import {Link} from 'react-router-dom';
import styles from './Navi.module.scss';
import {apiURL, ROUTE_CONST} from '../../constants.js';
import {useRef, useState} from 'react';
import {generateLinks} from '../../utils/utils.jsx';

const Navi = () => {
    const [ isMenuOpen, setIsMenuOpen ] = useState( false );

    const hamburgerMenuRef = useRef( null );
    const pullRef = useRef( null );

    const routeArray = [
        ROUTE_CONST.HOME,
        ROUTE_CONST.WEDDING_QS,
        ROUTE_CONST.DESTIN_WEDDING_QS,
        ROUTE_CONST.CONTACT_US_ROUTE,
        ROUTE_CONST.LOGIN
    ];

    const handleMenuToggle = () => {
        const menuOpen = !isMenuOpen;

        if (menuOpen) {
            pullRef.current.classList.add( `${styles.pullDownVisible}` );
            hamburgerMenuRef.current.classList.add(
                `${styles.navigation__icon_MenuOpen}` );
        }
        else {
            pullRef.current.classList.remove( `${styles.pullDownVisible}` );
            hamburgerMenuRef.current.classList.remove(
                `${styles.navigation__icon_MenuOpen}` );

        }

        setIsMenuOpen( menuOpen );
    };

    return (
        <div className={styles.navContainer}>
            <div className={styles.addressText}>
                <p className={styles.addressTextContent}>1234 Some Street, Anytown, Anyplace, 12345</p>
            </div>
            <div className={styles.logoWrapper}>
                <Link to={ROUTE_CONST.HOME}>
                    <img className={styles.logo}
                         src={`${apiURL}/img/page-img/Logo.png`}
                         alt='Main Logo and link to home page'/>
                </Link>
            </div>
            <nav role="navigation" className={styles.mainNavWrapper}>
                <ul className={styles.mainNav}>
                    <div className={styles.innerNav}>
                        {
                            generateLinks( routeArray, 'menu-link' )
                        }
                    </div>

                    <div className={styles.mobileMenu}>
                        <button className={styles.navigation__button}
                                onClick={handleMenuToggle}
                        >
                                <span
                                    className={styles.navigation__icon}
                                    ref={hamburgerMenuRef}
                                >&nbsp;</span>
                        </button>

                        <div className={styles.pullDown} ref={pullRef}>
                            {
                                generateLinks( routeArray, 'mobile-menu-link' )
                            }
                        </div>
                    </div>
                </ul>
            </nav>
        </div>
    );
};

export default Navi;