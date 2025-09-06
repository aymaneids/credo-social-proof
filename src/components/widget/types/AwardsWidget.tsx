import React from 'react';
import { Star, Award, Trophy } from 'lucide-react';
import { Widget, Testimonial } from '../../../types';

interface AwardsWidgetProps {
  widget: Widget;
  testimonials: Testimonial[];
  className?: string;
}

const AwardsWidget: React.FC<AwardsWidgetProps> = ({
  widget,
  testimonials,
  className = ''
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
    <div className={`rounded-xl p-8 border-2 border-yellow-200 ${className} relative`}>
      <div className="absolute top-4 left-4">
        <Award className="w-6 h-6 text-yellow-500" />
      </div>
      <div className="absolute top-4 right-4">
        <Award className="w-6 h-6 text-yellow-500" />
      </div>
      
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-amber-100 px-6 py-3 rounded-full mb-6 border border-yellow-300">
          <Trophy className="w-5 h-5 text-yellow-600" />
          <span className="text-sm font-bold text-yellow-800 uppercase tracking-wide">Top Review</span>
        </div>
        
        {widget.settings.show_ratings && (
          <div className="flex items-center justify-center mb-6">
            {[...Array(displayTestimonials[0].rating)].map((_, i) => (
              <Star key={i} className="w-8 h-8 text-yellow-400 fill-current" />
            ))}
          </div>
        )}
        
        <blockquote className={`text-2xl leading-relaxed mb-8 font-medium italic ${
          widget.settings.theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
        }`} style={{ fontFamily: 'Georgia, serif' }}>
          "{displayTestimonials[0].content}"
        </blockquote>
        
        <div className="flex items-center justify-center space-x-4">
          {widget.settings.show_avatars && (
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg border-4 border-yellow-200">
              <span className="text-white font-bold text-lg">
                {displayTestimonials[0].client_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
              </span>
            </div>
          )}
          <div className="text-center">
            <div className={`font-bold text-xl ${
              widget.settings.theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`} style={{ fontFamily: 'Georgia, serif' }}>
              {displayTestimonials[0].client_name}
            </div>
            {widget.settings.show_company && displayTestimonials[0].client_email && (
              <div className={`text-sm font-medium ${
                widget.settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {displayTestimonials[0].client_email.split('@')[1]}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 rounded-xl border-4 border-yellow-300 opacity-20 pointer-events-none"></div>
    </div>
  );
};

export default AwardsWidget;