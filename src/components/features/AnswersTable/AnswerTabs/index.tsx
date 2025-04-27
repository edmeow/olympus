import { Box, Paper } from "@mui/material";
import { PropsWithChildren } from "react";

// interface AnswersTabsProps extends PropsWithChildren {}

const AnswersTabs = ({ children }: PropsWithChildren) => {
  return (
    <Box position="fixed" left="0px" bottom="0px" width="100%">
      <Paper sx={{ padding: "12px 20px" }}>{children}</Paper>
    </Box>
  );
};

export default AnswersTabs;
