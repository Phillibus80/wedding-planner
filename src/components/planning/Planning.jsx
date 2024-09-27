import PropTypes from "prop-types";
import {Col, Container, Image, Row} from "react-bootstrap";

import {apiURL} from "../../constants.js";
import {getPlanningImageComboArray} from "../../utils/utils.jsx";
import SectionHeader from "../sectionHeader/SectionHeader.jsx";

import styles from './Planning.module.scss';

const Planning = ({responseObj}) => {
    const {
        title,
        subTitle,
        content: {
            planning: {
                planningList
            },
            images: {
                imageList
            }
        }
    } = responseObj;

    const comboArray = getPlanningImageComboArray(planningList, imageList);

    return (
        <Container className={styles.planning}>
            <Row>
                <SectionHeader
                    sectionHeader={title}
                    subTitle={subTitle}
                />

                <Row>
                    {
                        comboArray?.length > 0
                        && comboArray.map(({planning, image}, index) => (
                            <Col
                                lg={{span: 4}}
                                className={styles.item}
                                key={`${title}_${index}`}
                            >
                                <div className={styles.item_count}>
                                    {planning?.columnTitle}
                                </div>
                                <h4 className={styles.item_header}>{title}</h4>
                                <p className={styles.item_text}>{planning?.planningText}</p>
                                <div className={styles.image}>
                                    <div className={styles.item_image}>
                                        <Image
                                            src={`${apiURL}${image?.src}`}
                                            alt='background image'
                                            role='presentation'
                                            fluid
                                        />
                                    </div>
                                </div>
                            </Col>
                        ))
                    }
                </Row>
            </Row>
        </Container>
    );
};

Planning.propTypes = {
    responseObj: PropTypes.shape({
        sectionName: PropTypes.string,
        pageName: PropTypes.string,
        showSection: PropTypes.bool,
        title: PropTypes.string,
        subTitle: PropTypes.string,
        content: PropTypes.shape({
            textContent: PropTypes.string,
            images: PropTypes.shape({
                count: PropTypes.number,
                imageList: PropTypes.arrayOf(
                    PropTypes.shape({
                        src: PropTypes.string,
                        alt: PropTypes.string,
                        tagline: PropTypes.string,
                        priorityNumber: PropTypes.number
                    }))
            }),
            planning: PropTypes.shape({
                count: PropTypes.number,
                planningList: PropTypes.arrayOf(
                    PropTypes.shape({
                        columnTitle: PropTypes.string,
                        title: PropTypes.string,
                        planningText: PropTypes.string,
                        sectionName: PropTypes.string,
                        id: PropTypes.string
                    })
                )
            })
        })
    })
};

export default Planning;