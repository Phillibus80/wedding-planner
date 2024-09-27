import PropTypes from "prop-types";
import {useState} from "react";
import {Col} from "react-bootstrap";

import AdminSocialMedia from "../../components/adminSocialMedia/AdminSocialMedia.jsx";

import * as styles from "./socialMediaList.module.scss";

const AdminSocialMediaList = (
    {
        count = 0,
        linkList = [],
        imageList,
        sectionName = ''
    }
) => {
    const [showNewColumn, setShowNewColumn] = useState(false);

    const handleRemove = () => setShowNewColumn(false);

    const socialMediaItems = linkList.reduce((accum, currentLink) => {
        const linkImage = imageList?.find(
            ({imageName}) => imageName?.toLowerCase()?.includes(currentLink?.title?.toLowerCase()));

        return [
            ...accum,
            {
                link: currentLink,
                image: linkImage
            }
        ];
    }, []);
    const socialMediaColumns = socialMediaItems.map(({image, link}, index) => (
        <Col className='gap-0' sm={12} md={3} key={`${image?.imageName}_${index}`}>
            <AdminSocialMedia
                linkResponseObj={{link, sectionName}}
                imageResponseObj={{image, sectionName}}
                removeCallback={handleRemove}
            />
        </Col>
    ));
    const additionalImage = (!imageList.some(({imageName}) => !imageName))
        && <Col className='gap-0' sm={12} md={3} key={`il-${socialMediaColumns.length}`}>
            <div className={styles.button_wrapper}>
                {showNewColumn
                        ? <AdminSocialMedia
                            linkResponseObj={{
                                link: {
                                    id: '',
                                    title: '',
                                    url: ''
                                }
                            }}
                            imageResponseObj={{
                                image: {
                                    id: '',
                                    imageName: '',
                                    src: '',
                                    alt: '',
                                    tagline: '',
                                    priority: '1'
                                },
                                sectionName: sectionName
                            }}
                            removeCallback={handleRemove}
                        />
                        : <button className={styles.navigation__button}
                                  onClick={() => setShowNewColumn(true)}>
                            <span className={styles.navigation__icon}>&nbsp;</span>
                        </button>
                }
            </div>
        </Col>;

    return count > 0
        ? [...socialMediaColumns, additionalImage]
        : [additionalImage]
};

AdminSocialMediaList.propTypes = {
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

export default AdminSocialMediaList;