import JudgeService from "../../../services/JudgeService";
import AnswersTable from "../../../components/features/AnswersTable";
import { useQuery } from "@tanstack/react-query";
import { CircularProgress } from "@mui/material";

const JudgeAnswers = () => {
  const { data: userAnswser, isLoading } = useQuery({
    queryKey: ["user-answers"],
    queryFn: JudgeService.getUserAnswersTable,
    refetchInterval: 30000,
  });

  if (isLoading) return <CircularProgress />;

  return (
    <div>
      <AnswersTable rows={userAnswser?.data} />
    </div>
  );
};

export default JudgeAnswers;
