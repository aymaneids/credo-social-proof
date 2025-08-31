
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Copy, Edit, Trash2, ExternalLink } from 'lucide-react';
import { useWidgets } from '../../hooks/useTestimonials';

const Widgets: React.FC = () => {
  const navigate = useNavigate();
  const { widgets, deleteWidget } = useWidgets();

  const handleDeleteWidget = async (widgetId: string) => {
    if (confirm('Are you sure you want to delete this widget?')) {
      try {
        await deleteWidget(widgetId);
      } catch (error) {
        console.error('Error deleting widget:', error);
      }
    }
  };

  const copyEmbedCode = (widgetId: string) => {
    const embedCode = `<script src="https://yoursite.com/widget/${widgetId}.js"></script>`;
    navigator.clipboard.writeText(embedCode);
    // You could add a toast notification here
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Widgets</h1>
          <p className="text-gray-600 text-lg">Embed testimonials anywhere on your website</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/widgets/create')}
          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Widget</span>
        </button>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgets.map((widget) => (
          <div key={widget.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {widget.widget_name || 'Untitled Widget'}
                </h3>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {widget.widget_type || 'wall'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate(`/dashboard/widgets/edit/${widget.id}`)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteWidget(widget.id)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{widget.views_count || 0}</div>
                <div className="text-xs text-gray-500">Views</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{widget.clicks_count || 0}</div>
                <div className="text-xs text-gray-500">Clicks</div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={() => copyEmbedCode(widget.id)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Embed Code</span>
              </button>
              
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>
                <button className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                  <ExternalLink className="w-4 h-4" />
                  <span>Live</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {widgets.length === 0 && (
          <div className="col-span-full bg-white/60 backdrop-blur-sm rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No widgets yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create your first widget to start displaying testimonials on your website.
            </p>
            <button
              onClick={() => navigate('/dashboard/widgets/create')}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
            >
              Create Your First Widget
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Widgets;
