import styles from './ImageInput.module.scss';

const ImageInput = ({field, form, label, disabled, ...props}) => {
    return (
        <>
            <div>
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

                <label
                    htmlFor={form.name}
                >
                    <span className={styles.inputButtonLabel}>{label}</span>
                </label>
            </div>

            {form.touched[field.name] && form.errors[field.name] && (
                <div>
                    {form.errors[field.name]}
                </div>
            )}
        </>
    )
}

export default ImageInput;