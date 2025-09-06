// Widget Types Index
// This file exports all widget type components for easy importing

export { default as WallWidget } from './WallWidget';
export { default as CarouselWidget } from './CarouselWidget';
export { default as SingleWidget } from './SingleWidget';
export { default as MasonryWidget } from './MasonryWidget';
export { default as ListWidget } from './ListWidget';
export { default as FloatingWidget } from './FloatingWidget';
export { default as FeaturedWidget } from './FeaturedWidget';
export { default as AwardsWidget } from './AwardsWidget';
export { default as InfiniteScrollWidget } from './InfiniteScrollWidget';

// Export types for better TypeScript support
export interface WidgetTypeProps {
  widget: any;
  testimonials: any[];
  className?: string;
}