import React, { ReactNode } from 'react';
import './ModalComment.scss';
import Modal from '../Modal/Modal';
interface ModalProps {
    active: boolean;
    setActive: React.Dispatch<React.SetStateAction<boolean>>;
    children: ReactNode;
}

const ModalComment: React.FC<ModalProps> = ({
    active,
    setActive,
    children,
}) => {
    return (
        <Modal active={active} setActive={setActive}>
            {children !== '' ? children : 'Комментарий пустой'}
        </Modal>
    );
};

export default ModalComment;
