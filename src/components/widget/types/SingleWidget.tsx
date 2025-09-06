import React from 'react';
import { Widget, Testimonial } from '../../../types';

interface SingleWidgetProps {
  widget: Widget;
  testimonials: Testimonial[];
  className?: string;
  TestimonialCard: React.ComponentType<{
    testimonial: Testimonial;
    index?: number;
    variant?: 'default' | 'small' | 'large';
  }>;
}

const SingleWidget: React.FC<SingleWidgetProps> = ({
  widget,
  testimonials,
  className = '',
  TestimonialCard
}) => {
  const displayTestimonials = testimonials.slice(0, widget.settings.max_testimonials);

  if (displayTestimonials.length === 0) {
    return (
      <div className={`rounded-xl p-6 border-2 border-dashed ${className}`}>
        <div className="text-center text-gray-500">
          <p className="text-sm">No testimonials to display.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <TestimonialCard testimonial={displayTestimonials[0]} />
    </div>
  );
};

export default SingleWidget;