import styles from './Footer.module.scss';
import {ROUTE_CONST} from "../../constants.js";
import {Link} from "react-router-dom";
import {generateFooterNavLinks} from "../../utils/utils.jsx";
import SocialMedia from "../socialMedia/SocialMedia.jsx";
import PropTypes from "prop-types";


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

    return (
        <footer className={styles.footer}>
            <div className={styles.footer_wrapper}>
                <div className={styles.logo}>
                    <Link to={ROUTE_CONST.HOME}>
                        <img className={styles.logo_image}
                             src={`/api/${logo?.src}`}
                             alt={'Risen Role Creations Logo'}
                        />
                    </Link>
                </div>

                <ul className={styles.footerNav}>
                    {
                        generateFooterNavLinks(routeArray, 'menu-link')
                    }
                </ul>
            </div>

            <SocialMedia socialMediaResponseObj={socialMedia}/>

            <div className={styles.footerBackground}>
                <img
                    src={'../../../api/img/Decor-outline.png'}
                    alt='background image'
                    role='presentation'
                    aria-hidden
                    className={styles.footerBackgroundFlourish_1}
                />
                <img
                    src={'../../../api/img/Decor_3.png'}
                    alt='background image'
                    role='presentation'
                    aria-hidden
                    className={styles.footerBackgroundFlourish_3}
                />
                <img
                    src={'../../../api/img/Decor-outline.png'}
                    alt='background image'
                    role='presentation'
                    aria-hidden
                    className={styles.footerBackgroundFlourish_2}
                />
            </div>
        </footer>
    )
};

Footer.propTypes = {
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
    })
}

export default Footer;