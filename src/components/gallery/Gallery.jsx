import styles from './Gallery.module.scss';
import {ROUTE_CONST} from "../../constants.js";
import SectionHeader from "../sectionHeader/SectionHeader.jsx";
import PropTypes from "prop-types";
import {Fade} from "react-awesome-reveal";

const Gallery = ({responseObj}) => {
    const {
        title: galleryHeader,
        subTitle: gallerySubTitle,
        content: {
            images: {
                imageList: images
            }
        }
    } = responseObj;

    const numberOfImagesPerColumn = 4;

    const [column1, column2, column3] = [
        images.filter((_, index) => index < numberOfImagesPerColumn),
        images.filter((_, index) => index >= numberOfImagesPerColumn && index < numberOfImagesPerColumn * 2),
        images.filter((_, index) => index >= numberOfImagesPerColumn * 2)
    ];

    const createGalleryImageElement = (elemSrc, tagline, alt, n) => (
        <div
            key={elemSrc}
        >
            <img className={`grid-item grid-item-${n + 1}`}
                 src={`${ROUTE_CONST.API}${elemSrc}`}
                 alt={alt}
                 loading="lazy"
            />
            <p>{tagline}</p>
        </div>
    );

    return (
        <section className={styles.gallery}>
            <div className={styles.gallery_wrapper}>
                <div className={styles.gallery_wrapper_header}>
                    <SectionHeader
                        sectionHeader={galleryHeader}
                        subTitle={gallerySubTitle}
                    />
                </div>

                <div className={styles.grid_container}>
                    <div className={styles.column1}>
                        <Fade bottom distance="10%" duration={1000}>;
                            {
                                column1.map(({src, tagline, alt}, index) =>
                                    createGalleryImageElement(src, tagline, alt, index))
                            }
                        </Fade>
                    </div>

                    <div className={styles.column2}>
                        <Fade bottom distance="10%" duration={1000}>;
                            {
                                column2.map(({src, tagline, alt}, index) =>
                                    createGalleryImageElement(src, tagline, alt, index))
                            }
                        </Fade>
                    </div>

                    <div className={styles.column3}>
                        <Fade top distance="10%" duration={1500}>
                            {
                                column3.map(({src, tagline, alt}, index) =>
                                    createGalleryImageElement(src, tagline, alt, index))
                            }
                        </Fade>
                    </div>
                </div>
            </div>
        </section>
    );
};

Gallery.propTypes = {
    responseObj: PropTypes.shape({
        title: PropTypes.string,
        subTitle: PropTypes.string,
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
};

export default Gallery;