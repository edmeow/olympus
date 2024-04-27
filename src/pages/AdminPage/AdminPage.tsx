import { FC, useContext, useState } from 'react';
import './AdminPage.scss';
import { Context } from '../..';
import { useNavigate } from 'react-router-dom';
import AdminForm from '../../components/Admin/AdminForm/AdminForm';
import AdminContests from '../../components/Admin/AdminContests/AdminContests';
type ViewType = 'form' | 'list';
const AdminPage: FC = () => {
    const [view, setView] = useState<ViewType>('list');
    const { store } = useContext(Context);
    const history = useNavigate();
    return (
        <div className="adminPage">
            <div className="adminPage_header">
                <div className="adminPage_buttons">
                    <button
                        className="button adminPage_contests"
                        onClick={() => {
                            setView('list');
                        }}
                    >
                        Олимпиады
                    </button>
                    <button
                        onClick={() => {
                            setView('form');
                        }}
                        className="button adminPage_createContest"
                    >
                        Создать олимпиаду
                    </button>
                </div>
                <div className="adminPage_data">
                    <h3 className="adminPage_userName">
                        {store.user.username}
                    </h3>
                    <button
                        onClick={() => {
                            try {
                                store.logout();
                                localStorage.removeItem('jwt');
                                history('/login');
                            } catch (error) {
                                console.log(error);
                            }
                        }}
                        className="button adminPage_logout"
                    >
                        Выйти
                    </button>
                </div>
            </div>
            <div className="adminPage_content">
                {view === 'form' && <AdminForm setView={setView} />}
                {view === 'list' && <AdminContests />}
            </div>
        </div>
    );
};

export default AdminPage;
