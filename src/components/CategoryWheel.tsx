
import React, { useState, useEffect } from 'react';
import { Category } from '@/types';

interface CategoryWheelProps {
  categories: Category[];
  onSelect: (category: Category) => void;
  isSpinning?: boolean;
}

const CategoryWheel: React.FC<CategoryWheelProps> = ({ 
  categories, 
  onSelect,
  isSpinning = false
}) => {
  const [rotation, setRotation] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const spinWheel = () => {
    if (isSpinning) return;
    
    // Random number of rotations (3-5 full rotations) plus random segment
    const fullRotations = 3 + Math.floor(Math.random() * 2);
    const segmentAngle = 360 / categories.length;
    const randomSegment = Math.floor(Math.random() * categories.length);
    
    // Calculate final rotation (ensure it's always greater than current)
    const newRotation = fullRotations * 360 + randomSegment * segmentAngle;
    
    // Set spinning state via props
    setRotation(newRotation);
    
    // After animation completes, select the category
    setTimeout(() => {
      const index = categories.length - 1 - (Math.floor(newRotation % 360 / segmentAngle) % categories.length);
      setSelectedIndex(index);
      onSelect(categories[index]);
    }, 3000); // Animation takes 3 seconds (see CSS)
  };

  // Create wheel segments
  const renderWheelSegments = () => {
    const segmentAngle = 360 / categories.length;
    
    return categories.map((category, index) => {
      const startAngle = index * segmentAngle;
      const endAngle = (index + 1) * segmentAngle;
      
      // Create SVG path for segment
      // This is a simplified version - in a real app you'd want a more sophisticated approach
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      
      const x1 = 150 + 120 * Math.cos(startRad);
      const y1 = 150 + 120 * Math.sin(startRad);
      const x2 = 150 + 120 * Math.cos(endRad);
      const y2 = 150 + 120 * Math.sin(endRad);
      
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
      
      const d = [
        "M", 150, 150,
        "L", x1, y1,
        "A", 120, 120, 0, largeArcFlag, 1, x2, y2,
        "Z"
      ].join(" ");
      
      const textRotation = startAngle + segmentAngle / 2;
      
      return (
        <g key={category.id}>
          <path 
            d={d} 
            fill={category.color || `hsl(${index * 360 / categories.length}, 70%, 50%)`}
            stroke="#222"
            strokeWidth="1"
          />
          <text
            x="150"
            y="150"
            textAnchor="middle"
            transform={`rotate(${textRotation}, 150, 150) translate(0, -85)`}
            fill="white"
            fontSize="12"
            fontWeight="bold"
          >
            {category.name}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[300px] h-[300px]">
        {/* Wheel */}
        <svg 
          width="300" 
          height="300" 
          viewBox="0 0 300 300"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: "transform 3s cubic-bezier(0.2, 0.8, 0.2, 1)"
          }}
        >
          {renderWheelSegments()}
        </svg>
        
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 
                      border-l-[10px] border-l-transparent
                      border-r-[10px] border-r-transparent
                      border-b-[20px] border-b-quiz-accent
                      shadow-neon z-10" />
      </div>
      
      <button 
        className="quiz-button mt-4"
        onClick={spinWheel}
        disabled={isSpinning}
      >
        {isSpinning ? 'Koło się kręci...' : 'Zakręć kołem'}
      </button>
      
      {selectedIndex !== null && (
        <div className="mt-4 p-2 bg-quiz-card rounded-lg">
          <p className="text-center">
            Wybrana kategoria: <span className="font-bold">{categories[selectedIndex].name}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryWheel;
