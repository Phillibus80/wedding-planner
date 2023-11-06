import styles from './ErrorModal.module.scss';
import PropTypes from "prop-types";

const ErrorModal = ({
                        onClose,
                        message
                    }) => {
    return (
        <div className={styles.modal}>
            <h1 className={styles.modal_header}>Error</h1>
            <div className={styles.modal_inner}>
                <p className={styles.modal_inner_message}>
                    {message}
                </p>
                <div className={styles.modal_inner_btn}>
                    <button
                        className={styles.modal_inner_btn_button}
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
};

ErrorModal.propTypes = {
    onClose: PropTypes.func,
    message: PropTypes.string
}

export default ErrorModal;
