import React, { useContext, useState } from 'react';
import { Context } from '../..';
import { useNavigate } from 'react-router-dom';
import Button from '../UI/Button/Button';

interface AdminNavProps {}
type selectedNavType = 'contests' | 'create-contest';
const AdminNav: React.FC<AdminNavProps> = () => {
    const { store } = useContext(Context);
    const [selectedNav, setSelectedNav] = useState<selectedNavType>('contests');
    const history = useNavigate();
    return (
        <div className="adminPage_header">
            <div className="adminPage_buttons">
                <Button
                    className={selectedNav === 'contests' ? 'checked' : ''}
                    label="Олимпиады"
                    onClick={() => {
                        setSelectedNav('contests');
                        history('/admin');
                    }}
                ></Button>
                <Button
                    className={
                        selectedNav === 'create-contest' ? 'checked' : ''
                    }
                    label="Создать олимпиаду"
                    onClick={() => {
                        setSelectedNav('create-contest');
                        history('/admin/create-contest');
                    }}
                ></Button>
            </div>
            <div className="adminPage_data">
                <h3 className="adminPage_userName">{store.user.username}</h3>
                <Button
                    onClick={() => {
                        try {
                            store.logout();
                            localStorage.removeItem('jwt');
                            history('/login');
                        } catch (error) {
                            console.log(error);
                        }
                    }}
                    label="Выйти"
                ></Button>
            </div>
        </div>
    );
};

export default AdminNav;
