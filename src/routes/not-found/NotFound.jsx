import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

import {apiURL, ROUTE_CONST} from "../../constants.js";

import styles from './NotFound.module.scss';

const NotFound = () => {
    const [timeLeft, setTimeLeft] = useState(3);
    const navigate = useNavigate();

    useEffect(() => {
        const countdownInterval = setInterval(() => {
            const time = timeLeft - 1;
            if (time <= 0) {
                clearInterval(countdownInterval);
                navigate(ROUTE_CONST.HOME);
            }

            setTimeLeft(time);
        }, 1000);

        return () => clearInterval(countdownInterval);
    });

    return (
        <div className={styles.notFound}>
            <div className={styles.notFound_container}>
                <Link
                    to={ROUTE_CONST.HOME}
                >
                    <img src={`${apiURL}/img/page-img/Logo.webp`}
                         alt='Main Logo and link to home page'
                    />
                </Link>

                <p className={styles.notFound_container_text}>
                    This page does not exist. You will be redirected to the home page in {timeLeft}s.
                </p>
            </div>
        </div>
    )
};
export default NotFound;
