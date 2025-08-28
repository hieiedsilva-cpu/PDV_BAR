import React, { ReactNode } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-dark-800 p-6 rounded-xl shadow-lg ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
