import React, { FC, useContext, useEffect } from 'react';
import './App.css';
import RoutesPack from './routes';
import { observer } from 'mobx-react-lite';
import { Context } from '.';
import AuthService from './services/AuthService';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

const App: FC = observer(() => {
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
                    } else {
                        history('/login');
                    }
                })
                .catch((err: AxiosError) => {
                    if (err.response?.status === 401) {
                        localStorage.removeItem('jwt');
                    } else {
                        console.log('Error ' + err.message);
                    }
                });
        }
    }, []);

    return (
        <div className="App">
            <RoutesPack />
        </div>
    );
});

export default App;
