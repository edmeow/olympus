import { observer } from "mobx-react-lite";
import JudgeAnswers from "./JudgeAnswers/JudgeAnswers";
import JudgeResults from "./JudgeResults/JudgeResults";
import { cn } from "@bem-react/classname";
import "./JudgePage.scss";
import JudgeService from "../../services/JudgeService";
import { Alert, CircularProgress } from "@mui/material";
import { useStore } from "../../hooks/useStore";
import { useQuery } from "@tanstack/react-query";

const cnJudgePage = cn("JudgePage");

const JudgePage = observer(() => {
  const { main, answers } = useStore();

  const { isLoading, isError, error } = useQuery({
    queryKey: ["judge-contest"],
    queryFn: async () => {
      const res = await JudgeService.getContest();
      main.setContest(res.data);
      answers.setContestId(res.data.id);
      main.setSelectedViewContent("answers");
      return res;
    },
  });

  if (isLoading) return <CircularProgress />;

  if (isError)
    return (
      <Alert severity="error">Что-то пошло не так: {error?.message}</Alert>
    );

  return (
    <div className={cnJudgePage()}>
      {main.selectedViewContent === "answers" && <JudgeAnswers />}
      {main.selectedViewContent === "results" && <JudgeResults />}
    </div>
  );
});

export default JudgePage;
