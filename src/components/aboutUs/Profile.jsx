import {ButtonBase} from "@mui/material";
import PropTypes from 'prop-types';
import {useState} from 'react';
import {Col, Container, Image, Row} from "react-bootstrap";

import {apiURL} from '../../constants.js';
import SectionHeader from "../sectionHeader/SectionHeader.jsx";

import styles from './Profile.module.scss';

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

    const expandButtonText = isTextExpanded
        ? 'Click here to hide text.'
        : 'Click here to read the whole story.'

    return (
        <Container className={styles.aboutUs}>
            <Row>
                <Col md={5}>
                    <SectionHeader
                        sectionHeader={profileTitle}
                        subTitle={profileSubtitle}
                    />
                    <p
                        dangerouslySetInnerHTML={processResponseProfileText(profileText)}
                        className={isTextExpanded ? styles.text_expanded : styles.text_short}
                    />

                    <ButtonBase className={styles.expand_btn}
                                onClick={() => setIsTextExpanded(() => !isTextExpanded)}>
                        {expandButtonText}
                    </ButtonBase>
                </Col>

                <Col md={5}>
                    <Image
                        src={`${apiURL}${profileImages[0].src}`}
                        alt={`${profileImages[0].alt}`}
                        className={styles.image_img}
                        fluid
                        loading='lazy'
                        defer
                    />
                </Col>
            </Row>
        </Container>
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