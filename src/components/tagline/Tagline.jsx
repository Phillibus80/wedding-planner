import styles from './Tagline.module.scss';
import PropTypes from "prop-types";


const Tagline = ({responseObj}) => {
    const formatTitle = titleString => {


    }

    return (
        <section className={styles.tagline}>
            <img src={'../../../api/img/Decor.png'}
                 alt='background image'
                 role='presentation'
                 aria-hidden
                 className={styles.backgroundFlourish_1}
            />
            <img src={'../../../api/img/Decor_2.png'}
                 alt='background image'
                 role='presentation'
                 aria-hidden
                 className={styles.backgroundFlourish_2}
            />
            <div className={styles.tagline_wrapper}>
                <p className={styles.tagline_wrapper_text}>{responseObj.title}</p>
            </div>
        </section>
    );
};

Tagline.propTypes = {
    responseObj: PropTypes.shape({
        title: PropTypes.string
    })
};

export default Tagline;