import ParticipantService from "../../../services/ParticipantService";
import { useQuery } from "@tanstack/react-query";
import { CircularProgress } from "@mui/material";
import RatingTable from "../../ui/RatingTable";
import { getRowsByUserGroup } from "./utils";

interface UserResultsProps {
  userGroup: string;
}

const UserResults = ({ userGroup }: UserResultsProps) => {
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
      />
    </div>
  );
};

export default UserResults;
