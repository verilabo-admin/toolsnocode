
/*
  # Fix unindexed foreign keys and unused indexes

  1. Add covering indexes for foreign keys on user_id columns
    - `public.experts.user_id` -> references auth.users
    - `public.projects.user_id` -> references auth.users
    - `public.tools.user_id` -> references auth.users
    - `public.tutorials.user_id` -> references auth.users

  2. Drop unused indexes
    - `idx_expert_tools_tool_id` on `public.expert_tools`
    - `idx_project_tools_tool_id` on `public.project_tools`
*/

CREATE INDEX IF NOT EXISTS idx_experts_user_id_fk ON public.experts (user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id_fk ON public.projects (user_id);
CREATE INDEX IF NOT EXISTS idx_tools_user_id_fk ON public.tools (user_id);
CREATE INDEX IF NOT EXISTS idx_tutorials_user_id_fk ON public.tutorials (user_id);

DROP INDEX IF EXISTS public.idx_expert_tools_tool_id;
DROP INDEX IF EXISTS public.idx_project_tools_tool_id;
