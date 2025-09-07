import React, { useState } from 'react';
import React, { useState } from 'react';
import { Instagram, Plus, Download, Filter, Eye, MessageSquare, ExternalLink, Trash2, BarChart3, TrendingUp, Users, Heart, ChevronDown, ChevronUp, Loader, CheckCircle, XCircle, Sparkles, Star, User, ThumbsUp, MessageCircle, Send, X, AlertCircle, Calendar, Clock } from 'lucide-react';
import { useInstagramImports, InstagramComment, InstagramImport } from '../../hooks/useInstagramImports';

const InstagramImports: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [maxComments, setMaxComments] = useState(20);
  const [useAI, setUseAI] = useState(false);
  const [expandedImport, setExpandedImport] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [commentsData, setCommentsData] = useState<{ [importId: string]: InstagramComment[] }>({});
  const [loadingComments, setLoadingComments] = useState<{ [importId: string]: boolean }>({});
  const [savingComments, setSavingComments] = useState<Set<string>>(new Set());
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [duplicateUrl, setDuplicateUrl] = useState('');
  const [existingImports, setExistingImports] = useState<InstagramImport[]>([]);

  const { imports, loading, scraping, scrapeInstagramPost, getCommentsForImport, saveCommentAsTestimonial, deleteImport, refetch } = useInstagramImports();

  // Extract Instagram post ID from URL
  const extractInstagramPostId = (url: string): string | null => {
    try {
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
      return null;
    } catch {
      return null;
    }
  };

  const handleScrapePost = async () => {
    if (!urlInput.trim()) return;

    // Extract post ID from the input URL
    const postId = extractInstagramPostId(urlInput.trim());
    if (!postId) {
      alert('Invalid Instagram URL format. Please use a direct link to an Instagram post.');
      return;
    }

    // Check for duplicate post IDs (same post, different URL formats)
    const existingImportsForPost = imports.filter(imp => {
      const existingPostId = extractInstagramPostId(imp.url);
      return existingPostId === postId;
    });

    if (existingImportsForPost.length > 0) {
      setDuplicateUrl(urlInput.trim());
      setExistingImports(existingImportsForPost);
      setShowDuplicateDialog(true);
      return;
    }

    await performScraping();
  };

  const performScraping = async (forceRescan = false) => {
    if (!urlInput.trim()) return;

    try {
      const result = await scrapeInstagramPost(
        urlInput,
        titleInput || 'Instagram Post',
        maxComments,
        useAI
      );

      setUrlInput('');
      setTitleInput('');
      setShowAddForm(false);
      setShowDuplicateDialog(false);
      
      // Automatically load comments for the new import
      if (result.importId) {
        await loadCommentsForImport(result.importId);
        setExpandedComments(result.importId);
      }
    } catch (error) {
      console.error('Error scraping Instagram post:', error);
      alert(error instanceof Error ? error.message : 'Failed to scrape Instagram post');
    }
  };

  const loadCommentsForImport = async (importId: string) => {
    setLoadingComments(prev => ({ ...prev, [importId]: true }));
    
    try {
      const comments = await getCommentsForImport(importId);
      setCommentsData(prev => ({ ...prev, [importId]: comments }));
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoadingComments(prev => ({ ...prev, [importId]: false }));
    }
  };

  const handleSaveComment = async (commentId: string, importId: string) => {
    setSavingComments(prev => new Set(prev).add(commentId));
    
    try {
      await saveCommentAsTestimonial(commentId);
      
      // Update the comment in local state
      setCommentsData(prev => ({
        ...prev,
        [importId]: prev[importId]?.map(comment => 
          comment.id === commentId 
            ? { ...comment, is_saved_as_testimonial: true }
            : comment
        ) || []
      }));
    } catch (error) {
      console.error('Error saving comment:', error);
      alert('Failed to save comment as testimonial');
    } finally {
      setSavingComments(prev => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    }
  };

  const handleDeleteImport = async (importId: string) => {
    if (!confirm('Are you sure you want to delete this import? This will also delete all associated comments.')) {
      return;
    }

    try {
      await deleteImport(importId);
      // Remove from local state
      setCommentsData(prev => {
        const newData = { ...prev };
        delete newData[importId];
        return newData;
      });
      setExpandedComments(null);
      setExpandedImport(null);
    } catch (error) {
      console.error('Error deleting import:', error);
      alert('Failed to delete import');
    }
  };

  const toggleComments = async (importId: string) => {
    if (expandedComments === importId) {
      setExpandedComments(null);
    } else {
      setExpandedComments(importId);
      if (!commentsData[importId]) {
        await loadCommentsForImport(importId);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      completed: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Completed', icon: CheckCircle },
      processing: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Processing', icon: Loader },
      pending: { color: 'bg-amber-100 text-amber-800 border-amber-200', label: 'Pending', icon: Clock },
      failed: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Failed', icon: XCircle }
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const toggleImportDetails = (importId: string) => {
    setExpandedImport(expandedImport === importId ? null : importId);
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
          { label: 'Comments Stored', value: imports.reduce((sum, imp) => sum + imp.comments_saved, 0).toString(), icon: Download, color: 'blue' },
          { label: 'This Month', value: imports.filter(imp => imp.created_at.startsWith('2025-01')).length.toString(), icon: Calendar, color: 'purple' }
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
              <li>• Comments are saved for review and can be individually selected</li>
              <li>• AI filtering helps identify the most valuable feedback</li>
              <li>• Click "View Comments" to see all scraped comments</li>
              <li>• Manually save individual comments as testimonials</li>
              <li>• You can rescan the same URL multiple times to catch new comments</li>
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

      {/* Duplicate URL Confirmation Dialog */}
      {showDuplicateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl animate-slide-up">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Post Already Scanned</h3>
                <p className="text-sm text-gray-600">This Instagram post ID has been scanned before</p>
              </div>
            </div>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700 mb-2"><strong>Post ID:</strong> {extractInstagramPostId(duplicateUrl)}</p>
              <p className="text-sm text-gray-700 mb-2"><strong>New URL:</strong></p>
              <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">{duplicateUrl}</p>
              
              {existingImports.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-700 mb-2"><strong>Previous Scans ({existingImports.length}):</strong></p>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {existingImports.map((imp, idx) => (
                      <div key={imp.id} className="text-xs text-gray-600 bg-white p-2 rounded border">
                        <p>• <strong>Scan #{idx + 1}:</strong> {imp.title}</p>
                        <p>• <strong>Max Requested:</strong> {imp.max_comments_requested} comments</p>
                        <p>• <strong>Actually Found:</strong> {imp.total_comments_found} comments</p>
                        <p>• <strong>Successfully Saved:</strong> {imp.comments_saved} comments</p>
                        <p>• <strong>Date:</strong> {new Date(imp.created_at).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 text-sm mb-1">What would you like to do?</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• <strong>View Existing:</strong> See comments from previous scans</li>
                  <li>• <strong>Scan Again:</strong> Get fresh comments with your current limit ({maxComments})</li>
                  <li>• <strong>Note:</strong> All {maxComments} comments will be saved, even if they're duplicates</li>
                </ul>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  if (existingImports.length > 0) {
                    // Open the most recent scan by default
                    const mostRecentImport = existingImports.sort((a, b) => 
                      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                    )[0];
                    setExpandedComments(mostRecentImport.id);
                    if (!commentsData[mostRecentImport.id]) {
                      loadCommentsForImport(mostRecentImport.id);
                    }
                  }
                  setShowDuplicateDialog(false);
                }}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>View Latest Scan</span>
              </button>
              
              <button
                onClick={() => performScraping(true)}
                disabled={scraping}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {scraping ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Scanning...</span>
                  </>
                ) : (
                  <>
                    <Instagram className="w-4 h-4" />
                    <span>Scan Again</span>
                  </>
                )}
              </button>
            </div>
            
            <button
              onClick={() => {
                setShowDuplicateDialog(false);
                setDuplicateUrl('');
                setExistingImports([]);
              }}
              className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              disabled={scraping}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Import History */}
      <div className="space-y-4">
        {imports.map((importData, index) => {
          const statusBadge = getStatusBadge(importData.status);
          const importComments = commentsData[importData.id] || [];
          const savedCount = importComments.filter(c => c.is_saved_as_testimonial).length;
          
          // Check for duplicate post IDs
          const currentPostId = extractInstagramPostId(importData.url);
          const duplicateImports = imports.filter(imp => {
            const impPostId = extractInstagramPostId(imp.url);
            return impPostId === currentPostId;
          });
          const isDuplicate = duplicateImports.length > 1;
          const duplicateIndex = duplicateImports.filter(imp => imp.created_at <= importData.created_at).length;
          
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
                    {isDuplicate && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200 flex items-center space-x-1">
                        <span>Post ID: {currentPostId} (Scan #{duplicateIndex})</span>
                      </span>
                    )}
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
                      <span className="text-gray-500">Comments Stored:</span>
                      <span className="ml-2 font-semibold text-blue-600">{importData.comments_saved}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Saved as Testimonials:</span>
                      <span className="ml-2 font-semibold text-green-600">{savedCount}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Max Requested:</span>
                      <span className="ml-2 font-semibold">{importData.max_comments_requested}</span>
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
                      className="bg-pink-50 hover:bg-pink-100 text-pink-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 border border-pink-200 flex items-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Comments</span>
                      {expandedComments === importData.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  )}
                  <button 
                    onClick={() => toggleImportDetails(importData.id)}
                    className="bg-pink-50 hover:bg-pink-100 text-pink-700 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 border border-pink-200 flex items-center space-x-1"
                  >
                    <BarChart3 className="w-4 h-4" />
                    {expandedImport === importData.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => handleDeleteImport(importData.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200"
                    title="Delete import"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Expanded Comments Section */}
              {expandedComments === importData.id && (
                <div className="mt-4 pt-4 border-t border-gray-200 animate-slide-up">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Comments from this Import</h4>
                      {isDuplicate && (
                        <p className="text-sm text-orange-600 mt-1">
                          ℹ️ This is scan #{duplicateIndex} of this URL. Each scan may capture different comments.
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-500">{importComments.length} total comments</span>
                      <span className="text-green-600 font-medium">{savedCount} saved as testimonials</span>
                    </div>
                  </div>
                  
                  {loadingComments[importData.id] ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <div className="w-8 h-8 border-2 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-gray-600">Loading comments...</p>
                      </div>
                    </div>
                  ) : importComments.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {importComments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-start space-x-3">
                            <img
                              src={comment.profile_image || 'https://via.placeholder.com/40'}
                              alt={comment.username}
                              className="w-10 h-10 rounded-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/40?text=' + (comment.username.charAt(0) || 'U');
                              }}
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-semibold text-gray-900">{comment.username}</span>
                                {comment.is_verified && (
                                  <CheckCircle className="w-4 h-4 text-blue-500" />
                                )}
                                <span className="text-sm text-gray-500">
                                  {new Date(comment.comment_created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-800 mb-3">{comment.message}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span className="flex items-center space-x-1">
                                    <Heart className="w-4 h-4" />
                                    <span>{comment.like_count}</span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <MessageCircle className="w-4 h-4" />
                                    <span>{comment.reply_count}</span>
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {comment.is_saved_as_testimonial ? (
                                    <span className="flex items-center space-x-1 text-green-600 text-sm font-medium">
                                      <CheckCircle className="w-4 h-4" />
                                      <span>Saved as Testimonial</span>
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => handleSaveComment(comment.id, importData.id)}
                                      disabled={savingComments.has(comment.id)}
                                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                                    >
                                      {savingComments.has(comment.id) ? (
                                        <>
                                          <Loader className="w-4 h-4 animate-spin" />
                                          <span>Saving...</span>
                                        </>
                                      ) : (
                                        <>
                                          <Send className="w-4 h-4" />
                                          <span>Save as Testimonial</span>
                                        </>
                                      )}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-lg font-medium">No comments found</p>
                      <p className="text-sm">Comments from this import will appear here</p>
                    </div>
                  )}
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