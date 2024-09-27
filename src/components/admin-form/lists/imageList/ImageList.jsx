import PropTypes from "prop-types";
import {useState} from "react";
import {Col} from "react-bootstrap";


import {SECTIONS} from "../../../../constants.js";
import AdminImage from "../../components/adminImage/AdminImage.jsx";

import * as styles from "./ImageList.module.scss";

const ImageList = ({count = 0, imageList = [], sectionName = ''}) => {
    const [showNewImage, setShowNewImage] = useState(false);
    const handleRemoveImage = () => setShowNewImage(false);
    const images = imageList.map((image, index) => (
        <Col className='gap-0' sm={12} md={4} key={`${image.imageName}_${index}`}>
            <AdminImage
                imageResponseObj={
                    {
                        ...image,
                        sectionName: sectionName
                    }
                }
                removeCallback={handleRemoveImage}
            />
        </Col>
    ));

    const additionalImage = (!imageList.some(({imageName}) => !imageName))
        && <Col className='gap-0' sm={12} md={4} key={`il-${images.length}`}>
            <div className={styles.button_wrapper}>
                {
                    showNewImage
                        ? <AdminImage
                            imageResponseObj={{
                                imageName: '',
                                src: '',
                                alt: '',
                                tagline: '',
                                sectionName: sectionName
                            }}
                            removeCallback={handleRemoveImage}
                        />
                        : sectionName !== SECTIONS.FOOTER
                        && sectionName !== SECTIONS.PROFILE
                        && <button className={styles.navigation__button}
                                   onClick={() => setShowNewImage(true)}>
                            <span className={styles.navigation__icon}>&nbsp;</span>
                        </button>
                }
            </div>
        </Col>;

    return count > 0
        ? [...images, additionalImage]
        : [additionalImage]
};

ImageList.propTypes = {
    count: PropTypes.number,
    sectionName: PropTypes.string,
    imageList: PropTypes.arrayOf(PropTypes.shape({
        imageName: PropTypes.string,
        src: PropTypes.string,
        alt: PropTypes.string,
        tagline: PropTypes.string,
        priority: PropTypes.string
    }))
}

export default ImageList;