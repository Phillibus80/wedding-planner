import {useContext} from "react";
import {Toast, ToastContainer} from "react-bootstrap";

import {AdminSectionContext} from "../../context/adminSectionContext/AdminSectionContext.jsx";

const CustomToast = (errorCallBack, infoCallBack) => {
    const {errors, setErrors, info, setInfo} = useContext(AdminSectionContext);

    return (
        <ToastContainer position='bottom-end' className="p-5 position-fixed" style={{zIndex: 11}}>
            <Toast
                bg='danger'
                onClose={
                    () => {
                        setErrors({
                            hasErrors: false,
                            errorMessage: ''
                        });

                        (typeof errorCallBack === "function" && errorCallBack());
                    }
                }
                show={errors.hasErrors}
                delay={3000}
                autohide
            >
                <Toast.Body
                    style={{
                        color: 'white',
                        fontWeight: 'bold'
                    }}>
                    {errors?.errorMessage}
                </Toast.Body>
            </Toast>

            <Toast
                bg='primary'
                onClose={
                    () => {
                        setInfo({
                            hasInfo: false,
                            infoMessage: ''
                        });

                        (typeof infoCallBack === 'function' && infoCallBack());
                    }
                }
                show={info.hasInfo}
                delay={3000}
                autohide
            >
                <Toast.Body style={{
                    color: 'white',
                    fontWeight: 'bold'
                }}>
                    {info?.infoMessage}
                </Toast.Body>
            </Toast>
        </ToastContainer>
    );
}

export default CustomToast;