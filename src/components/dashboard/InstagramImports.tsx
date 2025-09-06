import React, { useState } from 'react';
import { Instagram, Plus, Download, Filter, Eye, MessageSquare, ExternalLink, Trash2, BarChart3, TrendingUp, Users, Heart, ChevronDown, ChevronUp, Loader, CheckCircle, XCircle, Sparkles, Star, User, ThumbsUp, MessageCircle } from 'lucide-react';
import { useInstagramImports, InstagramComment } from '../../hooks/useInstagramImports';

const InstagramImports: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [maxComments, setMaxComments] = useState(20);
  const [useAI, setUseAI] = useState(false);
  const [expandedImport, setExpandedImport] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [lastScrapeResult, setLastScrapeResult] = useState<InstagramComment[] | null>(null);

  const { imports, loading, scraping, scrapeInstagramPost, refetch } = useInstagramImports();

  const handleScrapePost = async () => {
    if (!urlInput.trim()) return;

    try {
      const result = await scrapeInstagramPost(
        urlInput,
        titleInput || 'Instagram Post',
        maxComments,
        useAI
      );

      setLastScrapeResult(result.comments);
      setUrlInput('');
      setTitleInput('');
      setShowAddForm(false);
      
      // Show success message or handle result
      console.log('Scrape completed:', result);
    } catch (error) {
      console.error('Error scraping Instagram post:', error);
      alert(error instanceof Error ? error.message : 'Failed to scrape Instagram post');
    }
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      completed: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Completed', icon: CheckCircle },
      processing: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Processing' },
      pending: { color: 'bg-amber-100 text-amber-800 border-amber-200', label: 'Pending', icon: Loader },
      failed: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Failed', icon: XCircle }
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const toggleImportDetails = (importId: string) => {
    setExpandedImport(expandedImport === importId ? null : importId);
  };

  const toggleComments = (importId: string) => {
    setExpandedComments(expandedComments === importId ? null : importId);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Instagram imports...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Instagram Imports
          </h1>
          <p className="text-gray-600 text-lg">Import testimonials from Instagram posts by adding URLs</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Instagram URL</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
        {[
          { label: 'Total Imports', value: imports.length.toString(), icon: Instagram, color: 'pink' },
          { label: 'Comments Found', value: imports.reduce((sum, imp) => sum + imp.total_comments_found, 0).toString(), icon: MessageSquare, color: 'green' },
          { label: 'Testimonials Saved', value: imports.reduce((sum, imp) => sum + imp.comments_saved, 0).toString(), icon: CheckCircle, color: 'blue' },
          { label: 'This Month', value: imports.filter(imp => imp.created_at.startsWith('2025-01')).length.toString(), icon: Download, color: 'purple' }
        ].map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/20 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                  <IconComponent className={`w-5 h-5 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add URL Form */}
      {showAddForm && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 animate-slide-up">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Scrape Instagram Post Comments</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instagram Post URL</label>
              <p className="text-xs text-gray-500 mb-2">
                Paste any Instagram post, reel, or TV URL (e.g., https://instagram.com/p/ABC123/)
              </p>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://www.instagram.com/p/DC7Q4z5JPMX/"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title (Optional)</label>
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder="e.g., Product Launch Post"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Comments</label>
                <select
                  value={maxComments}
                  onChange={(e) => setMaxComments(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                >
                  <option value={10}>10 comments</option>
                  <option value={20}>20 comments</option>
                  <option value={50}>50 comments</option>
                  <option value={100}>100 comments</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">AI Filtering</label>
                <div className="flex items-center space-x-3 h-12">
                  <input
                    type="checkbox"
                    id="useAI"
                    checked={useAI}
                    onChange={(e) => setUseAI(e.target.checked)}
                    className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                  />
                  <label htmlFor="useAI" className="text-sm text-gray-700 flex items-center space-x-1">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span>Use AI to detect best comments</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4 mt-6">
            <button
              onClick={handleScrapePost}
              disabled={!urlInput.trim() || scraping}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
            >
              {scraping ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Scraping...</span>
                </>
              ) : (
                <>
                  <Instagram className="w-5 h-5" />
                  <span>Scrape Comments</span>
                </>
              )}
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors"
              disabled={scraping}
            >
              Cancel
            </button>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">How it works:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• We use Apify to extract real comments from the Instagram post</li>
              <li>• Comments are automatically converted to testimonials</li>
              <li>• AI filtering helps identify the most valuable feedback</li>
              <li>• All testimonials require your approval before going live</li>
              <li>• Processing typically takes 30-60 seconds depending on comment count</li>
            </ul>
          </div>
          
          {scraping && (
            <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center space-x-3">
                <Loader className="w-5 h-5 text-amber-600 animate-spin" />
                <div>
                  <h4 className="font-semibold text-amber-900">Scraping in progress...</h4>
                  <p className="text-sm text-amber-800">This may take 30-60 seconds. Please don't close this page.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Last Scrape Results */}
      {lastScrapeResult && lastScrapeResult.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Latest Scrape Results</span>
            </h3>
            <span className="text-sm text-gray-500">{lastScrapeResult.length} comments found</span>
          </div>
          
          <div className="grid gap-4 max-h-96 overflow-y-auto">
            {lastScrapeResult.map((comment, index) => (
              <div key={comment.id} className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 border border-pink-200">
                <div className="flex items-start space-x-3">
                  <img
                    src={comment.profileImage}
                    alt={comment.username}
                    className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-gray-900">{comment.username}</span>
                      {comment.isVerified && (
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">{comment.message}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{comment.likeCount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-3 h-3" />
                        <span>{comment.replyCount}</span>
                      </div>
                      <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Import History */}
      <div className="space-y-4">
        {imports.map((importData, index) => {
          const statusBadge = getStatusBadge(importData.status);
          return (
            <div 
              key={importData.id} 
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${200 + index * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Instagram className="w-5 h-5 text-pink-600" />
                    <h3 className="font-semibold text-gray-900">{importData.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusBadge.color} flex items-center space-x-1`}>
                      {statusBadge.icon && <statusBadge.icon className="w-3 h-3" />}
                      <span>{statusBadge.label}</span>
                    </span>
                    {importData.use_ai_filter && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200 flex items-center space-x-1">
                        <Sparkles className="w-3 h-3" />
                        <span>AI Filtered</span>
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">{importData.url}</span>
                    <button
                      onClick={() => window.open(importData.url, '_blank')}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-500">Comments Found:</span>
                      <span className="ml-2 font-semibold text-blue-600">{importData.total_comments_found}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Saved as Testimonials:</span>
                      <span className="ml-2 font-semibold text-green-600">{importData.comments_saved}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Max Requested:</span>
                      <span className="ml-2 font-semibold">{importData.max_comments_requested}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Success Rate:</span>
                      <span className="ml-2 font-semibold text-purple-600">
                        {importData.total_comments_found > 0 
                          ? Math.round((importData.comments_saved / importData.total_comments_found) * 100)
                          : 0}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Created: {new Date(importData.created_at).toLocaleDateString()}</span>
                    {importData.processed_at && (
                      <span>Processed: {new Date(importData.processed_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {importData.status === 'completed' && importData.comments_saved > 0 && (
                    <button 
                      onClick={() => toggleComments(importData.id)}
                      className="bg-pink-50 hover:bg-pink-100 text-pink-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors border border-pink-200 flex items-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Comments</span>
                      {expandedComments === importData.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  )}
                  <button 
                    onClick={() => toggleImportDetails(importData.id)}
                    className="bg-pink-50 hover:bg-pink-100 text-pink-700 px-3 py-2 rounded-lg text-sm font-semibold transition-colors border border-pink-200 flex items-center space-x-1"
                  >
                    <BarChart3 className="w-4 h-4" />
                    {expandedImport === importData.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* Expanded Import Details */}
              {expandedImport === importData.id && (
                <div className="mt-4 pt-4 border-t border-gray-200 animate-slide-up">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-pink-50 rounded-lg p-3 text-center border border-pink-200">
                      <TrendingUp className="w-5 h-5 text-pink-600 mx-auto mb-1" />
                      <div className="text-lg font-bold text-pink-900">
                        {importData.total_comments_found > 0 
                          ? Math.round((importData.comments_saved / importData.total_comments_found) * 100)
                          : 0}%
                      </div>
                      <div className="text-xs text-pink-700">Success Rate</div>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
                      <MessageSquare className="w-5 h-5 text-green-600 mx-auto mb-1" />
                      <div className="text-lg font-bold text-green-900">{importData.comments_saved}</div>
                      <div className="text-xs text-green-700">Saved</div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
                      <Eye className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <div className="text-lg font-bold text-blue-900">{importData.total_comments_found}</div>
                      <div className="text-xs text-blue-700">Found</div>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-200">
                      <Sparkles className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                      <div className="text-lg font-bold text-purple-900">{importData.use_ai_filter ? 'Yes' : 'No'}</div>
                      <div className="text-xs text-purple-700">AI Filter</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {imports.length === 0 && (
        <div className="text-center py-16 animate-fade-in">
          <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Instagram className="w-12 h-12 text-pink-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">No Instagram imports yet</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Start importing testimonials from Instagram post comments using our AI-powered scraper.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
          >
            Import Your First Post
          </button>
        </div>
      )}
    </div>
  );
};

export default InstagramImports;