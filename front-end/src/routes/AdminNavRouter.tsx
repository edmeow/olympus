import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router-dom';
import AdminNav from '../components/Admin/AdminNav/AdminNav';

const AdminNavRouter: FC = observer(() => {
    return (
        <>
            <AdminNav />
            <Outlet />
        </>
    );
});
export default AdminNavRouter;
