import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = 3001;

// Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Middleware
app.use(cors());
app.use(express.json());

// Widget data endpoint
app.get('/api/widget/:widgetId', async (req, res) => {
  try {
    const { widgetId } = req.params;
    
    // Get widget configuration
    const { data: widget, error: widgetError } = await supabase
      .from('widgets')
      .select('*')
      .eq('id', widgetId)
      .eq('is_active', true)
      .single();
    
    if (widgetError || !widget) {
      return res.status(404).json({ error: 'Widget not found' });
    }
    
    // Get testimonials based on widget settings
    let query = supabase
      .from('testimonials')
      .select('*')
      .eq('user_id', widget.user_id)
      .eq('status', 'approved');
    
    // Filter by sources if specified
    if (widget.settings.selected_sources && widget.settings.selected_sources.length > 0) {
      query = query.in('source', widget.settings.selected_sources);
    }
    
    const { data: testimonials, error: testimonialsError } = await query
      .order('created_at', { ascending: false })
      .limit(widget.settings.max_testimonials || 10);
    
    if (testimonialsError) {
      return res.status(500).json({ error: 'Failed to fetch testimonials' });
    }
    
    // Filter by tags if specified
    let filteredTestimonials = testimonials || [];
    if (widget.settings.filter_tags && widget.settings.filter_tags.length > 0) {
      filteredTestimonials = filteredTestimonials.filter(t =>
        widget.settings.filter_tags.some((tag: string) =>
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

// Track widget view
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

// Track widget click
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

app.listen(PORT, () => {
  console.log(`Widget API server running on port ${PORT}`);
});