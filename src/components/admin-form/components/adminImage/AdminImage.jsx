import {Field, Form, Formik} from "formik";
import PropTypes from "prop-types";
import {useContext} from "react";
import {Col, Container, Row} from "react-bootstrap";
import * as Yup from "yup";

import {AdminSectionContext} from "../../../../context/adminSectionContext/AdminSectionContext.jsx";
import {useCreateImage, useGetPageImages, useRemoveImage, useUpdateImage} from "../../../../hooks/api-hooks.js";
import AdminSectionButtons from "../adminSectionButtons/AdminSectionButtons.jsx";
import ImageLoaderField from "../imageLoaderField/ImageLoaderField.jsx";

import styles from "./AdminImage.module.scss";

const AdminImage = ({
                        imageResponseObj,
                        removeCallback = () => {
                        }
                    }) => {
    const {setErrors, setInfo} = useContext(AdminSectionContext);

    const {
        id,
        imageName,
        src,
        alt,
        tagline,
        sectionName
    } = imageResponseObj;

    const initValues = {
        image_name: imageName || '',
        image_src: src || '',
        field_src: '',
        image_alt: alt || '',
        image_tagline: tagline || '',
        imageOptions: ''
    };

    const adminImageSchema = Yup.object().shape({
        image_name: Yup.string(),
        image_src: Yup.string()
            .max(500, 'Image String is too long'),
        image_alt: Yup.string()
            .max(50, 'Please keep the alt text to only 50 characters.')
            .required('Alt Text is required.'),
        image_tagline: Yup.string()
            .max(150, 'Please keep the tagline text to only 50 characters.')
    });

    const allImagesQuery = useGetPageImages();
    const updateImage = useUpdateImage(setErrors, setInfo);
    const createImage = useCreateImage(setErrors, setInfo);
    const {
        mutateAsync: removeImage,
        isLoading: removeImageLoading
    } = useRemoveImage(setErrors, setInfo);

    const handleSubmit = async (
        {
            image_name: imageName,
            image_src: imageSrc,
            image_alt: imageAlt,
            image_tagline: imageTagline,
            file_src: uploadedFile
        }
    ) => {
        // New Image
        if (!imageResponseObj.imageName) {

            if (uploadedFile) {
                await createImage.mutateAsync(
                    {
                        imageName: imageName,
                        sectionName: sectionName,
                        alt: imageAlt,
                        tagline: imageTagline,
                        fileSrc: uploadedFile
                    }
                );
            } else {
                // Using an existing image
                await createImage.mutateAsync(
                    {
                        imageName: imageName,
                        sectionName: sectionName,
                        alt: imageAlt,
                        tagline: imageTagline,
                        imageSrc: imageSrc
                    }
                );
            }
        }
        // Updating an image
        else {
            await updateImage.mutateAsync(
                {
                    id,
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

    const handleRemove = () => removeImage({imageId: id})

    return (
        <div className={styles.image_inner}>
            <div className={styles.card_header}>
                Image Info:
            </div>

            <Container>
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
                             dirty
                         }) => (
                            <Form>
                                <Col>
                                    <ImageLoaderField
                                        onChange={handleChange}
                                        images={allImagesQuery?.isSuccess > 0
                                            ? allImagesQuery?.data?.data?.data
                                            : []}
                                    />
                                </Col>

                                <Col sm={12} className='gap-0'>
                                    <Container>
                                        <label className={styles.image_label}>
                                            Image Title:
                                        </label>
                                        <Row>
                                            <Field
                                                type='input'
                                                name='image_name'
                                                className={styles.image_input}
                                                aria-label={`A field for the naming of the image`}
                                            />
                                            {errors.image_name && touched.image_name ? (
                                                <div className='u-error-text'>{errors.image_name}</div>
                                            ) : null}
                                        </Row>
                                    </Container>
                                </Col>

                                <Col sm={12} className='gap-0'>
                                    <Container>
                                        <label className={styles.image_label}>
                                            Alt Text:
                                        </label>
                                        <Row>
                                            <Field
                                                type='input'
                                                name='image_alt'
                                                className={styles.image_input}
                                                aria-label={`A field containing the alternate text for the image`}
                                            />
                                            {errors.image_alt && touched.image_alt ? (
                                                <div className='u-error-text'>{errors.image_alt}</div>
                                            ) : null}
                                        </Row>
                                    </Container>
                                </Col>

                                <Col sm={12} className='gap-0'>
                                    <Container>
                                        <label className={styles.image_label}>
                                            Tagline:
                                        </label>
                                        <Row>
                                            <Field
                                                type='input'
                                                name='image_tagline'
                                                className={styles.image_input}
                                                aria-label={`A field containing the tagline text for the image`}
                                            />
                                            {errors.image_tagline && touched.image_tagline ? (
                                                <div className='u-error-text'>{errors.image_tagline}</div>
                                            ) : null}
                                        </Row>
                                    </Container>
                                </Col>

                                <AdminSectionButtons
                                    dirty={dirty}
                                    handleRemove={handleRemove}
                                    id={imageName}
                                    isLoading={removeImageLoading}
                                    isSubmitting={isSubmitting}
                                    isValid={isValid}
                                />
                            </Form>
                        )
                    }
                </Formik>
            </Container>
        </div>
    )
}

AdminImage.propTypes = {
    removeCallback: PropTypes.func,
    imageResponseObj: PropTypes.shape({
        imageName: PropTypes.string,
        id: PropTypes.string,
        src: PropTypes.string,
        alt: PropTypes.string,
        tagline: PropTypes.string,
        priority: PropTypes.string,
        sectionName: PropTypes.string
    })
}

export default AdminImage;