import { Link } from '@/i18n/routing';
import { CircleCheck } from 'lucide-react';

const ChapterOption = () => {
  return (
    <Link href="#">
      <li className="flex justify-between px-4 py-2 hover:bg-accent hover:cursor-pointer border-b border-b-gay-200">
        <div className="flex flex-col items-start">
          <h4 className="font-bold">Chapter Title</h4>
          <div>
            <span className="text-sm text-muted-foreground">
              20204-04-04 12:00:00
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
