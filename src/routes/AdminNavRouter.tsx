import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router-dom';
import AdminNav from '../components/Admin/AdminNav/AdminNav';

interface AdminNavRouterProps {
    type?: 'user' | 'judge';
}

const AdminNavRouter: FC<AdminNavRouterProps> = observer((props) => {
    return (
        <>
            <AdminNav type={props.type} />
            <Outlet />
        </>
    );
});
export default AdminNavRouter;
