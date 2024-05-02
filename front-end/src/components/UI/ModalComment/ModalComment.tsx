import React, { ReactNode } from 'react';
import './ModalComment.scss';
import Modal from '../Modal/Modal';
interface ModalProps {
    active: boolean;
    setActive: React.Dispatch<React.SetStateAction<boolean>>;
    text?: string | null;
}

const ModalComment: React.FC<ModalProps> = ({ active, setActive, text }) => {
    return (
        <Modal active={active} setActive={setActive}>
            {/* {children !== '' ? children : 'Комментарий пустой'} */}
            <p>{text}</p>
        </Modal>
    );
};

export default ModalComment;
