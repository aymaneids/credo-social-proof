import React, { useState, useEffect } from 'react';
import { Star, X, Quote, Heart } from 'lucide-react';
import { Widget, Testimonial } from '../../types';

interface FloatingBubblesWidgetProps {
  testimonials: Testimonial[];
  widget: Widget;
  className?: string;
}

interface BubblePosition {
  top: string;
  left: string;
  size: string;
  gradient: string;
  delay: string;
  duration: string;
  scale: string;
}

const FloatingBubblesWidget: React.FC<FloatingBubblesWidgetProps> = ({
  testimonials,
  widget,
  className = ''
}) => {
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [hoveredTestimonial, setHoveredTestimonial] = useState<Testimonial | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  // Enhanced positions with better distribution
  const bubblePositions: BubblePosition[] = [
    { top: '15%', left: '12%', size: 'w-16 h-16', gradient: 'from-blue-500 via-blue-600 to-cyan-500', delay: '0s', duration: '12s', scale: 'hover:scale-125' },
    { top: '28%', left: '78%', size: 'w-20 h-20', gradient: 'from-purple-500 via-purple-600 to-pink-500', delay: '1.8s', duration: '14s', scale: 'hover:scale-115' },
    { top: '48%', left: '8%', size: 'w-14 h-14', gradient: 'from-emerald-500 via-green-500 to-teal-500', delay: '3.2s', duration: '10s', scale: 'hover:scale-130' },
    { top: '68%', left: '72%', size: 'w-18 h-18', gradient: 'from-orange-500 via-red-500 to-pink-500', delay: '1.2s', duration: '13s', scale: 'hover:scale-120' },
    { top: '8%', left: '48%', size: 'w-12 h-12', gradient: 'from-indigo-500 via-purple-500 to-blue-500', delay: '2.4s', duration: '15s', scale: 'hover:scale-135' },
    { top: '78%', left: '28%', size: 'w-15 h-15', gradient: 'from-pink-500 via-rose-500 to-red-500', delay: '4.1s', duration: '11s', scale: 'hover:scale-125' },
    { top: '38%', left: '88%', size: 'w-13 h-13', gradient: 'from-yellow-500 via-amber-500 to-orange-500', delay: '2.8s', duration: '12.5s', scale: 'hover:scale-140' },
    { top: '58%', left: '42%', size: 'w-17 h-17', gradient: 'from-violet-500 via-purple-500 to-indigo-500', delay: '3.6s', duration: '13.8s', scale: 'hover:scale-110' },
    { top: '22%', left: '25%', size: 'w-14 h-14', gradient: 'from-cyan-500 via-blue-500 to-indigo-500', delay: '0.8s', duration: '14.2s', scale: 'hover:scale-125' },
    { top: '85%', left: '65%', size: 'w-12 h-12', gradient: 'from-green-500 via-emerald-500 to-teal-500', delay: '3.0s', duration: '11.8s', scale: 'hover:scale-130' }
  ];

  const openModal = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
  };

  const closeModal = () => {
    setSelectedTestimonial(null);
  };

  const handleMouseEnter = (testimonial: Testimonial, event: React.MouseEvent) => {
    setHoveredTestimonial(testimonial);
    const rect = containerRef?.getBoundingClientRect();
    if (rect) {
      setMousePosition({ 
        x: event.clientX - rect.left, 
        y: event.clientY - rect.top 
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredTestimonial(null);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (hoveredTestimonial && containerRef) {
      const rect = containerRef.getBoundingClientRect();
      setMousePosition({ 
        x: event.clientX - rect.left, 
        y: event.clientY - rect.top 
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <>
      <div 
        ref={setContainerRef}
        className={`relative overflow-hidden h-[500px] rounded-2xl shadow-lg ${className}`}
        onMouseMove={handleMouseMove}
        style={{
          // Adaptive background that works on any website
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(1px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            inset 0 -1px 0 rgba(0, 0, 0, 0.05)
          `
        }}
      >
        {/* Minimal, adaptive background overlay */}
        <div className="absolute inset-0">
          {/* Subtle gradient that adapts to any background */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.03) 0%, transparent 50%),
                radial-gradient(circle at 70% 80%, rgba(147, 51, 234, 0.03) 0%, transparent 50%),
                linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)
              `
            }}
          ></div>
          
          {/* Minimal floating elements for subtle depth */}
          <div 
            className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full blur-3xl animate-float opacity-20"
            style={{ 
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
              animationDuration: '20s' 
            }}
          ></div>
          <div 
            className="absolute bottom-1/3 left-1/3 w-40 h-40 rounded-full blur-3xl animate-float opacity-15"
            style={{ 
              background: 'radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, transparent 70%)',
              animationDelay: '5s', 
              animationDuration: '25s' 
            }}
          ></div>
        </div>

        {/* Enhanced Floating Avatars */}
        {testimonials.slice(0, Math.min(10, testimonials.length)).map((testimonial, index) => {
          const position = bubblePositions[index] || bubblePositions[0];
          const initials = testimonial.client_name.split(' ').map(n => n[0]).join('').toUpperCase();
          
          return (
            <div
              key={testimonial.id}
              className={`absolute cursor-pointer group transition-all duration-700 ease-out ${position.scale} animate-float z-20`}
              style={{ 
                top: position.top, 
                left: position.left,
                animationDelay: position.delay,
                animationDuration: position.duration
              }}
              onClick={() => openModal(testimonial)}
              onMouseEnter={(e) => handleMouseEnter(testimonial, e)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Enhanced Avatar with Professional Design */}
              <div 
                className={`${position.size} rounded-full flex items-center justify-center shadow-2xl transition-all duration-700 ease-out group-hover:shadow-3xl relative overflow-hidden border-2 group-hover:border-4 group-hover:border-white/60`}
                style={{
                  background: `linear-gradient(135deg, ${position.gradient.split(' ').map(color => {
                    if (color.includes('blue')) return '#3b82f6';
                    if (color.includes('purple')) return '#8b5cf6';
                    if (color.includes('pink')) return '#ec4899';
                    if (color.includes('emerald') || color.includes('green')) return '#10b981';
                    if (color.includes('orange') || color.includes('red')) return '#f97316';
                    if (color.includes('indigo')) return '#6366f1';
                    if (color.includes('yellow') || color.includes('amber')) return '#f59e0b';
                    if (color.includes('cyan')) return '#06b6d4';
                    if (color.includes('violet')) return '#8b5cf6';
                    if (color.includes('teal')) return '#14b8a6';
                    return '#3b82f6';
                  }).join(', ')})`,
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  boxShadow: `
                    0 8px 32px rgba(0, 0, 0, 0.15),
                    0 0 0 1px rgba(255, 255, 255, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2)
                  `
                }}
              >
                {/* Professional shimmer effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                  style={{
                    background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%)',
                    transform: 'translateX(-100%)',
                    animation: 'shimmer 2s ease-out infinite'
                  }}
                ></div>
                
                {/* Initials with enhanced typography */}
                <span className="relative z-10 text-white font-bold text-lg group-hover:scale-110 transition-transform duration-500 drop-shadow-lg tracking-wide">
                  {initials}
                </span>
                
                {/* Enhanced rating badge */}
                {widget.settings.show_ratings && (
                  <div 
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-xl border-2 border-white group-hover:scale-125 group-hover:rotate-12 transition-all duration-500"
                    style={{
                      background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)',
                      boxShadow: '0 4px 12px rgba(251, 191, 36, 0.4)'
                    }}
                  >
                    <Star className="w-3.5 h-3.5 text-white fill-current drop-shadow-sm" />
                  </div>
                )}
                
                {/* Subtle sparkle effects */}
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-500"></div>
                <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-500" style={{ animationDelay: '0.3s' }}></div>
              </div>
              
              {/* Enhanced outer glow */}
              <div 
                className={`absolute inset-0 ${position.size} rounded-full opacity-0 group-hover:opacity-30 blur-xl transition-all duration-1000 -z-10 group-hover:scale-150`}
                style={{
                  background: `linear-gradient(135deg, ${position.gradient.split(' ').map(color => {
                    if (color.includes('blue')) return '#3b82f6';
                    if (color.includes('purple')) return '#8b5cf6';
                    if (color.includes('pink')) return '#ec4899';
                    if (color.includes('emerald') || color.includes('green')) return '#10b981';
                    if (color.includes('orange') || color.includes('red')) return '#f97316';
                    if (color.includes('indigo')) return '#6366f1';
                    if (color.includes('yellow') || color.includes('amber')) return '#f59e0b';
                    if (color.includes('cyan')) return '#06b6d4';
                    if (color.includes('violet')) return '#8b5cf6';
                    if (color.includes('teal')) return '#14b8a6';
                    return '#3b82f6';
                  }).join(', ')})`
                }}
              ></div>
            </div>
          );
        })}

        {/* Add shimmer keyframes */}
        <style jsx>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%) rotate(45deg); }
            100% { transform: translateX(200%) rotate(45deg); }
          }
        `}</style>
      </div>

      {/* Enhanced Professional Tooltip */}
      {hoveredTestimonial && containerRef && (
        <div 
          className="absolute z-50 pointer-events-none animate-fade-in"
          style={{
            left: Math.min(mousePosition.x + 15, containerRef.offsetWidth - 320),
            top: Math.max(mousePosition.y - 10, 10),
            transform: mousePosition.y > containerRef.offsetHeight / 2 ? 'translateY(-100%)' : 'translateY(0)'
          }}
        >
          <div 
            className="rounded-2xl p-5 shadow-2xl max-w-sm border backdrop-blur-md"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              boxShadow: `
                0 20px 40px rgba(0, 0, 0, 0.15),
                0 0 0 1px rgba(255, 255, 255, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `
            }}
          >
            {/* Tooltip Header */}
            <div className="flex items-center space-x-3 mb-4">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white/50"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)'
                }}
              >
                <span className="text-white font-semibold text-sm">
                  {hoveredTestimonial.client_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{hoveredTestimonial.client_name}</div>
                {widget.settings.show_company && hoveredTestimonial.client_email && (
                  <div className="text-gray-500 text-xs">{hoveredTestimonial.client_email.split('@')[1]}</div>
                )}
              </div>
            </div>
            
            {/* Rating */}
            {widget.settings.show_ratings && (
              <div className="flex items-center mb-4">
                {renderStars(hoveredTestimonial.rating)}
                <span className="ml-2 text-xs text-gray-600 font-medium">
                  {hoveredTestimonial.rating}/5
                </span>
              </div>
            )}
            
            {/* Testimonial Preview */}
            <blockquote className="text-gray-700 text-sm leading-relaxed mb-4 relative">
              <div className="absolute -top-1 -left-1 text-blue-200 text-2xl font-serif">"</div>
              <div className="pl-4">
                {hoveredTestimonial.content.length > 120 
                  ? hoveredTestimonial.content.substring(0, 120) + '...' 
                  : hoveredTestimonial.content}
              </div>
            </blockquote>
            
            {/* Enhanced click hint */}
            <div className="pt-3 border-t border-gray-200/50">
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Click to read full testimonial</span>
              </div>
            </div>
            
            {/* Tooltip Arrow */}
            <div 
              className="absolute w-0 h-0"
              style={{
                bottom: mousePosition.y > (containerRef?.offsetHeight || 0) / 2 ? 'auto' : '-8px',
                top: mousePosition.y > (containerRef?.offsetHeight || 0) / 2 ? '-8px' : 'auto',
                left: '24px',
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: mousePosition.y > (containerRef?.offsetHeight || 0) / 2 ? '8px solid rgba(255, 255, 255, 0.95)' : 'none',
                borderBottom: mousePosition.y <= (containerRef?.offsetHeight || 0) / 2 ? '8px solid rgba(255, 255, 255, 0.95)' : 'none'
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Enhanced Professional Modal */}
      {selectedTestimonial && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div 
            className="rounded-3xl max-w-2xl w-full shadow-3xl overflow-hidden animate-scale-in"
            style={{
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: `
                0 25px 50px rgba(0, 0, 0, 0.25),
                0 0 0 1px rgba(255, 255, 255, 0.05),
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `
            }}
          >
            {/* Sophisticated Modal Header */}
            <div 
              className="relative p-8 text-white overflow-hidden"
              style={{
                background: `
                  linear-gradient(135deg, 
                    rgba(30, 41, 59, 0.95) 0%, 
                    rgba(51, 65, 85, 0.95) 50%, 
                    rgba(30, 41, 59, 0.95) 100%
                  )
                `,
                backdropFilter: 'blur(20px)'
              }}
            >
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                {[...Array(15)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${2 + Math.random() * 2}s`
                    }}
                  ></div>
                ))}
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div 
                        className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl border-3"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
                          backdropFilter: 'blur(10px)',
                          borderColor: 'rgba(255, 255, 255, 0.3)'
                        }}
                      >
                        <span className="text-white font-bold text-2xl tracking-wide drop-shadow-lg">
                          {selectedTestimonial.client_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      {/* Floating ring animation */}
                      <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></div>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold mb-2 tracking-wide">{selectedTestimonial.client_name}</h3>
                      {widget.settings.show_company && selectedTestimonial.client_email && (
                        <p className="text-white/80 text-lg font-medium">{selectedTestimonial.client_email.split('@')[1]}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-3 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-90"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <X className="w-7 h-7 text-white" />
                  </button>
                </div>
                
                {/* Enhanced rating display */}
                {widget.settings.show_ratings && (
                  <div className="flex items-center justify-center space-x-2">
                    {renderStars(selectedTestimonial.rating).map((star, i) => (
                      <div key={i} className="transform hover:scale-125 transition-transform duration-300">
                        {React.cloneElement(star, { 
                          className: 'w-7 h-7 text-yellow-300 fill-current drop-shadow-lg',
                          style: { filter: 'drop-shadow(0 0 8px rgba(255, 193, 7, 0.5))' }
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Sophisticated decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-20 translate-x-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-16 -translate-x-16"></div>
            </div>

            {/* Enhanced Modal Body */}
            <div 
              className="p-8"
              style={{
                background: `
                  linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.98) 0%, 
                    rgba(248, 250, 252, 0.95) 50%, 
                    rgba(241, 245, 249, 0.98) 100%
                  )
                `,
                backdropFilter: 'blur(20px)'
              }}
            >
              {/* Professional quote section */}
              <div className="relative mb-8">
                <div className="flex justify-center mb-6">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg border"
                    style={{
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1))',
                      borderColor: 'rgba(255, 255, 255, 0.3)'
                    }}
                  >
                    <Quote className="w-8 h-8 text-slate-600" />
                  </div>
                </div>
                
                {/* Enhanced testimonial content */}
                <blockquote className="text-center text-xl md:text-2xl leading-relaxed text-slate-800 font-medium relative px-8">
                  <span className="text-8xl text-blue-200/30 absolute -top-6 -left-2 font-serif select-none">"</span>
                  <span className="relative z-10 italic tracking-wide">{selectedTestimonial.content}</span>
                  <span className="text-8xl text-blue-200/30 absolute -bottom-12 -right-2 font-serif select-none">"</span>
                </blockquote>
              </div>
              
              {/* Professional action button */}
              <div className="flex items-center justify-center">
                <button 
                  onClick={closeModal}
                  className="px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-xl flex items-center space-x-3"
                  style={{
                    background: 'linear-gradient(135deg, #475569, #64748b, #475569)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 25px rgba(71, 85, 105, 0.3)'
                  }}
                >
                  <span className="text-lg">Close</span>
                </button>
              </div>
            </div>
            
            {/* Minimalist Footer */}
            <div 
              className="px-8 py-4 border-t"
              style={{
                background: 'rgba(248, 250, 252, 0.8)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(226, 232, 240, 0.5)'
              }}
            >
              <div className="flex items-center justify-center space-x-2 text-xs text-slate-500">
                <Heart className="w-3 h-3 text-red-400" />
                <span>Powered by Credo</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingBubblesWidget;