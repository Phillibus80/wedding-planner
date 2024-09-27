import PropTypes from "prop-types";
import {Container, Row} from "react-bootstrap";

import styles from './ImageInput.module.scss';

const ImageInput = ({field, form, label = '', disabled, ...props}) => (
    <Container>
        {label}
        <Row className={styles.sectionWrapper}>
            <input
                disabled={disabled}
                id={field.name}
                name={field.name}
                className={disabled ? styles.disabledField : styles.customFileInput}
                type="file"
                onChange={(event) => {
                    props.setFieldValue(field.name, event.currentTarget.files[0]);
                }}
            />
        </Row>

        <Row className={styles.sectionWrapper}>
            {form.touched[field.name] && form.errors[field.name] && (
                <div>
                    {form.errors[field.name]}
                </div>
            )}
        </Row>
    </Container>
);

ImageInput.propTypes = {
    disabled: PropTypes.bool,
    field: PropTypes.shape({
        name: PropTypes.string
    }),
    form: PropTypes.object,
    label: PropTypes.string,
    setFieldValue: PropTypes.func
};

export default ImageInput;