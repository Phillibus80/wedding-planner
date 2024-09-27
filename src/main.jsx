import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter as Router} from 'react-router-dom';

import App from './App'
import Navi from './components/navigation/Navi.jsx';
import {AdminSectionMessengerProvider} from "./context/adminSectionContext/AdminSectionContext.jsx";

const catClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false
        }
    }
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AdminSectionMessengerProvider>
            <QueryClientProvider client={catClient}>
                <Router>
                    <Navi/>
                    <App/>
                    <ReactQueryDevtools initialIsOpen={false}/>
                </Router>
            </QueryClientProvider>
        </AdminSectionMessengerProvider>
    </React.StrictMode>,
)
