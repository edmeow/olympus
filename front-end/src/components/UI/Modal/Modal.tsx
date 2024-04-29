import React, { ReactNode } from 'react';
import './Modal.scss';
interface ModalProps {
    active: boolean;
    setActive: React.Dispatch<React.SetStateAction<boolean>>;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ active, setActive, children }) => {
    return (
        <div
            className={`modal ${active ? 'modal_active' : ''}`}
            onClick={() => setActive(false)}
        >
            <div
                className={`modal__content ${
                    active ? 'modal__content_active' : ''
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

export default Modal;
