import { useEffect, useMemo, useState } from "react";
import JudgeService from "../../../services/JudgeService";
import { observer } from "mobx-react-lite";
import { useQuery } from "@tanstack/react-query";
import { Chip, CircularProgress, Stack } from "@mui/material";
import RatingTable from "../../../components/ui/RatingTable";
import { getRowsByGroup, getUniqueGroups } from "../../../utils";

const JudgeResults = observer(() => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const { data: rating, isLoading } = useQuery({
    queryKey: ["judge-rating"],
    queryFn: JudgeService.getUserResults,
    refetchInterval: 90000,
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
});

export default JudgeResults;
