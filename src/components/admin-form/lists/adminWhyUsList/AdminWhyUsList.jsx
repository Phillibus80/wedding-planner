import PropTypes from "prop-types";
import {useState} from "react";
import {Col} from "react-bootstrap";

import {SECTIONS} from "../../../../constants.js";
import AdminWhyUs from "../../components/adminWhyUs/AdminWhyUs.jsx";
import * as styles from "../../lists/imageList/ImageList.module.scss";

const AdminWhyUsList = ({count = 0, sectionName = '', whyUsList = []}) => {
    const [showNewWhyUs, setShowNewWhyUs] = useState(false);

    const handleRemoveWhyUs = () => setShowNewWhyUs(false);
    const whyUsS = whyUsList.map(({id, title, whyText, muiIcon, iconifyIcon, removeCallback}) => (
        <Col className='gap-0' sm={12} md={4} key={title}>
            <AdminWhyUs
                key={title}
                id={id}
                title={title}
                whyUsText={whyText}
                muiIcon={muiIcon}
                iconifyIcon={iconifyIcon}
                removeCallback={removeCallback}
            />
        </Col>
        )
    );

    const additionalWhyUs =
        (!whyUsList?.some(({id}) => !id)
            && sectionName !== SECTIONS.PROFILE)
        && <Col className='gap-0' sm={12} md={4} key={`wu-${whyUsList.length}`}>
            <div
                className={styles.button_wrapper}
            >
                {
                    showNewWhyUs ?
                        <AdminWhyUs
                            id=''
                            title=''
                            whyUsText=''
                            muiIcon=''
                            iconifyIcon=''
                            removeCallback={handleRemoveWhyUs}
                        />
                        : <button className={styles.navigation__button}
                                  onClick={() => setShowNewWhyUs(true)}>
                            <span className={styles.navigation__icon}>&nbsp;</span>
                        </button>
                }
            </div>
        </Col>;

    return (count > 0)
        ? [...whyUsS, additionalWhyUs]
        : [additionalWhyUs];
};

AdminWhyUsList.propTypes = {
    count: PropTypes.number,
    sectionName: PropTypes.string,
    whyUsList: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
        whyText: PropTypes.string,
        muiIcon: PropTypes.string,
        iconifyIcon: PropTypes.string
    })).isRequired
}

export default AdminWhyUsList;