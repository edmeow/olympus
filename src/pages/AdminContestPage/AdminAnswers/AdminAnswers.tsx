import AdminService from "../../../services/AdminService";
import { useQuery } from "@tanstack/react-query";
import AnswersTable from "../../../components/features/AnswersTable";
import { CircularProgress } from "@mui/material";

interface AdminAnswersProps {
  contestId: number;
}

const AdminAnswers = ({ contestId }: AdminAnswersProps) => {
  const { data: userAnswser, isLoading } = useQuery({
    queryKey: ["user-answers"],
    queryFn: () => AdminService.getUserAnswers(contestId),
    refetchInterval: 30000,
  });

  if (isLoading) return <CircularProgress />;

  return (
    <div>
      <AnswersTable rows={userAnswser?.data} />
    </div>
  );
};

export default AdminAnswers;
