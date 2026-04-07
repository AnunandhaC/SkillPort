-- Faculty/Admin utility: save evaluation marks and feedback for a student's portfolio.
-- Run this after 002_portfolios.sql, 005_portfolios_meta.sql, and 007_add_faculty_feedback_to_portfolios.sql.

create or replace function public.faculty_save_evaluation(
  p_student_id uuid,
  p_criteria_scores jsonb,
  p_feedback text,
  p_total_score numeric
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor_role text;
  v_existing_meta jsonb;
begin
  select role
  into v_actor_role
  from public.profiles
  where id = auth.uid();

  if v_actor_role not in ('faculty', 'admin') then
    raise exception 'Only faculty or admin can save evaluations';
  end if;

  select coalesce(meta, '{}'::jsonb)
  into v_existing_meta
  from public.portfolios
  where student_id = p_student_id;

  if v_existing_meta is null then
    raise exception 'Portfolio not found for student %', p_student_id;
  end if;

  update public.portfolios
  set
    meta = jsonb_set(
      v_existing_meta,
      '{facultyEvaluation}',
      jsonb_build_object(
        'criteriaScores', coalesce(p_criteria_scores, '{}'::jsonb),
        'feedback', coalesce(p_feedback, ''),
        'totalScore', p_total_score,
        'updatedAt', now()
      ),
      true
    ),
    faculty_feedback = coalesce(p_feedback, ''),
    score = p_total_score,
    last_updated = now()
  where student_id = p_student_id;
end;
$$;

revoke all on function public.faculty_save_evaluation(uuid, jsonb, text, numeric) from public;
grant execute on function public.faculty_save_evaluation(uuid, jsonb, text, numeric) to authenticated;
