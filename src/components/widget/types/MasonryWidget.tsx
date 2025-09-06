import React from 'react';
import { Widget, Testimonial } from '../../../types';

interface MasonryWidgetProps {
  widget: Widget;
  testimonials: Testimonial[];
  className?: string;
  TestimonialCard: React.ComponentType<{
    testimonial: Testimonial;
    index?: number;
    variant?: 'default' | 'small' | 'large';
  }>;
}

const MasonryWidget: React.FC<MasonryWidgetProps> = ({
  widget,
  testimonials,
  className = '',
  TestimonialCard
}) => {
  const displayTestimonials = testimonials.slice(0, widget.settings.max_testimonials);

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayTestimonials.map((testimonial, index) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
        ))}
      </div>
    </div>
  );
};

export default MasonryWidget;