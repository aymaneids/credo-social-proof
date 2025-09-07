/*
  # Create Instagram Comments Storage Table

  1. New Tables
    - `instagram_comments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `import_id` (uuid, foreign key to instagram_imports)
      - `comment_id` (text, Instagram comment ID)
      - `username` (text, Instagram username)
      - `message` (text, comment content)
      - `like_count` (integer, number of likes)
      - `reply_count` (integer, number of replies)
      - `is_verified` (boolean, verified account)
      - `profile_image` (text, profile image URL)
      - `created_at` (timestamp, when comment was created)
      - `scraped_at` (timestamp, when we scraped it)
      - `is_saved_as_testimonial` (boolean, if saved to testimonials)
      - `testimonial_id` (uuid, reference to testimonial if saved)

  2. Security
    - Enable RLS on `instagram_comments` table
    - Add policies for users to manage their own comments
    - Add indexes for performance

  3. Functions
    - Add function to clean up comments when import is deleted
*/

-- Create instagram_comments table
CREATE TABLE IF NOT EXISTS instagram_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  import_id uuid NOT NULL REFERENCES instagram_imports(id) ON DELETE CASCADE,
  comment_id text NOT NULL,
  username text NOT NULL DEFAULT 'unknown',
  message text NOT NULL,
  like_count integer DEFAULT 0,
  reply_count integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  profile_image text DEFAULT '',
  comment_created_at timestamptz,
  scraped_at timestamptz DEFAULT now(),
  is_saved_as_testimonial boolean DEFAULT false,
  testimonial_id uuid REFERENCES testimonials(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE instagram_comments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own instagram comments"
  ON instagram_comments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own instagram comments"
  ON instagram_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own instagram comments"
  ON instagram_comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own instagram comments"
  ON instagram_comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_instagram_comments_user_id ON instagram_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_instagram_comments_import_id ON instagram_comments(import_id);
CREATE INDEX IF NOT EXISTS idx_instagram_comments_comment_id ON instagram_comments(comment_id);
CREATE INDEX IF NOT EXISTS idx_instagram_comments_is_saved ON instagram_comments(is_saved_as_testimonial);
CREATE INDEX IF NOT EXISTS idx_instagram_comments_created_at ON instagram_comments(created_at);

-- Add unique constraint to prevent duplicate comments
ALTER TABLE instagram_comments ADD CONSTRAINT unique_user_comment_id UNIQUE (user_id, comment_id);

-- Add trigger for updated_at
CREATE TRIGGER update_instagram_comments_updated_at
  BEFORE UPDATE ON instagram_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();