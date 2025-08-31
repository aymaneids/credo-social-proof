
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Code, Save, Sparkles, Palette, Settings, Target } from 'lucide-react';
import { useWidgets } from '../../hooks/useTestimonials';
import WidgetPreview from '../widget/WidgetPreview';
import { useAuth } from '../../contexts/AuthContext';

const CreateWidget: React.FC = () => {
  const navigate = useNavigate();
  const { createWidget } = useWidgets();
  const { user } = useAuth();
  
  const [step, setStep] = useState(1);
  const [widgetConfig, setWidgetConfig] = useState({
    widget_name: '',
    widget_type: 'wall',
    settings: {
      theme: 'light',
      max_testimonials: 10,
      animation_style: 'fade',
      show_ratings: true,
      show_avatars: true,
      show_company: true,
      autoplay: false,
      selected_sources: [],
      filter_tags: []
    }
  });

  const [saving, setSaving] = useState(false);

  // Mock testimonials for preview
  const mockTestimonials = [
    {
      id: '1',
      user_id: user?.id || '',
      client_name: 'Sarah Johnson',
      client_email: 'sarah@example.com',
      content: 'This product has completely transformed how we handle customer feedback. The integration was seamless and the results speak for themselves.',
      rating: 5,
      source: 'direct' as const,
      status: 'approved' as const,
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      user_id: user?.id || '',
      client_name: 'Mike Chen',
      client_email: 'mike@example.com',
      content: 'Outstanding service and support. The team went above and beyond to ensure our success.',
      rating: 5,
      source: 'instagram' as const,
      status: 'approved' as const,
      created_at: '2024-01-14T15:30:00Z'
    },
    {
      id: '3',
      user_id: user?.id || '',
      client_name: 'Emily Rodriguez',
      client_email: 'emily@example.com',
      content: 'Game-changer for our business. Highly recommended!',
      rating: 4,
      source: 'facebook' as const,
      status: 'approved' as const,
      created_at: '2024-01-13T09:15:00Z'
    }
  ];

  const widgetTypes = [
    {
      id: 'wall',
      name: 'Testimonial Wall',
      description: 'Grid layout showcasing multiple testimonials',
      icon: '🏗️',
      preview: 'Perfect for landing pages and about sections'
    },
    {
      id: 'carousel',
      name: 'Carousel',
      description: 'Sliding testimonials with navigation',
      icon: '🎠',
      preview: 'Great for hero sections and product pages'
    },
    {
      id: 'single',
      name: 'Single Display',
      description: 'One testimonial at a time with rotation',
      icon: '📱',
      preview: 'Ideal for sidebars and compact spaces'
    },
    {
      id: 'masonry',
      name: 'Masonry Grid',
      description: 'Pinterest-style layout with varying heights',
      icon: '🧱',
      preview: 'Perfect for blogs and content-rich pages'
    },
    {
      id: 'list',
      name: 'List View',
      description: 'Simple vertical list of testimonials',
      icon: '📝',
      preview: 'Clean and minimal design'
    },
    {
      id: 'floating',
      name: 'Floating Widget',
      description: 'Fixed position widget that stays on screen',
      icon: '💬',
      preview: 'Non-intrusive social proof'
    }
  ];

  const handleSave = async () => {
    if (!widgetConfig.widget_name.trim()) {
      alert('Please enter a widget name');
      return;
    }

    setSaving(true);
    try {
      await createWidget(widgetConfig);
      navigate('/dashboard/widgets');
    } catch (error) {
      console.error('Error creating widget:', error);
      alert('Failed to create widget. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setWidgetConfig(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: value
      }
    }));
  };

  const updateArraySetting = (key: string, item: string, checked: boolean) => {
    setWidgetConfig(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: checked 
          ? [...(prev.settings[key as keyof typeof prev.settings] as string[]), item]
          : (prev.settings[key as keyof typeof prev.settings] as string[]).filter((i: string) => i !== item)
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard/widgets')}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Create New Widget</h1>
                <p className="text-sm text-gray-600">Step {step} of 3</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {step < 3 ? (
                <button
                  onClick={() => setStep(Math.min(3, step + 1))}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105 flex items-center space-x-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Creating...' : 'Create Widget'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="space-y-6">
            {/* Step 1: Basic Info & Type */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                  <div className="flex items-center space-x-3 mb-6">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Widget Basics</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Widget Name</label>
                      <input
                        type="text"
                        value={widgetConfig.widget_name}
                        onChange={(e) => setWidgetConfig(prev => ({ ...prev, widget_name: e.target.value }))}
                        placeholder="e.g., Homepage Testimonials"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                  <div className="flex items-center space-x-3 mb-6">
                    <Target className="w-6 h-6 text-purple-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Choose Widget Type</h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {widgetTypes.map((type) => (
                      <div
                        key={type.id}
                        onClick={() => setWidgetConfig(prev => ({ ...prev, widget_type: type.id }))}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                          widgetConfig.widget_type === type.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="text-2xl">{type.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{type.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                            <p className="text-xs text-purple-600 font-medium">{type.preview}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Design & Settings */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                  <div className="flex items-center space-x-3 mb-6">
                    <Palette className="w-6 h-6 text-purple-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Design Settings</h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
                      <div className="grid grid-cols-3 gap-3">
                        {['light', 'dark', 'auto'].map((theme) => (
                          <button
                            key={theme}
                            onClick={() => updateSetting('theme', theme)}
                            className={`p-3 rounded-lg border text-sm font-medium capitalize transition-colors ${
                              widgetConfig.settings.theme === theme
                                ? 'border-purple-500 bg-purple-50 text-purple-700'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            {theme}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Maximum Testimonials: {widgetConfig.settings.max_testimonials}
                      </label>
                      <input
                        type="range"
                        min="3"
                        max="50"
                        value={widgetConfig.settings.max_testimonials}
                        onChange={(e) => updateSetting('max_testimonials', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>3</span>
                        <span>50</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Animation Style</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['fade', 'slide', 'zoom', 'none'].map((animation) => (
                          <button
                            key={animation}
                            onClick={() => updateSetting('animation_style', animation)}
                            className={`p-3 rounded-lg border text-sm font-medium capitalize transition-colors ${
                              widgetConfig.settings.animation_style === animation
                                ? 'border-purple-500 bg-purple-50 text-purple-700'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            {animation}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                  <div className="flex items-center space-x-3 mb-6">
                    <Settings className="w-6 h-6 text-purple-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Display Options</h2>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: 'show_ratings', label: 'Show Star Ratings', description: 'Display customer ratings' },
                      { key: 'show_avatars', label: 'Show Customer Photos', description: 'Display profile pictures' },
                      { key: 'show_company', label: 'Show Company Names', description: 'Display customer companies' },
                      { key: 'autoplay', label: 'Auto-rotate Testimonials', description: 'Automatically cycle through testimonials' }
                    ].map((option) => (
                      <div key={option.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{option.label}</h4>
                          <p className="text-xs text-gray-600">{option.description}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={widgetConfig.settings[option.key as keyof typeof widgetConfig.settings] as boolean}
                          onChange={(e) => updateSetting(option.key, e.target.checked)}
                          className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Filters & Sources */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Testimonial Sources</h2>
                  
                  <div className="space-y-3">
                    {['direct', 'instagram', 'facebook', 'x', 'youtube'].map((source) => (
                      <div key={source} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900 capitalize">{source}</span>
                        <input
                          type="checkbox"
                          checked={widgetConfig.settings.selected_sources.includes(source)}
                          onChange={(e) => updateArraySetting('selected_sources', source, e.target.checked)}
                          className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Content Filters</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Keywords</label>
                    <input
                      type="text"
                      placeholder="e.g., excellent, amazing, recommend (comma-separated)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      onChange={(e) => {
                        const tags = e.target.value.split(',').map((tag: string) => tag.trim()).filter(Boolean);
                        updateSetting('filter_tags', tags);
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-2">Only show testimonials containing these keywords</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Live Preview */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center space-x-3 mb-6">
                <Eye className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">Live Preview</h2>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 min-h-[400px]">
                <WidgetPreview
                  widget={{
                    id: 'preview',
                    user_id: user?.id || '',
                    widget_name: widgetConfig.widget_name || 'Preview Widget',
                    widget_type: widgetConfig.widget_type as any,
                    settings: widgetConfig.settings,
                    is_active: true,
                    embed_code: '',
                    views_count: 0,
                    clicks_count: 0,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  }}
                  testimonials={mockTestimonials}
                />
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-start space-x-3">
                  <Code className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900">Ready to embed?</h4>
                    <p className="text-xs text-blue-700 mt-1">
                      Once created, you'll get a simple script tag to add this widget to any website.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWidget;
