
import React, { useState } from 'react';
import { Wand2, Eye, Code, Copy, CheckCircle, Settings, Palette, Filter } from 'lucide-react';
import { useWidgets } from '../../hooks/useTestimonials';
import { useAuth } from '../../contexts/AuthContext';
import { useCollectionLinks } from '../../hooks/useTestimonials';

interface WidgetSettings {
  theme: 'light' | 'dark' | 'auto';
  max_testimonials: number;
  animation_style: string;
  show_ratings: boolean;
  show_avatars: boolean;
  show_company: boolean;
  autoplay: boolean;
  selected_sources: string[];
  filter_tags: string[];
}

const CreateWidget: React.FC = () => {
  const { createWidget } = useWidgets();
  const { user } = useAuth();
  const { links } = useCollectionLinks();

  const [widgetName, setWidgetName] = useState('');
  const [widgetType, setWidgetType] = useState<'wall' | 'carousel' | 'single' | 'masonry' | 'list' | 'floating' | 'featured' | 'awards' | 'infinite-scroll'>('wall');
  const [settings, setSettings] = useState<WidgetSettings>({
    theme: 'light',
    max_testimonials: 10,
    animation_style: 'fade',
    show_ratings: true,
    show_avatars: true,
    show_company: true,
    autoplay: false,
    selected_sources: [],
    filter_tags: []
  });
  
  const [activeTab, setActiveTab] = useState('design');
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isCreating, setIsCreating] = useState(false);
  const [embedCode, setEmbedCode] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const widgetTypes = [
    { id: 'wall', name: 'Wall', description: 'Grid layout of testimonials' },
    { id: 'carousel', name: 'Carousel', description: 'Sliding testimonials' },
    { id: 'single', name: 'Single', description: 'One testimonial at a time' },
    { id: 'masonry', name: 'Masonry', description: 'Pinterest-style layout' },
    { id: 'list', name: 'List', description: 'Vertical list layout' },
    { id: 'floating', name: 'Floating', description: 'Floating testimonials' },
    { id: 'featured', name: 'Featured', description: 'Highlighted testimonials' },
    { id: 'awards', name: 'Awards', description: 'Award-style display' },
    { id: 'infinite-scroll', name: 'Infinite Scroll', description: 'Continuously scrolling' }
  ];

  const sources = ['direct', 'instagram', 'facebook', 'x', 'youtube'];

  const updateArraySetting = (key: keyof WidgetSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: (prev[key] as string[]).includes(value)
        ? (prev[key] as string[]).filter((item: string) => item !== value)
        : [...(prev[key] as string[]), value]
    }));
  };

  const handleCreateWidget = async () => {
    if (!widgetName.trim()) return;

    setIsCreating(true);
    try {
      const widget = await createWidget({
        widget_name: widgetName,
        widget_type: widgetType,
        settings,
        is_active: true
      });

      if (widget) {
        setEmbedCode(widget.embed_code);
        setShowSuccess(true);
      }
    } catch (error) {
      console.error('Error creating widget:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
  };

  const resetForm = () => {
    setWidgetName('');
    setWidgetType('wall');
    setSettings({
      theme: 'light',
      max_testimonials: 10,
      animation_style: 'fade',
      show_ratings: true,
      show_avatars: true,
      show_company: true,
      autoplay: false,
      selected_sources: [],
      filter_tags: []
    });
    setShowSuccess(false);
    setEmbedCode('');
  };

  if (showSuccess) {
    return (
      <div className="p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Widget Created Successfully!</h2>
            <p className="text-gray-600 mb-6">Your widget is ready to be embedded on your website.</p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Embed Code</h3>
              <div className="flex items-center space-x-2">
                <code className="flex-1 text-left bg-white p-3 rounded border text-sm font-mono">
                  {embedCode}
                </code>
                <button
                  onClick={copyEmbedCode}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </button>
              </div>
            </div>

            <div className="flex space-x-4 justify-center">
              <button
                onClick={resetForm}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Create Another Widget
              </button>
              <button
                onClick={() => window.location.href = '/dashboard/widgets'}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                View All Widgets
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Wand2 className="w-8 h-8 mr-3 text-blue-600" />
          Create Widget
        </h1>
        <p className="text-gray-600 text-lg">Design and customize your testimonial widget</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="space-y-6">
          {/* Basic Settings */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Basic Settings
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Widget Name</label>
                <input
                  type="text"
                  value={widgetName}
                  onChange={(e) => setWidgetName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter widget name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Widget Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {widgetTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setWidgetType(type.id as typeof widgetType)}
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        widgetType === type.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">{type.name}</div>
                      <div className="text-xs text-gray-500">{type.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="border-b border-gray-200">
              <div className="flex">
                {[
                  { id: 'design', name: 'Design', icon: Palette },
                  { id: 'content', name: 'Content', icon: Filter }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <tab.icon className="w-4 h-4 mr-2" />
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'design' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                    <select
                      value={settings.theme}
                      onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value as 'light' | 'dark' | 'auto' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Testimonials: {settings.max_testimonials}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={settings.max_testimonials}
                      onChange={(e) => setSettings(prev => ({ ...prev, max_testimonials: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Animation Style</label>
                    <select
                      value={settings.animation_style}
                      onChange={(e) => setSettings(prev => ({ ...prev, animation_style: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="fade">Fade</option>
                      <option value="slide">Slide</option>
                      <option value="zoom">Zoom</option>
                      <option value="none">None</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    {[
                      { key: 'show_ratings', label: 'Show Ratings' },
                      { key: 'show_avatars', label: 'Show Avatars' },
                      { key: 'show_company', label: 'Show Company' },
                      { key: 'autoplay', label: 'Autoplay (for carousel)' }
                    ].map((option) => (
                      <label key={option.key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings[option.key as keyof WidgetSettings] as boolean}
                          onChange={(e) => setSettings(prev => ({ ...prev, [option.key]: e.target.checked }))}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'content' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sources</label>
                    <div className="space-y-2">
                      {sources.map((source) => (
                        <label key={source} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.selected_sources.includes(source)}
                            onChange={() => updateArraySetting('selected_sources', source)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 capitalize">{source}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Create Button */}
          <button
            onClick={handleCreateWidget}
            disabled={!widgetName.trim() || isCreating}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Wand2 className="w-5 h-5" />
            <span>{isCreating ? 'Creating Widget...' : 'Create Widget'}</span>
          </button>
        </div>

        {/* Preview Panel */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Preview
            </h2>
            <div className="flex space-x-2">
              {['desktop', 'tablet', 'mobile'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setPreviewMode(mode)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    previewMode === mode
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className={`border border-gray-200 rounded-lg p-4 ${
            previewMode === 'mobile' ? 'max-w-sm mx-auto' :
            previewMode === 'tablet' ? 'max-w-md mx-auto' : ''
          }`}>
            <div className="text-center text-gray-500 py-8">
              <Code className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Widget preview will appear here</p>
              <p className="text-sm mt-2">Type: {widgetType} | Theme: {settings.theme}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWidget;
