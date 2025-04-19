import AdminService from "../../../services/AdminService";
import RatingTable from "../../../components/ui/RatingTable";
import { useQuery } from "@tanstack/react-query";
import { Chip, CircularProgress, Stack } from "@mui/material";
import { getRowsByGroup, getUniqueGroups } from "./utils";
import { useEffect, useMemo, useState } from "react";

interface AdminResultsProps {
  contestId: number;
}

const AdminResults = ({ contestId }: AdminResultsProps) => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const { data: rating, isLoading } = useQuery({
    queryKey: ["rating"],
    queryFn: () => AdminService.getUserResults(contestId),
    refetchInterval: 30000,
  });

  const groups = useMemo(() => getUniqueGroups(rating?.data), [rating]);

  useEffect(() => {
    if (selectedGroup === null && groups.length > 0) {
      setSelectedGroup(groups[0]);
    }
  }, [groups]);

  if (isLoading) return <CircularProgress />;

  return (
    <div>
      {groups.length > 0 && (
        <Stack direction="row" mb={1} spacing={1}>
          {groups.map((group) => (
            <Chip
              key={group}
              label={group}
              variant={selectedGroup === group ? "filled" : "outlined"}
              clickable
              onClick={() => setSelectedGroup(group)}
            />
          ))}
        </Stack>
      )}
      <RatingTable
        rows={getRowsByGroup(rating?.data, selectedGroup)}
        taskCount={rating?.data?.tasksCount || 0}
      />
    </div>
  );
};

export default AdminResults;
