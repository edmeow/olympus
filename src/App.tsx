import { AxiosError } from "axios";
import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.scss";
import RoutesPack from "./routes";
import AuthService from "./services/AuthService";
import { useStore } from "./hooks/useStore";
import routes from "./config/routes";
import { CircularProgress } from "@mui/material";

const App: FC = observer(() => {
  const { main } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const checkJWT = async () => {
    const jwt = localStorage.getItem("jwt");

    if (jwt) {
      try {
        const response = await AuthService.checkJWT();
        if (response.data.accessToken) {
          const { accessToken, ...data } = response.data;
          main.setUser(data);
          main.setAuth(true);
        }
      } catch (err) {
        const status = (err as AxiosError)?.response?.status;
        if (status === 401 || status === 403) {
          localStorage.removeItem("jwt");
          navigate(routes.login);
        } else {
          console.log("Error " + (err as AxiosError).message);
        }
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    checkJWT();
  }, []);

  if (loading)
    return (
      <div className="loader-container">
        <CircularProgress />
      </div>
    );

  return (
    <div className="App">
      <RoutesPack />
    </div>
  );
});

export default App;
