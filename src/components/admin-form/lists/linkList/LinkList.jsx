import PropTypes from "prop-types";
import {useState} from "react";
import {Col} from "react-bootstrap";

import {SECTIONS} from "../../../../constants.js";
import AdminLink from "../../components/adminLink/AdminLink.jsx";

import * as styles from "./LinkList.module.scss";

const LinkList = ({count = 0, linkList = [], sectionName = ''}) => {
    const [showNewLink, setShowNewLink] = useState(false);

    const handleRemoveLink = () => setShowNewLink(false);
    const links = linkList.map((contentLink, index) => (
        <Col className='gap-0' sm={12} md={4} key={`${contentLink.url}_${index}`}>
            <AdminLink
                linkResponseObj={contentLink}
                sectionName={sectionName}
            />
        </Col>
        )
    );

    const newLink = (
            !linkList.some(({url}) => url === '')
            && sectionName !== SECTIONS.YOUTUBE)
        && <Col className='gap-0' sm={12} md={4} key={`ll-${linkList.length}`}>
            <div
                className={styles.link_list_additional}
            >
                {
                    showNewLink ?
                        <AdminLink
                            linkResponseObj={{
                                id: '',
                                title: '',
                                url: '',
                            }}
                            sectionName={sectionName}
                            removeCallback={handleRemoveLink}
                        />
                        : <button className={styles.navigation__button}
                                  onClick={() => setShowNewLink(true)}>
                            <span className={styles.navigation__icon}>&nbsp;</span>
                        </button>
                }
            </div>
        </Col>

    return count > 0 ? [...links, newLink] : [newLink];
}


LinkList.propTypes = {
    count: PropTypes.number,
    sectionName: PropTypes.string,
    linkList: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        url: PropTypes.string,
        id: PropTypes.string
    })).isRequired
}

export default LinkList;