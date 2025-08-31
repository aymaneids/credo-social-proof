
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchTestimonials = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTestimonial = async (testimonialData: any) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .insert([{ ...testimonialData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      await fetchTestimonials();
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const updateTestimonial = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchTestimonials();
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchTestimonials();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [user]);

  return {
    testimonials,
    loading,
    error,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    refetch: fetchTestimonials
  };
};

export const useWidgets = () => {
  const [widgets, setWidgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchWidgets = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('widgets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWidgets(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createWidget = async (widgetCreateData: any) => {
    if (!user) return null;
    
    try {
      // Generate a unique embed code
      const embedCode = `<script src="https://testimonial-widget.com/widget.js" data-widget-id="${Date.now()}"></script>`;
      
      const widgetInsertData = {
        ...widgetCreateData,
        user_id: user.id,
        embed_code: embedCode
      };

      const { data, error } = await supabase
        .from('widgets')
        .insert([widgetInsertData])
        .select()
        .single();

      if (error) throw error;
      
      await fetchWidgets();
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const updateWidget = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('widgets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchWidgets();
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const deleteWidget = async (id: string) => {
    try {
      const { error } = await supabase
        .from('widgets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchWidgets();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const getWidget = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('widgets')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const duplicateWidget = async (id: string) => {
    try {
      const originalWidget = await getWidget(id);
      if (!originalWidget) return null;

      const newWidgetData = {
        widget_name: `${originalWidget.widget_name} (Copy)`,
        widget_type: originalWidget.widget_type,
        settings: originalWidget.settings,
        is_active: false
      };

      return await createWidget(newWidgetData);
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  useEffect(() => {
    fetchWidgets();
  }, [user]);

  return {
    widgets,
    loading,
    error,
    createWidget,
    updateWidget,
    deleteWidget,
    getWidget,
    duplicateWidget,
    refetch: fetchWidgets
  };
};

export const useCollectionLinks = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchLinks = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('collection_links')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLinks(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createLink = async (linkData: any) => {
    if (!user) return null;
    
    try {
      const linkId = Math.random().toString(36).substring(2, 15);
      
      const linkInsertData = {
        ...linkData,
        user_id: user.id,
        link_id: linkId,
        url: `${window.location.origin}/collect/${linkId}`
      };

      const { data, error } = await supabase
        .from('collection_links')
        .insert([linkInsertData])
        .select()
        .single();

      if (error) throw error;
      
      await fetchLinks();
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const updateLink = async (id: string, updates: any) => {
    try {
      const { error } = await supabase
        .from('collection_links')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      await fetchLinks();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const deleteLink = async (id: string) => {
    try {
      const { error } = await supabase
        .from('collection_links')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchLinks();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [user]);

  return {
    links,
    loading,
    error,
    createLink,
    updateLink,
    deleteLink,
    refetch: fetchLinks
  };
};

export const useWidgetPreviews = () => {
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchPreviews = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('widget_previews')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPreviews(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createPreview = async (previewData: any) => {
    if (!user) return null;
    
    try {
      const previewUrl = Math.random().toString(36).substring(2, 15);
      
      const previewInsertData = {
        ...previewData,
        user_id: user.id,
        preview_url: previewUrl
      };

      const { data, error } = await supabase
        .from('widget_previews')
        .insert([previewInsertData])
        .select()
        .single();

      if (error) throw error;
      
      await fetchPreviews();
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const getPreviewByUrl = async (previewUrl: string) => {
    try {
      const { data, error } = await supabase
        .from('widget_previews')
        .select('*')
        .eq('preview_url', previewUrl)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const updatePreview = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('widget_previews')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchPreviews();
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const deletePreview = async (id: string) => {
    try {
      const { error } = await supabase
        .from('widget_previews')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchPreviews();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  useEffect(() => {
    fetchPreviews();
  }, [user]);

  return {
    previews,
    loading,
    error,
    createPreview,
    getPreviewByUrl,
    updatePreview,
    deletePreview,
    refetch: fetchPreviews
  };
};
