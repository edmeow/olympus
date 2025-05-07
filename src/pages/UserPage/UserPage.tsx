import { useNavigate } from "react-router-dom";
import ParticipantService from "../../services/ParticipantService";
import UserPageContent from "./UserPageContent/UserPageContent";
import "./UserPage.scss";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";
import { useQuery } from "@tanstack/react-query";
import { Alert, CircularProgress } from "@mui/material";
import { isUserHasNotPersonalData } from "./utils";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";

const UserPage = () => {
  const { main } = useStore();
  const navigate = useNavigate();
  // NOTE: this hook is need here because react-query reset error after the refetch
  //       and it causes the interface to flash
  const [contestNotStarted, setContestNotStarted] = useState(false);

  const {
    error,
    isPending,
    isError,
    refetch: refetchContest,
  } = useQuery({
    queryKey: ["user-contest"],
    queryFn: async () => {
      const res = await ParticipantService.getContest();
      main.setContest(res.data);
      main.setSelectedViewContent("tasks");
      setContestNotStarted(false);
      return res;
    },
  });

  useEffect(() => {
    if (isUserHasNotPersonalData(main.user)) {
      navigate("/add-personal-data");
    }
  }, [main.user]);

  useEffect(() => {
    const interval = setInterval(() => {
      if ((error as AxiosError)?.status === 423) {
        setContestNotStarted(true);
        refetchContest();
      } else {
        clearInterval(interval);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [error]);

  if (contestNotStarted || (error as AxiosError)?.status === 423)
    return <Alert severity="info">Олимпиада ещё не начата</Alert>;

  if ((error as AxiosError)?.status === 403)
    return <Alert severity="info">Олимпиада завершена</Alert>;

  if (isError)
    return (
      <Alert severity="error">
        Что-то пошло не так. Сообщите о проблеме организатору
      </Alert>
    );

  if (isPending) return <CircularProgress />;

  return (
    <div className="userPage">
      <UserPageContent />
    </div>
  );
};

export default observer(UserPage);
