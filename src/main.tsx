import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import main, { StoreContext } from "./store";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import queryClient from "./query-client";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

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
