import {Field, Form, Formik} from "formik";
import PropTypes from "prop-types";
import {useContext} from "react";
import {Col, Container, Row} from "react-bootstrap";
import * as Yup from "yup";

import {AdminSectionContext} from "../../../../context/adminSectionContext/AdminSectionContext.jsx";
import {
    useCreateImage,
    useCreateLink,
    useGetPageImages,
    useRemoveImage,
    useRemoveLink,
    useUpdateImage,
    useUpdateLink
} from "../../../../hooks/api-hooks.js";
import AdminSectionButtons from "../adminSectionButtons/AdminSectionButtons.jsx";
import ImageLoaderField from "../imageLoaderField/ImageLoaderField.jsx";

import styles from "./AdminSocialMedia.module.scss";


const AdminSocialMedia = (
    {
        imageResponseObj,
        linkResponseObj,
        removeCallback = () => {
        }
    }
) => {
    const {setErrors, setInfo} = useContext(AdminSectionContext);

    const {
        link: {
            id: linkId,
            title,
            url
        }
    } = linkResponseObj;

    const initValues = {
        id: imageResponseObj?.image?.id || '',
        image_name: imageResponseObj?.image?.imageName || '',
        image_src: imageResponseObj?.image?.src || '',
        field_src: '',
        image_alt: imageResponseObj?.image?.alt || '',
        image_tagline: imageResponseObj?.image?.tagline || '',
        imageOptions: '',
        link_id: linkId || '',
        link_title: title || '',
        link_url: url || ''
    };

    const AdminSocialMediaSchema = Yup.object().shape({
        link_title: Yup.string()
            .max(150, 'Please keep the link title to only 150 characters.')
            .required('Link title is required.'),
        link_url: Yup.string()
            .url('Must be a valid url.')
            .max(500, 'Url is too long.')
            .required('Url is required.'),
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

    const updateLink = useUpdateLink(setErrors, setInfo);
    const createLink = useCreateLink(setErrors, setInfo);
    const removeLink = useRemoveLink(setErrors, setInfo);

    const handleSubmit = async ({
                                    image_src,
                                    image_alt,
                                    image_tagline,
                                    file_src,
                                    link_id,
                                    link_title,
                                    link_url
                                }
    ) => {
        const socialMediaImageName = `${link_title}-social-media-image`;
        let promises = [];

        // New Admin Social Media
        if (!imageResponseObj?.image?.imageName) {
            if (file_src) {
                promises.push(createImage.mutateAsync(
                    {
                        imageName: socialMediaImageName,
                        sectionName: imageResponseObj?.sectionName,
                        alt: image_alt,
                        tagline: image_tagline,
                        fileSrc: file_src
                    }
                ));
            } else {
                promises.push(createImage.mutateAsync(
                    {
                        imageName: socialMediaImageName,
                        sectionName: imageResponseObj?.sectionName,
                        alt: image_alt,
                        tagline: image_tagline,
                        imageSrc: image_src
                    }
                ))
            }

            promises.push(
                createLink.mutateAsync({
                    title: link_title,
                    url: link_url,
                    sectionName: imageResponseObj?.sectionName
                })
            );

            await Promise.all(promises);
        }
        // Update Admin Social Media
        else {
            await Promise.all(
                [
                    updateLink.mutateAsync({
                        id: link_id,
                        title: link_title,
                        url: link_url
                    }),
                    updateImage.mutateAsync(
                        {
                            id: imageResponseObj?.image?.id,
                            imageName: socialMediaImageName,
                            src: image_src,
                            alt: image_alt,
                            tagline: image_tagline,
                            fileSrc: file_src
                        }
                    )
                ]
            );
        }

        removeCallback();
    };

    const handleRemove = async () => {
        await removeImage({imageId: imageResponseObj?.image?.id});
        await removeLink.mutateAsync({linkId});
    }

    return (
        <div className={styles.social_media_inner}>
            <div className={styles.card_header}>
                Social Media Info:
            </div>

            <Formik
                initialValues={initValues}
                onSubmit={handleSubmit}
                validationSchema={AdminSocialMediaSchema}
            >
                {
                    ({
                         handleChange,
                         isSubmitting,
                         values,
                         isValid,
                         errors,
                         touched,
                         dirty
                     }) => (
                        <Form>
                            <Col>
                                <Container>
                                    <ImageLoaderField
                                        onChange={handleChange}
                                        images={allImagesQuery?.isSuccess > 0
                                            ? allImagesQuery?.data?.data?.data
                                            : []}
                                    />
                                </Container>
                            </Col>

                            <Col className='gap-0' sm={12}>
                                <Container>
                                    <label>Title:</label>
                                    <Row>
                                        <Field
                                            value={values.link_title}
                                            type='input'
                                            name='link_title'
                                            className={styles.questions_form_section_input}
                                            aria-label={`A field labeling the title of the link ${values.link_title}`}
                                        />
                                        {errors.link_title && touched.link_title ? (
                                            <div className='u-error-text'>{errors.link_title}</div>
                                        ) : null}
                                    </Row>
                                </Container>
                            </Col>

                            <Col className='gap-0' sm={12}>
                                <Container>
                                    <label>URL: (include the http&#58;&#47;&#47; or https&#58;&#47;&#47;)</label>
                                    <Row>
                                        <Field
                                            value={values.link_url}
                                            type='input'
                                            name='link_url'
                                            className={styles.questions_form_section_input}
                                            aria-label={`A field containing the url for the link of ${values.link_title}`}
                                        />
                                        {errors.link_url && touched.link_url ? (
                                            <div className='u-error-text'>{errors.link_url}</div>
                                        ) : null}
                                    </Row>
                                </Container>
                            </Col>

                            <Col sm={12} className='gap-0'>
                                <Container>
                                    <label>
                                        Alt Text:
                                    </label>
                                    <Row>
                                        <Field
                                            type='input'
                                            name='image_alt'
                                            className={styles.questions_form_section_input}
                                            aria-label={`A field containing the alternate text for the image`}
                                        />
                                        {errors.image_alt && touched.image_alt ? (
                                            <div className='u-error-text'>{errors.image_alt}</div>
                                        ) : null}
                                    </Row>
                                </Container>
                            </Col>

                            <AdminSectionButtons
                                dirty={dirty}
                                handleRemove={handleRemove}
                                id={imageResponseObj?.image?.id}
                                isLoading={removeImageLoading}
                                isSubmitting={isSubmitting}
                                isValid={isValid}
                            />
                        </Form>
                    )
                }
            </Formik>
        </div>
    )
}

AdminSocialMedia.propTypes = {
    linkResponseObj: PropTypes.shape({
        link: PropTypes.shape({
            id: PropTypes.string,
            title: PropTypes.string,
            url: PropTypes.string
        })
    }).isRequired,
    removeCallback: PropTypes.func,
    imageResponseObj: PropTypes.shape({
        image: PropTypes.shape({
            imageName: PropTypes.string,
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            src: PropTypes.string,
            alt: PropTypes.string,
            tagline: PropTypes.string,
            priority: PropTypes.string
        }),
        sectionName: PropTypes.string
    }).isRequired
}

export default AdminSocialMedia;