import './App.scss';
import {Route, Routes} from 'react-router-dom';

import CustomToast from "./components/toast/CustomToast.jsx";
import {ROUTE_CONST} from './constants.js';
import Admin from "./routes/admin/Admin.jsx";
import ContactUs from './routes/contact-us/contact-us.jsx';
import "@fontsource/roboto";
import "@fontsource/marcellus";
import "@fontsource/noto-sans";
import DestinationQuestions from "./routes/destination-questionnaire/DestinationQuestions.jsx";
import {Home} from './routes/home/Home.jsx';
import Login from "./routes/login/Login.jsx";
import NotFound from './routes/not-found/NotFound.jsx';
import Questions from "./routes/questions/Questions.jsx";

const App = () => (
    <>
        <CustomToast/>
        <Routes>
            <Route index exact path={ROUTE_CONST.HOME} element={<Home/>}/>
            <Route path={ROUTE_CONST.CONTACT_US_ROUTE} element={<ContactUs/>}/>
            <Route path={ROUTE_CONST.LOGIN} element={<Login/>}/>
            <Route path={ROUTE_CONST.ADMIN} element={<Admin/>}/>
            <Route path={ROUTE_CONST.WEDDING_QS} element={<Questions page={ROUTE_CONST.WEDDING_QS}/>}/>
            <Route path={ROUTE_CONST.DESTIN_WEDDING_QS}
                   element={<DestinationQuestions page={ROUTE_CONST.DESTIN_WEDDING_QS}/>}/>
            <Route path={'*'} element={<NotFound/>}/>
        </Routes>
    </>
);

export default App
