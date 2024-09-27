import {Icon as IconifyIcon} from '@iconify/react';
import * as MUIIcon from '@mui/icons-material';
import {Icon} from "@mui/material";
import PropTypes from "prop-types";
import {Fade} from "react-awesome-reveal";
import {Col, Container, Row} from "react-bootstrap";

import SectionHeader from "../sectionHeader/SectionHeader.jsx";

import styles from './WhyUs.module.scss';

const WhyUs = ({responseObj}) => (
    <Container className={styles.whyUs}>
        <Row>
            <SectionHeader
                sectionHeader={responseObj.title}
                subTitle={responseObj.subTitle}/>

            <Row>
                {
                    responseObj?.content?.whyUsList?.map(({title: whyUsTitle, whyText, muiIcon, iconifyIcon}) => (
                        <Col
                            className='gap-0'
                            md={12}
                            lg={{span: 5, offset: 1}}
                            key={whyUsTitle}
                        >
                            <Fade top distance="10%" duration={1000} key={whyUsTitle}>
                                <Row className={styles.icon_wrapper}>
                                    <Col className={styles.icon}>
                                        {
                                            muiIcon
                                                ? <Icon
                                                    component={MUIIcon[`${muiIcon}`]}
                                                    fontSize="large"
                                                />
                                                : <IconifyIcon
                                                    className={styles.icon_ring}
                                                    icon={iconifyIcon}
                                                />
                                        }
                                    </Col>

                                    <Col className={styles.icon_content}>
                                        <p className={styles.icon_content_title}>{whyUsTitle}</p>
                                        <p>{whyText}</p>
                                    </Col>
                                </Row>

                            </Fade>
                        </Col>
                        )
                    )
                }
            </Row></Row>
    </Container>
);

WhyUs.propTypes = {
    responseObj: PropTypes.shape({
        sectionName: PropTypes.string,
        pageName: PropTypes.string,
        showSection: PropTypes.bool,
        title: PropTypes.string,
        subTitle: PropTypes.string,
        content: PropTypes.shape({
            count: PropTypes.number,
            whyUsList: PropTypes.arrayOf(PropTypes.shape({
                title: PropTypes.string,
                whyText: PropTypes.string,
                muiIcon: PropTypes.string
            }))
        })
    })
}

export default WhyUs;