import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import main, { StoreContext } from './store';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
);

root.render(
    <React.StrictMode>
        <StoreContext.Provider value={{ main }}>
            <BrowserRouter>
                <SnackbarProvider>
                    <App />
                </SnackbarProvider>
            </BrowserRouter>
        </StoreContext.Provider>
    </React.StrictMode>,
);
