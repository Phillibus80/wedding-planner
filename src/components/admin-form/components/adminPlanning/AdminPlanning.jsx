import {Field, Form, Formik} from "formik";
import PropTypes from "prop-types";
import {useContext} from "react";
import {Col, Container} from "react-bootstrap";
import * as Yup from "yup";

import {SECTIONS} from "../../../../constants.js";
import {AdminSectionContext} from "../../../../context/adminSectionContext/AdminSectionContext.jsx";
import {
    useCreateImage,
    useCreatePlanningItem,
    useGetPageImages,
    useRemoveImage,
    useRemovePlanning,
    useUpdateImage,
    useUpdatePlanning,
} from "../../../../hooks/api-hooks.js";
import AdminSectionButtons from "../adminSectionButtons/AdminSectionButtons.jsx";
import ImageLoaderField from "../imageLoaderField/ImageLoaderField.jsx";

import styles from './AdminPlanning.module.scss';

const AdminPlanning = ({
                           id,
                           columnTitle,
                           title,
                           planningText,
                           removeCallback,
                           imageId,
                           imageName,
                           src = '',
                           alt,
                       }) => {
    const {setErrors, setInfo} = useContext(AdminSectionContext);
    const imagesQuery = useGetPageImages();
    const {
        isSuccess,
        data: imagesData
    } = imagesQuery;
    const images = isSuccess ? imagesData?.data?.data : [];

    const initValues = {
        planning_Column_Title: columnTitle || '',
        planning_Title: title || '',
        planning_Text: planningText || '',
        images: images,
        image_id: imageId || null,
        image_name: imageName || '',
        image_src: src || '',
        file_src: '',
        image_alt: alt || '',
        imageOptions: ''
    };

    const adminPlanningSchema = Yup.object().shape({
        planning_Column_Title: Yup.string()
            .max(50, 'The Column Title is too long')
            .matches(/^[a-z0-9' ]+$/i, 'Please only use alphanumeric characters.')
            .required('Column Title is required.'),
        planning_Title: Yup.string()
            .max(50, 'The title is too long')
            .required('Planning Title is required.'),
        planning_Text: Yup.string()
            .max(2000, 'Please keep the text to under 2000 characters.')
            .required('Planning Text is required.'),
        image_name: Yup.string(),
        image_src: Yup.string()
            .max(500, 'Image String is too long'),
        image_alt: Yup.string()
            .max(50, 'Please keep the alt text to only 50 characters.')
            .required('Alt Text is required.')
    });

    const {
        mutateAsync: createPlanning,
    } = useCreatePlanningItem(setErrors, setInfo);
    const {mutateAsync: updatePlanning} = useUpdatePlanning(setErrors, setInfo);
    const {
        mutateAsync: deletePlanning,
        isLoading: deletePlanningIsLoading,
        isSuccess: deletePlanningSuccess
    } = useRemovePlanning(setErrors, setInfo);
    const {
        mutateAsync: updateImage
    } = useUpdateImage(setErrors, setInfo);
    const {mutateAsync: createImage} = useCreateImage(setErrors, setInfo);
    const {
        mutateAsync: removeImage,
        isSuccess: removeImageSuccess
    } = useRemoveImage(setErrors, setInfo);

    const handleSubmit = async (
        {
            planning_Column_Title,
            planning_Title,
            planning_Text,
            image_id,
            image_src,
            file_src,
            image_alt,
        }
    ) => {
        const imageSRC = image_src || `/img/page-img/${file_src?.name}`;
        const newImageName = isNaN(Number(planning_Column_Title))
            ? planning_Column_Title
            : Number(planning_Column_Title);

        if (id) {
            // Update Planning
            await Promise.all([
                updatePlanning({
                    id,
                    columnTitle: planning_Column_Title,
                    title: planning_Title,
                    planningText: planning_Text
                }),
                updateImage({
                    id: image_id,
                    imageName: `${SECTIONS.PLANNING}-column-${newImageName}`,
                    src: imageSRC,
                    alt: image_alt,
                    tagline: '',
                    fileSrc: file_src
                })
            ]);
        } else {
            if (file_src) {
                await createImage({
                    imageName: `${SECTIONS.PLANNING}-column-${newImageName}`,
                    alt: image_alt,
                    tagline: '',
                    fileSrc: file_src,
                    sectionName: SECTIONS.PLANNING
                });
            } else {
                await createImage({
                    imageName: `${SECTIONS.PLANNING}-column-${newImageName}`,
                    alt: image_alt,
                    tagline: '',
                    imageSrc: imageSRC,
                    sectionName: SECTIONS.PLANNING
                });
            }

            // Create a new Planning Item
            await createPlanning({
                columnTitle: planning_Column_Title,
                title: planning_Title,
                planningText: planning_Text,
                sectionName: SECTIONS.PLANNING
            });

            removeCallback();
        }
    };

    const handleRemove = async (values) => {
        await Promise.all([
            removeImage({imageId: values.image_id}),
            deletePlanning({id})
        ]);

        (deletePlanningSuccess && removeImageSuccess) && removeCallback();
    };

    return (
        <section className={styles.planning}>
            <div className={styles.card_header}>
                Planning Info:
            </div>

            <Formik
                initialValues={initValues}
                onSubmit={handleSubmit}
                validationSchema={adminPlanningSchema}>
                {
                    ({
                         isSubmitting,
                         handleChange,
                         isValid,
                         errors,
                         touched,
                         values,
                         dirty
                     }) => (
                        <Form>
                            <Container>
                                <Col className='gap-0' sm={12}>
                                    <label>
                                        Column Title:
                                    </label>
                                </Col>

                                <Col className='gap-0' sm={12}>
                                    <Field
                                        type='input'
                                        name='planning_Column_Title'
                                        className={styles.form_input}
                                        aria-label={`Column title of in the Planning section - ${columnTitle}`}
                                    />
                                    {errors.planning_Column_Title && touched.planning_Column_Title ? (
                                        <div className='u-error-text'>{errors.planning_Column_Title}</div>
                                    ) : null}
                                </Col>

                                <Col>
                                    <ImageLoaderField
                                        onChange={handleChange}
                                        images={images}
                                    />
                                </Col>

                                <Col className='gap-0' sm={12}>
                                    <label>
                                        Alt Text:
                                    </label>
                                </Col>

                                <Col sm={12} className='gap-0'>
                                    <Field
                                        type='input'
                                        name='image_alt'
                                        className={styles.form_input}
                                        aria-label={`A field containing the alternate text for the image`}
                                    />
                                    {errors.image_alt && touched.image_alt ? (
                                        <div className='u-error-text'>{errors.image_alt}</div>
                                    ) : null}
                                </Col>

                                <Col className='gap-0' sm={12}>
                                    <label>
                                        Title:
                                    </label>
                                </Col>

                                <Col className='gap-0' sm={12}>
                                    <Field
                                        type='input'
                                        name='planning_Title'
                                        className={styles.form_input}
                                        aria-label={`A field labeling the title of one of the reasons to choose Risen Rose - ${title}`}
                                    />
                                    {errors.planning_Title && touched.planning_Title ? (
                                        <div className='u-error-text'>{errors.planning_Title}</div>
                                    ) : null}
                                </Col>

                                <Col className='gap-0' sm={12}>
                                    <label>Planning Text::</label>
                                </Col>

                                <Col className='gap-0' sm={12}>
                                    <Field
                                        as='textarea'
                                        type='input'
                                        name='planning_Text'
                                        className={styles.form_textarea}
                                        aria-label={`A field containing the text for the reasons why to choose Risen Rose - ${title}`}
                                    />
                                    {errors.planning_Text && touched.planning_Text ? (
                                        <div className='u-error-text'>{errors.planning_Text}</div>
                                    ) : null}
                                </Col>

                                <AdminSectionButtons
                                    dirty={dirty}
                                    handleRemove={() => handleRemove(values)}
                                    id={id}
                                    isLoading={deletePlanningIsLoading}
                                    isSubmitting={isSubmitting}
                                    isValid={isValid}
                                />
                            </Container>
                        </Form>
                    )
                }
            </Formik>
        </section>
    )
};

AdminPlanning.propTypes = {
    id: PropTypes.string,
    columnTitle: PropTypes.string,
    title: PropTypes.string,
    planningText: PropTypes.string,
    removeCallback: PropTypes.func,
    imageName: PropTypes.string,
    imageId: PropTypes.string,
    src: PropTypes.string,
    alt: PropTypes.string,
};

export default AdminPlanning;