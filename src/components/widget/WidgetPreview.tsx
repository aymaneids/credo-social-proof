import React, { useState } from 'react';
import { Star, Play, ChevronLeft, ChevronRight, Twitter, Instagram, Facebook, Youtube, Link as LinkIcon, Award, Trophy, Sparkles, ArrowRight, Quote, CheckCircle, Heart, MessageSquare, Share2, ArrowUpRight, Eye } from 'lucide-react';
import { Widget, Testimonial } from '../../types';
import {
  WallWidget,
  CarouselWidget,
  SingleWidget,
  MasonryWidget,
  ListWidget,
  FloatingWidget,
  FeaturedWidget,
  AwardsWidget,
  InfiniteScrollWidget
} from './types';

interface WidgetPreviewProps {
  widget: Widget;
  testimonials: Testimonial[];
  className?: string;
}

// Enhanced List Testimonial Card Component
const ListTestimonialCard: React.FC<{
  testimonial: Testimonial;
  widget: Widget;
  index: number;
}> = ({ testimonial, widget, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get platform-specific styling
  const getPlatformStyling = (source: string) => {
    switch (source) {
      case 'direct':
        return {
          gradient: 'from-emerald-50 via-green-50 to-emerald-50',
          borderColor: 'border-emerald-200/60',
          accentColor: 'text-emerald-600',
          badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
          iconColor: 'text-emerald-500',
          hoverGradient: 'group-hover:from-emerald-100 group-hover:via-green-100 group-hover:to-emerald-100',
          showSocialMetrics: false,
          platformName: 'Direct',
          platformIcon: '🔗'
        };
      case 'instagram':
        return {
          gradient: 'from-pink-50 via-purple-50 to-pink-50',
          borderColor: 'border-pink-200/60',
          accentColor: 'text-pink-600',
          badgeColor: 'bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 border-pink-200',
          iconColor: 'text-pink-500',
          hoverGradient: 'group-hover:from-pink-100 group-hover:via-purple-100 group-hover:to-pink-100',
          showSocialMetrics: true,
          platformName: 'Instagram',
          platformIcon: '📷'
        };
      case 'facebook':
        return {
          gradient: 'from-blue-50 via-indigo-50 to-blue-50',
          borderColor: 'border-blue-200/60',
          accentColor: 'text-blue-600',
          badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
          iconColor: 'text-blue-500',
          hoverGradient: 'group-hover:from-blue-100 group-hover:via-indigo-100 group-hover:to-blue-100',
          showSocialMetrics: true,
          platformName: 'Facebook',
          platformIcon: '👥'
        };
      case 'x':
        return {
          gradient: 'from-gray-50 via-slate-50 to-gray-50',
          borderColor: 'border-gray-200/60',
          accentColor: 'text-gray-700',
          badgeColor: 'bg-gray-100 text-gray-700 border-gray-200',
          iconColor: 'text-gray-600',
          hoverGradient: 'group-hover:from-gray-100 group-hover:via-slate-100 group-hover:to-gray-100',
          showSocialMetrics: true,
          platformName: 'X',
          platformIcon: '🐦'
        };
      case 'youtube':
        return {
          gradient: 'from-red-50 via-orange-50 to-red-50',
          borderColor: 'border-red-200/60',
          accentColor: 'text-red-600',
          badgeColor: 'bg-red-100 text-red-700 border-red-200',
          iconColor: 'text-red-500',
          hoverGradient: 'group-hover:from-red-100 group-hover:via-orange-100 group-hover:to-red-100',
          showSocialMetrics: true,
          platformName: 'YouTube',
          platformIcon: '📺'
        };
      default:
        return {
          gradient: 'from-gray-50 via-white to-gray-50',
          borderColor: 'border-gray-200/60',
          accentColor: 'text-gray-600',
          badgeColor: 'bg-gray-100 text-gray-700 border-gray-200',
          iconColor: 'text-gray-500',
          hoverGradient: 'group-hover:from-gray-100 group-hover:via-gray-50 group-hover:to-gray-100',
          showSocialMetrics: false,
          platformName: 'Unknown',
          platformIcon: '💬'
        };
    }
  };

  const styling = getPlatformStyling(testimonial.source);
  const initials = testimonial.client_name.split(' ').map(n => n[0]).join('').toUpperCase();

  // Generate mock social metrics for demo (in real app, these would come from API)
  const getSocialMetrics = (source: string) => {
    const baseMetrics = {
      likes: Math.floor(Math.random() * 500) + 50,
      shares: Math.floor(Math.random() * 100) + 10,
      comments: Math.floor(Math.random() * 50) + 5
    };
    
    switch (source) {
      case 'instagram':
        return { likes: baseMetrics.likes, comments: baseMetrics.comments };
      case 'facebook':
        return { likes: baseMetrics.likes, shares: baseMetrics.shares, comments: baseMetrics.comments };
      case 'x':
        return { likes: baseMetrics.likes, retweets: baseMetrics.shares, replies: baseMetrics.comments };
      case 'youtube':
        return { likes: baseMetrics.likes, views: `${(baseMetrics.likes * 10).toLocaleString()}`, comments: baseMetrics.comments };
      default:
        return {};
    }
  };

  const socialMetrics = getSocialMetrics(testimonial.source);

  return (
    <div 
      className={`group relative bg-gradient-to-br ${styling.gradient} ${styling.hoverGradient} rounded-2xl p-6 border-2 ${styling.borderColor} shadow-lg hover:shadow-2xl transition-all duration-500 ease-out hover:-translate-y-2 overflow-hidden animate-slide-up`}
      style={{ animationDelay: `${index * 150}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating decorative elements */}
      <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-white/20 to-white/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-150"></div>
      <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-tr from-white/15 to-white/5 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-125"></div>
      
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-shimmer"
          style={{ animationDuration: '2s' }}
        ></div>
      </div>

      {/* Platform badge - removed text, keeping icon in avatar */}

      {/* Main content */}
      <div className="relative z-10">
        <div className="flex items-start space-x-4 mb-5">
          {/* Enhanced Avatar */}
          {widget.settings.show_avatars && (
            <div className="relative flex-shrink-0 group-hover:scale-110 transition-transform duration-300 mt-1">
              <div 
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl border-3 border-white/60 backdrop-blur-sm relative overflow-hidden`}
                style={{
                  background: testimonial.source === 'direct' 
                    ? 'linear-gradient(135deg, #10b981, #059669, #14b8a6)'
                    : testimonial.source === 'instagram'
                    ? 'linear-gradient(135deg, #e1306c, #833ab4, #fd1d1d)'
                    : testimonial.source === 'facebook'
                    ? 'linear-gradient(135deg, #1877f2, #42a5f5, #1565c0)'
                    : testimonial.source === 'x'
                    ? 'linear-gradient(135deg, #000000, #1a1a1a, #333333)'
                    : testimonial.source === 'youtube'
                    ? 'linear-gradient(135deg, #ff0000, #cc0000, #ff4444)'
                    : 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)',
                  boxShadow: `
                    0 8px 25px rgba(0, 0, 0, 0.15),
                    0 0 0 1px rgba(255, 255, 255, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2)
                  `
                }}
              >
                <span className="text-white font-bold text-lg tracking-wide drop-shadow-lg relative z-10">
                  {initials}
                </span>
                
                {/* Subtle inner glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              {/* Floating ring animation */}
              <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-white/40 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
              
              {/* Source-specific badge */}
              {testimonial.source === 'direct' ? (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white group-hover:scale-125 transition-transform duration-300">
                  <LinkIcon className="w-3 h-3 text-white" />
                </div>
              ) : testimonial.source === 'instagram' ? (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white group-hover:scale-125 transition-transform duration-300">
                  <Instagram className="w-3 h-3 text-white" />
                </div>
              ) : testimonial.source === 'facebook' ? (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white group-hover:scale-125 transition-transform duration-300">
                  <Facebook className="w-3 h-3 text-white" />
                </div>
              ) : testimonial.source === 'x' ? (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full flex items-center justify-center shadow-lg border-2 border-white group-hover:scale-125 transition-transform duration-300">
                  <Twitter className="w-3 h-3 text-white" />
                </div>
              ) : testimonial.source === 'youtube' ? (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white group-hover:scale-125 transition-transform duration-300">
                  <Youtube className="w-3 h-3 text-white" />
                </div>
              ) : null}
            </div>
          )}

          {/* Content section */}
          <div className="flex-1 min-w-0">
            {/* Header with name and rating */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3 pt-0.5">
                <h4 className="font-bold text-lg text-gray-900 group-hover:scale-105 transition-transform duration-300 leading-tight">
                  {testimonial.client_name}
                </h4>
              </div>
              
              {/* Enhanced rating display */}
              {widget.settings.show_ratings && (
                <div className="flex items-center space-x-2 group-hover:scale-110 transition-transform duration-300">
                  <div className="flex items-center space-x-0.5">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-5 h-5 text-amber-400 fill-current drop-shadow-sm group-hover:animate-pulse" 
                        style={{ animationDelay: `${i * 100}ms` }}
                      />
                    ))}
                    {[...Array(5 - testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-gray-300" />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
                    {testimonial.rating}.0
                  </span>
                </div>
              )}
            </div>

            {/* Company info */}
            {widget.settings.show_company && testimonial.client_email && (
              <div className="flex items-center space-x-2 mb-4">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${styling.badgeColor}`}>
                  {/* Empty div for styling purposes only - no domain text */}
                </div>
              </div>
            )}

            {/* Enhanced testimonial content */}
            <div className="relative mb-5">
              <div className="absolute -top-2 -left-2 text-4xl text-blue-200/40 font-serif select-none">"</div>
              <blockquote className="text-gray-800 leading-relaxed text-lg font-medium pl-6 pr-4 italic group-hover:text-gray-900 transition-colors duration-300">
                {testimonial.content}
              </blockquote>
              <div className="absolute -bottom-2 -right-2 text-4xl text-blue-200/40 font-serif select-none">"</div>
            </div>

            {/* Social metrics (only for social media sources) */}
            {styling.showSocialMetrics && (
              <div className="flex items-center space-x-6 mb-4 text-sm text-gray-600">
                {socialMetrics.likes && (
                  <div className="flex items-center space-x-1.5 group-hover:scale-105 transition-transform duration-200">
                    <Heart className={`w-4 h-4 ${styling.iconColor}`} />
                    <span className="font-medium">{socialMetrics.likes}</span>
                    <span className="text-gray-500">likes</span>
                  </div>
                )}
                {socialMetrics.shares && (
                  <div className="flex items-center space-x-1.5 group-hover:scale-105 transition-transform duration-200">
                    <Share2 className={`w-4 h-4 ${styling.iconColor}`} />
                    <span className="font-medium">{socialMetrics.shares}</span>
                    <span className="text-gray-500">shares</span>
                  </div>
                )}
                {socialMetrics.retweets && (
                  <div className="flex items-center space-x-1.5 group-hover:scale-105 transition-transform duration-200">
                    <ArrowUpRight className={`w-4 h-4 ${styling.iconColor}`} />
                    <span className="font-medium">{socialMetrics.retweets}</span>
                    <span className="text-gray-500">retweets</span>
                  </div>
                )}
                {socialMetrics.replies && (
                  <div className="flex items-center space-x-1.5 group-hover:scale-105 transition-transform duration-200">
                    <MessageSquare className={`w-4 h-4 ${styling.iconColor}`} />
                    <span className="font-medium">{socialMetrics.replies}</span>
                    <span className="text-gray-500">replies</span>
                  </div>
                )}
                {socialMetrics.comments && !socialMetrics.replies && (
                  <div className="flex items-center space-x-1.5 group-hover:scale-105 transition-transform duration-200">
                    <MessageSquare className={`w-4 h-4 ${styling.iconColor}`} />
                    <span className="font-medium">{socialMetrics.comments}</span>
                    <span className="text-gray-500">comments</span>
                  </div>
                )}
                {socialMetrics.views && (
                  <div className="flex items-center space-x-1.5 group-hover:scale-105 transition-transform duration-200">
                    <Eye className={`w-4 h-4 ${styling.iconColor}`} />
                    <span className="font-medium">{socialMetrics.views}</span>
                    <span className="text-gray-500">views</span>
                  </div>
                )}
              </div>
            )}

            {/* Enhanced footer */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 font-medium">
                {new Date(testimonial.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
              
              {/* Call-to-action hint */}
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold ${styling.badgeColor} shadow-sm`}>
                  <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse"></div>
                  <span>Read full story</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced hover effect overlay */}
        <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
             style={{
               background: `linear-gradient(135deg, ${
                 testimonial.source === 'direct' ? 'rgba(16, 185, 129, 0.05)' :
                 testimonial.source === 'instagram' ? 'rgba(225, 48, 108, 0.05)' :
                 testimonial.source === 'facebook' ? 'rgba(24, 119, 242, 0.05)' :
                 testimonial.source === 'x' ? 'rgba(0, 0, 0, 0.05)' :
                 testimonial.source === 'youtube' ? 'rgba(255, 0, 0, 0.05)' :
                 'rgba(99, 102, 241, 0.05)'
               } 0%, transparent 100%)`
             }}>
        </div>
      </div>
    </div>
  );
};

