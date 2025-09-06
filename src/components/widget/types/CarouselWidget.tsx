import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Widget, Testimonial } from '../../../types';

interface CarouselWidgetProps {
  widget: Widget;
  testimonials: Testimonial[];
  className?: string;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

const CarouselWidget: React.FC<CarouselWidgetProps> = ({
  widget,
  testimonials,
  className = '',
  currentIndex,
  setCurrentIndex
}) => {
  const displayTestimonials = testimonials.slice(0, widget.settings.max_testimonials);

  return (
    <div className={`relative ${className} group`}>
      {/* Enhanced carousel container with professional styling */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 shadow-2xl border border-white/50 backdrop-blur-sm">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}></div>
        
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        
        <div 
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {displayTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full flex-shrink-0 px-8 py-12">
              {/* Enhanced testimonial card for carousel */}
              <div className="relative max-w-4xl mx-auto">
                <div className="relative bg-white/90 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-white/60 group-hover:shadow-3xl transition-all duration-500 overflow-hidden">
                  {/* Decorative background elements */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full -translate-y-20 translate-x-20 group-hover:scale-125 transition-transform duration-700"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-100/30 to-amber-100/30 rounded-full translate-y-16 -translate-x-16 group-hover:scale-125 transition-transform duration-700"></div>
                  
                  <div className="relative z-10">
                    {/* Rating section with enhanced design */}
                    {widget.settings.show_ratings && (
                      <div className="flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                        <div className="flex items-center space-x-1 bg-gradient-to-r from-amber-50 to-yellow-50 px-6 py-3 rounded-full border border-amber-200/50 shadow-lg">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-6 h-6 text-amber-400 fill-current drop-shadow-sm" />
                          ))}
                          <span className="ml-3 text-amber-700 font-semibold text-sm">
                            {testimonial.rating}.0 out of 5
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Enhanced quote section */}
                    <div className="relative mb-10">
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full shadow-lg border border-white/50 mb-6">
                          <Quote className="w-8 h-8 text-slate-600" />
                        </div>
                      </div>
                      
                      <blockquote className="text-center text-xl md:text-2xl lg:text-3xl leading-relaxed font-medium text-slate-800 relative px-4 md:px-8">
                        <span className="absolute -top-4 -left-2 text-8xl text-blue-200/40 font-serif select-none">"</span>
                        <span className="relative z-10 italic tracking-wide">{testimonial.content}</span>
                        <span className="absolute -bottom-8 -right-2 text-8xl text-blue-200/40 font-serif select-none">"</span>
                      </blockquote>
                    </div>
                    
                    {/* Enhanced author section */}
                    <div className="flex items-center justify-center space-x-6 group-hover:scale-105 transition-transform duration-300">
                      {widget.settings.show_avatars && (
                        <div className="relative">
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl ring-4 ring-white/60 backdrop-blur-sm">
                            <span className="text-white font-bold text-xl tracking-wide">
                              {testimonial.client_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                          {/* Floating ring animation */}
                          <div className="absolute inset-0 rounded-full border-2 border-blue-300/50 animate-ping"></div>
                          
                          {/* Excellence badge */}
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                            <Star className="w-4 h-4 text-white fill-current" />
                          </div>
                        </div>
                      )}
                      <div className="text-center">
                        <div className="font-bold text-2xl text-slate-900 mb-2 tracking-wide">
                          {testimonial.client_name}
                        </div>
                        {widget.settings.show_company && testimonial.client_email && (
                          <div className="text-slate-600 font-medium text-lg">
                            {testimonial.client_email.split('@')[1]}
                          </div>
                        )}
                        <div className="mt-2 text-sm text-slate-500 font-medium">
                          Verified Customer
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Enhanced navigation with professional styling */}
      {displayTestimonials.length > 1 && (
        <>
          {/* Previous button */}
          <button
            onClick={() => setCurrentIndex(currentIndex === 0 ? displayTestimonials.length - 1 : currentIndex - 1)}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/95 hover:bg-white shadow-2xl transition-all duration-300 hover:scale-125 opacity-0 group-hover:opacity-100 z-20 border border-white/50 backdrop-blur-md"
            style={{
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
          >
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </button>
          
          {/* Next button */}
          <button
            onClick={() => setCurrentIndex((currentIndex + 1) % displayTestimonials.length)}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/95 hover:bg-white shadow-2xl transition-all duration-300 hover:scale-125 opacity-0 group-hover:opacity-100 z-20 border border-white/50 backdrop-blur-md"
            style={{
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
          >
            <ChevronRight className="w-6 h-6 text-slate-700" />
          </button>
          
          {/* Enhanced carousel indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-xl border border-white/50">
            {displayTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`rounded-full transition-all duration-500 relative overflow-hidden ${
                  index === currentIndex 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 w-8 h-3 shadow-lg' 
                    : 'bg-slate-300 hover:bg-slate-400 w-3 h-3 hover:scale-125'
                }`}
              >
                {index === currentIndex && (
                  <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </>
      )}
      
      {/* Enhanced autoplay indicator */}
      {widget.settings.autoplay && displayTestimonials.length > 1 && (
        <div className="absolute top-6 right-6 z-20">
          <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg border border-white/30 backdrop-blur-sm">
            <div className="relative">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="absolute inset-0 w-2 h-2 bg-white rounded-full animate-ping"></div>
            </div>
            <span className="tracking-wide">AUTO PLAY</span>
          </div>
        </div>
      )}
      
      {/* Progress bar for autoplay */}
      {widget.settings.autoplay && displayTestimonials.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700 ease-linear"
            style={{ 
              width: `${((currentIndex + 1) / displayTestimonials.length) * 100}%`,
              boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default CarouselWidget;