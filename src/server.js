import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === CONFIGURATION ===

// Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Apify configuration
const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN;
const APIFY_ACTOR_ID = process.env.APIFY_ACTOR_ID || 'apidojo~instagram-comments-scraper';

// Validate required environment variables
if (!APIFY_API_TOKEN) {
  console.error('APIFY_API_TOKEN environment variable is required');
  process.exit(1);
}

console.log(`Using Apify Actor: ${APIFY_ACTOR_ID}`);
console.log(`API Token configured: ${APIFY_API_TOKEN ? 'Yes' : 'No'}`);
console.log(`API Token length: ${APIFY_API_TOKEN ? APIFY_API_TOKEN.length : 0}`);
if (APIFY_API_TOKEN) {
  console.log(`API Token starts with: ${APIFY_API_TOKEN.substring(0, 10)}...`);
}

const app = express();
const PORT = process.env.PORT || 3001;

// === MIDDLEWARE ===
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
  credentials: false
}));
app.use(express.json());
// Serve static files from dist and public directories
app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.static(path.join(__dirname, '../public')));

// === UTILITY FUNCTIONS ===
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-id');
  res.sendStatus(200);
});

// === INSTAGRAM API ENDPOINTS ===

// Extract Instagram post ID from URL
const extractInstagramPostId = (url) => {
  const patterns = [
    /instagram\.com\/p\/([A-Za-z0-9_-]+)/,
    /instagram\.com\/reel\/([A-Za-z0-9_-]+)/,
    /instagram\.com\/tv\/([A-Za-z0-9_-]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  throw new Error('Invalid Instagram URL format');
};

// Apply AI filtering to comments
const applyAIFilter = (comments) => {
  return comments.filter(comment => {
    const message = comment.message?.toLowerCase() || '';
    
    if (message.length < 10) return false;
    
    const emojiRegex = /^[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\s]*$/u;
    if (emojiRegex.test(message)) return false;
    
    const positiveWords = [
      'love', 'amazing', 'great', 'awesome', 'fantastic', 'excellent', 'perfect',
      'wonderful', 'incredible', 'outstanding', 'brilliant', 'superb', 'recommend',
      'best', 'good', 'nice', 'beautiful', 'helpful', 'useful', 'thank', 'thanks'
    ];
    
    const hasPositiveWords = positiveWords.some(word => message.includes(word));
    const isSpam = /follow.*back|check.*bio|dm.*me|click.*link|buy.*now|free.*money/i.test(message);
    
    return hasPositiveWords && !isSpam && (comment.likeCount || 0) > 0;
  });
};

// Instagram scraping endpoint
app.post('/api/instagram/scrape', async (req, res) => {
  try {
    const { url, maxComments = 20, useAI = false, title = 'Instagram Post' } = req.body;
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    if (!url) {
      return res.status(400).json({ error: 'Instagram URL is required' });
    }

    const instagramUrlPattern = /^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[A-Za-z0-9_-]+/;
    if (!instagramUrlPattern.test(url)) {
      return res.status(400).json({ error: 'Invalid Instagram URL format' });
    }

    console.log(`Starting Instagram scrape for user ${userId}: ${url}`);
    
    // Validate that the URL is accessible (basic check)
    try {
      const urlCheck = new URL(url);
      if (!urlCheck.hostname.includes('instagram.com')) {
        throw new Error('URL must be from instagram.com');
      }
    } catch (urlError) {
      throw new Error('Invalid URL format');
    }

    // Create import record
    const { data: importRecord, error: importError } = await supabase
      .from('instagram_imports')
      .insert({
        user_id: userId,
        url,
        title,
        max_comments_requested: maxComments,
        use_ai_filter: useAI,
        status: 'processing'
      })
      .select()
      .single();

    if (importError) {
      console.error('Error creating import record:', importError);
      throw new Error('Failed to create import record');
    }

    try {
      // Extract post ID from URL
      const postId = extractInstagramPostId(url);
      console.log(`Extracted post ID: ${postId}`);
      
      // Prepare Apify Actor input - Use either startUrls OR postIds, not both
      // According to docs, postIds is more efficient
      const actorInput = {
        postIds: [postId],
        maxItems: Math.min(maxComments, 1000)
        // Removed customMapFunction as it can cause bans according to docs
      };

      console.log('Calling Apify with input:', JSON.stringify(actorInput, null, 2));

      // Call Apify Actor with timeout and better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout
      
      try {
        const response = await fetch(
          `https://api.apify.com/v2/acts/${APIFY_ACTOR_ID}/run-sync-get-dataset-items?token=${APIFY_API_TOKEN}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(actorInput),
            signal: controller.signal
          }
        );
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Apify API error:', response.status, errorText);
          
          // Try to parse error details
          try {
            const errorData = JSON.parse(errorText);
            if (errorData.error?.message) {
              throw new Error(`Apify Actor failed: ${errorData.error.message}`);
            }
          } catch (parseError) {
            // If we can't parse, use the raw error
          }
          
          throw new Error(`Apify API error: ${response.status} - ${errorText}`);
        }

        const comments = await response.json();
        console.log(`Apify returned ${comments?.length || 0} comments`);

        if (!Array.isArray(comments)) {
          console.error('Invalid response format:', comments);
          throw new Error('Invalid response format from Apify API');
        }
        
        // If no comments returned, try with startUrls as fallback
        if (comments.length === 0) {
          console.log('No comments with postIds, trying with startUrls as fallback...');
          
          const fallbackInput = {
            startUrls: [url],
            maxItems: Math.min(maxComments, 1000)
          };
          
          console.log('Trying fallback with input:', JSON.stringify(fallbackInput, null, 2));
          
          const fallbackResponse = await fetch(
            `https://api.apify.com/v2/acts/${APIFY_ACTOR_ID}/run-sync-get-dataset-items?token=${APIFY_API_TOKEN}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(fallbackInput),
              signal: controller.signal
            }
          );
          
          if (fallbackResponse.ok) {
            const fallbackComments = await fallbackResponse.json();
            if (Array.isArray(fallbackComments) && fallbackComments.length > 0) {
              console.log(`Fallback returned ${fallbackComments.length} comments`);
              comments.push(...fallbackComments);
            }
          }
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          throw new Error('Request timeout - Instagram post might be taking too long to process');
        }
        throw fetchError;
      }

      let commentsToSave = comments;

      // Apply AI filtering if requested
      if (useAI && commentsToSave.length > 0) {
        console.log(`Applying AI filter to ${commentsToSave.length} comments`);
        commentsToSave = applyAIFilter(commentsToSave);
        console.log(`AI filter reduced to ${commentsToSave.length} comments`);
      }

      // Save comments as testimonials
      let saved = 0;
      const errors = [];

      for (const comment of commentsToSave) {
        try {
          if (!comment.message || comment.message.trim().length < 3) {
            continue;
          }
          
          let rating = 5;
          if ((comment.likeCount || 0) < 5) rating = 3;
          else if ((comment.likeCount || 0) < 10) rating = 4;
          
          const testimonialData = {
            user_id: userId,
            client_name: comment.user?.username || 'Instagram User',
            client_email: `${comment.user?.username || 'user'}@instagram.com`,
            content: comment.message,
            rating: rating,
            source: 'instagram',
            status: 'pending',
            instagram_data: {
              comment_id: comment.id,
              instagram_user_id: comment.userId,
              username: comment.user?.username,
              profile_image: comment.user?.image,
              is_verified: comment.user?.isVerified || false,
              like_count: comment.likeCount || 0,
              reply_count: comment.replyCount || 0,
              created_at: comment.createdAt,
              post_url: url,
              is_ranked: comment.isRanked || false,
              share_enabled: comment.shareEnabled || false
            }
          };
          
          const { error } = await supabase
            .from('testimonials')
            .insert(testimonialData);

          if (error) {
            errors.push(`Failed to save comment from ${comment.user?.username || 'unknown'}: ${error.message}`);
          } else {
            saved++;
          }
        } catch (error) {
          errors.push(`Error processing comment from ${comment.user?.username || 'unknown'}: ${error.message}`);
        }
      }

      // Update import record with results
      await supabase
        .from('instagram_imports')
        .update({
          total_comments_found: comments.length,
          comments_saved: saved,
          status: 'completed',
          processed_at: new Date().toISOString()
        })
        .eq('id', importRecord.id);

      console.log(`Instagram scrape completed: ${saved} testimonials saved, ${errors.length} errors`);

      res.json({
        success: true,
        totalFound: comments.length,
        saved,
        errors,
        comments: commentsToSave.map(comment => ({
          id: comment.id,
          username: comment.user?.username || 'unknown',
          message: comment.message,
          likeCount: comment.likeCount || 0,
          replyCount: comment.replyCount || 0,
          isVerified: comment.user?.isVerified || false,
          profileImage: comment.user?.image || '',
          createdAt: new Date((comment.createdAt || Date.now() / 1000) * 1000).toISOString()
        }))
      });

    } catch (scrapeError) {
      console.error('Scrape error:', scrapeError);
      
      // Update import record with error status
      await supabase
        .from('instagram_imports')
        .update({
          status: 'failed',
          processed_at: new Date().toISOString()
        })
        .eq('id', importRecord.id);

      // Provide more helpful error messages
      let userFriendlyMessage = scrapeError.message;
      
      if (scrapeError.message.includes('Actor run did not succeed')) {
        userFriendlyMessage = 'Instagram post could not be processed. This might happen if the post is private, has comments disabled, or if Instagram is blocking automated access. Please try a different public post.';
      } else if (scrapeError.message.includes('timeout')) {
        userFriendlyMessage = 'Request timed out. The Instagram post might be taking too long to process. Please try again or try a post with fewer comments.';
      } else if (scrapeError.message.includes('Invalid Instagram URL')) {
        userFriendlyMessage = 'Invalid Instagram URL format. Please make sure you\'re using a direct link to an Instagram post (e.g., https://www.instagram.com/p/ABC123/).';
      }
      
      throw new Error(userFriendlyMessage);
    }

  } catch (error) {
    console.error('Error in Instagram scrape endpoint:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
});

// Instagram imports history endpoint
app.get('/api/instagram/imports', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    const { data, error } = await supabase
      .from('instagram_imports')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching Instagram imports:', error);
      throw error;
    }

    res.json({ imports: data || [] });

  } catch (error) {
    console.error('Error fetching Instagram import history:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
});

// === WIDGET API ENDPOINTS ===

// Widget data endpoint
app.get('/api/widget/:widgetId', async (req, res) => {
  try {
    const { widgetId } = req.params;
    
    const { data: widget, error: widgetError } = await supabase
      .from('widgets')
      .select('*')
      .eq('id', widgetId)
      .eq('is_active', true)
      .single();
    
    if (widgetError || !widget) {
      return res.status(404).json({ error: 'Widget not found' });
    }
    
    let query = supabase
      .from('testimonials')
      .select('*')
      .eq('user_id', widget.user_id)
      .eq('status', 'approved');
    
    if (widget.settings.selected_sources && widget.settings.selected_sources.length > 0) {
      query = query.in('source', widget.settings.selected_sources);
    }
    
    const { data: testimonials, error: testimonialsError } = await query
      .order('created_at', { ascending: false })
      .limit(widget.settings.max_testimonials || 10);
    
    if (testimonialsError) {
      return res.status(500).json({ error: 'Failed to fetch testimonials' });
    }
    
    let filteredTestimonials = testimonials || [];
    if (widget.settings.filter_tags && widget.settings.filter_tags.length > 0) {
      filteredTestimonials = filteredTestimonials.filter(t =>
        widget.settings.filter_tags.some((tag) =>
          t.content.toLowerCase().includes(tag.toLowerCase())
        )
      );
    }
    
    res.json({
      widget,
      testimonials: filteredTestimonials
    });
    
  } catch (error) {
    console.error('Error fetching widget data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/widget/:widgetId/view', async (req, res) => {
  try {
    const { widgetId } = req.params;
    
    const { error } = await supabase.rpc('increment_widget_views', {
      widget_id: widgetId
    });
    
    if (error) {
      console.error('Error tracking widget view:', error);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking widget view:', error);
    res.status(500).json({ error: 'Failed to track view' });
  }
});

app.post('/api/widget/:widgetId/click', async (req, res) => {
  try {
    const { widgetId } = req.params;
    
    const { error } = await supabase.rpc('increment_widget_clicks', {
      widget_id: widgetId
    });
    
    if (error) {
      console.error('Error tracking widget click:', error);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking widget click:', error);
    res.status(500).json({ error: 'Failed to track click' });
  }
});

// === WIDGET EMBED ENDPOINTS ===

// Widget embed script serving
app.get('/widget-embed.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Cache-Control', 'public, max-age=86400'); // 24 hours
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.sendFile(path.join(__dirname, '../public/widget-embed.js'));
});

// Legacy widget script serving (for backward compatibility)
app.get('/widget/:widgetId.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.sendFile(path.join(__dirname, '../public/widget-embed.js'));
});

// === UTILITY ENDPOINTS ===

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    apify: {
      configured: !!APIFY_API_TOKEN,
      actor: APIFY_ACTOR_ID
    }
  });
});

