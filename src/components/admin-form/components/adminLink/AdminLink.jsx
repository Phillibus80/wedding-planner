import {Field, Form, Formik} from "formik";
import PropTypes from "prop-types";
import {useContext} from "react";
import {Col, Container} from "react-bootstrap";
import * as Yup from "yup";

import {AdminSectionContext} from "../../../../context/adminSectionContext/AdminSectionContext.jsx";
import {useCreateLink, useRemoveLink, useUpdateLink} from "../../../../hooks/api-hooks.js";
import AdminSectionButtons from "../adminSectionButtons/AdminSectionButtons.jsx";

import * as styles from './AdminLink.module.scss';

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
        if (id) {
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
        <div className={styles.admin_link}>
            <div className={styles.card_header}>
                Link Info:
            </div>

            <Formik initialValues={initValues} onSubmit={handleSubmit} validationSchema={adminLinkSchema}>
                {
                    ({isSubmitting, isValid, errors, touched, dirty}) => (
                        <Form>
                            <Container>
                                <Col className='gap-0' sm={12}>
                                    <label>
                                        Title:
                                    </label>
                                </Col>

                                <Col className='gap-0' sm={12}>
                                    <Field
                                        type='input'
                                        name='link_title'
                                        className={styles.form_input}
                                        aria-label={`A field labeling the title of the link ${title}`}
                                    />
                                    {errors.link_title && touched.link_title ? (
                                        <div className='u-error-text'>{errors.link_title}</div>
                                    ) : null}
                                </Col>


                                <Col className='gap-0' sm={12}>
                                    <label>URL:</label>
                                </Col>

                                <Col className='gap-0' sm={12}>
                                    <Field
                                        type='input'
                                        name='link_url'
                                        className={styles.form_input}
                                        aria-label={`A field containing the url for the link of  ${title}`}
                                    />
                                    {errors.link_url && touched.link_url ? (
                                        <div className='u-error-text'>{errors.link_url}</div>
                                    ) : null}
                                </Col>

                                <AdminSectionButtons
                                    dirty={dirty}
                                    handleRemove={handleRemove}
                                    id={id}
                                    isLoading={removeLink?.isLoading}
                                    isSubmitting={isSubmitting}
                                    isValid={isValid}
                                />
                            </Container>
                        </Form>
                    )
                }
            </Formik>
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