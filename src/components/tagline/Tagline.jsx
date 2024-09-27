import PropTypes from "prop-types";
import {Container, Row} from "react-bootstrap";

import styles from './Tagline.module.scss';


const Tagline = ({responseObj}) => (
    <Container className={styles.tagline}>
        <Row className={styles.tagline_wrapper}>
            <p className={styles.tagline_wrapper_text}>{responseObj.title}</p>
        </Row>
    </Container>
);

Tagline.propTypes = {
    responseObj: PropTypes.shape({
        title: PropTypes.string
    })
};

export default Tagline;