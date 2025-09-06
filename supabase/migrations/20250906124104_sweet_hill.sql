/*
  # Create Instagram Imports Table

  1. New Tables
    - `instagram_imports`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `url` (text, Instagram post URL)
      - `title` (text, user-defined title for the import)
      - `total_comments_found` (integer, total comments found by scraper)
      - `comments_saved` (integer, comments successfully saved as testimonials)
      - `max_comments_requested` (integer, max comments user requested to scrape)
      - `use_ai_filter` (boolean, whether AI filtering was used)
      - `status` (text, import status: pending, processing, completed, failed)
      - `processed_at` (timestamp, when the import was processed)
      - `created_at` (timestamp, when the import was created)
      - `updated_at` (timestamp, when the import was last updated)

  2. Security
    - Enable RLS on `instagram_imports` table
    - Add policies for users to manage their own imports

  3. Indexes
    - Add indexes for performance optimization
*/

-- Create instagram_imports table
CREATE TABLE IF NOT EXISTS instagram_imports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url text NOT NULL,
  title text NOT NULL DEFAULT 'Instagram Post',
  total_comments_found integer DEFAULT 0,
  comments_saved integer DEFAULT 0,
  max_comments_requested integer DEFAULT 20,
  use_ai_filter boolean DEFAULT false,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  processed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE instagram_imports ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own Instagram imports"
  ON instagram_imports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own Instagram imports"
  ON instagram_imports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own Instagram imports"
  ON instagram_imports
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own Instagram imports"
  ON instagram_imports
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_instagram_imports_user_id ON instagram_imports(user_id);
CREATE INDEX IF NOT EXISTS idx_instagram_imports_status ON instagram_imports(status);
CREATE INDEX IF NOT EXISTS idx_instagram_imports_created_at ON instagram_imports(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_instagram_imports_updated_at'
  ) THEN
    CREATE TRIGGER update_instagram_imports_updated_at
      BEFORE UPDATE ON instagram_imports
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Add instagram_data column to testimonials table for storing Instagram-specific data
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'testimonials' AND column_name = 'instagram_data'
  ) THEN
    ALTER TABLE testimonials ADD COLUMN instagram_data jsonb;
  END IF;
END $$;

-- Create index on instagram_data for performance
CREATE INDEX IF NOT EXISTS idx_testimonials_instagram_data ON testimonials USING gin(instagram_data);