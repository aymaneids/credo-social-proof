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
  username: string;
  message: string;
  likeCount: number;
  replyCount: number;
  isVerified: boolean;
  profileImage: string;
  createdAt: string;
}

export interface ScrapeResult {
  success: boolean;
  totalFound: number;
  saved: number;
  errors: string[];
  comments: InstagramComment[];
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

  return {
    imports,
    loading,
    scraping,
    scrapeInstagramPost,
    refetch: fetchImports
  };
};