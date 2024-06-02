import React, { useContext, useState } from 'react';
import { Context } from '../../..';
import { useNavigate } from 'react-router-dom';
import './AdminNav.scss';
import logo from '../../../utils/icons/logo.svg';

interface AdminNavProps {}
const AdminNav: React.FC<AdminNavProps> = () => {
    const { store } = useContext(Context);
    const history = useNavigate();
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    function handleExit(): void {
        try {
            store.logout();
            localStorage.removeItem('jwt');
            history('/login');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="admin-nav">
            <div className="admin-nav__left">
                <img src={logo} alt="Логотип" />
                <p className="admin-nav__title">Главная</p>
            </div>
            <div
                onClick={() => setModalIsOpen((prev) => !prev)}
                className={`admin-nav__right`}
            >
                <div
                    className={`admin-nav__dropdown ${
                        modalIsOpen ? 'admin-nav__dropdown_checked' : ''
                    }`}
                >
                    <div className="admin-nav__info">
                        <div className="admin-nav__profile-icon"></div>
                        <h3 className="admin-nav__user-name">
                            {store.user.username}
                        </h3>
                        <div className="admin-nav__vector"></div>
                    </div>

                    {modalIsOpen && (
                        <div onClick={handleExit} className="admin-nav__exit">
                            <div className="admin-nav__exit-logo"></div>
                            <div className="admin-nav__exit-text">
                                Выйти из профиля
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminNav;
