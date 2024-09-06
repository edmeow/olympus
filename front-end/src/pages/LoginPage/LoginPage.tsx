import { useContext, useEffect, useState } from 'react';
import LoginForm from '../../components/LoginForm/LoginForm';
import AuthService from '../../services/AuthService';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { Context } from '../..';
import './LoginPage.scss';

function LoginPage() {
    const { store } = useContext(Context);
    const [loading, setLoading] = useState(true);

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
    useEffect(() => {
        const jwt = localStorage.getItem('jwt');
        if (jwt) {
            AuthService.checkJWT()
                .then((response) => {
                    if (response.data.accessToken) {
                        const { accessToken, ...data } = response.data;
                        store.setUser(data);
                        store.setAuth(true);
                        redirectToPage(data.role, data.session);
                    }
                })
                .catch((err: AxiosError) => {
                    if (err.response?.status === 401) {
                        localStorage.removeItem('jwt');
                    } else {
                        console.log('Error ' + err.message);
                    }
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);
    if (loading) {
        return null;
    }

    return (
        <div className="form-container">
            <div className="form-container__left">
                {/* add logo  */}
                <p style={{ padding: '32px 42px' }}>logo</p>
            </div>
            <div className="form-container__right"></div>
            <LoginForm />
        </div>
    );
}

export default LoginPage;
