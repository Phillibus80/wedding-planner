import styles from './InfoModal.module.scss';

const InfoModal = ({
                       onClose,
                       message
                   }) => {
    return (
        <div className={styles.modal}>
            <h1 className={styles.modal_header}>Info:</h1>
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

export default InfoModal;
