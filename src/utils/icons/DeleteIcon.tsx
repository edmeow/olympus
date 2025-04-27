import { FC } from 'react';

interface DeleteIconProps {
  className?: string;
}

export const DeleteIcon: FC<DeleteIconProps> = () => {
  return (
    <svg
      width="14.000000"
      height="16.000000"
      viewBox="0 0 14 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <desc>Created with Pixso.</desc>
      <defs>
        <clipPath id="clip94_1179">
          <rect
            id="trash"
            width="14.000000"
            height="16.000000"
            fill="white"
            fillOpacity="0"
          />
        </clipPath>
      </defs>
      <rect
        id="trash"
        width="14.000000"
        height="16.000000"
        fill="#FFFFFF"
        fillOpacity="0"
      />
      <g clipPath="url(#clip94_1179)">
        <path
          id="Vector"
          d="M0 2C0 2.55 0.44 3 1 3L13 3C13.55 3 14 2.55 14 2C14 1.44 13.55 1 13 1L9 1C9 0.44 8.55 0 8 0L6 0C5.44 0 5 0.44 5 1L1 1C0.44 1 0 1.44 0 2ZM1.54 4C1.25 4 1.02 4.25 1.04 4.54L1.84 14.16C1.93 15.2 2.8 16 3.84 16L10.15 16C11.19 16 12.06 15.2 12.15 14.16L12.95 4.54C12.97 4.25 12.74 4 12.45 4L1.54 4ZM5 6.5C5 6.22 5.22 6 5.5 6C5.77 6 6 6.22 6 6.5L6 13.5C6 13.77 5.77 14 5.5 14C5.22 14 5 13.77 5 13.5L5 6.5ZM8.5 6C8.22 6 8 6.22 8 6.5L8 13.5C8 13.77 8.22 14 8.5 14C8.77 14 9 13.77 9 13.5L9 6.5C9 6.22 8.77 6 8.5 6Z"
          fill="#F33764"
          fillOpacity="1.000000"
          fillRule="evenodd"
        />
      </g>
    </svg>
  );
};
