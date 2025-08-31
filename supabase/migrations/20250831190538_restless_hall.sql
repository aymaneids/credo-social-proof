/*
  # Add Widget Tracking Functions

  1. New Functions
    - `increment_widget_views` - Safely increment widget view count
    - `increment_widget_clicks` - Safely increment widget click count

  2. Security
    - Functions are accessible to anonymous users for tracking
    - Only increment operations allowed, no other modifications
*/

-- Function to increment widget views
CREATE OR REPLACE FUNCTION increment_widget_views(widget_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE widgets 
  SET views_count = COALESCE(views_count, 0) + 1,
      updated_at = now()
  WHERE id = widget_id AND is_active = true;
END;
$$;

-- Function to increment widget clicks
CREATE OR REPLACE FUNCTION increment_widget_clicks(widget_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE widgets 
  SET clicks_count = COALESCE(clicks_count, 0) + 1,
      updated_at = now()
  WHERE id = widget_id AND is_active = true;
END;
$$;

-- Grant execute permissions to anonymous users for tracking
GRANT EXECUTE ON FUNCTION increment_widget_views(uuid) TO anon;
GRANT EXECUTE ON FUNCTION increment_widget_clicks(uuid) TO anon;