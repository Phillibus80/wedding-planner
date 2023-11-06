import styles from './WhyUs.module.scss';
import SectionHeader from "../sectionHeader/SectionHeader.jsx";
import * as MUIIcon from '@mui/icons-material';
import {Icon as IconifyIcon} from '@iconify/react';
import {Icon} from "@mui/material";
import PropTypes from "prop-types";
import {Fade} from "react-awesome-reveal";

const WhyUs = ({responseObj}) => (
    <section className={styles.whyUs}>
        <div className={styles.whyUs_wrapper}>
            <SectionHeader
                sectionHeader={responseObj.title}
                subTitle={responseObj.subTitle}/>

            <div className={styles.whyUs_wrapper_icons}>
                {
                    responseObj?.content?.whyUsList?.map(({title: whyUsTitle, whyText, muiIcon, iconifyIcon}) => (
                        <Fade top distance="10%" duration={1000} key={whyUsTitle}>
                            <div className={styles.whyUs_wrapper_icons_wrapper}>
                                <div className={styles.icon}>
                                    {
                                        !!muiIcon
                                            ? <Icon
                                                component={MUIIcon[`${muiIcon}`]}
                                                fontSize="large"
                                            />
                                            : <IconifyIcon
                                                className={styles.icon_ring}
                                                icon={iconifyIcon}
                                            />
                                    }
                                </div>

                                <div className={styles.icon_content}>
                                    <p className={styles.icon_content_title}>{whyUsTitle}</p>
                                    <p>{whyText}</p>
                                </div>
                            </div>
                        </Fade>
                        )
                    )
                }
            </div>
        </div>
    </section>
);

WhyUs.propTypes = {
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
}

export default WhyUs;