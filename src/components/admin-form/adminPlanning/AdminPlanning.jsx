import {useContext} from "react";
import * as Yup from "yup";
import {useCreatePlanningItem, useRemovePlanning, useUpdatePlanning,} from "../../../hooks/api-hooks.js";
import styles from './AdminPlanning.module.scss';
import {Field, Form, Formik} from "formik";
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner.jsx";
import {SECTIONS} from "../../../constants.js";
import {AdminSectionContext} from "../../../context/adminSectionContext/AdminSectionContext.jsx";
import PropTypes from "prop-types";

const AdminPlanning = ({
                           id,
                           columnTitle,
                           title,
                           planningText,
                           removeCallback
                       }) => {
    const {setErrors, setInfo} = useContext(AdminSectionContext);

    const initValues = {
        planning_Column_Title: columnTitle || '',
        planning_Title: title || '',
        planning_Text: planningText || ''
    };

    const adminPlanningSchema = Yup.object().shape({
        planning_Column_Title: Yup.string()
            .max(50, 'The Column Title is too long')
            .required('Column Title is required.'),
        planning_Title: Yup.string()
            .max(50, 'The title is too long')
            .required('Planning Title is required.'),
        planning_Text: Yup.string()
            .max(2000, 'Please keep the text to under 2000 characters.')
            .required('Planning Text is required.')
    });

    const {
        mutateAsync: createPlanning,
    } = useCreatePlanningItem(setErrors, setInfo);
    const {mutateAsync: updatePlanning} = useUpdatePlanning(setErrors, setInfo);
    const {
        mutateAsync: deletePlanning,
        isLoading: deletePlanningIsLoading,
        isSuccess: deleteMyUsIsSuccess
    } = useRemovePlanning(setErrors, setInfo);

    const handleSubmit = async (
        {
            planning_Column_Title,
            planning_Title,
            planning_Text
        }
    ) => {
        const currentSectionName = SECTIONS.PLANNING;
        if (!!id) {
            await updatePlanning({
                id,
                columnTitle: planning_Column_Title,
                title: planning_Title,
                planningText: planning_Text
            });
        } else {
            await createPlanning({
                columnTitle: planning_Column_Title,
                title: planning_Title,
                planningText: planning_Text,
                sectionName: currentSectionName
            });

            removeCallback();
        }
    };

    const handleRemove = async () => {
        await deletePlanning({id});
        deleteMyUsIsSuccess && removeCallback();
    }

    return (
        <section className={styles.planning}>
            <div className={styles.card_header}>
                Planning Info:
            </div>

            <div className={styles.planning_wrapper}>
                <Formik
                    initialValues={initValues}
                    onSubmit={handleSubmit}
                    validationSchema={adminPlanningSchema}>
                    {
                        ({
                             isSubmitting,
                             isValid,
                             errors,
                             touched,
                             dirty
                         }) => (
                            <Form
                                className={styles.planning_form_wrapper}
                            >
                                <div className={styles.field_wrapper}>
                                    <label>
                                        Column Title:
                                    </label>
                                    <Field
                                        type='input'
                                        name='planning_Column_Title'
                                        className={styles.planning_form_input}
                                        aria-label={`Column title of in the Planning section - ${columnTitle}`}
                                    />
                                    {errors.planning_Column_Title && touched.planning_Column_Title ? (
                                        <div className='u-error-text'>{errors.planning_Column_Title}</div>
                                    ) : null}
                                </div>

                                <div className={styles.field_wrapper}>
                                    <label>
                                        Title:
                                    </label>
                                    <Field
                                        type='input'
                                        name='planning_Title'
                                        className={styles.planning_form_input}
                                        aria-label={`A field labeling the title of one of the reasons to choose Risen Rose - ${title}`}
                                    />
                                    {errors.planning_Title && touched.planning_Title ? (
                                        <div className='u-error-text'>{errors.planning_Title}</div>
                                    ) : null}
                                </div>

                                <div className={styles.field_wrapper}>
                                    <label>Planning Text::</label>
                                    <Field
                                        as='textarea'
                                        type='input'
                                        name='planning_Text'
                                        className={styles.planning_form_textarea}
                                        aria-label={`A field containing the text for the reasons why to choose Risen Rose - ${title}`}
                                    />
                                    {errors.planning_Text && touched.planning_Text ? (
                                        <div className='u-error-text'>{errors.planning_Text}</div>
                                    ) : null}
                                </div>

                                <div className={styles.planning_form_wrapper_button_container}>
                                    {
                                        !!id
                                        &&
                                        <>
                                            <button
                                                disabled={(isSubmitting || deletePlanningIsLoading)}
                                                className={styles.planning_form_wrapper_button_container_button_remove}
                                                type='button'
                                                onClick={handleRemove}
                                                aria-label={'A button the removes the image from the current section'}
                                            >
                                                <span>Remove</span>
                                                {
                                                    (isSubmitting || deletePlanningIsLoading) &&
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
                                        className={styles.planning_form_wrapper_button_container_button}
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

AdminPlanning.propTypes = {
    id: PropTypes.string,
    columnTitle: PropTypes.string,
    title: PropTypes.string,
    planningText: PropTypes.string,
    removeCallback: PropTypes.func
};

export default AdminPlanning;