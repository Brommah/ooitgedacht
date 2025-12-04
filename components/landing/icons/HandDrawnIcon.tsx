import React, { useRef, useState, useEffect } from 'react';
import rough from 'roughjs';

interface HandDrawnIconProps {
  type: 'lock' | 'users' | 'clock' | 'document';
  size?: number;
  color?: string;
  className?: string;
}

/**
 * Hand-drawn SVG icon component using Rough.js
 */
export const HandDrawnIcon: React.FC<HandDrawnIconProps> = ({ 
  type, 
  size = 48, 
  color = '#60a5fa', 
  className = '' 
}) => {
  const canvasRef = useRef<SVGSVGElement>(null);
  const [paths, setPaths] = useState<string[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const rc = rough.svg(canvasRef.current);
    const generatedPaths: string[] = [];
    
    const options = {
      stroke: color,
      strokeWidth: 1.5,
      roughness: 1.2,
      bowing: 2,
      fill: 'none',
    };

    const shapes: SVGElement[] = [];
    
    switch (type) {
      case 'lock':
        // Lock body
        shapes.push(rc.rectangle(12, 22, 24, 20, { ...options, fill: `${color}15`, fillStyle: 'solid' }));
        // Lock shackle (arc)
        shapes.push(rc.arc(24, 22, 16, 16, Math.PI, 0, false, options));
        // Keyhole
        shapes.push(rc.circle(24, 30, 4, { ...options, fill: color, fillStyle: 'solid' }));
        break;
      case 'users':
        // Person 1 (left)
        shapes.push(rc.circle(16, 16, 10, options));
        shapes.push(rc.arc(16, 40, 20, 16, Math.PI, 0, false, options));
        // Person 2 (right)
        shapes.push(rc.circle(32, 16, 10, options));
        shapes.push(rc.arc(32, 40, 20, 16, Math.PI, 0, false, options));
        break;
      case 'clock':
        // Clock face
        shapes.push(rc.circle(24, 24, 18, options));
        // Clock hands
        shapes.push(rc.line(24, 24, 24, 14, options)); // Hour
        shapes.push(rc.line(24, 24, 32, 28, options)); // Minute
        // Center dot
        shapes.push(rc.circle(24, 24, 3, { ...options, fill: color, fillStyle: 'solid' }));
        break;
      case 'document':
        // Document body
        shapes.push(rc.rectangle(10, 6, 28, 36, options));
        // Folded corner
        shapes.push(rc.line(30, 6, 38, 14, options));
        shapes.push(rc.line(38, 14, 38, 6, options));
        // Lines
        shapes.push(rc.line(14, 18, 30, 18, options));
        shapes.push(rc.line(14, 24, 30, 24, options));
        shapes.push(rc.line(14, 30, 24, 30, options));
        // Checkmark
        shapes.push(rc.circle(32, 36, 8, { ...options, fill: `${color}30`, fillStyle: 'solid' }));
        break;
    }
    
    shapes.forEach(shape => {
      if (shape instanceof SVGPathElement || shape instanceof SVGElement) {
        generatedPaths.push(shape.outerHTML);
      }
    });
    
    setPaths(generatedPaths);
  }, [type, color]);

  return (
    <svg
      ref={canvasRef}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      dangerouslySetInnerHTML={{ __html: paths.join('') }}
    />
  );
};




