import React, { useState } from 'react';
import { Star, Sparkles, ArrowRight } from 'lucide-react';
import { Widget, Testimonial } from '../../../types';

interface FeaturedWidgetProps {
  widget: Widget;
  testimonials: Testimonial[];
  className?: string;
  featuredIndex: number;
  setFeaturedIndex: (index: number) => void;
}

const FeaturedWidget: React.FC<FeaturedWidgetProps> = ({
  widget,
  testimonials,
  className = '',
  featuredIndex,
  setFeaturedIndex
}) => {
  const displayTestimonials = testimonials.slice(0, widget.settings.max_testimonials);

  return (
    <div className={`relative ${className}`}>
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20 animate-fade-in">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-white px-6 py-2 rounded-full shadow-lg border-2 border-white">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-bold tracking-wide">FEATURED REVIEW</span>
        </div>
      </div>
      
      <div className="relative mb-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
        <div className="relative bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-2xl p-8 shadow-2xl border border-white/50 backdrop-blur-sm overflow-hidden group hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-amber-400/10 to-yellow-400/10 rounded-full translate-y-12 -translate-x-12 group-hover:scale-150 transition-transform duration-700"></div>
          
          <div className="relative z-10">
            {widget.settings.show_ratings && (
              <div className="flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {[...Array(displayTestimonials[featuredIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-8 h-8 text-yellow-400 fill-current mx-1 drop-shadow-sm" />
                ))}
              </div>
            )}
            
            <blockquote className="text-center text-xl md:text-2xl leading-relaxed mb-8 font-medium text-gray-800 italic relative">
              <span className="text-6xl text-blue-200 absolute -top-4 -left-4 font-serif">"</span>
              <span className="relative z-10">{displayTestimonials[featuredIndex].content}</span>
              <span className="text-6xl text-blue-200 absolute -bottom-8 -right-4 font-serif">"</span>
            </blockquote>
            
            <div className="flex items-center justify-center space-x-4 group-hover:scale-105 transition-transform duration-300">
              {widget.settings.show_avatars && (
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl ring-4 ring-white">
                    <span className="text-white font-bold text-lg">
                      {displayTestimonials[featuredIndex].client_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                    <Star className="w-3 h-3 text-white fill-current" />
                  </div>
                </div>
              )}
              <div className="text-center">
                <div className="font-bold text-xl text-gray-900 mb-1">
                  {displayTestimonials[featuredIndex].client_name}
                </div>
                {widget.settings.show_company && displayTestimonials[featuredIndex].client_email && (
                  <div className="text-gray-600 font-medium">
                    {displayTestimonials[featuredIndex].client_email.split('@')[1]}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {displayTestimonials.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
          {displayTestimonials.slice(1, 3).map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className="group cursor-pointer transition-all duration-300 hover:-translate-y-1"
              onClick={() => setFeaturedIndex(index + 1)}
            >
              <div className="relative bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50 hover:shadow-xl hover:bg-white/90 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  {widget.settings.show_ratings && (
                    <div className="flex items-center mb-3 group-hover:scale-105 transition-transform duration-200">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  )}
                  
                  <blockquote className="text-gray-700 leading-relaxed mb-4 font-medium line-clamp-3">
                    "{testimonial.content}"
                  </blockquote>
                  
                  <div className="flex items-center space-x-3">
                    {widget.settings.show_avatars && (
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white font-semibold text-sm">
                          {testimonial.client_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {testimonial.client_name}
                      </div>
                      {widget.settings.show_company && testimonial.client_email && (
                        <div className="text-gray-500 text-xs">
                          {testimonial.client_email.split('@')[1]}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Click to feature
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {displayTestimonials.length > 3 && (
        <div className="text-center mt-8 animate-fade-in" style={{ animationDelay: '600ms' }}>
          <div className="inline-flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-white/50 hover:bg-white/90 transition-all duration-300 cursor-pointer">
            <span className="text-gray-700 font-medium">
              +{displayTestimonials.length - 3} more amazing reviews
            </span>
            <ArrowRight className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedWidget;