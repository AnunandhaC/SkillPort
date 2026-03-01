# Supabase Setup for SkillPort

Account details (name, email, role, program) are stored in a `profiles` table. You must run the migration once in your Supabase project.

## Steps

1. Open your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor**
4. Open `supabase/migrations/001_profiles.sql` and copy its contents
5. Paste into the SQL Editor and click **Run**

This will:
- Create the `profiles` table
- Enable Row Level Security (RLS)
- Add a trigger to auto-create a profile when users sign up
- Backfill profiles for any existing users

After running the migration, new signups will save to the database correctly.
