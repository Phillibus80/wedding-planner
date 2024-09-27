import {useQueryClient} from "@tanstack/react-query";
import {useFormikContext} from "formik";
import PropTypes from "prop-types";
import {useContext, useEffect} from "react";
import {Container, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

import {FETCH_KEYS, ROUTE_CONST} from "../../../../constants.js";
import {AdminSectionContext} from "../../../../context/adminSectionContext/AdminSectionContext.jsx";
import {useLogOut} from "../../../../hooks/api-hooks.js";
import {generateFields} from "../../../../utils/utils.jsx";
import LoadingSpinner from "../../../loadingSpinner/LoadingSpinner.jsx";

import styles from "./AdminProfile.module.scss";

const ProfileForm = ({isUserUpdated = false, isUserPasswordUpdated = false}) => {
    const {setErrors} = useContext(AdminSectionContext);
    const {
        values,
        errors,
        touched,
        isSubmitting,
        isValid,
    } = useFormikContext();
    const formikValueKeys = Object.keys(values);
    const profileKeys = formikValueKeys.filter(objKey => !objKey.toLowerCase().includes('password'));
    const passwordKeys = formikValueKeys.filter(objKey => objKey.toLowerCase().includes('password'));

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const queryClientData = queryClient.getQueryData([FETCH_KEYS.QUERY.GET_USER_BY_USERNAME]);
    const cachedUserName = queryClientData?.data?.data?.username;

    const {
        mutateAsync: logout
    } = useLogOut(setErrors);

    useEffect(() => {
        const update = async () => {
            if ((values.userName !== cachedUserName) || isUserPasswordUpdated) {
                await logout(cachedUserName);
                navigate(ROUTE_CONST.LOGIN);
            }
        }

        update();

    }, [isUserUpdated, isUserPasswordUpdated]);

    return (
        <Row>
            <Container>
                <Row>
                    {generateFields(profileKeys, touched, errors, false)}
                </Row>
            </Container>

            <h2>Change Password</h2>

            <Container>
                <Row>
                    {generateFields(passwordKeys, touched, errors, true)}
                </Row>
            </Container>

            <Container className={styles.adminProfile_form_button_container}>
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
            </Container>
        </Row>
    );
};

ProfileForm.propTypes = {
    profileKeys: PropTypes.object,
    passwordKeys: PropTypes.object,
    isUserUpdated: PropTypes.bool,
    isUserPasswordUpdated: PropTypes.bool
};

export default ProfileForm;