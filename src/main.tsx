import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import main, { StoreContext } from "./store";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <StoreContext.Provider value={{ main }}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <SnackbarProvider>
              <App />
            </SnackbarProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </StoreContext.Provider>
    </ThemeProvider>
  </React.StrictMode>
);
