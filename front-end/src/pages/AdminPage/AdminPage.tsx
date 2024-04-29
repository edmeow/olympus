import { FC, useContext, useState } from 'react';
import './AdminPage.scss';
import { Context } from '../..';
import { useNavigate } from 'react-router-dom';
import AdminForm from '../../components/Admin/AdminForm/AdminForm';
import AdminContests from '../../components/Admin/AdminContests/AdminContests';
type ViewType = 'form' | 'list';
const AdminPage: FC = () => {
    return (
        <div className="adminPage">
            <div className="adminPage_content">
                <AdminContests />
            </div>
        </div>
    );
};

export default AdminPage;
