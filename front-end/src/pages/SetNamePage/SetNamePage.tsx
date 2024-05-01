import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IAddPersonalDataRequest } from '../../models/request/IAddPersonalDataRequest';
import { zodResolver } from '@hookform/resolvers/zod';
import { addPersonalSchema } from '../../models/zodSchemas/addPersonalSchema';
import ParticipantService from '../../services/ParticipantService';
import { Context } from '../..';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

interface SetNamePageProps {}

const SetNamePage: React.FC<SetNamePageProps> = () => {
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
            <form onSubmit={handleSubmit(onSubmit)}>
                <h1 className="formAuth__title">Введите персональные данные</h1>
                <label className="formAuth__label">
                    Введите свое имя
                    <input
                        {...register('name')}
                        className="formAuth__input formAuth__input_login"
                        placeholder="Иван"
                    ></input>
                    {errors.name && (
                        <p className="formAuth__input-error">{`${errors.name.message}`}</p>
                    )}
                </label>
                <label className="formAuth__label">
                    Введите свою фамилию
                    <input
                        {...register('surname')}
                        placeholder="Иванов"
                        className="formAuth__input formAuth__input_login"
                    ></input>
                    {errors.surname && (
                        <p className="formAuth__input-error">{`${errors.surname.message}`}</p>
                    )}
                </label>
                <label className="formAuth__label">
                    Введите свою почту
                    <input
                        {...register('email')}
                        placeholder="email@mail.ru"
                        className="formAuth__input formAuth__input_login"
                    ></input>
                    {errors.email && (
                        <p className="formAuth__input-error">{`${errors.email.message}`}</p>
                    )}
                </label>
                <p className="formAuth__error">{errors.root?.message}</p>
                <button
                    disabled={!isValid || isSubmitting}
                    className="formAuth__btn"
                >
                    {isSubmitting ? 'Ожидание ответа' : 'Запомнить'}
                </button>
            </form>
        </div>
    );
};

export default SetNamePage;
