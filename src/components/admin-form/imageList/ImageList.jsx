import AdminImage from "../adminImage/AdminImage.jsx";
import PropTypes from "prop-types";

const ImageList = ({count, imageList, sectionName, removeCallback}) => {
    if (count > 0) {
        return (
            imageList.map(image => (
                <AdminImage
                    key={image.imageName}
                    imageResponseObj={
                        {
                            ...image,
                            sectionName: sectionName
                        }
                    }
                    removeCallback={removeCallback}
                />
            ))
        );
    }
};

ImageList.propTypes = {
    count: PropTypes.number,
    sectionName: PropTypes.string,
    removeCallback: PropTypes.func,
    imageList: PropTypes.arrayOf(PropTypes.shape({
        imageName: PropTypes.string,
        src: PropTypes.string,
        alt: PropTypes.string,
        tagline: PropTypes.string,
        priority: PropTypes.string
    }))
}

export default ImageList;