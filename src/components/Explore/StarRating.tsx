import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface StarRatingProps {
  rating: number; // e.g., 3.5
  size?: number;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  size = 20,
  className = '',
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`flex gap-1 ${className}`}>
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          size={size}
          className="text-yellow-500 fill-yellow-500"
        />
      ))}
      {hasHalfStar && (
        <div className="relative">
          <StarHalf size={size} className="text-yellow-500 fill-yellow-500" />
          <Star size={size} className="absolute bottom-0 text-yellow-500" />
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={size} className="text-yellow-500" />
      ))}
    </div>
  );
};

export default StarRating;
