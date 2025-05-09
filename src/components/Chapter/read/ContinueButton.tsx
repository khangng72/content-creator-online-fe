import { Link } from '@/i18n/routing';
import React from 'react';

interface ContinueButtonProps {
  nextChapterId: string;
}
const ContinueButton = ({ nextChapterId }: ContinueButtonProps) => {
  return nextChapterId ? (
    <Link
      href={`/chapter/read/${nextChapterId}`}
      className="w-full text-center bg-purpleRainbow text-white font-bold py-2 rounded-md active:scale-95 transition-all duration-300 ease-in-out"
    >
      Continue to next chapter
    </Link>
  ) : (
    <button
      className="w-full text-center bg-accent font-bold py-2 rounded-md hover:cursor-not-allowed"
      disabled
    >
      No more chapters
    </button>
  );
};

export default ContinueButton;
