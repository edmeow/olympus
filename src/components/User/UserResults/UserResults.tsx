import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import ResultsTable from "../../UI/ResultsTable/ResultsTable";
import ParticipantService from "../../../services/ParticipantService";
import { useStore } from "../../../hooks/useStore";

const UserResults: React.FC = observer(() => {
  const { main } = useStore();

  const getUserResults = async () => {
    await ParticipantService.getUserResults(main.user.id).then((res) => {
      if (res.data) {
        main.setUserResults(res.data);
      }
    });
  };

  useEffect(() => {
    getUserResults();
    const intervalId = setInterval(() => {
      getUserResults();
    }, 90000);
    return () => {
      clearInterval(intervalId);
      main.setUserResults({ users: [], tasksCount: 0 });
    };
  }, []);

  return (
    <div>
      <ResultsTable rows={main.userResults} />
    </div>
  );
});

export default UserResults;
