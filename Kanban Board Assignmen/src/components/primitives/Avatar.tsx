import React from 'react';
import clsx from 'clsx';
import { getInitials } from '@/utils/task.utils';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ name, size = 'md', className }) => {
  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  };
  
  return (
    <div
      className={clsx(
        'bg-primary-500 rounded-full text-white flex items-center justify-center font-semibold',
        'transition-transform duration-150 hover:scale-110',
        sizes[size],
        className
      )}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
};
