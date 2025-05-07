import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface StoriImageProps {
  source: string | null;
  storyTitle: string;
  className?: string;
}

const StoriImage = ({ source, storyTitle, className }: StoriImageProps) => {
  const [error, setError] = useState(false);
  if (!source) {
    return (
      <div
        className={cn(
          'flex flex-col justify-center items-center bg-accent rounded-md  px-3',
          className ? className : 'w-[160px] h-[240px] text-xs'
        )}
      >
        <span className="font-bold">{storyTitle}</span>
        <span className="text-muted-foreground mt-2">
          Cover image coming soon
        </span>
      </div>
    );
  }
  return (
    <>
      {!error ? (
        <Image
          src={source}
          alt={storyTitle}
          width={160}
          height={240}
          className={cn(
            'rounded-md  object-cover',
            className ? className : 'w-[160px] h-[240px]'
          )}
          priority
          onError={() => setError(true)} // Handles image error
        />
      ) : (
        <div
          className={cn(
            'flex flex-col justify-center items-center bg-accent rounded-md  px-3',
            className ? className : 'w-[160px] h-[240px] text-xs'
          )}
        >
          {storyTitle}
          <span className="text-red-500 mt-2">Image not available</span>
        </div>
      )}
    </>
  );
};

export default StoriImage;
