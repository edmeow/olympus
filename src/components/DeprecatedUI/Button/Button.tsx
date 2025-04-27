import React, { MouseEventHandler } from 'react';
import './Button.scss';
interface ButtonProps {
  label: string;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: 'submit';
}

const Button: React.FC<ButtonProps> = ({ label, onClick, className, type }) => {
  return (
    <button type={type} className={`button ${className}`} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
