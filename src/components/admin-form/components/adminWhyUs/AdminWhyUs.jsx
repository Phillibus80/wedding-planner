import {Field, Form, Formik} from "formik";
import PropTypes from "prop-types";
import {useContext} from "react";
import {Col, Container} from "react-bootstrap";
import * as Yup from "yup";

import {SECTIONS} from "../../../../constants.js";
import {AdminSectionContext} from "../../../../context/adminSectionContext/AdminSectionContext.jsx";
import {useCreateWhyUsItem, useRemoveWhyUs, useUpdateWhyUs} from "../../../../hooks/api-hooks.js";
import AdminSectionButtons from "../adminSectionButtons/AdminSectionButtons.jsx";

import styles from './AdminWhyUs.module.scss';


const AdminWhyUs = ({
                        id,
                        title,
                        whyUsText,
                        muiIcon,
                        iconifyIcon,
                        removeCallback
                    }) => {
    const {setErrors, setInfo} = useContext(AdminSectionContext);


    const initValues = {
        whyUs_Title: title || '',
        whyUs_Text: whyUsText || '',
        mui_Icon: muiIcon || '',
        iconify_Icon: iconifyIcon || ''
    };

    const adminWhyUsSchema = Yup.object().shape({
        whyUs_Title: Yup.string()
            .max(50, 'The title is too long')
            .required('Why Us Title is required.'),
        whyUs_Text: Yup.string()
            .max(2000, 'Please keep the text to under 2000 characters.')
            .required('Why Us Text is required.'),
        mui_Icon: Yup.string()
            .max(200, 'The icon string is too long.'),
        iconify_Icon: Yup.string()
            .max(200, 'The icon string is too long.')
    });

    const {
        mutateAsync: createWhyUs
    } = useCreateWhyUsItem(setErrors, setInfo);
    const {mutateAsync: updateWhyUs} = useUpdateWhyUs(setErrors, setInfo);
    const {
        mutateAsync: deleteWhyUs,
        isLoading: deleteWhyUsIsLoading,
        isSuccess: deleteMyUsIsSuccess
    } = useRemoveWhyUs(setErrors, setInfo);

    const handleSubmit = async (
        {
            whyUs_Title,
            whyUs_Text,
            mui_Icon,
            iconify_Icon
        }
    ) => {
        if (id) {
            await updateWhyUs({
                id,
                title: whyUs_Title,
                whyText: whyUs_Text,
                muiIcon: mui_Icon,
                iconifyIcon: iconify_Icon
            });
        } else {
            await createWhyUs({
                sectionName: SECTIONS.WHY_US,
                title: whyUs_Title,
                whyText: whyUs_Text,
                muiIcon: mui_Icon,
                iconifyIcon: iconify_Icon
            });

            removeCallback();
        }
    };

    const handleRemove = async () => {
        await deleteWhyUs({id});
        deleteMyUsIsSuccess && removeCallback();
    }

    return (
        <section className={styles.whyUs}>
            <div className={styles.card_header}>
                Why Us Info:
            </div>

            <Formik
                initialValues={initValues}
                onSubmit={handleSubmit}
                validationSchema={adminWhyUsSchema}>
                {
                    ({
                         isSubmitting,
                         isValid,
                         errors,
                         touched,
                         dirty,
                         values
                     }) => (
                        <Form>
                            <Container>
                                <Col className='gap-0' sm={12}> <label>
                                    Title:
                                </label>
                                </Col>

                                <Col className='gap-0' sm={12}>
                                    <Field
                                        type='input'
                                        name='whyUs_Title'
                                        className={styles.form_input}
                                        aria-label={`A field labeling the title of one of the reasons to choose Risen Rose - ${title}`}
                                    />
                                    {errors.whyUs_Title && touched.whyUs_Title ? (
                                        <div className='u-error-text'>{errors.whyUs_Title}</div>
                                    ) : null}
                                </Col>


                                <Col className='gap-0' sm={12}>
                                    <label>Why Us Text::</label>
                                    <Field
                                        as='textarea'
                                        type='input'
                                        name='whyUs_Text'
                                        className={styles.form_textarea}
                                        aria-label={`A field containing the text for the reasons why to choose Risen Rose - ${title}`}
                                    />
                                    {errors.whyUs_Text && touched.whyUs_Text ? (
                                        <div className='u-error-text'>{errors.whyUs_Text}</div>
                                    ) : null}
                                </Col>

                                <Col className='gap-0' sm={12}>
                                    <label>Material UI Icons::</label>
                                    <p>For a list of available Material Icons, go <a
                                        href='https://mui.com/material-ui/material-icons/'
                                        target='_blank' rel="noreferrer"
                                    >here</a></p>
                                    <Field
                                        type='input'
                                        name='mui_Icon'
                                        className={styles.form_input}
                                        aria-label={`An input field to change the Material Design Icon`}
                                        disabled={values.iconify_Icon}
                                    />
                                    {errors.muiIcon && touched.muiIcon ? (
                                        <div className='u-error-text'>{errors.muiIcon}</div>
                                    ) : null}
                                </Col>

                                <Col className='gap-0' sm={12}>
                                    <label>Iconify Icons::</label>
                                    <p>For a list of available Iconify Icons, go <a
                                        href='https://icon-sets.iconify.design/'
                                        target='_blank' rel="noreferrer"
                                    >here</a></p>
                                    <Field
                                        type='input'
                                        name='iconify_Icon'
                                        className={styles.form_input}
                                        aria-label={`An input field to change the Iconify Icon`}
                                        disabled={values.mui_Icon}
                                    />
                                    {errors.muiIcon && touched.muiIcon ? (
                                        <div className='u-error-text'>{errors.muiIcon}</div>
                                    ) : null}
                                </Col>

                                <AdminSectionButtons
                                    dirty={dirty}
                                    handleRemove={handleRemove}
                                    id={id}
                                    isLoading={deleteWhyUsIsLoading}
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

AdminWhyUs.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    whyUsText: PropTypes.string,
    muiIcon: PropTypes.string,
    iconifyIcon: PropTypes.string,
    removeCallback: PropTypes.func
};

export default AdminWhyUs;