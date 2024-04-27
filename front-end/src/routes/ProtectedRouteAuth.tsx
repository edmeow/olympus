import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Context } from '..';
import { observer } from 'mobx-react-lite';

const ProtectedRouteAuth = observer(() => {
    const { store } = useContext(Context);

    if (store.isAuth) {
        return <Outlet />;
    }
    return <Navigate to="/login" />;
});

export default ProtectedRouteAuth;
