"use client";

import React, { useState, useEffect } from 'react';
import { useIsMobile } from '../hooks/use-mobile';

const CustomCursor = () => {
  const isMobile = useIsMobile();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    if (isMobile) return;

    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    const mouseDown = () => setIsClicking(true);
    const mouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      const hasPointerCursor = window.getComputedStyle(target).cursor === 'pointer';
      if (hasPointerCursor || 
          tagName === 'a' || 
          tagName === 'button' || 
          target.onclick ||
          target.getAttribute('role') === 'button') {
        setIsPointer(true);
        setCursorVariant('pointer');
      } else if (tagName === 'input' || tagName === 'textarea') {
        setCursorVariant('text');
        setIsPointer(false);
      } else {
        setCursorVariant('default');
        setIsPointer(false);
      }
    };

    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mousedown', mouseDown);
    window.addEventListener('mouseup', mouseUp);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mousedown', mouseDown);
      window.removeEventListener('mouseup', mouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isMobile]);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: isClicking ? 0.8 : 1,
    },
    pointer: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: isClicking ? 0.8 : 1.2,
    },
    text: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 0.8,
    }
  } as const;

  const currentVariant = variants[cursorVariant as keyof typeof variants];

  if (isMobile) return null;

  return (
    <>
      {/* Main cursor */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          transform: `translate3d(${currentVariant.x}px, ${currentVariant.y}px, 0) scale(${currentVariant.scale})`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        <div className="w-8 h-8 bg-white rounded-full opacity-90 shadow-lg"></div>
      </div>

      {/* Trailing dot */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          transform: `translate3d(${mousePosition.x - 2}px, ${mousePosition.y - 2}px, 0)`,
          transition: 'transform 0.15s ease-out',
        }}
      >
        <div className="w-1 h-1 bg-blue-400 rounded-full opacity-60"></div>
      </div>

      {/* Hover effect ring */}
      {isPointer && (
        <div
          className="fixed top-0 left-0 pointer-events-none z-[9997]"
          style={{
            transform: `translate3d(${mousePosition.x - 24}px, ${mousePosition.y - 24}px, 0)`,
            transition: 'transform 0.1s ease-out, opacity 0.2s ease-out',
          }}
        >
          <div 
            className="w-12 h-12 border-2 border-blue-400 rounded-full opacity-50"
            style={{
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          ></div>
        </div>
      )}

      {/* Click ripple effect */}
      {isClicking && (
        <div
          className="fixed top-0 left-0 pointer-events-none z-[9996]"
          style={{
            transform: `translate3d(${mousePosition.x - 20}px, ${mousePosition.y - 20}px, 0)`,
          }}
        >
          <div 
            className="w-10 h-10 border-2 border-purple-400 rounded-full opacity-70"
            style={{
              animation: 'ripple 0.6s ease-out forwards',
            }}
          ></div>
        </div>
      )}

      <style jsx>{`
        @keyframes glassPulse {
          0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 8px 32px 0 rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          }
          50% { 
            transform: scale(1.05); 
            box-shadow: 0 12px 40px 0 rgba(59, 130, 246, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          }
        }
        
        @keyframes glassRipple {
          0% {
            transform: scale(1);
            opacity: 0.8;
            box-shadow: 0 8px 32px 0 rgba(168, 85, 247, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
            box-shadow: 0 16px 64px 0 rgba(168, 85, 247, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05);
          }
        }
        
        /* Hide default cursor on desktop only (component rendered only on desktop) */
        * { cursor: none !important; }

        /* Glass morphism support check */
        @supports (backdrop-filter: blur(10px)) {
          .glass-cursor {
            backdrop-filter: blur(10px);
          }
        }

        /* Fallback for browsers without backdrop-filter */
        @supports not (backdrop-filter: blur(10px)) {
          .glass-cursor {
            background: rgba(255, 255, 255, 0.15) !important;
          }
        }

        /* Performance optimizations */
        .cursor-element {
          will-change: transform, opacity;
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }
      `}</style>
    </>
  );
};

export default CustomCursor;