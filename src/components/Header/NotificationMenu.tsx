import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';

const NotificationMenu = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = React.useRef<HTMLDivElement>(null);

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  useEffect(() => {
    const handleOnClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !event.composedPath().includes(notificationRef.current)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.body.addEventListener('click', handleOnClickOutside);
    return () => {
      document.body.removeEventListener('click', handleOnClickOutside);
    };
  }, []);

  return (
    <div ref={notificationRef} className="items-center flex">
      <button
        className="relative hover:opacity-80 hover:cursor-pointer"
        onClick={toggleNotification}
      >
        <Bell className="w-5 h-5 md:w-7 md:h-7" />
        <div className="w-5 h-5 flex items-center justify-center rounded-full bg-red-500 absolute bottom-3 left-3">
          <span className="text-[10px]">122</span>
        </div>
      </button>
      {isNotificationOpen && (
        <div className="absolute top-14 md:right-3 md:translate-x-0 md:left-auto left-1/2 -translate-x-1/2 bg-card w-[90%] md:w-80 rounded-md flex-col px-5 pt-2 pb-4 space-y-3">
          <h2 className="font-bold text-md">Notifications</h2>
        </div>
      )}
    </div>
  );
};

export default NotificationMenu;
