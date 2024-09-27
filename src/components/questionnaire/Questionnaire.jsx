import {Form, Formik} from "formik";
import PropTypes from "prop-types";
import {Col, Container, Row} from "react-bootstrap";
import * as Yup from "yup";

import {useGetQuestionnaireQuestions} from "../../hooks/api-hooks.js";
import {generateFormikFields, generateFormikInitValues, generateYupSchema, getCurrentPage} from "../../utils/utils.jsx";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner.jsx";
import SectionHeader from "../sectionHeader/SectionHeader.jsx";

import * as styles from './Questionnaire.module.scss';

const Questionnaire = ({page, introText, header, subHeader, submitCallback}) => {
    const currentPage = getCurrentPage(page);
    const {
        data: questions,
        isSuccess: questionsIsSuccess
    } = useGetQuestionnaireQuestions(currentPage);

    let weddingQuestionsSchema = {};
    let weddingQuestionInitValues = {};

    if (questionsIsSuccess) {
        weddingQuestionsSchema = generateYupSchema(questions?.data);
        weddingQuestionInitValues = generateFormikInitValues(questions?.data)
    } else {
        weddingQuestionsSchema = Yup.object().shape({});
        weddingQuestionInitValues = {};
    }

    return <Container className={styles.questions}>
        <Row>
            <SectionHeader
                sectionHeader={header}
                subTitle={subHeader}
            />

            <p className={styles.questions_blurb}>
                {introText}
            </p>
        </Row>


        {
            questionsIsSuccess &&
            <Formik
                validationSchema={weddingQuestionsSchema}
                initialValues={{...weddingQuestionInitValues}}
                onSubmit={(e) => submitCallback(e)}
            >
                {({
                      isSubmitting,
                      isValid,
                      errors,
                      touched,
                  }) => (
                    <Form className={styles.questions_form}>
                        <Container>
                            <Row>
                                {
                                    generateFormikFields(questions?.data, errors, touched)
                                }

                                <Container>
                                    <Row>
                                        <Col className={styles.button_container} sm={12}
                                             md={{span: 3, offset: 8}}>
                                            <button
                                                className={styles.button_container_button}
                                                disabled={isSubmitting || !isValid}
                                                type='submit'
                                                aria-label={isSubmitting
                                                    ? 'The' +
                                                    ' submit button is currently disabled' +
                                                    ' due to the either the form is' +
                                                    ' submitting or it is invalid.'
                                                    : 'The button to submit your message to Risen Rose Creations.'}
                                            >
                                                <span>Submit</span>
                                                {
                                                    isSubmitting &&
                                                    <div className='loading_spinner'>
                                                        <LoadingSpinner
                                                            role='presentation'
                                                            aria-label='A loading spinner that is on the screen during the form submission.'
                                                        />
                                                    </div>
                                                }
                                            </button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Row>
                        </Container>
                    </Form>
                )}
            </Formik>
        }
    </Container>
}

Questionnaire.propTypes = {
    page: PropTypes.string,
    introText: PropTypes.string,
    header: PropTypes.string,
    subHeader: PropTypes.string,
    submitCallback: PropTypes.func
};

export default Questionnaire;