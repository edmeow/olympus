import React from 'react';
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
            <p className="modalComment__text">{text ? text : 'Пусто'}</p>
        </Modal>
    );
};

export default ModalComment;
