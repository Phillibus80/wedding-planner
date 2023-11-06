import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {BrowserRouter as Router} from 'react-router-dom';
import Navi from './components/navigation/Navi.jsx';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
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
