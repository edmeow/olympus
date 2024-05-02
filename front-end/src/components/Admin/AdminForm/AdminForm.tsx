import React, { ChangeEvent, FormEvent, useState } from 'react';
import './AdminForm.scss';
import AdminService from '../../../services/AdminService';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createContestSchema } from '../../../models/zodSchemas/createContestSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { IСreateContestRequest } from '../../../models/request/IСreateContestRequest';

const AdminForm: React.FC = () => {
    const history = useNavigate();

    const {
        register,
        control,
        handleSubmit,
        reset,
        setValue,
        setError,
        watch,
        formState: { errors, isSubmitting, isValid },
    } = useForm<IСreateContestRequest>({
        mode: 'onBlur',
        resolver: zodResolver(createContestSchema),
    });

    async function onSubmit(dataFields: IСreateContestRequest) {
        AdminService.createContest(
            dataFields.nameContest,
            dataFields.participantCount,
            dataFields.judgeCount,
            dataFields.prefix,
            dataFields.duration,
            // dataFields.problemInfos,
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
                history(`/admin/contest/${res.data.contest.session}`);
            })

            .catch((err: AxiosError) => {
                console.log(err);
            });
    }
    return (
        <div className="AdminForm_сontainer">
            <h1>Форма создания олимпиады</h1>
            <form className="adminForm" onSubmit={handleSubmit(onSubmit)}>
                {/* <div className="adminForm__inputs"> */}
                {/* <div className="adminForm__left"> */}
                <label>
                    Название олимпиады
                    <input
                        {...register('nameContest')}
                        placeholder="Наименование олимпиады..."
                    ></input>
                    {errors.nameContest && (
                        <p className="formAuth__input-error">{`${errors.nameContest.message}`}</p>
                    )}
                </label>
                <label>
                    Количество участников
                    <input
                        {...register('participantCount')}
                        placeholder="Количество участников..."
                    ></input>
                    {errors.participantCount && (
                        <p className="formAuth__input-error">{`${errors.participantCount.message}`}</p>
                    )}
                </label>
                <label>
                    Количество жюри
                    <input
                        {...register('judgeCount')}
                        placeholder="Количество жюри..."
                    ></input>
                    {errors.judgeCount && (
                        <p className="formAuth__input-error">{`${errors.judgeCount.message}`}</p>
                    )}
                </label>
                <label>
                    Префикс олимпиады
                    <input
                        {...register('prefix')}
                        placeholder="Префикс олимпиады..."
                    ></input>
                    {errors.prefix && (
                        <p className="formAuth__input-error">{`${errors.prefix.message}`}</p>
                    )}
                </label>
                <label>
                    Длительность олимпиады
                    <input
                        {...register('duration')}
                        placeholder="00:00"
                    ></input>
                    {errors.duration && (
                        <p className="formAuth__input-error">{`${errors.duration.message}`}</p>
                    )}
                </label>
                {/* </div> */}
                {/* <div className="adminForm__right">
                        <FileInputs
                            control={control}
                            errors={errors}
                            watch={watch}
                            setValue={setValue}
                            reset={reset}
                        />

                        {errors.problemInfos && (
                            <p className="formAuth__input-error">{`${errors.problemInfos.message}`}</p>
                        )}
                    </div> */}
                {/* </div> */}
                <button
                    disabled={!isValid || isSubmitting}
                    //className="formAuth__btn"
                >
                    {isSubmitting ? 'Создается...' : 'Создание олимпиады'}
                </button>
            </form>
        </div>
    );
};
export default AdminForm;
