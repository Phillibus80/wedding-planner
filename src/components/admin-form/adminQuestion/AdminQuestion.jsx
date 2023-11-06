import PropTypes from 'prop-types';
import styles from './AdminQuestion.module.scss';
import '../../../scss/main.scss';
import {Field, Form, Formik} from "formik";
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner.jsx";
import {
    useCreateQuestionnaireQuestion,
    useRemoveQuestionnaireQuestion,
    useUpdateQuestionnaireQuestion
} from "../../../hooks/api-hooks.js";
import * as Yup from "yup";
import {useContext} from "react";
import {AdminSectionContext} from "../../../context/adminSectionContext/AdminSectionContext.jsx";

const AdminQuestion = ({
                           questionObject,
                           removeCallback = () => {
                           },
                           sectionName,
                           pageName,
                           sectionOrder
                       }) => {
    if (!questionObject) return;
    const {setErrors, setInfo: setSuccess} = useContext(AdminSectionContext);

    const {
        mutateAsync: createQuestion
    } = useCreateQuestionnaireQuestion(setSuccess, setErrors);

    const {
        mutateAsync: updateQuestion,
        isLoading: updateQuestionIsLoading
    } = useUpdateQuestionnaireQuestion(setSuccess, setErrors);

    const {
        mutateAsync: removeQuestion,
        isSuccess: removeQuestionIsSuccess,
        isLoading: removeQuestionIsLoading
    } = useRemoveQuestionnaireQuestion(setSuccess, setErrors);

    const {
        name: questionName,
        options: questionOptions,
        question: questionText,
        required: questionRequired,
        type: qType
    } = questionObject;

    const adminQuestionSchema = Yup.object().shape({
        name: Yup.string()
            .max(1500, 'Name is too long')
            .required('Field is required.'),
        question: Yup.string()
            .max(1500, 'Question is too long')
            .required('Field is required.'),
        options: Yup.string()
            .max(1500, 'Please keep the options text to only 1500 characters.'),
        questionRequired: Yup.string()
            .required('Field is required.'),
        questionType: Yup.string()
            .max(10, 'Please keep the type text to under 10 characters.')
            .required('Field is required.'),
        questionSectionName: Yup.string()
            .max(100, 'Please keep the section name to under 100 characters.')
            .required('Field is required.')
    });

    const initValues = {
        name: questionName || '',
        options: questionOptions || '',
        question: questionText || '',
        questionRequired: questionRequired ? 'true' : 'false',
        questionType: qType || 'input',
        questionSectionName: sectionName || ''
    };

    const createRequestPayload__General = (questionSectionOrder, questionPageName) => (
        questionName,
        questionText,
        questionOptions,
        questionType,
        questionRequired,
        sectionName
    ) => ({
        section_name: sectionName,
        question_name: questionName || '',
        question_text: questionText || '',
        question_options: questionOptions || '',
        question_type: questionType || 'input',
        question_required: questionRequired === 'true',
        page_name: questionPageName,
        section_order: questionSectionOrder
    });

    const createRequestPayload = createRequestPayload__General(sectionOrder, pageName);

    const handleSubmit = async ({
                                    name,
                                    options,
                                    question,
                                    questionRequired,
                                    questionType,
                                    questionSectionName
                                }) => {
        const generatedRequestBody = createRequestPayload(name, question, options, questionType, questionRequired, questionSectionName);
        // Update Question
        if (!!questionName) {
            await updateQuestion({
                sectionName,
                questionName: questionObject.name,
                pageName,
                requestBody: generatedRequestBody
            });
        }
        // Create Question
        else {
            await createQuestion({
                requestBody: generatedRequestBody
            });
        }

        removeCallback()
    };

    const handleRemove = async () => {
        await removeQuestion({
            questionSectionName: sectionName,
            questionName: questionObject.name,
            pageName: pageName
        });

        removeQuestionIsSuccess && removeCallback();
    }

    return (
        <div className={styles.comments_wrapper}>
            <div className={styles.comments_wrapper_label}>
                <span>Question Info:</span>
            </div>

            <div className={styles.form_questions_wrapper}>
                <Formik
                    initialValues={initValues}
                    onSubmit={handleSubmit}
                    validationSchema={adminQuestionSchema}
                >
                    {
                        ({
                             isSubmitting,
                             isValid,
                             errors,
                             touched,
                             values
                         }) => (
                            <Form className={styles.inner}>
                                <label>Name (unique internal name):</label>
                                <Field
                                    type='input'
                                    name='name'
                                    className={styles.adminSection_form_input}
                                    aria-label={`A field that contains the question name: ${values.name}`}
                                />
                                {errors.name && touched.name ? (
                                    <div className='u-error-text'>{errors.name}</div>
                                ) : null}

                                <label>Options: (comma seperated list.):</label>
                                <Field
                                    disabled={values.questionType !== 'radio' && values.questionType !== 'select'}
                                    type='input'
                                    name='options'
                                    className={styles.adminSection_form_input}
                                    aria-label={`A select field showing the possible answers: ${values.options}`}
                                />
                                {errors.options && touched.options ? (
                                    <div className='u-error-text'>{errors.options}</div>
                                ) : null}

                                <label>Question text:</label>
                                <Field
                                    as='textarea'
                                    name='question'
                                    className={styles.adminSection_form_input}
                                    aria-label={`A field with the question text: ${values.question}`}
                                />
                                {errors.question && touched.question ? (
                                    <div className='u-error-text'>{errors.question}</div>
                                ) : null}

                                <label
                                    htmlFor="questionRequired"
                                    id="questionRequiredLabel"
                                >
                                    Required:
                                </label>
                                <div role="group" aria-labelledby="questionRequiredLabel">
                                    <label>
                                        <Field type="radio" name="questionRequired" value='true'/>
                                        Yes
                                    </label>

                                    <label>
                                        <Field type="radio" name="questionRequired" value='false'/>
                                        No
                                    </label>
                                </div>
                                {errors.questionRequired && touched.questionRequired ? (
                                    <div className='u-error-text'>
                                        {errors.questionRequired}
                                    </div>
                                ) : null}

                                <label>Question Type:</label>
                                <Field
                                    as='select'
                                    name='questionType'
                                    className={styles.adminSection_form_input}
                                    aria-labelledby={`questionTypeLabel`}
                                    value={values.questionType}
                                >
                                    <option disabled value=''>Select an option.</option>
                                    <option value='tel'>Telephone Number</option>
                                    <option value='email'>Email</option>
                                    <option value='number'>Number</option>
                                    <option value='input'>Small Text Input</option>
                                    <option value='select'>Select Box</option>
                                    <option value='textarea'>Large Text Input</option>
                                    <option value='radio'>Radio buttons</option>
                                    <option value='date'>Date</option>
                                    <option value='time'>Time</option>
                                </Field>
                                {errors.questionType && touched.questionType ? (
                                    <div className='u-error-text'>
                                        {errors.questionType}
                                    </div>
                                ) : null}

                                <div className={styles.button_container}>
                                    {
                                        !!questionName
                                        &&
                                        <button
                                            disabled={removeQuestionIsLoading}
                                            className={styles.button_container_button_remove}
                                            type='button'
                                            onClick={values => handleRemove(values)}
                                            aria-label={'A button the removes the image from the current section'}
                                        >
                                            <span>Remove</span>
                                            {
                                                (removeQuestionIsLoading) &&
                                                <div className={styles.loading_spinner}>
                                                    <LoadingSpinner
                                                        role='presentation'
                                                        aria-label='A loading spinner that is on the screen during the form submission.'
                                                    />
                                                </div>
                                            }
                                        </button>}

                                    <button
                                        disabled={!isValid}
                                        className={styles.button_container_button}
                                        type='submit'
                                        aria-label={isSubmitting
                                            ? 'The button is disabled while submitting your update.'
                                            : 'The button to submit your updated comment.'}
                                    >
                                        <span>Submit</span>
                                        {
                                            (updateQuestionIsLoading) &&
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
    );
}


AdminQuestion.propTypes = {
    questionObject: PropTypes.shape({
        name: PropTypes.string,
        options: PropTypes.string,
        question: PropTypes.string,
        required: PropTypes.bool,
        type: PropTypes.string
    }),
    removeCallback: PropTypes.func,
    sectionOrder: PropTypes.number
};

export default AdminQuestion;