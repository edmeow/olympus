import { FC, useContext, useState } from 'react';
import './AdminPage.scss';
import AdminContests from '../../components/Admin/AdminContests/AdminContests';
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
