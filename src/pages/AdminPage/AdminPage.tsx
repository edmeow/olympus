import { FC } from 'react';
import AdminContests from '../../components/Admin/AdminContests/AdminContests';
import './AdminPage.scss';
const AdminPage: FC = () => {
    return (
        <div className="admin-page">
            <AdminContests />
        </div>
    );
};

export default AdminPage;
