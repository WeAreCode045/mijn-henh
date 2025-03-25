
-- Create function to upsert features
CREATE OR REPLACE FUNCTION public.upsert_features(feature_descriptions TEXT[])
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  FOR i IN 1..array_length(feature_descriptions, 1) LOOP
    INSERT INTO public.property_features (description)
    VALUES (feature_descriptions[i])
    ON CONFLICT (description) DO NOTHING;
  END LOOP;
END;
$$;
