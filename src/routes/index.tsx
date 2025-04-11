import { Route, Routes } from "react-router-dom";
import UserPage from "../pages/UserPage/UserPage";
import JudgePage from "../pages/JudgePage/JudgePage";
import AdminPage from "../pages/AdminPage/AdminPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import ForbiddenPage from "../pages/ForbiddenPage";
import ProtectedRoute from "./ProtectedRoute";
import { observer } from "mobx-react-lite";
import ProtectedRouteAuth from "./ProtectedRouteAuth";
import AdminContestPage from "../pages/AdminContestPage/AdminContestPage";
import AdminNavRouter from "./AdminNavRouter";
import SetNamePage from "../pages/SetNamePage/SetNamePage";
import routes from "../config/routes";
import NavigateByPole from "./NavigateByPole";

const RoutesPack = () => {
  return (
    <Routes>
      <Route path={routes.login} element={<LoginPage />} />
      <Route path="/forbidden" element={<ForbiddenPage />} />
      <Route element={<ProtectedRouteAuth />}>
        <Route
          element={
            <ProtectedRoute
              protectedRole="ROLE_PARTICIPANT"
              redirectPath="/forbidden"
            ></ProtectedRoute>
          }
        >
          <Route path={`/add-personal-data`} element={<SetNamePage />} />
          <Route element={<AdminNavRouter type={"user"} />}>
            <Route path={`/participant`} element={<UserPage />} />
          </Route>
        </Route>

        <Route
          element={
            <ProtectedRoute
              protectedRole="ROLE_JUDGE"
              redirectPath="/forbidden"
            ></ProtectedRoute>
          }
        >
          <Route element={<AdminNavRouter type={"judge"} />}>
            <Route path={`/judge`} element={<JudgePage />} />
          </Route>
        </Route>

        <Route
          element={
            <ProtectedRoute
              protectedRole="ROLE_ADMIN"
              redirectPath="/forbidden"
            ></ProtectedRoute>
          }
        >
          <Route element={<AdminNavRouter />}>
            <Route path="/admin" element={<AdminPage />} />
            <Route
              path="/admin/contest/:contestId"
              element={<AdminContestPage />}
            />
          </Route>
        </Route>
        <Route path="*" element={<NavigateByPole />} />
      </Route>
    </Routes>
  );
};

export default observer(RoutesPack);
