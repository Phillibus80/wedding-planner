import AdminWhyUs from "../adminWhyUs/AdminWhyUs.jsx";
import PropTypes from "prop-types";

const AdminWhyUsList = ({count, whyUsList}) => {
    return (count > 0)
        &&
        whyUsList.map(({id, title, whyText, muiIcon, iconifyIcon, removeCallback}) => (
                <AdminWhyUs
                    key={title}
                    id={id}
                    title={title}
                    whyUsText={whyText}
                    muiIcon={muiIcon}
                    iconifyIcon={iconifyIcon}
                    removeCallback={removeCallback}
                />
            )
        );
};

AdminWhyUsList.propTypes = {
    count: PropTypes.number,
    whyUsList: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
        whyText: PropTypes.string,
        muiIcon: PropTypes.string,
        iconifyIcon: PropTypes.string
    }))
}

export default AdminWhyUsList;