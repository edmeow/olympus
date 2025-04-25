import { useNavigate } from "react-router-dom";
import ParticipantService from "../../services/ParticipantService";
import UserPageContent from "./UserPageContent/UserPageContent";
import "./UserPage.scss";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";
import { useQuery } from "@tanstack/react-query";
import { Alert, CircularProgress } from "@mui/material";
import { isUserHasNotPersonalData } from "./utils";
import { useEffect } from "react";

const UserPage = () => {
  const { main } = useStore();
  const navigate = useNavigate();

  const { isLoading, isError } = useQuery({
    queryKey: ["user-contest"],
    queryFn: async () => {
      const res = await ParticipantService.getContest();
      main.setContest(res.data);
      if (main.selectedViewContent === null) {
        main.setSelectedViewContent("tasks");
      }
      return res;
    },
  });

  useEffect(() => {
    if (isUserHasNotPersonalData(main.user)) {
      navigate("/add-personal-data");
    }
  }, [main.user]);

  if (isLoading) return <CircularProgress />;

  if (isError)
    return (
      <Alert severity="error">
        Что-то пошло не так. Сообщите о проблеме организатору
      </Alert>
    );

  return (
    <div className="userPage">
      <UserPageContent />
    </div>
  );
};

export default observer(UserPage);
