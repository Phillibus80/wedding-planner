import PropTypes from "prop-types";
import {Container} from "react-bootstrap";

import styles from './SectionHeader.module.scss';

const SectionHeader = ({
                           sectionHeader,
                           subTitle
                       }) => (
    <Container className={styles.section_header}>
        <div className={styles.section_header_underline}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
        <h2 className={styles.section_header_title}>{sectionHeader}</h2>
        <p className={styles.section_header_subtitle}>{subTitle}</p>
    </Container>
);

SectionHeader.propTypes = {
    sectionHeader: PropTypes.string,
    subTitle: PropTypes.string
}

export default SectionHeader;