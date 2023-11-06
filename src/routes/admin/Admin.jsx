import styles from './Admin.module.scss';
import {useGetAdminPage, useLogOut} from "../../hooks/api-hooks.js";
import SectionList from "../../components/admin-form/sectionList/sectionList.jsx";
import React, {useContext, useEffect, useState} from "react";
import {API_ROUTE_CONST, FETCH_KEYS, ROUTE_CONST} from "../../constants.js";
import {convertRouteToTitle, decodeJWT} from "../../utils/utils.jsx";
import AdminProfile from "../../components/admin-form/adminProfile/AdminProfile.jsx";
import {useNavigate} from "react-router-dom";
import {useQueryClient} from "@tanstack/react-query";
import {createPortal} from "react-dom";
import ErrorModal from "../../components/modals/error/ErrorModal.jsx";
import {Fade} from "react-awesome-reveal";
import AdminQuestionList from "../../components/admin-form/adminQuestionList/AdminQuestionList.jsx";
import InfoModal from "../../components/modals/info/InfoModal.jsx";
import {AdminSectionContext} from "../../context/adminSectionContext/AdminSectionContext.jsx";

const Admin = () => {
    const [currentPage, setCurrentPage] = useState(ROUTE_CONST.MAIN);

    const {errors, setErrors, info, setInfo} = useContext(AdminSectionContext);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const userData = queryClient.getQueryData([`${FETCH_KEYS.QUERY.GET_USER_BY_USERNAME}`]);

    const weddingQuestionnaireRoute = ROUTE_CONST.WEDDING_QS.replaceAll('_', ' ');
    const destinationWeddingQuestionnaireRoute = ROUTE_CONST.DESTIN_WEDDING_QS.replaceAll('_', ' ');

    const adminTabLabels = [
        ROUTE_CONST.ADMIN,
        ROUTE_CONST.MAIN,
        weddingQuestionnaireRoute,
        destinationWeddingQuestionnaireRoute,
        `/${API_ROUTE_CONST.LOGOUT}`
    ];

    const adminContentRes = useGetAdminPage();
    const {
        mutateAsync: logoutMutate
    } = useLogOut(setErrors);

    const adminArr = adminContentRes.isSuccess
        ? adminContentRes?.data?.data
        : [];

    const handleClick = async pageRoute => {
        if (pageRoute === `/${API_ROUTE_CONST.LOGOUT}`) {
            await logoutMutate(userData?.data?.data?.username);
        }

        setCurrentPage(pageRoute);
    }

    const errorModal = (
        createPortal(<ErrorModal
                message={errors?.errorMessage}
                onClose={() => setErrors({
                    hasErrors: false,
                    errorMessage: ''
                })}
            />,
            document.body
        )
    );

    const infoModal = (
        createPortal(<InfoModal
                message={info?.infoMessage}
                onClose={() => {
                    setInfo({
                        hasInfo: false,
                        infoMessage: ''
                    });
                }}
            />,
            document.body
        )
    );

    useEffect(() => {
        if (!userData?.data?.data?.token) {
            navigate(ROUTE_CONST.LOGIN);
        } else {
            const {
                user: {
                    signedIn
                }
            } = decodeJWT(userData?.data?.data?.token);

            if (!signedIn) {
                navigate(ROUTE_CONST.LOGIN);
            }
        }
    });

    return (
        <>
            {errors.hasErrors && errorModal}
            {info.hasInfo && infoModal}

            <div className={styles.admin}>
                <nav className={styles.admin_nav}>
                    {
                        adminTabLabels.map(page => (
                            <div
                                key={page}
                                className={currentPage === page
                                    ? styles.admin_nav_option_selected
                                    : styles.admin_nav_option}
                                onClick={() => handleClick(page)}
                            >
                                <p className={styles.admin_nav_option_text}>{convertRouteToTitle(page)}</p>
                            </div>
                        ))
                    }
                </nav>

                {/*Admin Profile Info*/}
                {
                    (adminContentRes.isLoading &&
                        currentPage === ROUTE_CONST.ADMIN) &&
                    <h1>Loading...</h1>
                }
                {
                    (adminContentRes.isSuccess &&
                        currentPage === ROUTE_CONST.ADMIN) &&
                    <Fade bottom distance="10%" duration={1000}>
                        <AdminProfile/>
                    </Fade>
                }

                {/*Admin Wedding Questionnaire Pages*/}
                {
                    (adminContentRes.isLoading && currentPage === weddingQuestionnaireRoute) &&
                    <h1>Loading...</h1>
                }
                {
                    (adminContentRes.isSuccess && currentPage === weddingQuestionnaireRoute) &&
                    <Fade bottom distance="10%" duration={1000}>
                        <AdminQuestionList
                            pageName={currentPage}
                        />
                    </Fade>
                }

                {/*Admin Destination Wedding Questionnaire Pages*/}
                {
                    (adminContentRes.isLoading && currentPage === destinationWeddingQuestionnaireRoute) &&
                    <h1>Loading...</h1>
                }
                {
                    (adminContentRes.isSuccess && currentPage === destinationWeddingQuestionnaireRoute) &&
                    <Fade bottom distance="10%" duration={1000}>
                        <AdminQuestionList
                            pageName={currentPage}
                        />
                    </Fade>
                }

                {/*Main Admin Page Info*/}
                {
                    (adminContentRes.isLoading &&
                        currentPage === ROUTE_CONST.MAIN) &&
                    <h1>Loading...</h1>
                }
                {
                    (adminContentRes.isSuccess &&
                        currentPage === ROUTE_CONST.MAIN) &&
                    <div>
                        <SectionList
                            sectionArray={adminArr}
                        />
                    </div>
                }
            </div>
        </>
    );
};

export default Admin;