import { useContext, useState } from 'react';
import { Context } from '../..';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import { useForm } from 'react-hook-form';
import { ISignInRequest } from '../../models/request/ISignInRequest';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema } from '../../models/zodSchemas/signInSchema';
import './loginForm.scss';
import axios, { AxiosError } from 'axios';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const LoginForm = () => {
    const [passwordShown, setPasswordShown] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting, isValid },
    } = useForm<ISignInRequest>({
        mode: 'onBlur',
        resolver: zodResolver(signInSchema),
    });
    const { store } = useContext(Context);
    const history = useNavigate();
    const redirectToPage = (role: string, session: string) => {
        switch (role) {
            case 'ROLE_PARTICIPANT':
                history(`/session/${session}`);
                break;
            case 'ROLE_JUDGE':
                history(`/judge/${session}`);
                break;
            case 'ROLE_ADMIN':
                history(`/admin`);
                break;
            default:
                break;
        }
    };

    const onSubmit = async (dataFields: ISignInRequest) => {
        try {
            const response = await AuthService.login(
                dataFields.username,
                dataFields.password,
            );

            const { accessToken, ...data } = response.data;
            store.setUser(data);
            localStorage.setItem('jwt', accessToken);
            store.setAuth(true);
            redirectToPage(store.user.role, store.user.session);
            reset();
        } catch (e: AxiosError | any) {
            if (e?.response?.status === 401) {
                setError('root', {
                    type: 'manual',
                    message: 'Ошибка неправильных данных при логине',
                });
            } else if (e?.request) {
                setError('root', {
                    type: 'manual',
                    message: 'Запрос был выполнен, но не получен ответ',
                });
            } else {
                console.log(1);
            }
        }
    };

    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="formAuth">
            <h2 className="formAuth__welcome">Добро пожаловать</h2>
            <h1 className="formAuth__title">Вход</h1>
            <label className="formAuth__label">
                <p className="formAuth__label-text">Введите логин</p>
                <input
                    {...register('username')}
                    className="formAuth__input formAuth__input_login"
                    placeholder="Username or email address"
                    type="text"
                />
                {errors.username && (
                    <p className="formAuth__input-error">{`${errors.username.message}`}</p>
                )}
            </label>
            <label className="formAuth__label">
                <p className="formAuth__label-text">Введите пароль</p>
                <div className="formAuth__password-container">
                    <input
                        {...register('password')}
                        className="formAuth__input formAuth__input_password"
                        placeholder="Password"
                        type={passwordShown ? 'text' : 'password'}
                    />
                    {passwordShown ? (
                        <VisibilityOffIcon
                            onClick={togglePasswordVisiblity}
                            aria-label="Hide password"
                            className="formAuth__password-icon"
                        />
                    ) : (
                        <VisibilityIcon
                            onClick={togglePasswordVisiblity}
                            aria-label="Show password"
                            className="formAuth__password-icon"
                        />
                    )}
                </div>
                <p className="formAuth__input-error">{errors.password ? errors.password.message : ''}</p>
            </label>
            <p className="formAuth__error">{errors.root?.message}</p>
            <button
                disabled={!isValid || isSubmitting}
                className="formAuth__btn"
            >
                {isSubmitting ? 'Ожидание ответа' : 'Войти'}
            </button>
        </form>
    );
};

export default observer(LoginForm);
