import { Navigate, Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '../hooks/useStore';

const ProtectedRouteAuth = observer(() => {
    const { main } = useStore();

    if (main.isAuth) {
        return <Outlet />;
    }

    return <Navigate to="/login" />;
});

export default ProtectedRouteAuth;
