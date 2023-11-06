import styles from './AdminLink.module.scss';
import {Field, Form, Formik} from "formik";
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner.jsx";
import {useContext} from "react";
import PropTypes from "prop-types";
import {useCreateLink, useRemoveLink, useUpdateLink} from "../../../hooks/api-hooks.js";
import * as Yup from "yup";
import {AdminSectionContext} from "../../../context/adminSectionContext/AdminSectionContext.jsx";

const AdminLink = ({
                       linkResponseObj,
                       sectionName,
                       removeCallback = () => {
                       }
                   }) => {
    const {setErrors, setInfo} = useContext(AdminSectionContext);

    const {
        id,
        title,
        url
    } = linkResponseObj;

    const adminLinkSchema = Yup.object().shape({
        link_title: Yup.string()
            .max(150, 'Please keep the link title to only 150 characters.')
            .required('Link title is required.'),
        link_url: Yup.string()
            .max(500, 'Url is too long.')
            .required('Url is required.'),
    });

    const updateLink = useUpdateLink(setErrors, setInfo);
    const createLink = useCreateLink(setErrors, setInfo);
    const removeLink = useRemoveLink(setErrors, setInfo);

    const initValues = {
        id: id,
        link_title: title,
        link_url: url
    };

    const handleSubmit = async e => {
        // Update Link
        if (!!id) {
            await updateLink.mutateAsync({
                id,
                title: e.link_title,
                url: e.link_url
            });
        }
        // New Link
        else {
            await createLink.mutateAsync({
                title: e.link_title,
                url: e.link_url,
                sectionName: sectionName
            });
        }

        removeCallback();
    };


    const handleRemove = async () => removeLink.mutateAsync({linkId: id});

    return (
        <div className={styles.links_link}>
            <div className={styles.card_header}>
                Link Info:
            </div>

            <div className={styles.links_link_wrapper}>

                <Formik initialValues={initValues} onSubmit={handleSubmit} validationSchema={adminLinkSchema}>
                    {
                        ({isSubmitting, isValid, errors, touched, dirty}) => (
                            <Form
                                className={styles.links_link_form_wrapper}
                            >
                                <div className={styles.links_wrapper}>
                                    <label>
                                        Title:
                                    </label>
                                    <Field
                                        type='input'
                                        name='link_title'
                                        className={styles.adminSection_form_input}
                                        aria-label={`A field labeling the title of the link ${title}`}
                                    />
                                    {errors.link_title && touched.link_title ? (
                                        <div className='u-error-text'>{errors.link_title}</div>
                                    ) : null}
                                </div>

                                <div className={styles.links_wrapper}>
                                    <label>URL:</label>
                                    <Field
                                        type='input'
                                        name='link_url'
                                        className={styles.adminSection_form_input}
                                        aria-label={`A field containing the url for the link of  ${title}`}
                                    />
                                    {errors.link_url && touched.link_url ? (
                                        <div className='u-error-text'>{errors.link_url}</div>
                                    ) : null}
                                </div>

                                <div className={styles.links_link_button_container}>
                                    {
                                        !!id
                                        &&
                                        <button
                                            disabled={(isSubmitting || removeLink.isLoading)}
                                            className={styles.links_link_button_container_button_remove}
                                            type='button'
                                            onClick={handleRemove}
                                            aria-label={'A button the removes the image from the current section'}
                                        >
                                            <span>Remove</span>
                                            {
                                                (isSubmitting || removeLink.isLoading) &&
                                                <div className={styles.loading_spinner}>
                                                    <LoadingSpinner
                                                        role='presentation'
                                                        aria-label='A loading spinner that is on the screen during the form submission.'
                                                    />
                                                </div>
                                            }
                                        </button>}
                                    <button
                                        disabled={isSubmitting || !isValid || !dirty}
                                        className={styles.links_link_button_container_button}
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
                                </div>
                            </Form>
                        )
                    }
                </Formik>
            </div>
        </div>
    )
}

AdminLink.propTypes = {
    linkResponseObj: PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
        url: PropTypes.string
    }),
    sectionName: PropTypes.string,
    removeCallback: PropTypes.func
};

export default AdminLink;