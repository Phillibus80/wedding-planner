import AdminLink from "../adminLink/AdminLink.jsx";
import PropTypes from "prop-types";

const LinkList = ({count, linkList, sectionName}) => {
    return count > 0 ? linkList.map(contentLink => (
            <AdminLink
                key={contentLink.url}
                linkResponseObj={contentLink}
                sectionName={sectionName}
            />
        )
    ) : '';
};

LinkList.propTypes = {
    count: PropTypes.number,
    sectionName: PropTypes.string,
    linkList: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        url: PropTypes.string,
        id: PropTypes.string
    }))
}

export default LinkList;