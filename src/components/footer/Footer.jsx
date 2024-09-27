import PropTypes from "prop-types";
import {Col, Container, Image, Row} from "react-bootstrap";
import {Link} from "react-router-dom";

import {ROUTE_CONST} from "../../constants.js";
import {generateFooterNavLinks} from "../../utils/utils.jsx";
import SocialMedia from "../socialMedia/SocialMedia.jsx";

import styles from './Footer.module.scss';


const Footer = ({responseObj}) => {
    const {
        footer: {
            content: {
                images: {
                    imageList: footerImages
                }
            }
        },
        socialMedia
    } = responseObj;

    const routeArray = [
        ROUTE_CONST.HOME,
        ROUTE_CONST.WEDDING_QS,
        ROUTE_CONST.DESTIN_WEDDING_QS,
        ROUTE_CONST.CONTACT_US_ROUTE,
        ROUTE_CONST.LOGIN
    ];

    const logo = footerImages.find(({alt}) => alt === 'risen rose logo');
    const navElements = generateFooterNavLinks(routeArray, 'menuLink');

    return (
        <footer className={styles.footer}>
            <Container>
                <Row className={styles.logo}>
                    <Link to={ROUTE_CONST.HOME}>
                        <Image className={styles.logo_image}
                               src={`/api/${logo?.src}`}
                               alt={'Risen Role Creations Logo'}
                               fluid
                        />
                    </Link>
                </Row>

                <Row className={styles.footerNav}>
                    {
                        navElements.map((route, index) => (
                            <Col key={`${route}_${index}`}>
                                {route}
                            </Col>
                        ))
                    }
                </Row>
            </Container>

            <SocialMedia socialMediaResponseObj={socialMedia}/>

            <Container className={styles.footerBackground}>
                <Image
                    src={'../../../api/img/Decor-outline.webp'}
                    alt='background image'
                    role='presentation'
                    aria-hidden
                    className={styles.footerBackgroundFlourish_1}
                    fluid
                />
                <Image
                    src={'../../../api/img/Decor_3.webp'}
                    alt='background image'
                    role='presentation'
                    aria-hidden
                    className={styles.footerBackgroundFlourish_3}
                    fluid
                />
                <Image
                    src={'../../../api/img/Decor-outline.webp'}
                    alt='background image'
                    role='presentation'
                    aria-hidden
                    className={styles.footerBackgroundFlourish_2}
                    fluid
                />
            </Container>
        </footer>
    )
};

Footer.propTypes = {
    responseObj: PropTypes.shape({
        sectionName: PropTypes.string,
        pageName: PropTypes.string,
        showSection: PropTypes.bool,
        title: PropTypes.string,
        subTitle: PropTypes.string,
        content: PropTypes.shape({
            textContent: PropTypes.string,
            comments: PropTypes.shape({
                count: PropTypes.number,
                commentList: PropTypes.array
            }),
            links: PropTypes.shape({
                count: PropTypes.number,
                linkList: PropTypes.array
            }),
            images: PropTypes.shape({
                count: PropTypes.number,
                imageList: PropTypes.array
            })
        }),
        footer: PropTypes.shape({
            content: PropTypes.shape({
                images: PropTypes.shape({
                    imageList: PropTypes.array
                })
            })
        }),
        socialMedia: PropTypes.object
    })
}

export default Footer;