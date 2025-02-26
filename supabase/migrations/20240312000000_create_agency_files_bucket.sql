
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name)
  VALUES ('agency_files', 'agency_files')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO storage.policies (name, bucket_id, definition)
  VALUES
    ('Allow public read access', 'agency_files', '{"roleName":"anon","allowedOperations":["SELECT"]}'::jsonb),
    ('Allow authenticated uploads', 'agency_files', '{"roleName":"authenticated","allowedOperations":["SELECT","INSERT","UPDATE","DELETE"]}'::jsonb)
  ON CONFLICT (name, bucket_id) DO NOTHING;
END $$;
