import styles from './Planning.module.scss';
import PropTypes from "prop-types";
import SectionHeader from "../sectionHeader/SectionHeader.jsx";

import {apiURL} from "../../constants.js";

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

    const getImageSrcByColumnIndex = columnIndex => {
        const adjustColumnIndex = columnIndex + 1;
        const imageColumnRef = imageList?.map(({imageName}) => imageName.slice(-1));
        const imageIndex = imageColumnRef?.indexOf(`${adjustColumnIndex}`);
        return `${apiURL}${imageList[imageIndex].src}`;
    }

    return (
        <section className={styles.planning}>
            <img src={'../../../api/img/Decor-outline.png'}
                 alt='background image'
                 role='presentation'
                 aria-hidden
                 className={styles.backgroundFlourish_1}
            />
            <img src={'../../../api/img/Decor-outline.png'}
                 alt='background image'
                 role='presentation'
                 aria-hidden
                 className={styles.backgroundFlourish_2}
            />
            <div className={styles.planning_wrapper}>
                <SectionHeader
                    sectionHeader={title}
                    subTitle={subTitle}
                />

                <div className={styles.planningItems}>
                    {
                        planningList?.map(({
                                               columnTitle,
                                               title,
                                               planningText
                                           }, index) => (
                            <div
                                className={styles.planningItems_item}
                                key={title}
                            >
                                <div className={styles.planningItems_item_count}>
                                    {columnTitle}
                                </div>
                                <h4 className={styles.planningItems_item_header}>{title}</h4>
                                <p className={styles.planningItems_item_text}>{planningText}</p>
                                <div className={styles.image}>
                                    <div className={styles.planningItems_item_image}>
                                        <img
                                            src={`${getImageSrcByColumnIndex(index)}`}
                                            alt='background image'
                                            role='presentation'
                                            className={styles.planningItems_item_image_img}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </section>
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