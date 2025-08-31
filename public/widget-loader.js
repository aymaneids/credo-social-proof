// Widget Loader Script
(function() {
  'use strict';
  
  // Get the current script tag to extract widget ID
  const currentScript = document.currentScript || (function() {
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();
  
  const scriptSrc = currentScript.src;
  const widgetId = scriptSrc.match(/\/widget\/([^\/]+)\.js/)?.[1];
  
  if (!widgetId) {
    console.error('Credo Widget: Could not extract widget ID from script source');
    return;
  }
  
  // Create container for the widget
  const container = document.createElement('div');
  container.id = `credo-widget-${widgetId}`;
  container.style.cssText = 'width: 100%; margin: 0; padding: 0;';
  
  // Insert container after the script tag
  currentScript.parentNode.insertBefore(container, currentScript.nextSibling);
  
  // Load widget data and render
  async function loadWidget() {
    try {
      const response = await fetch(`${window.location.protocol}//${window.location.host}/api/widget/${widgetId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const widgetData = await response.json();
      renderWidget(widgetData, container);
      
      // Track widget view
      trackWidgetView(widgetId);
      
    } catch (error) {
      console.error('Credo Widget: Failed to load widget data:', error);
      container.innerHTML = `
        <div style="
          padding: 20px; 
          text-align: center; 
          color: #666; 
          border: 2px dashed #ddd; 
          border-radius: 8px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
          <p>Widget temporarily unavailable</p>
          <small>Widget ID: ${widgetId}</small>
        </div>
      `;
    }
  }
  
  function renderWidget(data, container) {
    const { widget, testimonials } = data;
    
    if (!testimonials || testimonials.length === 0) {
      container.innerHTML = `
        <div style="
          padding: 20px; 
          text-align: center; 
          color: #666;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
          <p>No testimonials to display</p>
        </div>
      `;
      return;
    }
    
    // Inject CSS styles
    injectStyles();
    
    // Render based on widget type
    switch (widget.widget_type) {
      case 'wall':
        renderWallWidget(widget, testimonials, container);
        break;
      case 'carousel':
        renderCarouselWidget(widget, testimonials, container);
        break;
      case 'single':
        renderSingleWidget(widget, testimonials, container);
        break;
      case 'list':
        renderListWidget(widget, testimonials, container);
        break;
      default:
        renderWallWidget(widget, testimonials, container);
    }
  }
  
  function injectStyles() {
    if (document.getElementById('credo-widget-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'credo-widget-styles';
    styles.textContent = `
      .credo-widget {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.5;
      }
      
      .credo-testimonial-card {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 24px;
        margin-bottom: 16px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
      }
      
      .credo-testimonial-card:hover {
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }
      
      .credo-testimonial-card.dark {
        background: #1f2937;
        border-color: #374151;
        color: white;
      }
      
      .credo-stars {
        display: flex;
        gap: 2px;
        margin-bottom: 16px;
      }
      
      .credo-star {
        width: 16px;
        height: 16px;
        fill: #fbbf24;
        color: #fbbf24;
      }
      
      .credo-star.empty {
        fill: #d1d5db;
        color: #d1d5db;
      }
      
      .credo-content {
        font-size: 16px;
        line-height: 1.6;
        color: #374151;
        margin-bottom: 20px;
        font-style: italic;
      }
      
      .credo-testimonial-card.dark .credo-content {
        color: #d1d5db;
      }
      
      .credo-author {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .credo-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
        font-size: 14px;
      }
      
      .credo-author-info {
        flex: 1;
      }
      
      .credo-author-name {
        font-weight: 600;
        color: #111827;
        margin-bottom: 2px;
      }
      
      .credo-testimonial-card.dark .credo-author-name {
        color: white;
      }
      
      .credo-author-company {
        font-size: 14px;
        color: #6b7280;
      }
      
      .credo-testimonial-card.dark .credo-author-company {
        color: #9ca3af;
      }
      
      .credo-grid {
        display: grid;
        gap: 20px;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      }
      
      .credo-carousel {
        position: relative;
        overflow: hidden;
        border-radius: 12px;
      }
      
      .credo-carousel-track {
        display: flex;
        transition: transform 0.5s ease;
      }
      
      .credo-carousel-slide {
        min-width: 100%;
        padding: 0 20px;
      }
      
      .credo-carousel-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.9);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: all 0.2s ease;
      }
      
      .credo-carousel-nav:hover {
        background: white;
        transform: translateY(-50%) scale(1.1);
      }
      
      .credo-carousel-prev {
        left: 10px;
      }
      
      .credo-carousel-next {
        right: 10px;
      }
      
      .credo-carousel-indicators {
        display: flex;
        justify-content: center;
        gap: 8px;
        margin-top: 16px;
      }
      
      .credo-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #d1d5db;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .credo-indicator.active {
        background: #3b82f6;
        transform: scale(1.2);
      }
      
      @media (max-width: 768px) {
        .credo-grid {
          grid-template-columns: 1fr;
        }
        
        .credo-testimonial-card {
          padding: 20px;
        }
      }
    `;
    
    document.head.appendChild(styles);
  }
  
  function renderStars(rating, showRatings) {
    if (!showRatings) return '';
    
    let starsHtml = '<div class="credo-stars">';
    for (let i = 1; i <= 5; i++) {
      starsHtml += `<svg class="credo-star ${i > rating ? 'empty' : ''}" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>`;
    }
    starsHtml += '</div>';
    return starsHtml;
  }
  
  function renderTestimonialCard(testimonial, widget) {
    const initials = testimonial.client_name.split(' ').map(n => n[0]).join('').toUpperCase();
    const company = testimonial.client_email ? testimonial.client_email.split('@')[1] : '';
    
    return `
      <div class="credo-testimonial-card ${widget.settings.theme === 'dark' ? 'dark' : ''}">
        ${renderStars(testimonial.rating, widget.settings.show_ratings)}
        <div class="credo-content">"${testimonial.content}"</div>
        <div class="credo-author">
          ${widget.settings.show_avatars ? `<div class="credo-avatar">${initials}</div>` : ''}
          <div class="credo-author-info">
            <div class="credo-author-name">${testimonial.client_name}</div>
            ${widget.settings.show_company && company ? `<div class="credo-author-company">${company}</div>` : ''}
          </div>
        </div>
      </div>
    `;
  }
  
  function renderWallWidget(widget, testimonials, container) {
    const testimonialsHtml = testimonials
      .slice(0, widget.settings.max_testimonials)
      .map(t => renderTestimonialCard(t, widget))
      .join('');
    
    container.innerHTML = `
      <div class="credo-widget">
        <div class="credo-grid">
          ${testimonialsHtml}
        </div>
      </div>
    `;
  }
  
  function renderCarouselWidget(widget, testimonials, container) {
    const displayTestimonials = testimonials.slice(0, widget.settings.max_testimonials);
    let currentIndex = 0;
    
    const testimonialsHtml = displayTestimonials
      .map(t => `<div class="credo-carousel-slide">${renderTestimonialCard(t, widget)}</div>`)
      .join('');
    
    const indicatorsHtml = displayTestimonials
      .map((_, index) => `<div class="credo-indicator ${index === 0 ? 'active' : ''}" data-index="${index}"></div>`)
      .join('');
    
    container.innerHTML = `
      <div class="credo-widget">
        <div class="credo-carousel">
          <div class="credo-carousel-track" id="track-${widgetId}">
            ${testimonialsHtml}
          </div>
          ${displayTestimonials.length > 1 ? `
            <button class="credo-carousel-nav credo-carousel-prev" id="prev-${widgetId}">‹</button>
            <button class="credo-carousel-nav credo-carousel-next" id="next-${widgetId}">›</button>
            <div class="credo-carousel-indicators" id="indicators-${widgetId}">
              ${indicatorsHtml}
            </div>
          ` : ''}
        </div>
      </div>
    `;
    
    // Add carousel functionality
    if (displayTestimonials.length > 1) {
      const track = document.getElementById(`track-${widgetId}`);
      const prevBtn = document.getElementById(`prev-${widgetId}`);
      const nextBtn = document.getElementById(`next-${widgetId}`);
      const indicators = document.getElementById(`indicators-${widgetId}`);
      
      function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update indicators
        indicators.querySelectorAll('.credo-indicator').forEach((indicator, index) => {
          indicator.classList.toggle('active', index === currentIndex);
        });
      }
      
      prevBtn.addEventListener('click', () => {
        currentIndex = currentIndex === 0 ? displayTestimonials.length - 1 : currentIndex - 1;
        updateCarousel();
        trackWidgetClick(widgetId);
      });
      
      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % displayTestimonials.length;
        updateCarousel();
        trackWidgetClick(widgetId);
      });
      
      // Indicator clicks
      indicators.addEventListener('click', (e) => {
        if (e.target.classList.contains('credo-indicator')) {
          currentIndex = parseInt(e.target.dataset.index);
          updateCarousel();
          trackWidgetClick(widgetId);
        }
      });
      
      // Auto-advance if enabled
      if (widget.settings.autoplay) {
        setInterval(() => {
          currentIndex = (currentIndex + 1) % displayTestimonials.length;
          updateCarousel();
        }, 4000);
      }
    }
  }
  
  function renderSingleWidget(widget, testimonials, container) {
    if (testimonials.length === 0) return;
    
    container.innerHTML = `
      <div class="credo-widget">
        ${renderTestimonialCard(testimonials[0], widget)}
      </div>
    `;
  }
  
  function renderListWidget(widget, testimonials, container) {
    const testimonialsHtml = testimonials
      .slice(0, widget.settings.max_testimonials)
      .map(t => renderTestimonialCard(t, widget))
      .join('');
    
    container.innerHTML = `
      <div class="credo-widget">
        <div style="display: flex; flex-direction: column; gap: 16px;">
          ${testimonialsHtml}
        </div>
      </div>
    `;
  }
  
  async function trackWidgetView(widgetId) {
    try {
      await fetch(`${window.location.protocol}//${window.location.host}/api/widget/${widgetId}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Failed to track widget view:', error);
    }
  }
  
  async function trackWidgetClick(widgetId) {
    try {
      await fetch(`${window.location.protocol}//${window.location.host}/api/widget/${widgetId}/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Failed to track widget click:', error);
    }
  }
  
  // Load the widget
  loadWidget();
})();