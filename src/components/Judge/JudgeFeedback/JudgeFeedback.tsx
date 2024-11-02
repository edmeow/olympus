import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Context } from '../../..';
import { IUserAnwser } from '../../../models/IUserAnwser';
import { IJudgeFeedbackRequest } from '../../../models/request/IJudgeFeedbackRequest';
import { judgeFeedbackSchema } from '../../../models/zodSchemas/judgeFeedbackSchema';
import JudgeService from '../../../services/JudgeService';
import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';
import Modal from '../../UI/Modal/Modal';
import './JudgeFeedback.scss';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AxiosError } from 'axios';

interface JudgeFeedbackProps {
    userTasksData: {
        selectedFeedbackModalid: number;
        maxStr: number;
    };
    isOpenSetStateModal: boolean;
    setOpenSetStateModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const JudgeFeedback: React.FC<JudgeFeedbackProps> = ({
    isOpenSetStateModal,
    setOpenSetStateModal,
    userTasksData,
}) => {
    const { store } = React.useContext(Context);

    const {
        register,
        handleSubmit,
        reset,
        setError,
        setValue,
        control,
        watch,
        formState: { errors },
    } = useForm<IJudgeFeedbackRequest>({
        mode: 'onBlur',
        resolver: zodResolver(judgeFeedbackSchema),
    });

    const onSubmit = async (dataFields: IJudgeFeedbackRequest) => {
        try {
            const response = await JudgeService.judgeFeedback<IUserAnwser>(
                userTasksData.selectedFeedbackModalid,
                dataFields.accepted,
                dataFields.points,
                dataFields.comment,
            );
            if (response) {
                store.updateUserAnswer(response.data);
            }
            setOpenSetStateModal(false);
            reset();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
        } catch (e: AxiosError | any) {
            setError('root', {
                type: 'manual',
                message: 'Ошибка сервера',
            });
        }
    };
    const allValues = watch();
    useEffect(() => {
        if (allValues.accepted === 'not-accept') {
            setValue('points', '0');
        }
    }, [allValues.accepted]);
    return (
        <Modal active={isOpenSetStateModal} setActive={setOpenSetStateModal}>
            <form onSubmit={handleSubmit(onSubmit)} className="feedback">
                <label className="feedback__select-label">
                    Установить состояние
                    <Controller
                        name="accepted"
                        control={control}
                        defaultValue={'not-accept'}
                        render={({ field }) => (
                            <select className="feedback__select" {...field}>
                                <option value="not-accept">Отклонено</option>
                                <option value="accept">Принято</option>
                            </select>
                        )}
                    />
                </label>
                <Input
                    disabled={
                        allValues.accepted === 'not-accept' ? true : false
                    }
                    label="Выставить оценку"
                    errors={errors}
                    register={register}
                    name="points"
                    type="number"
                    placeholder="Оценка..."
                />
                <Input
                    label="Оставить комментарий"
                    placeholder="Комментарий..."
                    errors={errors}
                    register={register}
                    name="comment"
                    type="text"
                />
                <p className="formAuth__error">{errors.root?.message}</p>
                <Button label="Отправить"></Button>
            </form>
        </Modal>
    );
};

export default JudgeFeedback;
