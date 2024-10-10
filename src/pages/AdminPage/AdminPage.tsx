import { FC, useContext, useState } from 'react';
import './AdminPage.scss';
import AdminContests from '../../components/Admin/AdminContests/AdminContests';
const AdminPage: FC = () => {
    return (
        <div className="admin-page">
            <AdminContests />
        </div>
    );
};

export default AdminPage;
