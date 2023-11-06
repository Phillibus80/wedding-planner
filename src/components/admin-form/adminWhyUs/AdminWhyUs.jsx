import {useContext} from "react";
import * as Yup from "yup";
import {useCreateWhyUsItem, useRemoveWhyUs, useUpdateWhyUs} from "../../../hooks/api-hooks.js";
import styles from './AdminWhyUs.module.scss';
import {Field, Form, Formik} from "formik";
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner.jsx";
import {SECTIONS} from "../../../constants.js";
import {AdminSectionContext} from "../../../context/adminSectionContext/AdminSectionContext.jsx";

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
        if (!!id) {
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

            <div className={styles.whyUs_wrapper}>
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
                            <Form
                                className={styles.whyUs_form_wrapper}
                            >
                                <div className={styles.field_wrapper}>
                                    <label>
                                        Title:
                                    </label>
                                    <Field
                                        type='input'
                                        name='whyUs_Title'
                                        className={styles.whyUs_form_input}
                                        aria-label={`A field labeling the title of one of the reasons to choose Risen Rose - ${title}`}
                                    />
                                    {errors.whyUs_Title && touched.whyUs_Title ? (
                                        <div className='u-error-text'>{errors.whyUs_Title}</div>
                                    ) : null}
                                </div>

                                <div className={styles.field_wrapper}>
                                    <label>Why Us Text::</label>
                                    <Field
                                        as='textarea'
                                        type='input'
                                        name='whyUs_Text'
                                        className={styles.whyUs_form_textarea}
                                        aria-label={`A field containing the text for the reasons why to choose Risen Rose - ${title}`}
                                    />
                                    {errors.whyUs_Text && touched.whyUs_Text ? (
                                        <div className='u-error-text'>{errors.whyUs_Text}</div>
                                    ) : null}
                                </div>

                                <div className={styles.field_wrapper}>
                                    <label>Material UI Icons::</label>
                                    <p>For a list of available Material Icons, go <a
                                        href='https://mui.com/material-ui/material-icons/'
                                        target='_blank'
                                    >here</a></p>
                                    <Field
                                        type='input'
                                        name='mui_Icon'
                                        className={styles.whyUs_form_input}
                                        aria-label={`An input field to change the Material Design Icon`}
                                        disabled={values.iconify_Icon}
                                    />
                                    {errors.muiIcon && touched.muiIcon ? (
                                        <div className='u-error-text'>{errors.muiIcon}</div>
                                    ) : null}
                                </div>

                                <div className={styles.field_wrapper}>
                                    <label>Iconify Icons::</label>
                                    <p>For a list of available Iconify Icons, go <a
                                        href='https://icon-sets.iconify.design/'
                                        target='_blank'
                                    >here</a></p>
                                    <Field
                                        type='input'
                                        name='iconify_Icon'
                                        className={styles.whyUs_form_input}
                                        aria-label={`An input field to change the Iconify Icon`}
                                        disabled={values.mui_Icon}
                                    />
                                    {errors.muiIcon && touched.muiIcon ? (
                                        <div className='u-error-text'>{errors.muiIcon}</div>
                                    ) : null}
                                </div>

                                <div className={styles.whyUs_form_wrapper_button_container}>
                                    {
                                        !!id
                                        &&
                                        <>
                                            <button
                                                disabled={(isSubmitting || deleteWhyUsIsLoading)}
                                                className={styles.whyUs_form_wrapper_button_container_button_remove}
                                                type='button'
                                                onClick={handleRemove}
                                                aria-label={'A button the removes the image from the current section'}
                                            >
                                                <span>Remove</span>
                                                {
                                                    (isSubmitting || deleteWhyUsIsLoading) &&
                                                    <div className={styles.loading_spinner}>
                                                        <LoadingSpinner
                                                            role='presentation'
                                                            aria-label='A loading spinner that is on the screen during the form submission.'
                                                        />
                                                    </div>
                                                }
                                            </button>
                                        </>
                                    }

                                    <button
                                        disabled={isSubmitting || !isValid || !dirty}
                                        className={styles.whyUs_form_wrapper_button_container_button}
                                        type='submit'
                                        aria-label={'A button the submits the update to the why us item.'}
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
        </section>
    )
};

export default AdminWhyUs;