
import React, { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'default', className = '', ...props }) => {
  const baseClasses = 'font-semibold transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-800';
  
  const variantClasses = {
    primary: 'bg-primary text-dark-900 hover:bg-amber-400 focus:ring-amber-500',
    secondary: 'bg-secondary text-dark-900 hover:bg-cyan-400 focus:ring-cyan-500',
    danger: 'bg-red-600 text-white hover:bg-red-500 focus:ring-red-600',
    ghost: 'bg-transparent text-gray-300 hover:bg-dark-700 hover:text-white focus:ring-gray-500',
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-dark-900 focus:ring-amber-500',
  };

  const sizeClasses = {
    default: 'px-4 py-2 rounded-lg',
    sm: 'px-3 py-1.5 rounded-md text-sm',
    lg: 'px-6 py-3 rounded-lg text-lg',
    icon: 'h-9 w-9 p-0 rounded-full',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;