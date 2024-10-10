import { FC, useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Context } from '..';
import { observer } from 'mobx-react-lite';

interface ProtectedRouteProps {
    redirectPath: string;
    protectedRole: string;
}

const ProtectedRoute: FC<ProtectedRouteProps> = observer(
    ({ redirectPath, protectedRole }) => {
        const { store } = useContext(Context);
        if (store.user.role !== protectedRole) {
            return <Navigate to={redirectPath} />;
        }
        return <Outlet />;
    },
);
export default ProtectedRoute;
