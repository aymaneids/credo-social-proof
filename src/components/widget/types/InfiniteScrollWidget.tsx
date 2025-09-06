import React from 'react';
import { Widget, Testimonial } from '../../../types';

interface InfiniteScrollWidgetProps {
  widget: Widget;
  testimonials: Testimonial[];
  className?: string;
  TestimonialCard: React.ComponentType<{
    testimonial: Testimonial;
    index?: number;
    variant?: 'default' | 'small' | 'large';
  }>;
}

const InfiniteScrollWidget: React.FC<InfiniteScrollWidgetProps> = ({
  widget,
  testimonials,
  className = '',
  TestimonialCard
}) => {
  const displayTestimonials = testimonials.slice(0, widget.settings.max_testimonials);
  
  const extendedTestimonials = Array.from({ length: 12 }, (_, i) => ({
    ...displayTestimonials[i % displayTestimonials.length],
    id: `${displayTestimonials[i % displayTestimonials.length]?.id || 'default'}-${i}`
  }));

  return (
    <div className={`relative overflow-hidden h-[48rem] ${className}`}>
      <div className={`absolute top-0 left-0 right-0 h-12 bg-gradient-to-b ${
        widget.settings.theme === 'dark' ? 'from-gray-900' : 'from-slate-50'
      } to-transparent z-10 pointer-events-none`} />
      <div className={`absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t ${
        widget.settings.theme === 'dark' ? 'from-gray-900' : 'from-indigo-100'
      } to-transparent z-10 pointer-events-none`} />
      
      <div className="absolute inset-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="relative overflow-hidden">
          <div className="flex flex-col gap-8 animate-scroll-up">
            {[...extendedTestimonials, ...extendedTestimonials].map((testimonial, index) => (
              <div key={`col1-${index}`} className="flex-shrink-0">
                <TestimonialCard testimonial={testimonial} index={index} />
              </div>
            ))}
          </div>
        </div>
        <div className="relative overflow-hidden hidden sm:block">
          <div className="flex flex-col gap-8 animate-scroll-down">
            {[...extendedTestimonials, ...extendedTestimonials].slice().reverse().map((testimonial, index) => (
              <div key={`col2-${index}`} className="flex-shrink-0">
                <TestimonialCard testimonial={testimonial} index={index} />
              </div>
            ))}
          </div>
        </div>
        <div className="relative overflow-hidden hidden lg:block">
          <div className="flex flex-col gap-8 animate-scroll-up-delayed">
            {[...extendedTestimonials, ...extendedTestimonials].map((testimonial, index) => (
              <div key={`col3-${index}`} className="flex-shrink-0">
                <TestimonialCard testimonial={testimonial} index={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfiniteScrollWidget;