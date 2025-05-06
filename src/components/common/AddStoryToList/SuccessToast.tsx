import { Link } from '@/i18n/routing';
import React from 'react';

const SuccessToast = () => {
  return (
    <div>
      Successfully Added Story to{' '}
      <Link
        className="font-bold hover:underline inline"
        href="/my_library/reading_lists"
      >
        Read list
      </Link>
    </div>
  );
};

export default SuccessToast;
