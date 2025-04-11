import { observer } from "mobx-react-lite";
import { Navigate, Outlet } from "react-router-dom";
import { useStore } from "../hooks/useStore";

const NavigateByPole = observer(() => {
  const { main } = useStore();

  if (main.user.role === "ROLE_ADMIN") {
    return <Navigate to="/admin" />;
  }

  if (main.user.role === "ROLE_JUDGE") {
    return <Navigate to="/judge" />;
  }

  if (main.user.role === "ROLE_PARTICIPANT") {
    return <Navigate to="/participant" />;
  }

  return <Outlet />;
});
export default NavigateByPole;
