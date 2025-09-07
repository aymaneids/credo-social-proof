const express = require('express');
const serverless = require('serverless-http');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();

// Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Apify configuration
const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN;
const APIFY_ACTOR_ID = process.env.APIFY_ACTOR_ID || 'apidojo~instagram-comments-scraper';

// Middleware
app.use(express.json());

// Handle preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-id');
  res.sendStatus(200);
});

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
      
      // Prepare Apify Actor input
      const actorInput = {
        startUrls: [url],
        postIds: [postId],
        maxItems: Math.min(maxComments, 1000),
        customMapFunction: "(object) => { return {...object} }"
      };

      console.log('Calling Apify with input:', JSON.stringify(actorInput, null, 2));

      // Call Apify Actor
      const response = await fetch(
        `https://api.apify.com/v2/acts/${APIFY_ACTOR_ID}/run-sync-get-dataset-items?token=${APIFY_API_TOKEN}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(actorInput)
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Apify API error:', response.status, errorText);
        throw new Error(`Apify API error: ${response.status} - ${errorText}`);
      }

      const comments = await response.json();
      console.log(`Apify returned ${comments.length} comments`);

      if (!Array.isArray(comments)) {
        throw new Error('Invalid response format from Apify API');
      }

      let commentsToSave = comments;

      let commentsToSave = comments;

      // Apply AI filtering if requested
      if (useAI && commentsToSave.length > 0) {
        console.log(`Applying AI filter to ${commentsToSave.length} comments`);
        commentsToSave = applyAIFilter(commentsToSave);
        console.log(`AI filter reduced to ${commentsToSave.length} comments`);
      }

      // Save comments to instagram_comments table for later manual conversion
      let savedComments = 0;
      const errors = [];

      for (const comment of commentsToSave) {
        try {
          // Check if comment has text (the new API uses 'text' instead of 'message')
          const commentText = comment.text || comment.message;
          if (!commentText || commentText.trim().length < 3) {
            continue;
          }
          
          const commentData = {
            user_id: userId,
            import_id: importRecord.id,
            comment_id: comment.id || `comment_${Date.now()}_${Math.random()}`,
            username: comment.ownerUsername || 'Instagram User',
            message: commentText,
            like_count: 0, // New API doesn't provide like counts
            reply_count: 0, // New API doesn't provide reply counts
            is_verified: comment.ownerIsVerified || false,
            profile_image: comment.ownerProfilePicUrl || '',
            comment_created_at: comment.timestamp ? new Date(comment.timestamp).toISOString() : new Date().toISOString(),
            is_saved_as_testimonial: false
          };
          
          // For duplicate URLs, append import ID to comment_id to avoid conflicts
          // This ensures ALL comments are saved on rescans, even if they're duplicates
          const existingUrlImports = await supabase
            .from('instagram_imports')
            .select('id')
            .eq('url', url)
            .eq('user_id', userId)
            .neq('id', importRecord.id);
            
          if (existingUrlImports.data && existingUrlImports.data.length > 0) {
            // Always append import ID for rescans to save ALL comments
            commentData.comment_id = `${commentData.comment_id}_import_${importRecord.id}`;
          }
          
          const { error } = await supabase
            .from('instagram_comments')
            .insert(commentData);

          if (error) {
            // If it's still a duplicate after our ID modification, try with timestamp
            if (error.message.includes('unique_user_comment_id')) {
              commentData.comment_id = `${commentData.comment_id}_${Date.now()}`;
              const { error: retryError } = await supabase
                .from('instagram_comments')
                .insert(commentData);
              
              if (retryError) {
                errors.push(`Failed to save comment from ${comment.ownerUsername || 'unknown'}: ${retryError.message}`);
              } else {
                savedComments++;
              }
            } else {
              errors.push(`Failed to save comment from ${comment.ownerUsername || 'unknown'}: ${error.message}`);
            }
          } else {
            savedComments++;
          }
        } catch (error) {
          errors.push(`Error processing comment from ${comment.ownerUsername || 'unknown'}: ${error.message}`);
        }
      }

      // Update import record with results
      await supabase
        .from('instagram_imports')
        .update({
          total_comments_found: comments.length,
          comments_saved: savedComments, // This represents comments stored in instagram_comments table
          status: 'completed',
          processed_at: new Date().toISOString()
        })
        .eq('id', importRecord.id);

      console.log(`Instagram scrape completed: ${savedComments} comments saved, ${errors.length} errors`);

      res.json({
        success: true,
        totalFound: comments.length,
        saved: savedComments,
        errors,
        importId: importRecord.id,
        comments: commentsToSave.map(comment => ({
          id: comment.id,
          username: comment.ownerUsername || 'unknown',
          message: comment.text || comment.message,
          likeCount: 0, // New API doesn't provide like counts
          replyCount: 0, // New API doesn't provide reply counts
          isVerified: comment.ownerIsVerified || false,
          profileImage: comment.ownerProfilePicUrl || '',
          createdAt: comment.timestamp || new Date().toISOString()
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

      throw scrapeError;
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

// Widget embed script serving
app.get('/widget-embed.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  // For Netlify functions, we need to return the script content directly
  res.send(`
    // Widget embed script for Netlify functions
    console.log('Widget embed script loaded');
    // Add your widget embed logic here
  `);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Get comments for a specific import
app.get('/api/instagram/comments/:importId', async (req, res) => {
  try {
    const { importId } = req.params;
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    if (!importId) {
      return res.status(400).json({ error: 'Import ID is required' });
    }

    // Get comments for this import
    const { data: comments, error } = await supabase
      .from('instagram_comments')
      .select('*')
      .eq('import_id', importId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }

    res.json({ comments: comments || [] });

  } catch (error) {
    console.error('Error fetching Instagram comments:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
});

// Save individual comment as testimonial endpoint
app.post('/api/instagram/save-comment', async (req, res) => {
  try {
    const { commentId } = req.body;
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    if (!commentId) {
      return res.status(400).json({ error: 'Comment ID is required' });
    }

    // Get the comment from instagram_comments table
    const { data: comment, error: commentError } = await supabase
      .from('instagram_comments')
      .select('*')
      .eq('id', commentId)
      .eq('user_id', userId)
      .single();

    if (commentError || !comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if already saved as testimonial
    if (comment.is_saved_as_testimonial) {
      return res.status(400).json({ error: 'Comment already saved as testimonial' });
    }

    // Get the import record for additional context
    const { data: importRecord, error: importError } = await supabase
      .from('instagram_imports')
      .select('url')
      .eq('id', comment.import_id)
      .single();

    if (importError || !importRecord) {
      return res.status(404).json({ error: 'Import record not found' });
    }

    // Create testimonial from comment
    const testimonialData = {
      user_id: userId,
      client_name: comment.username,
      client_email: `${comment.username}@instagram.com`,
      content: comment.message,
      rating: 5, // Default rating for Instagram comments
      source: 'instagram',
      status: 'pending',
      instagram_data: {
        comment_id: comment.comment_id,
        username: comment.username,
        profile_image: comment.profile_image,
        is_verified: comment.is_verified,
        like_count: comment.like_count,
        reply_count: comment.reply_count,
        created_at: comment.comment_created_at,
        post_url: importRecord.url
      }
    };

    const { data: testimonial, error: testimonialError } = await supabase
      .from('testimonials')
      .insert(testimonialData)
      .select()
      .single();

    if (testimonialError) {
      console.error('Error saving testimonial:', testimonialError);
      throw testimonialError;
    }

    // Update the comment to mark it as saved
    const { error: updateError } = await supabase
      .from('instagram_comments')
      .update({
        is_saved_as_testimonial: true,
        testimonial_id: testimonial.id
      })
      .eq('id', commentId);

    if (updateError) {
      console.error('Error updating comment status:', updateError);
      // Don't throw here, testimonial was created successfully
    }

    res.json({
      success: true,
      testimonial: testimonial,
      comment: comment
    });

  } catch (error) {
    console.error('Error in save comment endpoint:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
});

// Delete Instagram import and its comments
app.delete('/api/instagram/imports/:importId', async (req, res) => {
  try {
    const { importId } = req.params;
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    // Verify the import belongs to the user
    const { data: importRecord, error: importError } = await supabase
      .from('instagram_imports')
      .select('id')
      .eq('id', importId)
      .eq('user_id', userId)
      .single();

    if (importError || !importRecord) {
      return res.status(404).json({ error: 'Import not found' });
    }

    // Delete the import (comments will be deleted automatically due to CASCADE)
    const { error: deleteError } = await supabase
      .from('instagram_imports')
      .delete()
      .eq('id', importId)
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Error deleting import:', deleteError);
      throw deleteError;
    }

    res.json({ success: true });

  } catch (error) {
    console.error('Error deleting Instagram import:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
});

module.exports.handler = serverless(app);