import {ErrorMessage, Field, Form, Formik} from 'formik';
import {useContext} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import * as Yup from 'yup';

import LoadingSpinner from '../../components/loadingSpinner/LoadingSpinner.jsx';
import CustomToast from "../../components/toast/CustomToast.jsx";
import {AdminSectionContext} from "../../context/adminSectionContext/AdminSectionContext.jsx";
import {useSendEmailMutation} from "../../hooks/api-hooks.js";

import styles from './contact-us.module.scss';


const ContactUs = () => {
    const {setErrors, setInfo} = useContext(AdminSectionContext);

    const sendEmail = useSendEmailMutation(setErrors, setInfo);
    const navigate = useNavigate();

    const initValues = {
        client_name: '',
        email: '',
        client_message: ''
    };

    const contactUsSchema = Yup.object().shape({
        client_name: Yup.string()
            .max(50, 'Please keep your name to only 50 characters.')
            .required('Please enter your name.'),
        email: Yup.string()
            .email('Please enter a valid email.')
            .required('Email field is required.'),
        client_message: Yup.string()
            .max(500, 'Please keep your novel to only 500 characters.')
            .min(10, 'Please give us a little more.')
            .required('Please let us know how we can help.')
    });

    return (
        <>
            <CustomToast
                errorCallBack={() => navigate('/')}
                infoCallBack={() => navigate('/')}
            />

            <Container className={styles.contact_us}>
                <h1>Contact Us</h1>

                <Formik
                    initialValues={initValues}
                    onSubmit={e => sendEmail.mutate(e)}
                    validationSchema={contactUsSchema}
                >
                    {({isSubmitting, isValid}) => (
                        <Form className={styles.contact_form}>
                            <Row className={styles.contact_form_row}>
                                <Col
                                    className='gap-0'
                                    sm={12}
                                    md={6}
                                >
                                    <label htmlFor='client_name' id='client_name'>
                                        Name:
                                    </label>

                                    <Row className={styles.questions_form_section}>
                                        <Field
                                            type='input'
                                            name='client_name'
                                            placholder='Your name'
                                            className={styles.questions_form_section_input}
                                            aria-labelledby='client_name'
                                        />
                                        <ErrorMessage
                                            name='client_name'
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
                                        htmlFor='email'
                                        id='email'
                                    >
                                        Email:
                                    </label>

                                    <Row className={styles.questions_form_section}>
                                        <Field
                                            type='email'
                                            name='email'
                                            placeholder='somewhere@someplace.com'
                                            className={styles.questions_form_section_input}
                                            aria-labelledby='email'
                                        />
                                        <ErrorMessage
                                            className={styles.error_message}
                                            name='email'
                                            component='div'
                                        />
                                    </Row>
                                </Col>
                            </Row>

                            <Row className={styles.contact_form_row}>
                                <Col sm={12}
                                     md={12}
                                     className='gap-0'
                                >
                                    <Field
                                        as='textarea'
                                        name='client_message'
                                        placeholder='What can we do for you? Let us know.'
                                        className={styles.questions_form_section_textarea}
                                        aria-label='Message area used for emailing the cat lady pet sitting service.'
                                    />
                                    <ErrorMessage
                                        className={styles.error_message}
                                        component='div'
                                        name='client_message'
                                    />
                                </Col>
                            </Row>

                            <Container className={styles.button_container}>
                                <Row>
                                    <Col className='gap-0' sm={{span: 6, offset: 3}}>
                                        <button
                                            className={styles.button_container_button}
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
                            </Container>
                        </Form>
                    )}
                </Formik>
            </Container>
        </>
    )
};

export default ContactUs;
