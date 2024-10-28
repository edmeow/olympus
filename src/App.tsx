import { AxiosError } from 'axios';
import { observer } from 'mobx-react-lite';
import { FC, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '.';
import './App.scss';
import RoutesPack from './routes';
import AuthService from './services/AuthService';

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
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
