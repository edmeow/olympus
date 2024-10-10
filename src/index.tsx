import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Store from './store/store';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

const store = new Store();
export const Context = createContext({ store });

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
);
root.render(
    <React.StrictMode>
        <Context.Provider value={{ store }}>
            <BrowserRouter>
                <SnackbarProvider>
                    <App />
                </SnackbarProvider>
            </BrowserRouter>
        </Context.Provider>
    </React.StrictMode>,
);
reportWebVitals();
