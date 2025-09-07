import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface InstagramImport {
  id: string;
  user_id: string;
  url: string;
  title: string;
  total_comments_found: number;
  comments_saved: number;
  max_comments_requested: number;
  use_ai_filter: boolean;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface InstagramComment {
  id: string;
  import_id: string;
  comment_id: string;
  username: string;
  message: string;
  like_count: number;
  reply_count: number;
  is_verified: boolean;
  profile_image: string;
  comment_created_at: string;
  scraped_at: string;
  is_saved_as_testimonial: boolean;
  testimonial_id?: string;
}

export interface ScrapeResult {
  success: boolean;
  totalFound: number;
  saved: number;
  errors: string[];
  importId: string;
}

export const useInstagramImports = () => {
  const [imports, setImports] = useState<InstagramImport[]>([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const { user } = useAuth();

  const fetchImports = async () => {
    if (!user) return;

    try {
      console.log('Fetching Instagram imports for user:', user.id);
      
      const response = await fetch('/api/instagram/imports', {
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        }
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Fetch imports error:', response.status, errorText);
        throw new Error(`Failed to fetch imports: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Imports data received:', data);
      setImports(data.imports || []);
    } catch (error) {
      console.error('Error fetching Instagram imports:', error);
      setImports([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImports();
  }, [user]);

  const scrapeInstagramPost = async (
    url: string,
    title: string,
    maxComments: number,
    useAI: boolean
  ): Promise<ScrapeResult> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setScraping(true);

    try {
      console.log('Starting Instagram scrape request:', { url, title, maxComments, useAI });
      
      const response = await fetch('/api/instagram/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({
          url,
          title,
          maxComments,
          useAI
        })
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          console.log('Error response:', errorData);
          errorMessage = errorData.error || errorMessage;
        } catch {
          // Keep the HTTP status message if JSON parsing fails
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Scrape result:', result);
      
      // Refresh imports list
      await fetchImports();

      return result;
    } catch (error) {
      console.error('Error scraping Instagram post:', error);
      throw error;
    } finally {
      setScraping(false);
    }
  };

  const getCommentsForImport = async (importId: string): Promise<InstagramComment[]> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await fetch(`/api/instagram/comments/${importId}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch comments');
      }

      const result = await response.json();
      return result.comments || [];
    } catch (error) {
      console.error('Error fetching comments for import:', error);
      throw error;
    }
  };

  const saveCommentAsTestimonial = async (commentId: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await fetch('/api/instagram/save-comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({
          commentId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save comment');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error saving comment as testimonial:', error);
      throw error;
    }
  };

  const deleteImport = async (importId: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await fetch(`/api/instagram/imports/${importId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete import');
      }

      // Refresh imports list
      await fetchImports();

      return true;
    } catch (error) {
      console.error('Error deleting import:', error);
      throw error;
    }
  };

  return {
    imports,
    loading,
    scraping,
    scrapeInstagramPost,
    getCommentsForImport,
    saveCommentAsTestimonial,
    deleteImport,
    refetch: fetchImports
  };
};