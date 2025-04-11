import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(57, 135, 253)",
    },
    background: {
      default: "rgb(255, 255, 255)",
    }
  },
  typography: {
    fontFamily: "'Manrope', sans-serif",
  },
});

export default theme;
