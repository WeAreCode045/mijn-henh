
-- First, enable RLS if not already enabled
ALTER TABLE public.property_submission_replies ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated users to insert replies" ON public.property_submission_replies;
DROP POLICY IF EXISTS "Allow authenticated users to view replies" ON public.property_submission_replies;
DROP POLICY IF EXISTS "Allow users to update their own replies" ON public.property_submission_replies;
DROP POLICY IF EXISTS "Allow users to delete their own replies" ON public.property_submission_replies;

-- Create policies without IF NOT EXISTS
CREATE POLICY "Allow authenticated users to insert replies"
ON public.property_submission_replies
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view replies"
ON public.property_submission_replies
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow users to update their own replies"
ON public.property_submission_replies
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR auth.uid() = agent_id)
WITH CHECK (auth.uid() = user_id OR auth.uid() = agent_id);

CREATE POLICY "Allow users to delete their own replies"
ON public.property_submission_replies
FOR DELETE
TO authenticated
USING (auth.uid() = user_id OR auth.uid() = agent_id);
