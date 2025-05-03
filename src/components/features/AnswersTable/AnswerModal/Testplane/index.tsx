import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  Fade,
  Typography,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import BackButton from "../BackButton";
import JudgeService from "../../../../../services/JudgeService";
import { TestplaneProps } from "./interfaces";
import "./styles.scss";
import { cn } from "@bem-react/classname";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { ITestResult } from "../../../../../models/ITestResult";
import TestResultChip from "../TestResultChip";

const cnTestplane = cn("Testplane");

const getAverageResult = (results: ITestResult[], maxPoints: number) => {
  const passedTests = results.filter((result) => result.pass).length;
  return Math.round((passedTests / results.length) * maxPoints);
};

const Testplane = ({ answerId, maxPointsForTask, onBack }: TestplaneProps) => {
  const {
    data: testResult,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["test", answerId],
    queryFn: () => JudgeService.runTest(answerId),
  });

  const status = testResult?.data.status;

  useEffect(() => {
    if (testResult && testResult.data.status === "pending") {
      const timeout = setTimeout(refetch, 5000);
      return () => clearTimeout(timeout);
    }
  }, [testResult]);

  if (isLoading) return <CircularProgress />;

  return (
    <Fade in>
      <div className={cnTestplane()}>
        <BackButton label="Назад" onClick={onBack} />
        <Box height="8px" />
        {status === "pending" && (
          <Box>
            <CircularProgress size="16px" thickness={5} />
            <Typography
              component="span"
              variant="h6"
              ml={1}
              color="primary.main"
            >
              Прогоняем тесты
            </Typography>
          </Box>
        )}
        {testResult && status === "resolved" && (
          <Typography variant="h6">
            Предварительный результат:{" "}
            <span style={{ color: "#F7931A" }}>
              {getAverageResult(testResult.data.results, maxPointsForTask)}/
              {maxPointsForTask}
            </span>
          </Typography>
        )}
        <Box pb={12}>
          {testResult?.data.results.map((result) => (
            <div
              key={result.id}
              className={cnTestplane("Test", {
                variant: result.pass ? "success" : "failed",
              })}
            >
              {result.message ? (
                <Accordion elevation={0}>
                  <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                    <TestResultChip pass={result.pass} /> {result.title}
                  </AccordionSummary>

                  <AccordionDetails>
                    <Typography>{result.message}</Typography>
                  </AccordionDetails>
                </Accordion>
              ) : (
                <Box padding="12px 16px">
                  <TestResultChip pass={result.pass} />
                  {result.title}
                </Box>
              )}
            </div>
          ))}
        </Box>
      </div>
    </Fade>
  );
};

export default Testplane;
