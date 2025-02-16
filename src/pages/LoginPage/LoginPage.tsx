// import { useEffect, useState } from 'react';
import LoginForm from './LoginForm/LoginForm';
// import AuthService from '../../services/AuthService';
// import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.scss';
import Logo from '../../utils/icons/logo.svg';
import LoginBack from '../../utils/icons/login-form-bg-Image.png';
// import { useStore } from '../../hooks/useStore';

function LoginPage() {
    // const { main } = useStore();
    // const [loading, setLoading] = useState(true);

    const history = useNavigate();
    // const redirectToPage = (role: string, session: string) => {
    //     switch (role) {
    //         case 'ROLE_PARTICIPANT':
    //             history(`/session/${session}`);
    //             break;
    //         case 'ROLE_JUDGE':
    //             history(`/judge/${session}`);
    //             break;
    //         case 'ROLE_ADMIN':
    //             history(`/admin`);
    //             break;
    //         default:
    //             break;
    //     }
    // };
    // useEffect(() => {
    //     const jwt = localStorage.getItem('jwt');
    //     if (jwt) {
    //         AuthService.checkJWT()
    //             .then((response) => {
    //                 if (response.data.accessToken) {
    //                     const { accessToken, ...data } = response.data;
    //                     main.setUser(data);
    //                     main.setAuth(true);
    //                     redirectToPage(data.role, data.session);
    //                 }
    //             })
    //             .catch((err: AxiosError) => {
    //                 if (err.response?.status === 401) {
    //                     localStorage.removeItem('jwt');
    //                 } else {
    //                     console.log('Error ' + err.message);
    //                 }
    //             })
    //             .finally(() => setLoading(false));
    //     } else {
    //         setLoading(false);
    //     }
    // }, []);

    // if (loading) {
    //     return null;
    // }

    return (
        <div className="form-container">
            <img
                src={Logo}
                alt="Логотип платформы"
                className="form-container__logo"
            />
            <LoginForm />
            <img
                src={LoginBack}
                alt="Фоновое изображение"
                className="form-container__back"
            />
        </div>
    );
}

export default LoginPage;
