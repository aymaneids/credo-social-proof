
import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';

export const getWidgetData = async (req: Request, res: Response) => {
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
};

export const trackWidgetView = async (req: Request, res: Response) => {
  try {
    const { widgetId } = req.params;
    
    // Use RPC call instead of supabase.sql
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
};

export const trackWidgetClick = async (req: Request, res: Response) => {
  try {
    const { widgetId } = req.params;
    
    // Use RPC call instead of supabase.sql
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
};
