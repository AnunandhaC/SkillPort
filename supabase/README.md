# Supabase Setup for SkillPort

Account details are stored in `profiles` and portfolio content is stored in `portfolios`.
You must run migrations in order in your Supabase project.

## Steps

1. Open your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor**
4. Open `supabase/migrations/001_profiles.sql` and copy its contents
5. Paste into the SQL Editor and click **Run**
6. Open `supabase/migrations/002_portfolios.sql` and click **Run**
7. If you see `record "new" has no field "updated_at"`, run `supabase/migrations/003_fix_portfolios_updated_at.sql`
8. To allow admin to create faculty accounts from app UI, run `supabase/migrations/004_admin_create_faculty.sql`
9. To add flexible portfolio metadata, run `supabase/migrations/005_portfolios_meta.sql`
10. To let faculty suggestions persist for students, run `supabase/migrations/007_add_faculty_feedback_to_portfolios.sql`
11. To make faculty evaluation saving robust, run `supabase/migrations/008_faculty_save_evaluation.sql`

This will:
- Create the `profiles` table
- Create the `portfolios` table
- Enable Row Level Security (RLS)
- Add a trigger to auto-create a profile when users sign up
- Backfill profiles for any existing users

After running migrations, signups save to Supabase and portfolio edits persist in the `portfolios` table.