const WidgetPreview: React.FC<WidgetPreviewProps> = ({
  widget,
  testimonials,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeBubble, setActiveBubble] = useState<string | null>(null);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const displayTestimonials = testimonials.slice(0, widget.settings.max_testimonials);

  React.useEffect(() => {
    if (widget.widget_type === 'carousel' && widget.settings.autoplay && displayTestimonials.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % displayTestimonials.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [widget.widget_type, widget.settings.autoplay, displayTestimonials.length]);

  React.useEffect(() => {
    if (widget.widget_type === 'floating' && displayTestimonials.length > 0) {
      setActiveBubble(displayTestimonials[0].id);
    }
  }, [widget.widget_type, displayTestimonials]);

  const getAnimationClass = () => {
    switch (widget.settings.animation_style) {
      case 'fade': return 'animate-fade-in';
      case 'slide': return 'animate-slide-up';
      case 'scale': return 'animate-scale-in';
      default: return '';
    }
  };

  const getThemeClasses = () => {
    return widget.settings.theme === 'dark' 
      ? 'bg-gray-900 text-white' 
      : 'bg-white text-gray-900';
  };

  if (displayTestimonials.length === 0) {
    return (
      <div className={`rounded-xl p-6 border-2 border-dashed ${className}`}>
        <div className="text-center text-gray-500">
          <p className="text-sm">No testimonials to display.</p>
        </div>
      </div>
    );
  }

  // ### TESTIMONIAL CARD COMPONENT ###
  const TestimonialCard: React.FC<{ 
    testimonial: Testimonial; 
    index?: number; 
    variant?: 'default' | 'small' | 'large' 
  }> = ({ 
    testimonial, 
    index = 0,
    variant = 'default'
  }) => {
    const { rating, content, client_name, source, client_email } = testimonial;
    
    const getPlatformIcon = (platform: string) => {
      switch (platform) {
        case 'x':
          return <Twitter className="w-4 h-4 text-gray-500" />;
        case 'instagram':
          return <Instagram className="w-4 h-4 text-gray-500" />;
        case 'facebook':
          return <Facebook className="w-4 h-4 text-gray-500" />;
        case 'youtube':
         return <Youtube className="w-4 h-4 text-gray-500" />;
        case 'direct':
         return <LinkIcon className="w-4 h-4 text-gray-500" />;
        default:
          return null;
      }
    };
    
    const renderStars = (rating: number) => {
      return Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${
            i < rating
              ? "text-yellow-400 fill-current"
              : "text-gray-300"
          }`}
        />
      ));
    };

    const getCardClasses = () => {
      const baseClasses = `relative bg-white border border-gray-200/50 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-2 group backdrop-blur-sm ${getAnimationClass()}`;
      
      switch (variant) {
        case 'small':
          return `${baseClasses} p-4`;
        case 'large':
          return `${baseClasses} p-8`;
        default:
          return `${baseClasses} p-6`;
      }
    };

    const getTextClasses = () => {
      switch (variant) {
        case 'small':
          return 'text-sm';
        case 'large':
          return 'text-lg';
        default:
          return 'text-base';
      }
    };

    return (
      <div
        className={getCardClasses()}
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="relative z-10">
        {widget.settings.show_ratings && (
          <div className="flex items-center gap-1 mb-4 group-hover:scale-105 transition-transform duration-200">
            {renderStars(rating)}
          </div>
        )}

        <blockquote className={`text-gray-800 leading-relaxed mb-6 font-medium flex-1 ${getTextClasses()} group-hover:text-gray-900 transition-colors duration-200`}>
          "{content}"
        </blockquote>

        <div className="flex items-center gap-4 group-hover:transform group-hover:scale-105 transition-all duration-200">
          {widget.settings.show_avatars && (
            <div className="relative">
              <div className={`${variant === 'large' ? 'w-16 h-16' : 'w-12 h-12'} bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white group-hover:ring-4 group-hover:ring-blue-100 transition-all duration-200`}>
                <span className={`text-white font-semibold ${variant === 'large' ? 'text-lg' : 'text-base'}`}>
                  {client_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              {source && (
                <div className="absolute -bottom-1 -right-1 bg-white border border-gray-200 rounded-full p-1 shadow-md group-hover:shadow-lg transition-shadow duration-200">
                  {getPlatformIcon(source)}
                </div>
              )}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className={`text-gray-900 font-semibold ${variant === 'large' ? 'text-base' : 'text-sm'}`}>
              {client_name}
            </div>
            {widget.settings.show_company && client_email && (
              <div className={`text-gray-500 leading-tight ${variant === 'large' ? 'text-sm' : 'text-xs'}`}>
                {/* Domain text removed */}
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    );
  };

  // Render based on widget type
  switch (widget.widget_type) {
    case 'wall':
      return (
        <WallWidget 
          widget={widget}
          testimonials={displayTestimonials}
          className={className}
          TestimonialCard={TestimonialCard}
        />
      );

    case 'masonry':
      return (
        <MasonryWidget 
          widget={widget}
          testimonials={displayTestimonials}
          className={className}
          TestimonialCard={TestimonialCard}
        />
      );

    case 'carousel':
      return (
        <CarouselWidget 
          widget={widget}
          testimonials={displayTestimonials}
          className={className}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      );

    case 'single':
      return (
        <SingleWidget 
          widget={widget}
          testimonials={displayTestimonials}
          className={className}
          TestimonialCard={TestimonialCard}
        />
      );

    case 'list':
      return (
        <ListWidget 
          widget={widget}
          testimonials={displayTestimonials}
          className={className}
        />
      );

    case 'floating':
      return (
        <FloatingWidget 
          testimonials={displayTestimonials}
          widget={widget}
          className={className}
        />
      );

    case 'featured':
      return (
        <FeaturedWidget 
          widget={widget}
          testimonials={displayTestimonials}
          className={className}
          featuredIndex={featuredIndex}
          setFeaturedIndex={setFeaturedIndex}
        />
      );


    case 'awards':
      return (
        <AwardsWidget 
          widget={widget}
          testimonials={displayTestimonials}
          className={className}
        />
      );

    case 'infinite-scroll':
      return (
        <InfiniteScrollWidget 
          widget={widget}
          testimonials={displayTestimonials}
          className={className}
          TestimonialCard={TestimonialCard}
        />
      );
    
    default:
      return (
        <div className={`${className}`}>
          <TestimonialCard testimonial={displayTestimonials[0]} />
        </div>
      );
  }
};

export default WidgetPreview;