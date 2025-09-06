(function() {
  'use strict';

  // Configuration
  const WIDGET_API_BASE = window.location.origin;
  const ANIMATION_DURATION = 300;
  const TOOLTIP_DELAY = 500;

  // Utility functions
  function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'style' && typeof value === 'object') {
        Object.assign(element.style, value);
      } else if (key === 'className') {
        element.className = value;
      } else {
        element.setAttribute(key, value);
      }
    });
    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
    return element;
  }

  function injectStyles() {
    if (document.getElementById('credo-widget-styles')) return;

    const styles = `
      .credo-widget-container {
        position: relative;
        width: 100%;
        min-height: 400px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.5;
        color: #374151;
        overflow: hidden;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.02);
        backdrop-filter: blur(1px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 
          0 8px 32px rgba(0, 0, 0, 0.12),
          inset 0 1px 0 rgba(255, 255, 255, 0.2),
          inset 0 -1px 0 rgba(0, 0, 0, 0.05);
      }

      .credo-widget-background {
        position: absolute;
        inset: 0;
        background: 
          radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 70% 80%, rgba(147, 51, 234, 0.03) 0%, transparent 50%),
          linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
      }

      .credo-floating-element {
        position: absolute;
        border-radius: 50%;
        filter: blur(24px);
        opacity: 0.2;
        animation: credoFloat 20s ease-in-out infinite;
      }

      .credo-floating-element:nth-child(2) {
        animation-delay: 5s;
        animation-duration: 25s;
        opacity: 0.15;
      }

      .credo-avatar {
        position: absolute;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        border: 2px solid rgba(255, 255, 255, 0.3);
        box-shadow: 
          0 8px 32px rgba(0, 0, 0, 0.15),
          0 0 0 1px rgba(255, 255, 255, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(4px);
        animation: credoFloat 12s ease-in-out infinite;
        z-index: 20;
      }

      .credo-avatar:hover {
        transform: scale(1.15);
        border-width: 4px;
        border-color: rgba(255, 255, 255, 0.6);
        box-shadow: 
          0 20px 40px rgba(0, 0, 0, 0.25),
          0 0 0 1px rgba(255, 255, 255, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.3);
      }

      .credo-avatar-initials {
        color: white;
        font-weight: bold;
        font-size: 1.125rem;
        letter-spacing: 0.05em;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        transition: transform 0.5s ease;
        position: relative;
        z-index: 10;
      }

      .credo-avatar:hover .credo-avatar-initials {
        transform: scale(1.1);
      }

      .credo-rating-badge {
        position: absolute;
        top: -8px;
        right: -8px;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #fbbf24, #f59e0b, #d97706);
        box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
        border: 2px solid white;
        transition: all 0.5s ease;
      }

      .credo-avatar:hover .credo-rating-badge {
        transform: scale(1.25) rotate(12deg);
      }

      .credo-sparkle {
        position: absolute;
        width: 8px;
        height: 8px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 50%;
        opacity: 0;
        transition: opacity 0.5s ease;
      }

      .credo-sparkle:nth-child(1) {
        top: -4px;
        left: -4px;
      }

      .credo-sparkle:nth-child(2) {
        bottom: -4px;
        right: -4px;
        width: 6px;
        height: 6px;
        animation-delay: 0.3s;
      }

      .credo-avatar:hover .credo-sparkle {
        opacity: 1;
        animation: credoPing 1s ease-out infinite;
      }

      .credo-tooltip {
        position: absolute;
        z-index: 50;
        pointer-events: none;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 320px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border-radius: 16px;
        padding: 20px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: 
          0 20px 40px rgba(0, 0, 0, 0.15),
          0 0 0 1px rgba(255, 255, 255, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.2);
      }

      .credo-tooltip.show {
        opacity: 1;
        transform: translateY(0);
      }

      .credo-tooltip-arrow {
        position: absolute;
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
      }

      .credo-tooltip-arrow.bottom {
        bottom: -8px;
        left: 24px;
        border-top: 8px solid rgba(255, 255, 255, 0.95);
      }

      .credo-tooltip-arrow.top {
        top: -8px;
        left: 24px;
        border-bottom: 8px solid rgba(255, 255, 255, 0.95);
      }

      .credo-modal {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 16px;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .credo-modal.show {
        opacity: 1;
      }

      .credo-modal-content {
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        border-radius: 24px;
        max-width: 32rem;
        width: 100%;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 
          0 25px 50px rgba(0, 0, 0, 0.25),
          0 0 0 1px rgba(255, 255, 255, 0.05),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
        transform: scale(0.9);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .credo-modal.show .credo-modal-content {
        transform: scale(1);
      }

      .credo-star {
        width: 16px;
        height: 16px;
        fill: currentColor;
      }

      .credo-star.filled {
        color: #fbbf24;
      }

      .credo-star.empty {
        color: #d1d5db;
      }

      @keyframes credoFloat {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        25% { transform: translateY(-20px) rotate(2deg); }
        50% { transform: translateY(-35px) rotate(0deg); }
        75% { transform: translateY(-15px) rotate(-2deg); }
      }

      @keyframes credoPing {
        0% { transform: scale(1); opacity: 1; }
        75%, 100% { transform: scale(2); opacity: 0; }
      }

      @keyframes credoShimmer {
        0% { transform: translateX(-100%) rotate(45deg); }
        100% { transform: translateX(200%) rotate(45deg); }
      }

      @keyframes credoFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      .credo-fade-in {
        animation: credoFadeIn 0.6s ease-out forwards;
      }

      /* Responsive design */
      @media (max-width: 768px) {
        .credo-widget-container {
          min-height: 300px;
        }
        
        .credo-tooltip {
          max-width: 280px;
          padding: 16px;
        }
        
        .credo-modal-content {
          margin: 16px;
          max-width: calc(100vw - 32px);
        }
      }
    `;

    const styleSheet = createElement('style', {
      id: 'credo-widget-styles',
      type: 'text/css'
    }, [styles]);

    document.head.appendChild(styleSheet);
  }

  function createFloatingBubblesWidget(container, widgetData) {
    const { widget, testimonials } = widgetData;
    
    // Clear container
    container.innerHTML = '';
    
    // Create widget container
    const widgetContainer = createElement('div', {
      className: 'credo-widget-container',
      style: {
        height: '500px'
      }
    });

    // Background elements
    const background = createElement('div', {
      className: 'credo-widget-background'
    });

    // Floating background elements
    const floatingElement1 = createElement('div', {
      className: 'credo-floating-element',
      style: {
        top: '25%',
        right: '25%',
        width: '128px',
        height: '128px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)'
      }
    });

    const floatingElement2 = createElement('div', {
      className: 'credo-floating-element',
      style: {
        bottom: '33%',
        left: '33%',
        width: '160px',
        height: '160px',
        background: 'radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, transparent 70%)'
      }
    });

    background.appendChild(floatingElement1);
    background.appendChild(floatingElement2);
    widgetContainer.appendChild(background);

    // Enhanced bubble positions
    const bubblePositions = [
      { top: '15%', left: '12%', size: { width: '64px', height: '64px' }, gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8, #06b6d4)', delay: '0s', duration: '12s' },
      { top: '28%', left: '78%', size: { width: '80px', height: '80px' }, gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed, #ec4899)', delay: '1.8s', duration: '14s' },
      { top: '48%', left: '8%', size: { width: '56px', height: '56px' }, gradient: 'linear-gradient(135deg, #10b981, #059669, #14b8a6)', delay: '3.2s', duration: '10s' },
      { top: '68%', left: '72%', size: { width: '72px', height: '72px' }, gradient: 'linear-gradient(135deg, #f97316, #ea580c, #ec4899)', delay: '1.2s', duration: '13s' },
      { top: '8%', left: '48%', size: { width: '48px', height: '48px' }, gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6, #3b82f6)', delay: '2.4s', duration: '15s' },
      { top: '78%', left: '28%', size: { width: '60px', height: '60px' }, gradient: 'linear-gradient(135deg, #ec4899, #f43f5e, #ef4444)', delay: '4.1s', duration: '11s' },
      { top: '38%', left: '88%', size: { width: '52px', height: '52px' }, gradient: 'linear-gradient(135deg, #eab308, #f59e0b, #f97316)', delay: '2.8s', duration: '12.5s' },
      { top: '58%', left: '42%', size: { width: '68px', height: '68px' }, gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed, #6366f1)', delay: '3.6s', duration: '13.8s' },
      { top: '22%', left: '25%', size: { width: '56px', height: '56px' }, gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6, #6366f1)', delay: '0.8s', duration: '14.2s' },
      { top: '85%', left: '65%', size: { width: '48px', height: '48px' }, gradient: 'linear-gradient(135deg, #10b981, #059669, #14b8a6)', delay: '3.0s', duration: '11.8s' }
    ];

    // Create floating avatars
    testimonials.slice(0, Math.min(10, testimonials.length)).forEach((testimonial, index) => {
      const position = bubblePositions[index] || bubblePositions[0];
      const initials = testimonial.client_name.split(' ').map(n => n[0]).join('').toUpperCase();

      const avatar = createElement('div', {
        className: 'credo-avatar',
        style: {
          top: position.top,
          left: position.left,
          width: position.size.width,
          height: position.size.height,
          background: position.gradient,
          animationDelay: position.delay,
          animationDuration: position.duration
        }
      });

      // Avatar initials
      const initialsSpan = createElement('span', {
        className: 'credo-avatar-initials'
      }, [initials]);

      // Rating badge
      if (widget.settings.show_ratings) {
        const ratingBadge = createElement('div', {
          className: 'credo-rating-badge'
        });

        const starSvg = createElement('svg', {
          className: 'credo-star filled',
          viewBox: '0 0 24 24',
          fill: 'currentColor'
        });
        starSvg.innerHTML = '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>';
        
        ratingBadge.appendChild(starSvg);
        avatar.appendChild(ratingBadge);
      }

      // Sparkle effects
      const sparkle1 = createElement('div', {
        className: 'credo-sparkle'
      });
      const sparkle2 = createElement('div', {
        className: 'credo-sparkle'
      });

      avatar.appendChild(sparkle1);
      avatar.appendChild(sparkle2);
      avatar.appendChild(initialsSpan);

      // Tooltip
      const tooltip = createElement('div', {
        className: 'credo-tooltip',
        style: {
          left: '120%',
          top: '50%',
          transform: 'translateY(-50%)'
        }
      });

      // Tooltip content
      const tooltipHeader = createElement('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '12px'
        }
      });

      const tooltipAvatar = createElement('div', {
        style: {
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          border: '2px solid rgba(255, 255, 255, 0.5)'
        }
      }, [
        createElement('span', {
          style: {
            color: 'white',
            fontWeight: '600',
            fontSize: '12px'
          }
        }, [initials])
      ]);

      const tooltipInfo = createElement('div');
      const tooltipName = createElement('div', {
        style: {
          fontWeight: '600',
          color: '#111827',
          fontSize: '14px'
        }
      }, [testimonial.client_name]);

      tooltipInfo.appendChild(tooltipName);

      if (widget.settings.show_company && testimonial.client_email) {
        const tooltipCompany = createElement('div', {
          style: {
            color: '#6b7280',
            fontSize: '12px'
          }
        }, [testimonial.client_email.split('@')[1]]);
        tooltipInfo.appendChild(tooltipCompany);
      }

      tooltipHeader.appendChild(tooltipAvatar);
      tooltipHeader.appendChild(tooltipInfo);
      tooltip.appendChild(tooltipHeader);

      // Rating in tooltip
      if (widget.settings.show_ratings) {
        const ratingContainer = createElement('div', {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginBottom: '12px'
          }
        });

        for (let i = 0; i < 5; i++) {
          const star = createElement('svg', {
            className: `credo-star ${i < testimonial.rating ? 'filled' : 'empty'}`,
            viewBox: '0 0 24 24',
            fill: 'currentColor'
          });
          star.innerHTML = '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>';
          ratingContainer.appendChild(star);
        }

        const ratingText = createElement('span', {
          style: {
            marginLeft: '8px',
            fontSize: '12px',
            color: '#6b7280',
            fontWeight: '500'
          }
        }, [`${testimonial.rating}/5`]);

        ratingContainer.appendChild(ratingText);
        tooltip.appendChild(ratingContainer);
      }

      // Testimonial preview
      const testimonialPreview = createElement('blockquote', {
        style: {
          color: '#374151',
          fontSize: '14px',
          lineHeight: '1.5',
          marginBottom: '12px',
          position: 'relative',
          paddingLeft: '16px'
        }
      });

      const quoteIcon = createElement('div', {
        style: {
          position: 'absolute',
          top: '-4px',
          left: '-4px',
          color: '#bfdbfe',
          fontSize: '32px',
          fontFamily: 'serif'
        }
      }, ['"']);

      const content = testimonial.content.length > 120 
        ? testimonial.content.substring(0, 120) + '...' 
        : testimonial.content;

      testimonialPreview.appendChild(quoteIcon);
      testimonialPreview.appendChild(document.createTextNode(content));
      tooltip.appendChild(testimonialPreview);

      // Click hint
      const clickHint = createElement('div', {
        style: {
          paddingTop: '12px',
          borderTop: '1px solid rgba(226, 232, 240, 0.5)'
        }
      });

      const hintContent = createElement('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '12px',
          color: '#6b7280'
        }
      });

      const pulseIndicator = createElement('div', {
        style: {
          width: '6px',
          height: '6px',
          background: '#3b82f6',
          borderRadius: '50%',
          animation: 'credoPing 2s ease-out infinite'
        }
      });

      const hintText = createElement('span', {
        style: { fontWeight: '500' }
      }, ['Click to read full testimonial']);

      hintContent.appendChild(pulseIndicator);
      hintContent.appendChild(hintText);
      clickHint.appendChild(hintContent);
      tooltip.appendChild(clickHint);

      // Tooltip arrow
      const tooltipArrow = createElement('div', {
        className: 'credo-tooltip-arrow bottom'
      });
      tooltip.appendChild(tooltipArrow);

      // Event handlers
      let tooltipTimeout;

      avatar.addEventListener('mouseenter', (e) => {
        clearTimeout(tooltipTimeout);
        tooltipTimeout = setTimeout(() => {
          tooltip.classList.add('show');
        }, TOOLTIP_DELAY);
      });

      avatar.addEventListener('mouseleave', () => {
        clearTimeout(tooltipTimeout);
        tooltip.classList.remove('show');
      });

      avatar.addEventListener('click', () => {
        showModal(testimonial, widget);
      });

      avatar.appendChild(tooltip);
      widgetContainer.appendChild(avatar);
    });

    container.appendChild(widgetContainer);
  }

  function showModal(testimonial, widget) {
    // Create modal
    const modal = createElement('div', {
      className: 'credo-modal'
    });

    const modalContent = createElement('div', {
      className: 'credo-modal-content'
    });

    // Modal header
    const modalHeader = createElement('div', {
      style: {
        background: `
          linear-gradient(135deg, 
            rgba(30, 41, 59, 0.95) 0%, 
            rgba(51, 65, 85, 0.95) 50%, 
            rgba(30, 41, 59, 0.95) 100%
          )`,
        backdropFilter: 'blur(20px)',
        padding: '32px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }
    });

    // Animated background pattern
    const bgPattern = createElement('div', {
      style: {
        position: 'absolute',
        inset: '0',
        opacity: '0.1'
      }
    });

    for (let i = 0; i < 15; i++) {
      const dot = createElement('div', {
        style: {
          position: 'absolute',
          width: '4px',
          height: '4px',
          background: 'white',
          borderRadius: '50%',
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `credoPing ${2 + Math.random() * 2}s ease-out infinite`,
          animationDelay: `${Math.random() * 3}s`
        }
      });
      bgPattern.appendChild(dot);
    }

    modalHeader.appendChild(bgPattern);

    // Header content
    const headerContent = createElement('div', {
      style: {
        position: 'relative',
        zIndex: '10'
      }
    });

    const headerTop = createElement('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }
    });

    const userInfo = createElement('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '24px'
      }
    });

    // Large avatar
    const largeAvatar = createElement('div', {
      style: {
        position: 'relative'
      }
    });

    const avatarCircle = createElement('div', {
      style: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
        backdropFilter: 'blur(10px)',
        border: '3px solid rgba(255, 255, 255, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }
    }, [
      createElement('span', {
        style: {
          color: 'white',
          fontWeight: 'bold',
          fontSize: '32px',
          letterSpacing: '0.05em',
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
        }
      }, [testimonial.client_name.split(' ').map(n => n[0]).join('').toUpperCase()])
    ]);

    const pingRing = createElement('div', {
      style: {
        position: 'absolute',
        inset: '0',
        borderRadius: '50%',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        animation: 'credoPing 2s ease-out infinite'
      }
    });

    largeAvatar.appendChild(avatarCircle);
    largeAvatar.appendChild(pingRing);

    const userDetails = createElement('div');
    const userName = createElement('h3', {
      style: {
        fontSize: '48px',
        fontWeight: 'bold',
        marginBottom: '8px',
        letterSpacing: '0.025em'
      }
    }, [testimonial.client_name]);

    userDetails.appendChild(userName);

    if (widget.settings.show_company && testimonial.client_email) {
      const userCompany = createElement('p', {
        style: {
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '18px',
          fontWeight: '500'
        }
      }, [testimonial.client_email.split('@')[1]]);
      userDetails.appendChild(userCompany);
    }

    userInfo.appendChild(largeAvatar);
    userInfo.appendChild(userDetails);

    // Close button
    const closeButton = createElement('button', {
      style: {
        padding: '12px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: 'white',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }
    });

    const closeIcon = createElement('svg', {
      style: {
        width: '28px',
        height: '28px'
      },
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2'
    });
    closeIcon.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>';

    closeButton.appendChild(closeIcon);
    closeButton.addEventListener('click', () => {
      modal.classList.remove('show');
      setTimeout(() => document.body.removeChild(modal), 300);
    });

    headerTop.appendChild(userInfo);
    headerTop.appendChild(closeButton);
    headerContent.appendChild(headerTop);

    // Rating display
    if (widget.settings.show_ratings) {
      const ratingDisplay = createElement('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }
      });

      for (let i = 0; i < 5; i++) {
        const star = createElement('svg', {
          className: `credo-star ${i < testimonial.rating ? 'filled' : 'empty'}`,
          style: {
            width: '28px',
            height: '28px',
            color: i < testimonial.rating ? '#fde047' : '#d1d5db',
            filter: 'drop-shadow(0 0 8px rgba(255, 193, 7, 0.5))',
            transition: 'transform 0.3s ease'
          },
          viewBox: '0 0 24 24',
          fill: 'currentColor'
        });
        star.innerHTML = '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>';
        
        star.addEventListener('mouseenter', () => {
          star.style.transform = 'scale(1.25)';
        });
        star.addEventListener('mouseleave', () => {
          star.style.transform = 'scale(1)';
        });

        ratingDisplay.appendChild(star);
      }

      headerContent.appendChild(ratingDisplay);
    }

    modalHeader.appendChild(headerContent);

    // Modal body
    const modalBody = createElement('div', {
      style: {
        padding: '32px',
        background: `
          linear-gradient(135deg, 
            rgba(255, 255, 255, 0.98) 0%, 
            rgba(248, 250, 252, 0.95) 50%, 
            rgba(241, 245, 249, 0.98) 100%
          )`,
        backdropFilter: 'blur(20px)'
      }
    });

    // Quote section
    const quoteSection = createElement('div', {
      style: {
        position: 'relative',
        marginBottom: '32px'
      }
    });

    const quoteIcon = createElement('div', {
      style: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '24px'
      }
    });

    const quoteIconCircle = createElement('div', {
      style: {
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1))',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }
    });

    const quoteSvg = createElement('svg', {
      style: {
        width: '32px',
        height: '32px',
        color: '#64748b'
      },
      viewBox: '0 0 24 24',
      fill: 'currentColor'
    });
    quoteSvg.innerHTML = '<path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>';

    quoteIconCircle.appendChild(quoteSvg);
    quoteIcon.appendChild(quoteIconCircle);
    quoteSection.appendChild(quoteIcon);

    // Testimonial content
    const testimonialContent = createElement('blockquote', {
      style: {
        textAlign: 'center',
        fontSize: '24px',
        lineHeight: '1.6',
        color: '#1e293b',
        fontWeight: '500',
        position: 'relative',
        padding: '0 32px',
        fontStyle: 'italic',
        letterSpacing: '0.025em'
      }
    });

    const openQuote = createElement('span', {
      style: {
        fontSize: '128px',
        color: 'rgba(59, 130, 246, 0.15)',
        position: 'absolute',
        top: '-24px',
        left: '-8px',
        fontFamily: 'serif',
        userSelect: 'none'
      }
    }, ['"']);

    const closeQuote = createElement('span', {
      style: {
        fontSize: '128px',
        color: 'rgba(59, 130, 246, 0.15)',
        position: 'absolute',
        bottom: '-48px',
        right: '-8px',
        fontFamily: 'serif',
        userSelect: 'none'
      }
    }, ['"']);

    const contentSpan = createElement('span', {
      style: {
        position: 'relative',
        zIndex: '10'
      }
    }, [testimonial.content]);

    testimonialContent.appendChild(openQuote);
    testimonialContent.appendChild(contentSpan);
    testimonialContent.appendChild(closeQuote);
    quoteSection.appendChild(testimonialContent);
    modalBody.appendChild(quoteSection);

    // Close button
    const closeButtonContainer = createElement('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    });

    const modalCloseButton = createElement('button', {
      style: {
        background: 'linear-gradient(135deg, #475569, #64748b, #475569)',
        color: 'white',
        padding: '16px 32px',
        borderRadius: '16px',
        fontWeight: '600',
        fontSize: '18px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 25px rgba(71, 85, 105, 0.3)',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }
    }, ['Close']);

    modalCloseButton.addEventListener('click', () => {
      modal.classList.remove('show');
      setTimeout(() => document.body.removeChild(modal), 300);
    });

    modalCloseButton.addEventListener('mouseenter', () => {
      modalCloseButton.style.transform = 'scale(1.05)';
    });

    modalCloseButton.addEventListener('mouseleave', () => {
      modalCloseButton.style.transform = 'scale(1)';
    });

    closeButtonContainer.appendChild(modalCloseButton);
    modalBody.appendChild(closeButtonContainer);

    // Modal footer
    const modalFooter = createElement('div', {
      style: {
        padding: '16px 32px',
        background: 'rgba(248, 250, 252, 0.8)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(226, 232, 240, 0.5)'
      }
    });

    const footerContent = createElement('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontSize: '12px',
        color: '#64748b'
      }
    });

    const heartIcon = createElement('svg', {
      style: {
        width: '12px',
        height: '12px',
        color: '#ef4444'
      },
      viewBox: '0 0 24 24',
      fill: 'currentColor'
    });
    heartIcon.innerHTML = '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>';

    footerContent.appendChild(heartIcon);
    footerContent.appendChild(document.createTextNode('Powered by Credo'));
    modalFooter.appendChild(footerContent);

    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);
    modal.appendChild(modalContent);

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
        setTimeout(() => document.body.removeChild(modal), 300);
      }
    });

    // Close on escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        modal.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(modal);
          document.removeEventListener('keydown', handleEscape);
        }, 300);
      }
    };
    document.addEventListener('keydown', handleEscape);

    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => modal.classList.add('show'), 10);
  }

  function createWidget(container, widgetData) {
    const { widget } = widgetData;
    
    switch (widget.widget_type) {
      case 'floating':
        createFloatingBubblesWidget(container, widgetData);
        break;
      default:
        // Fallback for other widget types
        container.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">Widget type not supported in embed mode</div>';
    }
  }

  // Main initialization
  function initWidget() {
    const scripts = document.querySelectorAll('script[data-widget-id]');
    
    scripts.forEach(async (script) => {
      const widgetId = script.getAttribute('data-widget-id');
      if (!widgetId) return;

      try {
        // Inject styles
        injectStyles();

        // Create container
        const container = createElement('div', {
          id: `credo-widget-${widgetId}`,
          style: {
            width: '100%',
            minHeight: '400px'
          }
        });

        // Insert container after script
        script.parentNode.insertBefore(container, script.nextSibling);

        // Fetch widget data
        const response = await fetch(`${WIDGET_API_BASE}/api/widget/${widgetId}`);
        if (!response.ok) throw new Error('Failed to load widget');

        const widgetData = await response.json();

        // Track view
        fetch(`${WIDGET_API_BASE}/api/widget/${widgetId}/view`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }).catch(() => {}); // Silent fail for analytics

        // Create widget
        createWidget(container, widgetData);

      } catch (error) {
        console.error('Credo Widget Error:', error);
        
        // Show error state
        const errorContainer = createElement('div', {
          style: {
            padding: '20px',
            textAlign: 'center',
            color: '#ef4444',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px'
          }
        }, ['Failed to load testimonials widget']);

        script.parentNode.insertBefore(errorContainer, script.nextSibling);
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();