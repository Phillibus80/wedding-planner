import PropTypes from "prop-types";
import {Fade} from "react-awesome-reveal";

import AdminSection from "../../adminSection/AdminSection.jsx";

const SectionList = ({sectionArray}) => sectionArray.length > 0 && (
    <>
        {
            sectionArray.map(el =>
                <Fade bottom distance="10%" duration={1000} key={el.sectionName}>
                    <AdminSection
                        section={el}
                    />
                </Fade>
            )
        }
    </>
);

SectionList.propTypes = {
    sectionArray: PropTypes.array
}

export default SectionList;