import React, {useState} from 'react';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import * as Yup from 'yup';
import styles from './contact-us.module.scss';
import LoadingSpinner from '../../components/loadingSpinner/LoadingSpinner.jsx';
import {createPortal} from "react-dom";
import ErrorModal from "../../components/modals/error/ErrorModal.jsx";
import InfoModal from "../../components/modals/info/InfoModal.jsx";
import {useSendEmailMutation} from "../../hooks/api-hooks.js";
import {useNavigate} from "react-router-dom";

const ContactUs = () => {
    const [errors, setErrors] = useState({
        hasErrors: false,
        errorMessage: ''
    });
    const [info, setInfo] = useState({
        hasInfo: false,
        infoMessage: ''
    });

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

    const errorModal = (
        createPortal(<ErrorModal
                message={errors.errorMessage}
                onClose={() => {
                    setErrors({
                        hasErrors: false,
                        errorMessage: ''
                    });
                    navigate('/');
                }}
            />,
            document.body
        )
    );

    const infoModal = (
        createPortal(<InfoModal
                message={info.infoMessage}
                onClose={() => {
                    setInfo({
                        hasInfo: false,
                        infoMessage: ''
                    });
                    navigate('/');
                }}
            />,
            document.body
        )
    );

    return (
        <>
            {errors.hasErrors && errorModal}
            {info.hasInfo && infoModal}

            <div className={styles.contact_us}>
                <h1>
                    Contact Us
                </h1>
                <Formik
                    initialValues={initValues}
                    onSubmit={e => sendEmail.mutate(e)}
                    validationSchema={contactUsSchema}
                >
                    {({isSubmitting, isValid}) => (
                        <Form className={styles.contact_form}>
                            <div className={styles.container}>
                                <div className={styles.field_container}>
                                    <label
                                        htmlFor='client_name'
                                        id='client_name'
                                    >
                                        Name:
                                    </label>
                                    <Field
                                        type='input'
                                        name='client_name'
                                        placholder='Your name'
                                        className={styles.input_field}
                                        aria-labelledby='client_name'
                                    />
                                    <ErrorMessage
                                        name='client_name'
                                        className={styles.error_message}
                                        component='div'
                                    />
                                </div>

                                <div className={styles.field_container}>
                                    <label
                                        htmlFor='email'
                                        id='email'
                                    >
                                        Email:
                                    </label>
                                    <Field
                                        type='email'
                                        name='email'
                                        placeholder='somewhere@someplace.com'
                                        className={styles.input_field}
                                        aria-labelledby='email'
                                    />
                                    <ErrorMessage
                                        className={styles.error_message}
                                        name='email'
                                        component='div'
                                    />
                                </div>

                            </div>

                            <div className={styles.textarea_container}>
                                <Field
                                    as='textarea'
                                    name='client_message'
                                    placeholder='What can we do for you? Let us know.'
                                    className={styles.textarea_field}
                                    aria-label='Message area used for emailing the cat lady pet sitting service.'
                                />
                                <ErrorMessage
                                    className={styles.error_message}
                                    component='div'
                                    name='client_message'
                                />
                            </div>

                            <div className={styles.contact_form_button_container}>
                                <button
                                    className={styles.contact_form_button_container_button}
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
    )
};

export default ContactUs;