// Test Apify connection endpoint
app.get('/api/test-apify', async (req, res) => {
  try {
    if (!APIFY_API_TOKEN) {
      return res.status(500).json({ error: 'APIFY_API_TOKEN not configured' });
    }
    
    // Test API connection by getting actor info
    const response = await fetch(
      `https://api.apify.com/v2/acts/${APIFY_ACTOR_ID}?token=${APIFY_API_TOKEN}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Apify test error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: 'Apify API test failed', 
        details: errorText,
        status: response.status
      });
    }
    
    const actorInfo = await response.json();
    res.json({ 
      success: true, 
      message: 'Apify connection successful',
      actor: {
        id: actorInfo.data?.id,
        name: actorInfo.data?.name,
        isPublic: actorInfo.data?.isPublic
      }
    });
    
  } catch (error) {
    console.error('Error testing Apify connection:', error);
    res.status(500).json({ 
      error: 'Failed to test Apify connection',
      details: error.message
    });
  }
});

// === FRONTEND SERVING ===

// Serve React app for all other routes (SPA fallback)
app.get('*', (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// === SERVER STARTUP ===

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🎨 Widget API: http://localhost:${PORT}/api/widget/:widgetId`);
  console.log(`📷 Instagram API: http://localhost:${PORT}/api/instagram/scrape`);
  console.log(`📋 Instagram imports: http://localhost:${PORT}/api/instagram/imports`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});