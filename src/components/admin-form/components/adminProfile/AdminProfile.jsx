import {useQueryClient} from "@tanstack/react-query";
import {Form, Formik} from "formik";
import {useContext} from "react";
import {Container} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import * as Yup from "yup";

import {FETCH_KEYS, ROUTE_CONST} from "../../../../constants.js";
import {AdminSectionContext} from "../../../../context/adminSectionContext/AdminSectionContext.jsx";
import {useGetUserByName, useUpdateUser, useUpdateUserPassword} from "../../../../hooks/api-hooks.js";
import {capitalizedFirstLetter} from "../../../../utils/utils.jsx";

import styles from './AdminProfile.module.scss';
import ProfileForm from "./ProfileForm.jsx";

const AdminProfile = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const queryClientData = queryClient.getQueryData([FETCH_KEYS.QUERY.GET_USER_BY_USERNAME]);
    const cachedUserName = queryClientData?.data?.data?.username;
    const cachedToken = queryClientData?.data?.data?.cachedToken;
    const userData = useGetUserByName(cachedUserName, cachedToken);
    const user_email = userData?.data?.data?.data?.email;
    const first_name = userData?.data?.data?.data?.firstName;
    const last_name = userData?.data?.data?.data?.lastName;
    const user_name = userData?.data?.data?.data?.username;

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
    const initValues = {
        firstName: first_name,
        lastName: last_name,
        userName: user_name,
        emailField: user_email,
        currentPasswordField: '',
        newPasswordField: '',
    };

    const {
        mutateAsync: updateUserMutation,
        isSuccess: updateUserIsSuccess,
        isError: updateUserIsError
    } = useUpdateUser(setInfo, setErrors);
    const {
        mutateAsync: updatePassMutation,
        onSuccess: updatePasswordSuccess
    } = useUpdateUserPassword(setInfo, setErrors, updateUserIsSuccess);

    const handleOnSubmit = async values => {
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
            userName: cachedUserName,
            email,
            newUsername: userName
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
        <Container className={styles.adminProfile}>
            <h2>
                Hello, {capitalizedFirstLetter(first_name)}
            </h2>

            <Formik
                validationSchema={adminProfileSchema}
                initialValues={initValues}
                onSubmit={(e) => handleOnSubmit(e, 'orgSectionName')}
            >
                {() => (
                    <Form className={styles.adminProfile_form}>
                        <ProfileForm
                            isUserUpdated={updateUserIsSuccess}
                            isUserPasswordUpdated={updatePasswordSuccess}
                        />
                    </Form>
                )}
            </Formik>
        </Container>
    )

}

export default AdminProfile;