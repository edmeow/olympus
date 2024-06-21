import { FC, MouseEventHandler } from 'react';

interface ExitIconProps {
    className?: string;
    onClick?: MouseEventHandler<SVGSVGElement> | undefined;
}

export const ExitIcon: FC<ExitIconProps> = (props) => {
    return (
        <svg
            className={props.className}
            onClick={props.onClick}
            width="26.000000"
            height="26.000000"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <desc>Created with Pixso.</desc>
            <defs>
                <clipPath id="clip94_1222">
                    <rect
                        id="close_black_24dp 1"
                        width="26.000000"
                        height="26.000000"
                        fill="white"
                        fillOpacity="0"
                    />
                </clipPath>
            </defs>
            <rect
                id="close_black_24dp 1"
                width="26.000000"
                height="26.000000"
                fill="#FFFFFF"
                fillOpacity="0"
            />
            <g clipPath="url(#clip94_1222)">
                <path
                    id="Vector"
                    d="M19.82 6.18C19.4 5.76 18.71 5.76 18.29 6.18L13 11.47L7.7 6.17C7.28 5.75 6.59 5.75 6.17 6.17C5.75 6.59 5.75 7.28 6.17 7.7L11.47 13L6.17 18.29C5.75 18.71 5.75 19.4 6.17 19.82C6.59 20.24 7.28 20.24 7.7 19.82L13 14.52L18.29 19.82C18.71 20.24 19.4 20.24 19.82 19.82C20.24 19.4 20.24 18.71 19.82 18.29L14.52 13L19.82 7.7C20.23 7.29 20.23 6.59 19.82 6.18Z"
                    fill="#8F959E"
                    fillOpacity="1.000000"
                    fillRule="nonzero"
                />
            </g>
        </svg>
    );
};
