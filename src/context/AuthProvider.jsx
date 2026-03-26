import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   // { id, email, role, name, program }
  const [loading, setLoading] = useState(true);
  const normalizeProgram = (value) => {
    const v = String(value || '').trim().toLowerCase();
    if (v === 'barch' || v === 'b.arch' || v === 'b arch') return 'barch';
    if (v === 'btech' || v === 'b.tech' || v === 'b tech') return 'btech';
    return null;
  };

  // Load session + profile on app start (failsafe: never block rendering forever)
  useEffect(() => {
    let alive = true;
    const setUserSafe = (value) => {
      if (alive) setUser(value);
    };
    const setLoadingSafe = (value) => {
      if (alive) setLoading(value);
    };

    const syncUserFromSession = async (authUser) => {
      if (!authUser) {
        setUserSafe(null);
        setLoadingSafe(false);
        return;
      }

      const metadata = authUser.user_metadata || {};
      const fallback = {
        id: authUser.id,
        email: authUser.email,
        role: metadata.role || 'student',
        name: metadata.full_name || authUser.email?.split('@')[0] || 'User',
        program: normalizeProgram(metadata.program),
      };

      try {
        // `maybeSingle()` avoids throwing when 0 rows exist
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle();

        if (error) throw error;

        if (profile) {
          const resolvedProgram =
            normalizeProgram(profile.program) || normalizeProgram(metadata.program) || null;

          if (!normalizeProgram(profile.program) && resolvedProgram) {
            // Self-heal legacy/missing profile program so future logins are consistent.
            await supabase
              .from('profiles')
              .update({ program: resolvedProgram })
              .eq('id', profile.id);
          }

          setUserSafe({
            id: profile.id,
            email: profile.email,
            role: profile.role,
            name: profile.full_name,
            program: resolvedProgram,
          });
        } else {
          // Create profile if missing (if this fails due to RLS, still allow fallback)
          await supabase.from('profiles').upsert(
            {
              id: fallback.id,
              email: fallback.email,
              full_name: fallback.name,
              role: fallback.role,
              program: fallback.program,
            },
            { onConflict: 'id' }
          );

          setUserSafe(fallback);
        }
      } catch (err) {
        console.error('Auth/profile sync failed; using fallback user.', err);
        setUserSafe(fallback);
      } finally {
        setLoadingSafe(false);
      }
    };

    // Subscribe first (so we catch fast auth events), then load current session
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await syncUserFromSession(session?.user || null);
    });

    (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        await syncUserFromSession(data?.session?.user || null);
      } catch (err) {
        console.error('Error initializing auth session', err);
        setUserSafe(null);
        setLoadingSafe(false);
      }
    })();

    return () => {
      alive = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // LOGIN with email + password
  const login = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      throw error;
    }

    const authUser = data?.user;
    if (authUser) {
      const metadata = authUser.user_metadata || {};
      setUser({
        id: authUser.id,
        email: authUser.email,
        role: metadata.role || 'student',
        name: metadata.full_name || authUser.email?.split('@')[0] || 'User',
        program: normalizeProgram(metadata.program),
      });
    }

    // profile will be loaded by onAuthStateChange
    return data;
  };

  // SIGNUP (students only)
  const signupStudent = async ({ email, password, name, program }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role: 'student',
          program,
        },
      },
    });

    if (error) throw error;

    if (!data.user?.id) {
      throw new Error('Account could not be created. Please try again.');
    }

    // Best effort: ensure a row exists in profiles when a session is available.
    // If email confirmation is enabled, Supabase may create the auth user without
    // creating a client session yet, so app-side RLS-protected upserts can fail
    // even though the account itself was created successfully.
    const userId = data.user?.id;
    if (userId && data.session) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(
          {
            id: userId,
            email,
            full_name: name,
            role: 'student',
            program: program || null,
          },
          { onConflict: 'id' }
        );
      if (profileError) {
        console.warn('Profile save failed after signup; relying on DB trigger/profile sync:', profileError);
      }
    }

    return data;
  };

  // FORGOT PASSWORD
  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
    if (error) throw error;
    return data;
  };

  // UPDATE PASSWORD (used after recovery link redirect)
  const updatePassword = async (password) => {
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    return data;
  };

  const createFaculty = async ({ email, password, name }) => {
    if (user?.role !== 'admin') {
      throw new Error('Only admin can create faculty users.');
    }

    const { data, error } = await supabase.rpc('admin_create_faculty', {
      p_email: email?.trim(),
      p_password: password,
      p_full_name: name?.trim(),
    });

    if (error) throw error;
    return data;
  };

  const logout = async () => {
    setUser(null);
    setLoading(false);

    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) {
      console.error('Supabase signOut error:', error);
    }

    // Failsafe: clear any persisted Supabase auth tokens in this browser
    if (typeof window !== 'undefined' && window.localStorage) {
      Object.keys(window.localStorage).forEach((key) => {
        if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
          window.localStorage.removeItem(key);
        }
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signupStudent,
        createFaculty,
        resetPassword,
        updatePassword,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
