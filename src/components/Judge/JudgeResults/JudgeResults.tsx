import React, { useEffect } from "react";
import JudgeService from "../../../services/JudgeService";
import { observer } from "mobx-react-lite";
import ResultsTable from "../../UI/ResultsTable/ResultsTable";
import { useStore } from "../../../hooks/useStore";

const JudgeResults: React.FC = observer(() => {
  const { main } = useStore();

  const getUserResults = async () => {
    await JudgeService.getUserResults().then((res) => {
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

export default JudgeResults;
