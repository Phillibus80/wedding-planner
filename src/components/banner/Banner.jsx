import React from 'react';
import styles from './Banner.module.scss';
import PropTypes from 'prop-types';
import {apiURL} from '../../constants.js';

export const Banner = ({bannerResponseObj}) => {
    const {
        content: {
            images: {
                imageList: bannerImages
            }
        }
    } = bannerResponseObj;

    return (
        <div role="banner"
             className={styles.banner}
        >
            {
                bannerImages.map(({alt, src}) =>
                    <div className={styles.banner__backing} key={src}>
                        <img className={styles.banner__backing__image}
                             src={`${apiURL}${src}`} alt={alt}/>
                    </div>
                )
            }
        </div>
    )
};

Banner.propTypes = {
    bannerResponseObj: PropTypes.shape({
        content: PropTypes.shape({
            images: PropTypes.shape({
                imageList: PropTypes.arrayOf(
                    PropTypes.shape({
                        src: PropTypes.string,
                        alt: PropTypes.string,
                        tagline: PropTypes.string,
                        priorityNumber: PropTypes.number
                    }))
            })
        })
    })
};

Banner.propTypes = {
    bannerResponseObj: PropTypes.shape({
        sectionName: PropTypes.string,
        pageName: PropTypes.string,
        showSection: PropTypes.bool,
        title: PropTypes.string
    })
}

export default Banner;