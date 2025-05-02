import { Box, CircularProgress, Fade, Grid, Typography } from "@mui/material";
import BackButton from "../BackButton";
import JudgeService from "../../../../../services/JudgeService";
import { TestplaneProps } from "./interfaces";
import "./styles.scss";
import { cn } from "@bem-react/classname";
import { useQuery } from "@tanstack/react-query";

const cnTestplane = cn("Testplane");

const Testplane = ({ answerId, onBack }: TestplaneProps) => {
  const { data: testResult, isLoading } = useQuery({
    queryKey: ["test", answerId],
    queryFn: () => JudgeService.runTest(answerId),
  });

  if (isLoading) return <CircularProgress />;

  return (
    <Fade in>
      <div>
        <BackButton label="Назад" onClick={onBack} />
        <Box height="8px" />
      </div>
    </Fade>
  );
};

export default Testplane;
