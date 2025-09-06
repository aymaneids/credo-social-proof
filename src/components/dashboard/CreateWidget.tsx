import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Layout, Play, Quote, Tag, X, Star, Grid3X3, List, Zap, Heart, Trophy, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { TrendingUp } from 'lucide-react';
import { useWidgets, useTestimonials, useCollectionLinks } from '../../hooks/useTestimonials';
import { useAuth } from '../../contexts/AuthContext';
import WidgetPreview from '../widget/WidgetPreview';

// Widget Preview Component - Using the main WidgetPreview component
const CreateWidgetPreview: React.FC<{
  type: string;
  theme: string;
  animationStyle: string;
  showRatings: boolean;
  showAvatars: boolean;
  showCompany: boolean;
  autoplay: boolean;
  testimonials: any[];
  maxTestimonials: number;
  className?: string;
}> = ({
  type,
  theme,
  animationStyle,
  showRatings,
  showAvatars,
  showCompany,
  autoplay,
  testimonials,
  maxTestimonials,
  className = ''
}) => {
  // Create a widget object that matches the expected interface
  const widget = {
    id: 'preview',
    widget_name: 'Preview Widget',
    widget_type: type as 'wall' | 'carousel' | 'single' | 'masonry' | 'list' | 'floating' | 'featured' | 'awards' | 'infinite-scroll',
    settings: {
      theme: theme as 'light' | 'dark' | 'auto',
      max_testimonials: maxTestimonials,
      animation_style: animationStyle,
      show_ratings: showRatings,
      show_avatars: showAvatars,
      show_company: showCompany,
      autoplay: autoplay,
      selected_sources: [],
      filter_tags: []
    },
    embed_code: '',
    views_count: 0,
    clicks_count: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: ''
  };

  const displayTestimonials = testimonials.slice(0, maxTestimonials);

  if (displayTestimonials.length === 0) {
    return (
      <div className={`rounded-xl p-6 border-2 border-dashed border-gray-300 ${className}`}>
        <div className="text-center text-gray-500">
          <Layout className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">No testimonials match your criteria</p>
        </div>
      </div>
    );
  }

  return (
    <WidgetPreview 
      widget={widget}
      testimonials={displayTestimonials}
      className={className}
    />
  );
};

