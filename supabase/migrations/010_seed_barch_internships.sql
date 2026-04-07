-- Seed BArch-focused internships for SkillPort.
-- Run this after 009_seed_opportunities.sql.

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
    'Architectural Design Intern',
    'Studio Axis',
    'Internship',
    6.5,
    null,
    array['AutoCAD', 'SketchUp', 'Architectural Design'],
    'Assist with concept drawings, 2D drafting, and design development for residential and studio projects.'
  ),
  (
    'Interior Design Internship',
    'SpaceForm Collective',
    'Internship',
    6.0,
    null,
    array['Interior Design', 'SketchUp', 'Rendering'],
    'Support interior planning, mood boards, and 3D visualization for commercial and residential interiors.'
  ),
  (
    'Urban Planning Research Intern',
    'CityScape Lab',
    'Internship',
    7.0,
    null,
    array['Urban Planning', 'Site Analysis', 'Research'],
    'Work on planning studies, site analysis, and documentation for sustainable urban development projects.'
  ),
  (
    'Landscape Architecture Intern',
    'GreenGrid Studio',
    'Internship',
    6.5,
    null,
    array['Landscape Design', 'AutoCAD', 'Site Analysis'],
    'Contribute to landscape concept development, planting layouts, and site documentation for public-space projects.'
  );
