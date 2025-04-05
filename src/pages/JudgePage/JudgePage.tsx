import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import JudgeAnswers from "../../components/Judge/JudgeAnswers/JudgeAnswers";
import JudgeResults from "../../components/Judge/JudgeResults/JudgeResults";
import { cn } from "@bem-react/classname";
import "./JudgePage.scss";
import JudgeService from "../../services/JudgeService";
import { IContest } from "../../models/IContest";
import { CircularProgress } from "@mui/material";
import { useStore } from "../../hooks/useStore";
const cnJudgePage = cn("JudgePage");

const JudgePage = observer(() => {
  const { main } = useStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await JudgeService.getContest<IContest>();
        main.setContest(res.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {main.contest.contestId ? (
        <div className={cnJudgePage()}>
          {main.selectedViewContent === "answers" && <JudgeAnswers />}
          {main.selectedViewContent === "results" && <JudgeResults />}
        </div>
      ) : (
        <CircularProgress />
      )}
    </>
  );
});

export default JudgePage;
