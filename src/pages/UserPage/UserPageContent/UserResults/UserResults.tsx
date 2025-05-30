import { useQuery } from "@tanstack/react-query";
import { CircularProgress } from "@mui/material";
import { getRowsByUserGroup } from "./utils";
import ParticipantService from "../../../../services/ParticipantService";
import RatingTable from "../../../../components/ui/RatingTable";

interface UserResultsProps {
  userId: number;
  userGroup: string;
}

const UserResults = ({ userId, userGroup }: UserResultsProps) => {
  const { data: rating, isLoading } = useQuery({
    queryKey: ["user-rating"],
    queryFn: () => ParticipantService.getUserResults(),
    refetchInterval: 90000,
  });

  if (isLoading) return <CircularProgress />;

  return (
    <div>
      <RatingTable
        rows={getRowsByUserGroup(rating?.data, userGroup)}
        taskCount={rating?.data?.tasksCount || 0}
        highligthRowByUserId={userId}
      />
    </div>
  );
};

export default UserResults;
