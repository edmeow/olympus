import { Navigate, Route, Routes } from 'react-router-dom';
import UserPage from '../pages/UserPage/UserPage';
import JudgePage from '../pages/JudgePage';
import AdminPage from '../pages/AdminPage/AdminPage';
import LoginPage from '../pages/LoginPage';
import ForbiddenPage from '../pages/ForbiddenPage';
import ProtectedRoute from './ProtectedRoute';
import { observer } from 'mobx-react-lite';
import ProtectedRouteAuth from './ProtectedRouteAuth';
import AdminContestPage from '../pages/AdminContestPage/AdminContestPage';

const RoutesPack = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />{' '}
            {/* Маршрут для страницы входа доступен всем */}
            <Route path="/forbidden" element={<ForbiddenPage />} />{' '}
            {/* Маршрут для страницы входа доступен всем */}
            <Route element={<ProtectedRouteAuth />}>
                <Route
                    element={
                        <ProtectedRoute
                            protectedRole="ROLE_PARTICIPANT"
                            redirectPath="/forbidden"
                        ></ProtectedRoute>
                    }
                >
                    <Route
                        path={`/session/:sessionId`}
                        element={<UserPage />}
                    />
                </Route>

                <Route
                    element={
                        <ProtectedRoute
                            protectedRole="ROLE_JUDGE"
                            redirectPath="/forbidden"
                        ></ProtectedRoute>
                    }
                >
                    <Route path={`/judge/:sessionId`} element={<JudgePage />} />
                </Route>

                <Route
                    element={
                        <ProtectedRoute
                            protectedRole="ROLE_ADMIN"
                            redirectPath="/forbidden"
                        ></ProtectedRoute>
                    }
                >
                    <Route path="/admin" element={<AdminPage />} />
                    <Route
                        path="/admin/contest/:contestId"
                        element={<AdminContestPage />}
                    />
                </Route>
            </Route>
            <Route path="*" element={<Navigate to="/login"></Navigate>}></Route>
        </Routes>
    );
};

export default observer(RoutesPack);
