import PropTypes from "prop-types";
import {Col, Row} from "react-bootstrap";

import LoadingSpinner from "../../../loadingSpinner/LoadingSpinner.jsx";

import styles from "./AdminSectionButtons.module.scss";

const AdminSectionButtons = ({
                                 dirty = false,
                                 handleRemove = () => {
                                 },
                                 id = -1,
                                 isLoading = false,
                                 isSubmitting = false,
                                 isValid = false
                             }) =>
    <Row className={styles.button_container}>
        <Col className='gap-0' sm={12} md={6}>
            {
                // Hide the remove button when there is no id,
                // which means a new item is being created.
                !!id &&
                <button
                    disabled={(isSubmitting || isLoading)}
                    className={styles.button_container_button_remove}
                    type='button'
                    onClick={handleRemove}
                    aria-label={'A button the removes the image from the current section'}
                >
                    <span>Remove</span>
                    {
                        (isSubmitting || isLoading) &&
                        <div className={styles.loading_spinner}>
                            <LoadingSpinner
                                role='presentation'
                                aria-label='A loading spinner that is on the screen during the form submission.'
                            />
                        </div>
                    }
                </button>
            }
        </Col>

        <Col className='gap-0' sm={12} md={6}>
            <button
                disabled={isSubmitting || !isValid || !dirty}
                className={styles.button_container_button}
                type='submit'
                aria-label={'A button the submits the update to the image.'}
            >
                <span>Submit</span>
                {
                    isSubmitting &&
                    <div className={styles.loading_spinner}>
                        <LoadingSpinner
                            role='presentation'
                            aria-label='A loading spinner that is on the screen during the form submission.'
                        />
                    </div>
                }
            </button>
        </Col>
    </Row>;

AdminSectionButtons.propTypes = {
    dirty: PropTypes.bool,
    handleRemove: PropTypes.func,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isLoading: PropTypes.bool,
    isSubmitting: PropTypes.bool,
    isValid: PropTypes.bool
};

export default AdminSectionButtons;