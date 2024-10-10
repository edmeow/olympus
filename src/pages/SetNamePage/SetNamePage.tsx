import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Context } from '../..';
import { IAddPersonalDataRequest } from '../../models/request/IAddPersonalDataRequest';
import { addPersonalSchema } from '../../models/zodSchemas/addPersonalSchema';
import ParticipantService from '../../services/ParticipantService';
import './SetNamePage.scss';

const SetNamePage: React.FC = () => {
    const { store } = useContext(Context);
    const history = useNavigate();
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting, isValid },
    } = useForm<IAddPersonalDataRequest>({
        mode: 'onBlur',
        resolver: zodResolver(addPersonalSchema),
    });

    const onSubmit = async (dataFields: IAddPersonalDataRequest) => {
        try {
            const response = await ParticipantService.addPersonalData(
                dataFields.name,
                dataFields.surname,
                dataFields.email,
                store.user.username,
            );

            const { accessToken, ...data } = response.data;

            store.setUser(data);

            history(`/session/${store.user.session}`);
            reset();
        } catch (e: AxiosError | any) {
            setError('root', {
                type: 'manual',
                message: 'Невалидные данные в форме',
            });
        }
    };
    useEffect(() => {
        if (store.user.email && store.user.surname && store.user.name) {
            history(`/session/${store.user.session}`);
        }
    }, []);
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="formAuthUser">
                <h1 className="formAuthUser__title">
                    Введите персональные данные
                </h1>
                <label className="formAuthUser__label">
                    Введите свое имя
                    <input
                        {...register('name')}
                        className="formAuthUser__input formAuthUser__input_login"
                        placeholder="Иван"
                    ></input>
                    {errors.name && (
                        <p className="formAuthUser__input-error">{`${errors.name.message}`}</p>
                    )}
                </label>
                <label className="formAuthUser__label">
                    Введите свою фамилию
                    <input
                        {...register('surname')}
                        placeholder="Иванов"
                        className="formAuthUser__input formAuthUser__input_login"
                    ></input>
                    {errors.surname && (
                        <p className="formAuthUser__input-error">{`${errors.surname.message}`}</p>
                    )}
                </label>
                <label className="formAuthUser__label">
                    Введите свою почту
                    <input
                        {...register('email')}
                        placeholder="email@mail.ru"
                        className="formAuthUser__input formAuthUser__input_login"
                    ></input>
                    {errors.email && (
                        <p className="formAuthUser__input-error">{`${errors.email.message}`}</p>
                    )}
                </label>
                <p className="formAuthUser__error">{errors.root?.message}</p>
                <button
                    disabled={!isValid || isSubmitting}
                    className="formAuthUser__btn"
                >
                    {isSubmitting ? 'Ожидание ответа' : 'Запомнить'}
                </button>
            </form>
        </div>
    );
};

export default SetNamePage;
