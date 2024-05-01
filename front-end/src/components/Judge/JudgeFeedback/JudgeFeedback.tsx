import React, { useEffect } from 'react';
import Modal from '../../UI/Modal/Modal';
import Button from '../../UI/Button/Button';
import { Controller, useForm } from 'react-hook-form';
import { IJudgeFeedbackRequest } from '../../../models/request/IJudgeFeedbackRequest';
import { judgeFeedbackSchema } from '../../../models/zodSchemas/judgeFeedbackSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../../UI/Input/Input';
import { Context } from '../../..';
import JudgeService from '../../../services/JudgeService';
import { IUserAnwser } from '../../../models/IUserAnwser';
import { AxiosError } from 'axios';

interface JudgeFeedbackProps {
    userTasksId: number;
    isOpenSetStateModal: boolean;
    setOpenSetStateModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const JudgeFeedback: React.FC<JudgeFeedbackProps> = ({
    isOpenSetStateModal,
    setOpenSetStateModal,
    userTasksId,
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
        formState: { errors, isSubmitting, isValid },
    } = useForm<IJudgeFeedbackRequest>({
        mode: 'onBlur',
        resolver: zodResolver(judgeFeedbackSchema),
    });

    const onSubmit = async (dataFields: IJudgeFeedbackRequest) => {
        try {
            const response = await JudgeService.judgeFeedback<IUserAnwser>(
                userTasksId,
                dataFields.accepted,
                dataFields.points,
                dataFields.comment,
            );
            console.log(response);

            if (response) {
                store.updateUserAnswer(response.data);
            }
            setOpenSetStateModal(false);
            reset();
        } catch (e: AxiosError | any) {
            setError('root', {
                type: 'manual',
                message: 'Невалидные данные в форме',
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
            <form
                onSubmit={handleSubmit(onSubmit)}
                style={{ display: 'flex', flexDirection: 'column' }}
            >
                <p>Установить состояние</p>
                <Controller
                    name="accepted"
                    control={control}
                    defaultValue={'not-accept'}
                    render={({ field }) => (
                        <select {...field}>
                            <option value="not-accept">Отклонено</option>
                            <option value="accept">Принято</option>
                        </select>
                    )}
                />
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
