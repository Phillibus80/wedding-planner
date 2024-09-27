/* eslint react/prop-types: 0 */

import {createContext, useState} from "react";

export const AdminSectionContext = createContext({});

export const AdminSectionMessengerProvider = ({children}) => {
    const [errors, setErrors] = useState({
        hasErrors: false,
        errorMessage: ''
    });

    const [info, setInfo] = useState({
        hasInfo: false,
        infoMessage: ''
    });

    return (
        <AdminSectionContext.Provider value={{errors, setErrors, info, setInfo}}>
            {children}
        </AdminSectionContext.Provider>
    );
};