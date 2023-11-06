import styles from './AdminProfile.module.scss';
import {capitalizedFirstLetter} from "../../../utils/utils.jsx";
import {useContext} from "react";
import * as Yup from "yup";
import {Field, Form, Formik} from "formik";
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner.jsx";
import {useQueryClient} from "@tanstack/react-query";
import {FETCH_KEYS, ROUTE_CONST} from "../../../constants.js";
import {useGetUserByName, useUpdateUser, useUpdateUserPassword} from "../../../hooks/api-hooks.js";
import {useNavigate} from "react-router-dom";
import {AdminSectionContext} from "../../../context/adminSectionContext/AdminSectionContext.jsx";

const AdminProfile = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {
        data: {
            data: {
                username: cachedUserName,
                token: cachedToken
            }
        }
    } = queryClient.getQueryData([FETCH_KEYS.QUERY.GET_USER_BY_USERNAME]);
    const {
        data: {
            data: {
                data: {
                    email,
                    firstName,
                    lastName,
                    username
                }
            }
        }
    } = useGetUserByName(cachedUserName, cachedToken);

    const {setErrors, setInfo} = useContext(AdminSectionContext);

    const adminProfileSchema = Yup.object().shape({
        firstName: Yup.string()
            .max(200, 'Please keep the title text to only 200 characters.')
            .required('First name is required.'),
        lastName: Yup.string()
            .max(2000, 'Please keep the text to only 2000 characters.')
            .required('Last name is required.'),
        userName: Yup.string()
            .max(2000, 'Please keep the text to only 2000 characters.')
            .required('User name is required.'),
        emailField: Yup.string()
            .max(2000, 'Please keep the text to only 2000 characters.')
            .required('Email is required.'),
        currentPasswordField: Yup.string()
            .max(2000, 'Please keep the text to only 2000 characters.'),
        newPasswordField: Yup.string()
            .max(2000, 'Please keep the text to only 2000 characters.')
    });

    const {
        mutateAsync: updateUserMutation,
        isSuccess: updateUserIsSuccess,
        isError: updateUserIsError
    } = useUpdateUser(setInfo, setErrors);
    const {
        mutateAsync: updatePassMutation
    } = useUpdateUserPassword(setInfo, setErrors, updateUserIsSuccess);

    const handleSubmit = async (values) => {
        const {
            firstName,
            lastName,
            userName,
            emailField: email,
            currentPasswordField: currentPassword,
            newPasswordField: newPassword
        } = values;

        // Update the user object
        await updateUserMutation({
            firstName,
            lastName,
            userName,
            email
        });

        if (updateUserIsError) navigate(ROUTE_CONST.LOGIN);

        // Update the user's password if they have changed it
        if (!!currentPassword && !!newPassword) {
            await updatePassMutation({
                userName,
                currentPassword,
                newPassword
            })
        }
    };

    return (
        <div className={styles.adminProfile}>
            <h2>
                Hello, {capitalizedFirstLetter(firstName)}
            </h2>

            <Formik
                validationSchema={adminProfileSchema}
                initialValues={{
                    firstName,
                    lastName,
                    userName: username,
                    emailField: email,
                    currentPasswordField: '',
                    newPasswordField: '',
                }}
                onSubmit={(e) => handleSubmit(e, 'orgSectionName')}
            >
                {({isSubmitting, isValid, errors, touched}) => (
                    <Form className={styles.adminProfile_form}>
                        <div className={styles.adminProfile_form_wrap}>
                            <div
                                className={styles.profileTitle}
                            >
                                <label
                                    htmlFor='firstName'
                                    id='firstNameLabel'
                                >
                                    First Name
                                </label>
                                <Field
                                    type='input'
                                    name='firstName'
                                    className={styles.adminProfile_form_input}
                                    aria-labelledby='firstNameLabel'
                                />
                                {errors.firstName && touched.firstName ? (
                                    <div className='u-error-text'>{errors.firstName}</div>
                                ) : null}
                            </div>

                            <div
                                className={styles.profileTitle}
                            >
                                <label
                                    htmlFor='lastName'
                                    id='lastNameLabel'
                                >
                                    Last Name
                                </label>
                                <Field
                                    type='input'
                                    name='lastName'
                                    className={styles.adminProfile_form_input}
                                    aria-labelledby='lastNameLabel'
                                />
                                {errors.lastName && touched.lastName ? (
                                    <div className='u-error-text'>{errors.lastName}</div>
                                ) : null}
                            </div>
                        </div>

                        <div className={styles.adminProfile_form_wrap}>
                            <div
                                className={styles.profileTitle}
                            >
                                <label
                                    htmlFor='userName'
                                    id='userNameLabel'
                                >
                                    Username
                                </label>
                                <Field
                                    disabled
                                    type='input'
                                    name='userName'
                                    className={styles.adminProfile_form_input}
                                    aria-labelledby='userNameLabel'
                                />
                                {errors.userName && touched.userName ? (
                                    <div className='u-error-text'>{errors.userName}</div>
                                ) : null}
                            </div>

                            <div
                                className={styles.profileTitle}
                            >
                                <label
                                    htmlFor='emailField'
                                    id='emailLabel'
                                >
                                    Email
                                </label>
                                <Field
                                    type='email'
                                    name='emailField'
                                    className={styles.adminProfile_form_input}
                                    aria-labelledby='emailLabel'
                                />
                                {errors.emailField && touched.emailField ? (
                                    <div className='u-error-text'>{errors.emailField}</div>
                                ) : null}
                            </div>
                        </div>

                        <h2>Change Password</h2>

                        <div className={styles.adminProfile_form_wrap}>
                            <div
                                className={styles.profileTitle}
                            >
                                <label
                                    htmlFor='currentPasswordField'
                                    id='passwordLabel'
                                >
                                    Current Password
                                </label>
                                <Field
                                    type='password'
                                    name='currentPasswordField'
                                    className={styles.adminProfile_form_input}
                                    aria-labelledby='passwordLabel'
                                />
                                {errors.currentPasswordField && touched.currentPasswordField ? (
                                    <div className='u-error-text'>{errors.currentPasswordField}</div>
                                ) : null}
                            </div>

                            <div
                                className={styles.profileTitle}
                            >
                                <label
                                    htmlFor='newPasswordField'
                                    id='newPasswordLabel'
                                >
                                    New Password
                                </label>
                                <Field
                                    type='password'
                                    name='newPasswordField'
                                    className={styles.adminProfile_form_input}
                                    aria-labelledby='newPasswordLabel'
                                />
                                {errors.newPasswordField && touched.newPasswordField ? (
                                    <div className='u-error-text'>{errors.newPasswordField}</div>
                                ) : null}
                            </div>
                        </div>

                        <div className={styles.adminProfile_form_button_container}>
                            <button
                                disabled={isSubmitting || !isValid}
                                className={styles.adminProfile_form_button_container_button}
                                type='submit'
                                aria-label={isSubmitting
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
    );
}

export default AdminProfile;