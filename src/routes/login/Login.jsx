import styles from './Login.module.scss';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import LoadingSpinner from '../../components/loadingSpinner/LoadingSpinner.jsx';
import React, {useEffect, useState} from 'react';
import * as Yup from 'yup';
import {useGetUserByName, useLogin} from '../../hooks/api-hooks.js';
import {useNavigate} from 'react-router-dom';
import {createPortal} from "react-dom";
import ErrorModal from "../../components/modals/error/ErrorModal.jsx";
import {decodeJWT} from "../../utils/utils.jsx";
import {ROUTE_CONST} from "../../constants.js";

const Login = () => {
    const [errors, setErrors] = useState({
        hasErrors: false,
        errorMessage: ''
    });

    const errorModal = (
        createPortal(<ErrorModal
                message={errors.errorMessage}
                onClose={() => setErrors({
                    hasErrors: false,
                    errorMessage: ''
                })}
            />,
            document.body
        )
    );

    const initValues = {
        user_name: '',
        password: ''
    };

    const loginSchema = Yup.object().shape({
        user_name: Yup.string()
            .max(50, 'Please keep your name to only 50 characters.')
            .required('User name is required.'),
        password: Yup.string()
            .max(50, 'Please keep your password to only 50 characters.')
            .required('Password is required.')
    });

    // Hooks
    const navigate = useNavigate();
    const {
        mutateAsync: loginMutate,
        data: loginData,
        isSuccess: loginSuccess
    } = useLogin(setErrors);

    let userName, token = '';
    if (loginSuccess) {
        token = loginData?.data?.token;
        const {
            user: {
                username
            }
        } = decodeJWT(token);

        userName = username;
    }

    const {isSuccess: userSuccess} = useGetUserByName(userName, token);

    useEffect(() => {
        userSuccess && navigate(ROUTE_CONST.ADMIN);
    }, [userSuccess]);

    const submitLoginForm = async values => loginMutate(values);

    return (
        <>
            {errors.hasErrors && errorModal}
            <div className={styles.login}>
                <h1>
                    Login Screen
                </h1>
                <Formik
                    initialValues={initValues}
                    onSubmit={submitLoginForm}
                    validationSchema={loginSchema}
                >
                    {({isSubmitting, isValid}) => (
                        <Form className={styles.login_form}>
                            <div className={styles.container}>
                                <div className={styles.field_container}>
                                    <label
                                        htmlFor='user_name'
                                        id='user_name'
                                    >
                                        Username:
                                    </label>
                                    <Field
                                        type='input'
                                        name='user_name'
                                        placholder='username'
                                        className={styles.input_field}
                                        aria-labelledby='user_name'
                                    />
                                    <ErrorMessage
                                        name='user_name'
                                        className={styles.error_message}
                                        component='div'
                                    />
                                </div>

                                <div className={styles.field_container}>
                                    <label
                                        htmlFor='password'
                                        id='password'
                                    >
                                        Password:
                                    </label>
                                    <Field
                                        type='password'
                                        name='password'
                                        placholder='password'
                                        className={styles.input_field}
                                        aria-labelledby='password'
                                    />
                                    <ErrorMessage
                                        name='password'
                                        className={styles.error_message}
                                        component='div'
                                    />
                                </div>

                            </div>

                            <div className={styles.login_form_button_container}>
                                <button
                                    className={styles.login_form_button_container_button}
                                    type='submit'
                                    disabled={isSubmitting || !isValid}
                                    aria-label={isSubmitting || !isValid
                                        ? 'The' +
                                        ' submit button is currently disabled' +
                                        ' due to the either the form is' +
                                        ' submitting or it is invalid.'
                                        : 'The button to submit your message to the cat' +
                                        ' lady pet sitting service.'}
                                >
                                    <span>Submit</span>
                                    {
                                        isSubmitting &&
                                        <div className={styles.loading_spinner}>
                                            <LoadingSpinner
                                                role='presentation'
                                                aria-label='A loading spinner that is on the screen during the form submission.'
                                            />
                                        </div>
                                    }
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    );
};

export default Login;