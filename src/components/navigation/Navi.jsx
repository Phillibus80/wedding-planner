import {Container, Image, Nav, Navbar, NavbarCollapse, Row} from "react-bootstrap";
import {Link} from 'react-router-dom';

import {apiURL, ROUTE_CONST} from '../../constants.js';
import {generateLinks} from '../../utils/utils.jsx';

import styles from './Navi.module.scss';

const Navi = () => {
    const routeArray = [
        ROUTE_CONST.HOME,
        ROUTE_CONST.WEDDING_QS,
        ROUTE_CONST.DESTIN_WEDDING_QS,
        ROUTE_CONST.CONTACT_US_ROUTE,
        ROUTE_CONST.LOGIN
    ];

    return (
        <Navbar expand="lg" className={styles.navContainer}>

            <Row className={styles.addressText}>
                <p className={styles.addressTextContent}>1234 Some Street, Anytown, Anyplace, 12345</p>
            </Row>

            <Link to={ROUTE_CONST.HOME} className={styles.logoWrapper}>
                <Image
                    className={styles.logo}
                    src={`${apiURL}/img/page-img/Logo.webp`}
                    alt='Main Logo and link to home page'
                    fluid
                />
            </Link>

            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <NavbarCollapse>
                <Nav role="navigation">
                    <Container className={styles.mainNavWrapper}>
                        {
                            generateLinks(routeArray, 'menu-link')
                        }
                    </Container>
                </Nav>
            </NavbarCollapse>
        </Navbar>
    );
};

export default Navi;