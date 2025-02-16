import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IAddUsersRequest } from '../../../models/request/IAddUsersRequest';
import { addUsersSchema } from '../../../models/zodSchemas/addUsersSchema';
import AdminService from '../../../services/AdminService';
import Modal from '../Modal/Modal';
import './AddUserModal.scss';
import { useStore } from '../../../hooks/useStore';
interface ModalProps {
    active: boolean;
    setActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddUserModal: React.FC<ModalProps> = ({ active, setActive }) => {
    const { main } = useStore();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm<IAddUsersRequest>({
        mode: 'onBlur',
        resolver: zodResolver(addUsersSchema),
    });
    function createUsers(dataFields: IAddUsersRequest) {
        if (main.contest) {
            AdminService.createUsers(
                main.contest.session,
                dataFields.participantCount,
                dataFields.judgeCount,
            )
                .then((res) => {
                    const base64String = res.data.fileContent;

                    const binaryData = atob(base64String);
                    const byteArray = new Uint8Array(binaryData.length);
                    for (let i = 0; i < binaryData.length; i++) {
                        byteArray[i] = binaryData.charCodeAt(i);
                    }
                    const link = document.createElement('a');
                    link.href = `data:application/octet-stream;base64,${base64String}`;
                    link.download = 'contest_info.txt';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    setActive(false);
                })

                .catch((err: AxiosError) => {
                    console.log(err);
                });
        }
    }
    useEffect(() => {
        if (!active) {
            reset();
        }
    }, [active]);

    return (
        <Modal active={active} setActive={setActive}>
            <form
                className="contest-timing__duration-modal"
                onSubmit={handleSubmit(createUsers)}
            >
                <label className="contest-timing__duration-modal-title">
                    <p>Укажите количество новых участников</p>
                    <input
                        className="contest-timing__duration-modal-input"
                        {...register('participantCount')}
                        placeholder="Количество участников"
                    ></input>
                </label>
                {errors.participantCount && (
                    <p className="formAuth__input-error">{`${errors.participantCount.message}`}</p>
                )}
                <label className="contest-timing__duration-modal-title">
                    <p>Укажите количество новых жюри</p>
                    <input
                        className="contest-timing__duration-modal-input"
                        {...register('judgeCount')}
                        placeholder="Количество жюри"
                    ></input>
                </label>
                {errors.judgeCount && (
                    <p className="formAuth__input-error">{`${errors.judgeCount.message}`}</p>
                )}
                <button
                    className="contest-timing__duration-modal-btn"
                    disabled={!isValid}
                >
                    Создать
                </button>
            </form>
        </Modal>
    );
};

export default AddUserModal;
