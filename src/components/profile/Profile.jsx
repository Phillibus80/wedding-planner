import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {apiURL} from '../../constants.js';
import styles from './Profile.module.scss';
import SectionHeader from "../sectionHeader/SectionHeader.jsx";

export const Profile = ({profileResponseObj}) => {
    const [isTextExpanded, setIsTextExpanded] = useState(false);

    const {
        title: profileTitle,
        subTitle: profileSubtitle,
        content: {
            textContent: profileText,
            images: {
                imageList: profileImages
            }
        }
    } = profileResponseObj;

    const processResponseProfileText = resText => ({
        __html: resText.replaceAll('[br]', '<br /><br />')
    });

    return (
        <div className={styles.profile}>
            <img src={'../../../api/img/Decor_2.png'}
                 alt='background image'
                 role='presentation'
                 aria-hidden
                 className={styles.backgroundFlourish_1}
            />

            <div className={styles.backgroundFlourish_wrapper}>
                <img src={'../../../api/img/Decor_2.png'}
                     alt='background image'
                     role='presentation'
                     aria-hidden
                     className={styles.backgroundFlourish_2}
                />
            </div>

            <div className={styles.profileWrapper}>
                <div className={styles.profileWrapper_image}>
                    <img
                        src={`${apiURL}${profileImages[0].src}`}
                        alt={`${profileImages[0].alt}`}
                        className={styles.profileWrapper_image_img}
                    />
                </div>
                <div className={styles.profileWrapper_content}>
                    <SectionHeader
                        sectionHeader={profileTitle}
                        subTitle={profileSubtitle}
                    />
                    <p
                        dangerouslySetInnerHTML={processResponseProfileText(
                            profileText)}
                        className={
                            isTextExpanded
                                ? styles.profileWrapper_content_text_expanded
                                : styles.profileWrapper_content_text_short
                        }
                    />

                    <div className={styles.profileWrapper_content_expand_btn}
                         onClick={() => setIsTextExpanded(() => !isTextExpanded)}
                    >
                        {
                            isTextExpanded
                                ? 'Click here to hide text.'
                                : 'Click here to read the whole story.'
                        }
                    </div>
                </div>
            </div>
        </div>
    )
};

Profile.propTypes = {
    profileResponseObj: PropTypes.shape({
        title: PropTypes.string,
        subTitle: PropTypes.string,
        content: PropTypes.shape({
            textContent: PropTypes.string,
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

export default Profile;