const CreateWidget: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [selectedSources, setSelectedSources] = useState<string[]>(['direct']);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'wall',
    theme: 'light',
    max_testimonials: 10,
    animation_style: 'fade',
    show_ratings: true,
    show_avatars: true,
    show_company: true,
    autoplay: false
  });

  const { createWidget } = useWidgets();
  const { testimonials } = useTestimonials();
  const { links } = useCollectionLinks();

  // Calculate real testimonial counts by source
  const getSourceCounts = () => {
    const counts = {
      direct: testimonials.filter(t => t.source === 'direct').length,
      instagram: testimonials.filter(t => t.source === 'instagram').length,
      facebook: testimonials.filter(t => t.source === 'facebook').length,
      x: testimonials.filter(t => t.source === 'x').length,
      youtube: testimonials.filter(t => t.source === 'youtube').length
    };
    return counts;
  };

  const sourceCounts = getSourceCounts();
  const availableSources = [
    { id: 'direct', label: 'Direct Link Submissions', count: sourceCounts.direct },
    { id: 'instagram', label: 'Instagram Imports', count: sourceCounts.instagram },
    { id: 'facebook', label: 'Facebook Imports', count: sourceCounts.facebook },
    { id: 'x', label: 'X (Twitter) Imports', count: sourceCounts.x },
    { id: 'youtube', label: 'YouTube Imports', count: sourceCounts.youtube }
  ];

  const handleSourceToggle = (sourceId: string) => {
    setSelectedSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const handleSelectAllSources = () => {
    if (selectedSources.length === availableSources.length) {
      setSelectedSources([]);
    } else {
      setSelectedSources(availableSources.map(source => source.id));
    }
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags(prev => [...prev, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               name === 'max_testimonials' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createWidget({
        widget_name: formData.name,
        widget_type: formData.type,
        settings: {
          theme: formData.theme,
          max_testimonials: formData.max_testimonials,
          animation_style: formData.animation_style,
          show_ratings: formData.show_ratings,
          show_avatars: formData.show_avatars,
          show_company: formData.show_company,
          autoplay: formData.autoplay,
          selected_sources: selectedSources,
          filter_tags: tags
        },
        is_active: true
      });
      
      navigate('/dashboard/widgets');
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert('Failed to create widget. Please try again.');
      }
      console.error('Error creating widget:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get preview of testimonials that would be included
  const getPreviewTestimonials = () => {
    return testimonials.filter(t => {
      const sourceMatch = selectedSources.includes(t.source);
      const tagMatch = tags.length === 0 || 
        tags.some(tag => t.content.toLowerCase().includes(tag.toLowerCase()));
      const statusMatch = t.status === 'approved';
      
      return sourceMatch && tagMatch && statusMatch;
    }).slice(0, formData.max_testimonials);
  };

  const previewTestimonials = getPreviewTestimonials();

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center space-x-4 animate-fade-in">
        <button
          onClick={() => navigate('/dashboard/widgets')}
          className="p-2 hover:bg-white/50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Create New Widget
          </h1>
          <p className="text-gray-600 text-lg">Design and configure your testimonial widget</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-2">
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 animate-slide-up">
          <div className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Widget Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Homepage Testimonials"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Widget Type</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { type: 'wall', label: 'Wall of Love', desc: 'Grid layout with multiple testimonials', icon: Layout },
                    { type: 'carousel', label: 'Carousel', desc: 'Sliding testimonials with autoplay', icon: Play },
                    { type: 'single', label: 'Single', desc: 'One testimonial at a time', icon: Quote },
                    { type: 'masonry', label: 'Masonry Grid', desc: 'Pinterest-style varying heights', icon: Grid3X3 },
                    { type: 'list', label: 'List View', desc: 'Social media feed style', icon: List },
                    { type: 'floating', label: 'Floating Bubbles', desc: 'Interactive floating avatars', icon: Zap },
                    { type: 'featured', label: 'Featured Spotlight', desc: 'One main + supporting reviews', icon: Heart },
                    { type: 'awards', label: 'Top Review', desc: 'Prestigious showcase format', icon: Trophy },
                    { type: 'infinite-scroll', label: 'Infinite Scroll', desc: 'Continuous scrolling columns', icon: TrendingUp }
                  ].map((option) => (
                    <label key={option.type} className="cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value={option.type}
                        checked={formData.type === option.type}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className={`border-2 rounded-xl p-4 transition-all duration-200 ${
                        formData.type === option.type 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:border-purple-300'
                      }`}>
                        <div className="text-center">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2 ${
                            formData.type === option.type ? 'bg-purple-500' : 'bg-purple-100'
                          }`}>
                            <option.icon className={`w-4 h-4 ${
                              formData.type === option.type ? 'text-white' : 'text-purple-600'
                            }`} />
                          </div>
                          <h4 className="font-semibold text-gray-900 text-sm">{option.label}</h4>
                          <p className="text-xs text-gray-600 mt-1">{option.desc}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Sources */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">Content Sources</h2>
              <p className="text-sm text-gray-600">Select the testimonials you want to display in this widget.</p>
              
              <div className="space-y-3">
                {/* Select All Option */}
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <input 
                    type="checkbox" 
                    id="select-all-sources"
                    checked={selectedSources.length === availableSources.length}
                    onChange={handleSelectAllSources}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500" 
                  />
                  <label htmlFor="select-all-sources" className="text-sm font-medium text-gray-900">
                    Select All Sources
                  </label>
                </div>
                
                {/* Individual Sources */}
                {availableSources.map((source) => (
                  <div key={source.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-200 transition-colors">
                    <div className="flex items-center space-x-3">
                      <input 
                        type="checkbox" 
                        id={`source-${source.id}`}
                        checked={selectedSources.includes(source.id)}
                        onChange={() => handleSourceToggle(source.id)}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500" 
                      />
                      <label htmlFor={`source-${source.id}`} className="text-sm font-medium text-gray-700">
                        {source.label}
                      </label>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {source.count} testimonials
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Filter by Tags */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">Filter by Tags (Optional)</h2>
              <p className="text-sm text-gray-600">Only show testimonials that have at least one of these tags.</p>
              
              <div className="space-y-3">
                {/* Tag Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleTagInputKeyPress}
                    placeholder="Type a tag and press Enter (e.g., Homepage, Product-A)"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 pr-10"
                  />
                  <Tag className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                
                {/* Selected Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center space-x-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-purple-600 hover:text-purple-800 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Tag Examples */}
                <div className="text-xs text-gray-500">
                  <span className="font-medium">Examples:</span> Homepage, Product-Launch, Positive-Feedback, Feature-Request
                </div>
              </div>
            </div>

            {/* Appearance Settings */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">Appearance Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Theme</label>
                  <select 
                    name="theme"
                    value={formData.theme}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Max Testimonials</label>
                  <select 
                    name="max_testimonials"
                    value={formData.max_testimonials}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Animation Style</label>
                <select 
                  name="animation_style"
                  value={formData.animation_style}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="fade">Fade In</option>
                  <option value="slide">Slide Up</option>
                  <option value="scale">Scale In</option>
                  <option value="bounce">Bounce</option>
                  <option value="none">No Animation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Display Options</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'show_ratings', name: 'show_ratings', label: 'Show star ratings' },
                    { id: 'show_avatars', name: 'show_avatars', label: 'Show customer avatars' },
                    { id: 'show_company', name: 'show_company', label: 'Show company names' },
                    { id: 'autoplay', name: 'autoplay', label: 'Enable autoplay (carousel only)' }
                  ].map((option) => (
                    <div key={option.id} className="flex items-center space-x-3">
                      <input 
                        type="checkbox" 
                        id={option.id}
                        name={option.name}
                        checked={formData[option.name as keyof typeof formData] as boolean}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500" 
                      />
                      <label htmlFor={option.id} className="text-sm text-gray-700">{option.label}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/dashboard/widgets')}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || selectedSources.length === 0}
              className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                'Create Widget'
              )}
            </button>
          </div>
        </form>
        </div>

        {/* Preview Column */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <CreateWidgetPreview
              type={formData.type}
              theme={formData.theme}
              animationStyle={formData.animation_style}
              showRatings={formData.show_ratings}
              showAvatars={formData.show_avatars}
              showCompany={formData.show_company}
              autoplay={formData.autoplay}
              testimonials={previewTestimonials}
              maxTestimonials={Math.min(formData.max_testimonials, 3)}
            />

            {/* Stats */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mt-6">
              <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total testimonials:</span>
                <span className="font-semibold">{previewTestimonials.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Selected sources:</span>
                <span className="font-semibold">{selectedSources.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Filter tags:</span>
                <span className="font-semibold">{tags.length}</span>
              </div>

              {selectedSources.length === 0 && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-amber-800 text-sm">Please select at least one source to continue.</p>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWidget;