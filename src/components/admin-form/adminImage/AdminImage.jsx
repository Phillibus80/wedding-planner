import {Field, Form, Formik} from "formik";
import styles from "./AdminImage.module.scss";
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner.jsx";
import {useContext} from "react";
import {useCreateImage, useGetPageImages, useRemoveImage, useUpdateImage} from "../../../hooks/api-hooks.js";
import * as Yup from "yup";
import ImageInput from "../imageInput/ImageInput.jsx";
import {getImageNameFromFileUpload} from "../../../utils/utils.jsx";
import {AdminSectionContext} from "../../../context/adminSectionContext/AdminSectionContext.jsx";
import PropTypes from "prop-types";

const AdminImage = ({
                        imageResponseObj,
                        removeCallback = () => {
                        }
                    }) => {
    const {setErrors, setInfo} = useContext(AdminSectionContext);

    const {
        imageName,
        src,
        alt,
        tagline,
        sectionName
    } = imageResponseObj;

    const initValues = {
        image_src: src || '',
        field_src: '',
        image_alt: alt || '',
        image_tagline: tagline || '',
        imageOptions: ''
    };

    const adminImageSchema = Yup.object().shape({
        image_src: Yup.string()
            .max(500, 'Image String is too long'),
        image_alt: Yup.string()
            .max(50, 'Please keep the alt text to only 50 characters.')
            .required('Alt Text is required.'),
        image_tagline: Yup.string()
            .max(150, 'Please keep the tagline text to only 50 characters.')
    });

    const images = useGetPageImages();
    const updateImage = useUpdateImage(setErrors, setInfo);
    const createImage = useCreateImage(setErrors, setInfo);
    const removeImage = useRemoveImage(setErrors, setInfo);

    const handleSubmit = async (
        {
            image_src: imageSrc,
            image_alt: imageAlt,
            image_tagline: imageTagline,
            file_src: uploadedFile
        }
    ) => {
        // New Image
        if (!imageResponseObj.imageName) {
            const imageNameRemoveExt = getImageNameFromFileUpload(uploadedFile).replace(' ', '_');

            await createImage.mutateAsync(
                {
                    imageName: imageNameRemoveExt,
                    sectionName: sectionName,
                    alt: imageAlt,
                    tagline: imageTagline,
                    fileSrc: uploadedFile
                }
            )
        }
        // Updating an image
        else {
            await updateImage.mutateAsync(
                {
                    imageName,
                    src: imageSrc,
                    alt: imageAlt,
                    tagline: imageTagline,
                    fileSrc: uploadedFile
                }
            );
        }

        removeCallback();
    };

    const handleRemove = () => removeImage.mutateAsync({imageName})

    return (
        <div className={styles.image_inner}>
            <div className={styles.card_header}>
                Image Info:
            </div>

            <div className={styles.inner_wrapper}>
                <Formik
                    initialValues={initValues}
                    onSubmit={handleSubmit}
                    validationSchema={adminImageSchema}
                >
                    {
                        ({
                             handleChange,
                             isSubmitting,
                             isValid,
                             errors,
                             touched,
                             dirty,
                             setFieldValue,
                             values
                         }) => (
                            <Form>
                                <div className={styles.image_source}>
                                    <label>
                                        <p>Select an Image:</p>
                                        {
                                            imageResponseObj.imageName &&
                                            <Field
                                                as='select'
                                                className={styles.image_input}
                                                name='imageOptions'
                                                disabled={!!values.file_src}
                                                onChange={async e => {
                                                    handleChange(e);
                                                    await setFieldValue('image_src', `/img/page-img/${e.target.value}`);
                                                }}
                                            >
                                                <option value="">(Select an image)</option>
                                                {
                                                    images?.isSuccess > 0 &&
                                                    images?.data?.data?.data?.map(({
                                                                                       src: imageSource
                                                                                   }) => (
                                                        <option
                                                            value={`${imageSource.replace('./img/page-img/', '')}`}
                                                            key={`${imageSource}`}
                                                        >
                                                            {imageSource.replace('./img/page-img/', '')}
                                                        </option>
                                                    ))
                                                }
                                            </Field>
                                        }

                                        <Field
                                            disabled={!!values.imageOptions}
                                            type='input'
                                            name='file_src'
                                            className={styles.image_input}
                                            component={ImageInput}
                                            aria-label={`A button to update the image.`}
                                            setFieldValue={setFieldValue}
                                        />

                                        {errors.image_src && touched.image_src ? (
                                            <div className='u-error-text'>{errors.image_src}</div>
                                        ) : null}
                                    </label>

                                    <div className={styles.image_container}>
                                        <img
                                            className={styles.image_container_image}
                                            src={`api/${values.image_src}`}
                                            alt={values.image_alt}
                                            aria-label={values.image_alt}
                                            loading="lazy"
                                        />
                                    </div>
                                </div>

                                <div className={styles.image_alt}>
                                    <label className={styles.image_label}>
                                        Alt Text:
                                    </label>
                                    <Field
                                        type='input'
                                        name='image_alt'
                                        className={styles.image_input}
                                        aria-label={`A field containing the alternate text for the image`}
                                    />
                                    {errors.image_alt && touched.image_alt ? (
                                        <div className='u-error-text'>{errors.image_alt}</div>
                                    ) : null}
                                </div>

                                <div className={styles.image_tagline}>
                                    <label className={styles.image_label}>
                                        Tagline:
                                    </label>
                                    <Field
                                        type='input'
                                        name='image_tagline'
                                        className={styles.image_input}
                                        aria-label={`A field containing the tagline text for the image`}
                                    />
                                    {errors.image_tagline && touched.image_tagline ? (
                                        <div className='u-error-text'>{errors.image_tagline}</div>
                                    ) : null}
                                </div>

                                <div className={styles.image_button_container}>
                                    {
                                        !!imageResponseObj.imageName
                                        &&
                                        <button
                                            disabled={(isSubmitting || updateImage.isLoading)}
                                            className={styles.image_button_container_button_remove}
                                            type='button'
                                            onClick={handleRemove}
                                            aria-label={'A button the removes the image from the current section'}
                                        >
                                            <span>Remove</span>
                                            {
                                                (isSubmitting || updateImage.isLoading) &&
                                                <div className={styles.loading_spinner}>
                                                    <LoadingSpinner
                                                        role='presentation'
                                                        aria-label='A loading spinner that is on the screen during the form submission.'
                                                    />
                                                </div>
                                            }
                                        </button>}

                                    <button
                                        disabled={(isSubmitting || updateImage.isLoading) || !isValid || !dirty}
                                        className={styles.image_button_container_button}
                                        type='submit'
                                        aria-label={'A button the submits the update to the server'}
                                    >
                                        <span>Submit</span>
                                        {
                                            (isSubmitting || updateImage.isLoading) &&
                                            <div className={styles.loading_spinner}>
                                                <LoadingSpinner
                                                    role='presentation'
                                                    aria-label='A loading spinner that is on the screen during the form submission.'
                                                />
                                            </div>
                                        }
                                    </button>
                                </div>
                            </Form>
                        )
                    }
                </Formik>
            </div>
        </div>
    )
}

AdminImage.propTypes = {
    removeCallback: PropTypes.func,
    imageResponseObj: PropTypes.shape({
        imageName: PropTypes.string,
        src: PropTypes.string,
        tagline: PropTypes.string,
        priority: PropTypes.string
    })
}

export default AdminImage;