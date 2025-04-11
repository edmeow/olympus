import React from 'react';
import './HoverText.scss';

interface HoverTextProps {
    children: React.ReactNode;
    isDownload?: boolean;
}

const HoverText: React.FC<HoverTextProps> = (props) => {
    return (
        <p
            className={`hoverText ${
                props.isDownload ? 'hoverText_download' : ''
            }`}
        >
            {props.children}
        </p>
    );
};

export default HoverText;
