import {apiURL} from '../../constants.js';
import React from 'react';
import PropTypes from 'prop-types';
import styles from './SocialMedia.module.scss';

const SocialMedia = ({socialMediaResponseObj}) => {
    const {
        title: socialMediaTitle,
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
        <div className={styles.social}
             role="navigation"
             aria-label='Social Media Navigation.'
        >
            <div className={styles.social_container}>
                {
                    socialMediaLinks.map(
                        ({title, url}) => {
                            const normalizedTitle = title.toLowerCase();
                            const searchedImageObject = socialMediaImages.find(
                                ({alt}) => alt.toLowerCase().includes(normalizedTitle)
                            );
                            return (
                                <a className={styles.social_link}
                                   key={title}
                                   href={url}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   aria-label={`Link to the cat lady's ${title} page.`}
                                >
                                    <img
                                        className={styles.social_image}
                                        src={`${apiURL}${searchedImageObject.src}`}
                                        alt={`${searchedImageObject.alt}`}
                                    />
                                </a>
                            )
                        }
                    )
                }
            </div>
        </div>
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