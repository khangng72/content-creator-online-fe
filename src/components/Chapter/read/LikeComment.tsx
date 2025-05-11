'use client';

import { Heart } from 'lucide-react';
import React, { useState } from 'react';

const LikeComment = () => {
  const [isLikedComment, setIsLikedComment] = useState(false);

  const toggleLikeComment = () => {
    setIsLikedComment((prev) => !prev);
  };

  return (
    <button className="hover:cursor-pointer" onClick={toggleLikeComment}>
      {isLikedComment ? (
        <Heart className="text-purpleRainbow fill-purpleRainbow" />
      ) : (
        <Heart className="text-muted-foreground" />
      )}
    </button>
  );
};

export default LikeComment;
