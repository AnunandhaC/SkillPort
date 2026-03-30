-- Seed sample opportunities for SkillPort.
-- Run this after creating the public.opportunities table.

insert into public.opportunities (
  title,
  company,
  type,
  min_gpa,
  income_limit,
  required_skills,
  description
)
values
  (
    'React Developer Internship',
    'PixelForge Labs',
    'Internship',
    6.0,
    null,
    '["React", "JavaScript", "HTML", "CSS"]'::jsonb,
    'Frontend internship focused on React components, UI fixes, and API integration.'
  ),
  (
    'Backend Support Internship',
    'DataSpring Systems',
    'Internship',
    5.0,
    null,
    '["Node.js", "Express", "SQL"]'::jsonb,
    'Backend internship covering REST APIs, debugging, and database operations.'
  ),
  (
    'Full Stack Internship',
    'LaunchDeck Tech',
    'Internship',
    7.0,
    null,
    '["React", "Node.js", "MongoDB"]'::jsonb,
    'Full stack internship for students comfortable with React and server-side development.'
  ),
  (
    'Merit Scholarship for Developers',
    'BrightFuture Foundation',
    'Scholarship',
    8.0,
    400000,
    '[]'::jsonb,
    'Scholarship for students with strong academic performance and active development skills.'
  ),
  (
    'Need-Based Tech Scholarship',
    'NextStep Education Trust',
    'Scholarship',
    7.0,
    300000,
    '[]'::jsonb,
    'Scholarship for students pursuing technology careers with eligible family income.'
  );
