import React, { useContext, useEffect } from 'react';
import './AddUserModal.scss';
import Modal from '../Modal/Modal';
import { FieldErrors, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IChangeDurationRequest } from '../../../models/request/IChangeDurationRequest';
import { addUsersSchema } from '../../../models/zodSchemas/addUsersSchema';
import { IAddUsersRequest } from '../../../models/request/IAddUsersRequest';
import { AxiosError } from 'axios';
import AdminService from '../../../services/AdminService';
import { Context } from '../../..';
interface ModalProps {
    active: boolean;
    setActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddUserModal: React.FC<ModalProps> = ({ active, setActive }) => {
    const { store } = useContext(Context);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isValid },
    } = useForm<IAddUsersRequest>({
        mode: 'onBlur',
        resolver: zodResolver(addUsersSchema),
    });
    function createUsers(dataFields: IAddUsersRequest) {
        if (store.contest) {
            AdminService.createUsers(
                store.contest.session,
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
