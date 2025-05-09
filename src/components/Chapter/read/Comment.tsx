import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart } from 'lucide-react';
import React from 'react';
import Reply from './Reply';

const mockComment =
  'Tại họp báo chiều 9/5, EVN thông báo giá bán lẻ điện bình quân tăng từ 2.103,11 đồng lên 2.204,07 đồng một kWh (chưa gồm thuế VAT), tương đương tăng 4,8%. Mức tăng này tương tự hồi tháng 10/2024.';

const Comment = () => {
  return (
    <div className="w-full flex items-start justify-between border-t-2 border-accent pt-4">
      {/* user things */}
      <div className="flex gap-2 max-w-[90%]">
        {/* avatar */}
        <div>
          <Avatar className="">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="block space-y-2">
          <div className="flex flex-col gap-1 bg-card rounded-xl p-3">
            <span className="text-base font-bold">Username</span>
            <div>{mockComment}</div>
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-muted-foreground">20205-04-03</span>
            <span className="font-bold text-purpleRainbow">Reply</span>
          </div>
          <Reply />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-1">
        <Heart className="w-5 h-5 text-purpleRainbow fill-purpleRainbow" />
        <span>220</span>
      </div>
    </div>
  );
};

export default Comment;
