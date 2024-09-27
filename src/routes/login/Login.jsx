import {ErrorMessage, Field, Form, Formik} from 'formik';
import {useContext, useEffect} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import {useNavigate} from 'react-router-dom';
import * as Yup from 'yup';

import LoadingSpinner from '../../components/loadingSpinner/LoadingSpinner.jsx';
import {ROUTE_CONST} from "../../constants.js";
import {AdminSectionContext} from "../../context/adminSectionContext/AdminSectionContext.jsx";
import {useGetUserByName, useLogin} from '../../hooks/api-hooks.js';
import {decodeJWT} from "../../utils/utils.jsx";


import styles from './Login.module.scss';

const Login = () => {
    const {setErrors} = useContext(AdminSectionContext);

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
        <Container className={styles.login}>
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
                        <Row className={styles.container_section}>
                            <Col
                                className='gap-0'
                                sm={12}
                                md={6}
                            >
                                <label
                                    htmlFor='user_name'
                                    id='user_name_label'
                                >
                                    Username:
                                </label>

                                <Row className={styles.questions_form_section}>
                                    <Field
                                        type='input'
                                        id='user_name'
                                        name='user_name'
                                        placholder='username'
                                        className={styles.questions_form_section_input}
                                        aria-labelledby='user_name'
                                    />
                                    <ErrorMessage
                                        name='user_name'
                                        className={styles.error_message}
                                        component='div'
                                    />
                                </Row>
                            </Col>


                            <Col
                                className='gap-0'
                                sm={12}
                                md={6}
                            >
                                <label
                                    htmlFor='password'
                                    id='password_label'
                                >
                                    Password:
                                </label>

                                <Row className={styles.questions_form_section}>
                                    <Field
                                        type='password'
                                        id='password'
                                        name='password'
                                        placholder='password'
                                        className={styles.questions_form_section_input}
                                        aria-labelledby='password'
                                    />
                                    <ErrorMessage
                                        name='password'
                                        className={styles.error_message}
                                        component='div'
                                    />
                                </Row>
                            </Col>
                        </Row>

                        <Row>
                            <Col className='gap-1' sm={{span: 6, offset: 3}}>
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
                            </Col>
                        </Row>
                    </Form>
                )}
            </Formik>
        </Container>
    );
};

export default Login;