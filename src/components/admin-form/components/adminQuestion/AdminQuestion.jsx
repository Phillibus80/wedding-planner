import {Field, Form, Formik} from "formik";
import PropTypes from 'prop-types';
import {useContext} from "react";
import {Col, Container, Row} from "react-bootstrap";
import * as Yup from "yup";

import {AdminSectionContext} from "../../../../context/adminSectionContext/AdminSectionContext.jsx";
import {
    useCreateQuestionnaireQuestion,
    useRemoveQuestionnaireQuestion,
    useUpdateQuestionnaireQuestion
} from "../../../../hooks/api-hooks.js";
import {convertToCamelCase} from "../../../../utils/utils.jsx";
import AdminSectionButtons from "../adminSectionButtons/AdminSectionButtons.jsx";

import styles from './AdminQuestion.module.scss';

import '../../../../scss/main.scss';

const AdminQuestion = (
    {
        questionObject,
        removeCallback = () => {
        },
        sectionName,
        pageName,
        sectionOrder
    }
) => {
    if (!questionObject) return;

    // Toast
    const {setErrors, setInfo: setSuccess} = useContext(AdminSectionContext);

    // Hooks
    const {
        mutateAsync: createQuestion,
    } = useCreateQuestionnaireQuestion(setSuccess, setErrors);

    const {
        mutateAsync: updateQuestion,
        // isSuccess: updateSuccess
    } = useUpdateQuestionnaireQuestion(setSuccess, setErrors);

    const {
        mutateAsync: removeQuestion,
        isSuccess: removeQuestionIsSuccess,
        isLoading: removeQuestionIsLoading
    } = useRemoveQuestionnaireQuestion(setSuccess, setErrors);

    // Formik
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

    const initValues = ({
        name: questionObject?.name,
        options: questionObject?.options,
        question: questionObject?.question,
        questionRequired: questionObject?.required ? 'true' : 'false',
        questionType: questionObject?.type || 'input',
        questionSectionName: sectionName
    });

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

    const handleSubmit = async (
        {
            name,
            options,
            question,
            questionRequired,
            questionType,
            questionSectionName
        }
    ) => {
        // Update Question
        if (questionObject?.name) {
            const updateRequestBody = createRequestPayload(name, question, options, questionType, questionRequired, questionSectionName);

            await updateQuestion({
                requestBody: updateRequestBody
            });
        }
        // Create Question
        else {
            const modifiedName = convertToCamelCase(name);
            const createRequestBody = createRequestPayload(modifiedName, question, options, questionType, questionRequired, questionSectionName);

            await createQuestion({
                requestBody: createRequestBody
            });
        }

        removeCallback();
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
        <div className={styles.wrapper}>
            <div className={styles.wrapper_label}>
                <span>Question Info:</span>
            </div>

            <Formik
                enableReinitialize={true}
                initialValues={initValues}
                onSubmit={handleSubmit}
                validationSchema={adminQuestionSchema}
            >
                {
                    ({
                         dirty,
                         errors,
                         isSubmitting,
                         isValid,
                         touched,
                         values
                     }) => (
                        <Form>
                            <Container className={styles.form_questions}>
                                <Row>
                                    <Col className='gap-0' sm={12}>
                                        <label>Name (unique internal name):</label>

                                        <Row>
                                            <Field
                                                type='input'
                                                name='name'
                                                className={styles.form_input}
                                                aria-label={`A field that contains the question name: ${values.name}`}
                                                disabled={!!questionObject?.name}
                                            />
                                            {errors.name && touched.name ? (
                                                <div className='u-error-text'>{errors.name}</div>
                                            ) : null}
                                        </Row>
                                    </Col>

                                    <Col className='gap-0' sm={12}>
                                        <label>Question text:</label>

                                        <Row>
                                            <Field
                                                as='textarea'
                                                name='question'
                                                className={styles.form_input}
                                                aria-label={`A field with the question text: ${values.question}`}
                                            />
                                            {errors.question && touched.question ? (
                                                <div className='u-error-text'>{errors.question}</div>
                                            ) : null}
                                        </Row>
                                    </Col>

                                    <Col className='gap-0' sm={12}>
                                        <label htmlFor="questionRequired" id="questionRequiredLabel">
                                            Required:
                                        </label>

                                        <Row>
                                            <Col className='gap-0' sm={6} role="group"
                                                 aria-labelledby="questionRequiredLabel">
                                                <label>
                                                    <Field type="radio" name="questionRequired" value='true'/>
                                                    Yes
                                                </label>
                                            </Col>

                                            <Col className='gap-0' sm={6} role="group"
                                                 aria-labelledby="questionRequiredLabel">
                                                <label>
                                                    <Field type="radio" name="questionRequired" value='false'/>
                                                    No
                                                </label>
                                            </Col>
                                            {errors.questionRequired && touched.questionRequired ? (
                                                <div className='u-error-text'>
                                                    {errors.questionRequired}
                                                </div>
                                            ) : null}
                                        </Row>
                                    </Col>

                                    <Col className='gap-0' sm={12}>
                                        <label>Question Type:</label>
                                        <Row>
                                            <Field
                                                as='select'
                                                name='questionType'
                                                className={styles.form_input}
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
                                        </Row>
                                    </Col>

                                    {
                                        values.questionType === 'select' &&
                                        <Col className='gap-0 mt-2' sm={12}>
                                            <label>Options: (comma seperated list.):</label>
                                            <Row>
                                                <Field
                                                    disabled={values.questionType !== 'radio' && values.questionType !== 'select'}
                                                    type='input'
                                                    name='options'
                                                    className={styles.form_input}
                                                    aria-label={`A select field showing the possible answers: ${values.options}`}
                                                />
                                                {errors.options && touched.options ? (
                                                    <div className='u-error-text'>{errors.options}</div>
                                                ) : null}
                                            </Row>
                                        </Col>
                                    }

                                    <AdminSectionButtons
                                        dirty={dirty}
                                        handleRemove={handleRemove}
                                        id={questionObject?.name}
                                        isLoading={removeQuestionIsLoading}
                                        isSubmitting={isSubmitting}
                                        isValid={isValid}
                                    />
                                </Row>
                            </Container>
                        </Form>
                    )
                }
            </Formik>
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
    sectionOrder: PropTypes.number,
    sectionName: PropTypes.string,
    pageName: PropTypes.string
};

export default AdminQuestion;