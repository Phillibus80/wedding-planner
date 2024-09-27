import PropTypes from 'prop-types';
import {Col, Container, Image, Row} from "react-bootstrap";

import {apiURL} from '../../constants.js';

import styles from './SocialMedia.module.scss';


const SocialMedia = ({socialMediaResponseObj}) => {
    const {
        content: {
            images: {
                imageList: socialMediaImages
            },
            links: {
                linkList: socialMediaLinks
            }
        }
    } = socialMediaResponseObj;

    return (
        <Container className={styles.social}
             role="navigation"
             aria-label='Social Media Navigation.'
        >
            <Row className={styles.social_container}>
                {
                    socialMediaLinks.map(
                        ({title, url}, index) => {
                            const normalizedTitle = title.toLowerCase();
                            const searchedImageObject = socialMediaImages.find(
                                ({imageName}) => imageName.toLowerCase().includes(normalizedTitle)
                            );
                            return (
                                <Col key={`${title}_${index}`}>
                                    <a className={styles.social_link}
                                       href={url}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       aria-label={`Link to the cat lady's ${title} page.`}
                                    >
                                        <Image
                                            className={styles.social_image}
                                            src={`${apiURL}${searchedImageObject?.src}`}
                                            alt={`${searchedImageObject?.alt}`}
                                            loading='lazy'
                                        />
                                    </a>
                                </Col>
                            )
                        }
                    )
                }
            </Row>
        </Container>
    );
};

SocialMedia.propTypes = {
    socialMediaResponseObj: PropTypes.shape({
        title: PropTypes.string,
        content: PropTypes.shape({
            images: PropTypes.shape({
                imageList: PropTypes.arrayOf(
                    PropTypes.shape({
                        url: PropTypes.string
                    }))
            }),
            links: PropTypes.shape({
                linkList: PropTypes.arrayOf(
                    PropTypes.shape({
                        url: PropTypes.string
                    }))
            })
        })
    })
};

export default SocialMedia;