import React, { useEffect, useState } from 'react';
import { useData } from '../context/DataProvider';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../lib/supabaseClient';
import { Users, Layout, Plus } from 'lucide-react';

const AdminDashboard = () => {
    const { templates } = useData();
    const { createFaculty } = useAuth();
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [facultyForm, setFacultyForm] = useState({
        name: '',
        email: '',
        password: '',
    });

    const loadUsers = async () => {
        setLoadingUsers(true);
        try {
            const { data, error: listError } = await supabase
                .from('profiles')
                .select('id, full_name, email, role, created_at')
                .order('created_at', { ascending: false });
            if (listError) throw listError;
            setUsers(data || []);
        } catch (listError) {
            setError(listError.message || 'Failed to load users.');
        } finally {
            setLoadingUsers(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleCreateFaculty = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await createFaculty({
                name: facultyForm.name,
                email: facultyForm.email,
                password: facultyForm.password,
            });

            setSuccess('Faculty account created successfully.');
            setFacultyForm({ name: '', email: '', password: '' });
            await loadUsers();
        } catch (createError) {
            setError(createError.message || 'Failed to create faculty account.');
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
                <p className="text-slate-400">System configuration and user management.</p>
            </div>

            <div className="flex gap-4 border-b border-white/10 pb-1">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition ${activeTab === 'users' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400'}`}
                >
                    User Management
                </button>
                <button
                    onClick={() => setActiveTab('templates')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition ${activeTab === 'templates' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400'}`}
                >
                    Template Management
                </button>
            </div>

            {activeTab === 'users' && (
                <div className="space-y-6">
                    <div className="glass-panel rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Add New Faculty</h2>
                        <form onSubmit={handleCreateFaculty} className="grid grid-cols-1 md:grid-cols-4 gap-3" autoComplete="off">
                            <input
                                type="text"
                                required
                                name="faculty_full_name"
                                autoComplete="off"
                                value={facultyForm.name}
                                onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })}
                                placeholder="Full Name"
                                className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="email"
                                required
                                name="faculty_email"
                                autoComplete="off"
                                value={facultyForm.email}
                                onChange={(e) => setFacultyForm({ ...facultyForm, email: e.target.value })}
                                placeholder="Email"
                                className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="password"
                                required
                                minLength={6}
                                name="faculty_temp_password"
                                autoComplete="new-password"
                                value={facultyForm.password}
                                onChange={(e) => setFacultyForm({ ...facultyForm, password: e.target.value })}
                                placeholder="Temporary Password"
                                className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2.5 font-medium transition"
                            >
                                Create Faculty
                            </button>
                        </form>
                        {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
                        {success && <p className="text-sm text-green-400 mt-3">{success}</p>}
                    </div>

                    <div className="glass-panel rounded-xl overflow-hidden">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-white/5 text-slate-200 font-bold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Email</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loadingUsers ? (
                                <tr>
                                    <td className="px-6 py-4 text-slate-400" colSpan={3}>Loading users...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td className="px-6 py-4 text-slate-400" colSpan={3}>No users found.</td>
                                </tr>
                            ) : users.map(user => (
                                <tr key={user.id} className="hover:bg-white/5 transition">
                                    <td className="px-6 py-4 text-white font-medium">{user.full_name || 'Unnamed'}</td>
                                    <td className="px-6 py-4 capitalize">
                                        <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : user.role === 'faculty' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{user.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                </div>
            )}

            {activeTab === 'templates' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map(t => (
                        <div key={t.id} className="glass-card p-6 rounded-xl border border-white/10">
                            <div className="flex justify-between items-start mb-4">
                                <Layout size={32} className="text-blue-400" />
                                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">Active</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{t.name}</h3>
                            <p className="text-sm text-slate-400 mb-4">{t.description}</p>
                            <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">Edit Template</button>
                        </div>
                    ))}
                    <button className="border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center p-6 text-slate-500 hover:border-blue-500/50 hover:text-blue-400 transition cursor-pointer">
                        <Plus size={32} className="mb-2" />
                        <span className="font-medium">Add New Template</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
