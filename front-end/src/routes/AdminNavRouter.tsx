import { FC, useContext } from 'react';

import { observer } from 'mobx-react-lite';
import { Outlet, useNavigate } from 'react-router-dom';
import { Context } from '..';

const AdminNavRouter: FC = observer(() => {
    const { store } = useContext(Context);
    const history = useNavigate();
    return (
        <>
            <div className="adminPage_header">
                <div className="adminPage_buttons">
                    <button
                        className="button adminPage_contests"
                        onClick={() => {
                            history('/admin');
                        }}
                    >
                        Олимпиады
                    </button>
                    <button
                        onClick={() => {
                            history('/admin/create-contest');
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
            <Outlet />
        </>
    );
});
export default AdminNavRouter;
