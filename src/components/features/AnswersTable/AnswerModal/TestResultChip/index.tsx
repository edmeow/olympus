import React from "react";
import { cn } from "@bem-react/classname";
import { Typography } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import "./styles.scss";

interface TestResultChipProps {
  pass: boolean;
}

const cnTestResultChip = cn("TestResultChip");

const TestResultChip = ({ pass }: TestResultChipProps) => {
  return (
    <div className={cnTestResultChip({ status: pass ? "success" : "failed" })}>
      {pass ? <CheckIcon fontSize="inherit" /> : <CloseIcon fontSize="inherit" />}
      <Typography variant="caption">
        {pass ? "Success" : "Failed"}
      </Typography>
    </div>
  );
};

export default TestResultChip;
