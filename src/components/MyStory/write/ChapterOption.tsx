import { Link } from '@/i18n/routing';
import { Chapter } from '@/types/Chapter';
import { formatTimestamp } from '@/utils/FormatTimestamp';
import { CircleCheck } from 'lucide-react';

interface ChapterOptionProps {
  chapter: Chapter;
}
const ChapterOption = ({ chapter }: ChapterOptionProps) => {
  console.log('ChapterOption', chapter);
  return (
    <Link href={`/chapter/read/${chapter.chapterId}`}>
      <li className="flex justify-between px-4 py-2 hover:bg-background hover:cursor-pointer border-b border-b-gay-200">
        <div className="flex flex-col items-start">
          <h4 className="font-bold">{chapter.chapterTitle}</h4>
          <div>
            <span className="text-sm text-muted-foreground">
              {formatTimestamp(chapter.createdTime)}
            </span>
          </div>
        </div>
        <div>
          <CircleCheck className="text-[#8b5cf6]" />
        </div>
      </li>
    </Link>
  );
};

export default ChapterOption;
