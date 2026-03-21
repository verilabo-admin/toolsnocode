/*
  # Fix performance and security issues

  1. Indexes
    - Add covering index on `expert_tools.tool_id` (unindexed foreign key)
    - Add covering index on `project_tools.tool_id` (unindexed foreign key)
    - Drop unused index `idx_projects_user_id_fk` on `projects`
*/

CREATE INDEX IF NOT EXISTS idx_expert_tools_tool_id ON public.expert_tools (tool_id);

CREATE INDEX IF NOT EXISTS idx_project_tools_tool_id ON public.project_tools (tool_id);

DROP INDEX IF EXISTS public.idx_projects_user_id_fk;
