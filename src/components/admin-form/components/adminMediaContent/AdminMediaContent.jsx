import PropTypes from "prop-types";
import React from "react";
import {Container, Row} from "react-bootstrap";

import {SECTIONS} from "../../../../constants.js";
import AdminPlanningList from "../../lists/adminPlanningList/AdminPlanningList.jsx";
import AdminWhyUsList from "../../lists/adminWhyUsList/AdminWhyUsList.jsx";
import CommentList from "../../lists/commentList/CommentList.jsx";
import ImageList from "../../lists/imageList/ImageList.jsx";
import LinkList from "../../lists/linkList/LinkList.jsx";
import AdminSocialMediaList from "../../lists/socialMediaList/AdminSocialMediaList.jsx";

import * as styles from './AdminMediaContent.scss';

const AdminMediaContent = ({section}) => {
    const showWhyUs = section?.sectionName === SECTIONS.WHY_US;
    const showPlanning = section?.content?.planning?.length >= 0
        && section?.sectionName === SECTIONS.PLANNING;
    const showImageList = section?.content?.images?.count >= 0
        && (
            section?.sectionName !== SECTIONS.TAGLINE
            && section?.sectionName !== SECTIONS.COMMENTS
            && section?.sectionName !== SECTIONS.PLANNING
            && section?.sectionName !== SECTIONS.SOCIAL_MEDIA
        );
    const showComments = section?.content?.comments?.count >= 0 &&
        section?.sectionName === SECTIONS.COMMENTS;
    const showLinks = section?.content?.links?.count >= 0 && section?.sectionName === SECTIONS.YOUTUBE;
    const showSocialMedia = section?.sectionName === SECTIONS.SOCIAL_MEDIA;

    return <Container>
        <Row className={styles.media_content}>
            <span className={styles.media_content_header}>
                Media Content
            </span>

            {showComments &&
                <Row>
                    <CommentList
                        count={section?.content?.comments?.count}
                        commentList={section?.content?.comments?.commentList}
                        sectionName={section?.sectionName}
                    />
                </Row>
            }

            {showLinks &&
                <Row>
                    <LinkList
                        count={section?.content?.links?.count}
                        linkList={section?.content?.links?.linkList}
                        sectionName={section?.sectionName}
                    />
                </Row>
            }

            {showImageList &&
                <Row>
                    <ImageList
                        count={section?.content?.images?.count}
                        imageList={section?.content?.images?.imageList}
                        sectionName={section?.sectionName}
                    />
                </Row>

            }

            {showWhyUs &&
                <Row>
                    <AdminWhyUsList
                        count={section?.content?.whyUs?.length}
                        whyUsList={section?.content?.whyUs}
                        sectionName={section?.sectionName}
                    />
                </Row>
            }

            {showPlanning &&
                <Row>
                    <AdminPlanningList
                        count={section?.content?.planning?.length}
                        planningList={section?.content?.planning}
                        imageList={section?.content?.images?.imageList}
                        sectionName={section?.sectionName}
                    />
                </Row>
            }

            {
                showSocialMedia &&
                <Row>
                    <AdminSocialMediaList
                        count={section?.content?.images?.imageList?.length}
                        linkList={section?.content?.links?.linkList}
                        imageList={section?.content?.images?.imageList}
                        sectionName={section?.sectionName}
                    />
                </Row>
            }
        </Row>
    </Container>;
};

AdminMediaContent.propTypes = {
    section: PropTypes.shape({
        content: PropTypes.shape({
            textContent: PropTypes.string,
            comments: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
            links: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
            images: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
            whyUs: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
            planning: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
        }),
        pageName: PropTypes.string,
        sectionName: PropTypes.string,
        showSection: PropTypes.bool,
        subTitle: PropTypes.string,
        title: PropTypes.string
    }).isRequired
}

export default AdminMediaContent;