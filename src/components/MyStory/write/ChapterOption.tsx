import { Link } from '@/i18n/routing';
import { Chapter } from '@/types/Chapter';
import { formatTimestamp } from '@/utils/FormatTimestamp';
import { CircleCheck } from 'lucide-react';

interface ChapterOptionProps {
  chapter: Chapter;
  checked: boolean;
}

const ChapterOption = ({ chapter, checked }: ChapterOptionProps) => {
  return (
    <Link href={`/mystory/${chapter.storyId}/write/${chapter.chapterId}`}>
      <li className="flex justify-between px-4 py-2 hover:bg-accent hover:cursor-pointer border-b-2 border-accent">
        <div className="flex flex-col items-start">
          <h4 className="font-bold">
            {chapter.chapterNumber}. {chapter.chapterTitle}
          </h4>
          <div className="flex flex-col gap-1">
            <span className="text-sm">Last updated on</span>
            <span className="text-sm text-muted-foreground">
              {formatTimestamp(chapter.updatedTime)}
            </span>
          </div>
        </div>

        {checked && (
          <div>
            <CircleCheck className="text-[#8b5cf6]" />
          </div>
        )}
      </li>
    </Link>
  );
};

export default ChapterOption;
