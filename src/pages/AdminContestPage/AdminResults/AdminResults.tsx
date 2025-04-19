import AdminService from "../../../services/AdminService";
import RatingTable from "../../../components/ui/RatingTable";
import { useQuery } from "@tanstack/react-query";
import { CircularProgress } from "@mui/material";

interface AdminResultsProps {
  contestId: number;
}

const AdminResults = ({ contestId }: AdminResultsProps) => {
  const { data: rating, isLoading } = useQuery({
    queryKey: ["rating"],
    queryFn: () => AdminService.getUserResults(contestId),
    refetchInterval: 30000,
  });

  if (isLoading) return <CircularProgress />;

  return (
    <div>
      <RatingTable rows={rating?.data?.groups?.[0].users || []} taskCount={0} />
    </div>
  );
};

export default AdminResults;
