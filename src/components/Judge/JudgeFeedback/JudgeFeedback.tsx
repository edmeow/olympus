import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Context } from '../../..';
import { IUserAnwser } from '../../../models/IUserAnwser';
import JudgeService from '../../../services/JudgeService';
import Modal from '../../UI/Modal/Modal';
import './JudgeFeedback.scss';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AxiosError } from 'axios';
import { TextFieldFormComponent } from '../../UI/FormInputs/TextFieldFormComponent';
import { BaseFormModal } from '../../UI/BaseFormModal';
import {
    JudgeFeedbackRequestType,
    judgeFeedbackSchema,
} from '../../../models/zodSchemas/judgeFeedbackSchema';
import { TextFieldCounted } from '../../UI/Input/TextFieldCounted';

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

    const methods = useForm<JudgeFeedbackRequestType>({
        mode: 'onBlur',
        defaultValues: {
            accepted: 'not-accept',
            points: 0,
            comment: '',
        },
        resolver: zodResolver(judgeFeedbackSchema(userTasksData.maxStr)),
    });

    const onSubmit = async (dataFields: JudgeFeedbackRequestType) => {
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
            methods.reset();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
        } catch (e: AxiosError | any) {
            methods.setError('root', {
                type: 'manual',
                message: 'Ошибка сервера',
            });
        }
    };
    const allValues = methods.watch();

    useEffect(() => {
        methods.reset();
    }, [isOpenSetStateModal]);

    useEffect(() => {
        if (allValues.accepted === 'not-accept') {
            methods.setValue('points', 0);
        }
    }, [allValues.accepted]);

    return (
        <Modal active={isOpenSetStateModal} setActive={setOpenSetStateModal}>
            <BaseFormModal
                methods={methods}
                onSubmit={onSubmit}
                className="feedback"
                title="Оценить"
                content={
                    <>
                        <label className="feedback__select-label">
                            Установить состояние
                            <Controller
                                name="accepted"
                                control={methods.control}
                                defaultValue={'not-accept'}
                                render={({ field }) => (
                                    <select
                                        className="feedback__select"
                                        {...field}
                                    >
                                        <option value="not-accept">
                                            Отклонено
                                        </option>
                                        <option value="accept">Принято</option>
                                    </select>
                                )}
                            />
                        </label>
                        {allValues.accepted === 'not-accept' ? (
                            <TextFieldCounted
                                label={'Выставить оценку'}
                                value={'0'}
                                fullWidth
                                disabled
                            />
                        ) : (
                            <TextFieldFormComponent
                                name={'points'}
                                label={'Выставить оценку'}
                                numeric
                                required
                                fullWidth
                            />
                        )}

                        <TextFieldFormComponent
                            fullWidth
                            name={'comment'}
                            label={'Оставить комментарий'}
                        />
                    </>
                }
            />

            {/* <Input
                    disabled={
                        allValues.accepted === 'not-accept' ? true : false
                    }
                    max={userTasksData.maxStr}
                    label="Выставить оценку"
                    errors={errors}
                    register={register}
                    name="points"
                    type="number"
                    placeholder="Оценка..."
                /> */}
        </Modal>
        // <Modal active={isOpenSetStateModal} setActive={setOpenSetStateModal}>
        //     <form onSubmit={handleSubmit(onSubmit)} className="feedback">
        //         <label className="feedback__select-label">
        //             Установить состояние
        //             <Controller
        //                 name="accepted"
        //                 control={control}
        //                 defaultValue={'not-accept'}
        //                 render={({ field }) => (
        //                     <select className="feedback__select" {...field}>
        //                         <option value="not-accept">Отклонено</option>
        //                         <option value="accept">Принято</option>
        //                     </select>
        //                 )}
        //             />
        //         </label>
        //         <Input
        //             disabled={
        //                 allValues.accepted === 'not-accept' ? true : false
        //             }
        //             max={userTasksData.maxStr}
        //             label="Выставить оценку"
        //             errors={errors}
        //             register={register}
        //             name="points"
        //             type="number"
        //             placeholder="Оценка..."
        //         />
        //         <Input
        //             label="Оставить комментарий"
        //             placeholder="Комментарий..."
        //             errors={errors}
        //             register={register}
        //             name="comment"
        //             type="text"
        //         />
        //         <p className="formAuth__error">{errors.root?.message}</p>
        //         <Button label="Отправить"></Button>
        //     </form>
        // </Modal>
    );
};

export default JudgeFeedback;
