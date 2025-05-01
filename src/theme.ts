import { alpha, createTheme } from "@mui/material";
import { ruRU } from "@mui/x-data-grid/locales";

const theme = createTheme(
  {
    palette: {
      primary: {
        main: "rgb(57, 135, 253)",
      },
      background: {
        default: "rgb(255, 255, 255)",
      },
    },
    typography: {
      fontFamily: "'Manrope', sans-serif",
    },
    components: {
      MuiChip: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            border: "none",
            color: theme.palette.primary.main,
            borderRadius: "6px",
            transition: "opacity 0.5s",
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              opacity: 0.7,
            },
          }),
          filled: ({ theme }) => ({
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.background.default,
            "&:hover": {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.background.default,
            },
          }),
        },
      },
    },
  },
  ruRU
);

export default theme;
