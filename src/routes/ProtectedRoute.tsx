import { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../hooks/useStore";

interface ProtectedRouteProps {
  redirectPath: string;
  protectedRole: string;
}

const ProtectedRoute: FC<ProtectedRouteProps> = observer(
  ({ redirectPath, protectedRole }) => {
    const { main } = useStore();
    if (main.user.role !== protectedRole) {
      return <Navigate to={redirectPath} />;
    }
    return <Outlet />;
  }
);
export default ProtectedRoute;
