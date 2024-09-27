import PropTypes from 'prop-types';
import {Carousel, Container, Image} from "react-bootstrap";

import {apiURL} from '../../constants.js';

import styles from './Banner.module.scss';


export const Banner = ({bannerResponseObj}) => {
    const {
        content: {
            images: {
                imageList: bannerImages
            }
        }
    } = bannerResponseObj;

    const shouldShowControls = bannerImages?.length > 1;

    return (
        <Container role="banner"
                   className={styles.banner}
        >
            <Carousel
                controls={shouldShowControls}
                indicators={shouldShowControls}
                wrap={true}
                touch={true}
            >
                {
                    bannerImages?.map(({alt, src}) =>
                        <Carousel.Item
                            className={styles.banner__backing}
                            key={src}
                        >
                            <Image
                                className={styles.banner__backing__image}
                                src={`${apiURL}${src}`}
                                alt={alt}
                                fluid
                                loading='lazy'
                                defer
                            />
                        </Carousel.Item>
                    )
                }
            </Carousel>
        </Container>
    )
};

Banner.propTypes = {
    bannerResponseObj: PropTypes.shape({
        sectionName: PropTypes.string,
        pageName: PropTypes.string,
        showSection: PropTypes.bool,
        title: PropTypes.string,
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
}

export default Banner;