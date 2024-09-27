import {useQueryClient} from "@tanstack/react-query";
import {useContext, useEffect, useState} from "react";
import {Fade} from "react-awesome-reveal";
import {Container} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

import AdminProfile from "../../components/admin-form/components/adminProfile/AdminProfile.jsx";
import AdminQuestionList from "../../components/admin-form/lists/adminQuestionList/AdminQuestionList.jsx";
import SectionList from "../../components/admin-form/lists/sectionList/sectionList.jsx";
import {API_ROUTE_CONST, FETCH_KEYS, ROUTE_CONST} from "../../constants.js";
import {AdminSectionContext} from "../../context/adminSectionContext/AdminSectionContext.jsx";
import {useGetAdminPage, useLogOut} from "../../hooks/api-hooks.js";
import {convertRouteToTitle, decodeJWT} from "../../utils/utils.jsx";

import styles from './Admin.module.scss';

const Admin = () => {
    const [currentPage, setCurrentPage] = useState(ROUTE_CONST.MAIN);

    const {setErrors} = useContext(AdminSectionContext);
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
    const {mutateAsync: logoutMutate} = useLogOut(setErrors);

    const adminArr = adminContentRes.isSuccess
        ? adminContentRes?.data?.data
        : [];

    const handleClick = async pageRoute => {
        if (pageRoute === `/${API_ROUTE_CONST.LOGOUT}`) {
            await logoutMutate(userData?.data?.data?.username);
        }

        setCurrentPage(pageRoute);
    };

    const adminFactory = (route = '', sectionArr = []) => {
        switch (route) {
            case ROUTE_CONST.ADMIN:
                return <AdminProfile/>;
            case weddingQuestionnaireRoute:
                return <AdminQuestionList pageName={route}/>;
            case destinationWeddingQuestionnaireRoute:
                return <AdminQuestionList pageName={route}/>;
            case ROUTE_CONST.MAIN:
                return <SectionList sectionArray={sectionArr}/>;
        }
    }

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
            <Container className={styles.admin}>
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
                {
                    adminContentRes.isLoading &&
                    <h1>Loading...</h1>
                }

                {
                    adminContentRes.isSuccess &&
                    <Fade bottom distance="10%" duration={1000}>
                        {adminFactory(currentPage, adminArr)}
                    </Fade>
                }
            </Container>
        </>
    );
};

export default Admin;