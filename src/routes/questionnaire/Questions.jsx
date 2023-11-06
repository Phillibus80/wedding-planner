import styles from './Questions.module.scss';
import React, {useState} from "react";
import {Form, Formik} from "formik";
import {createPortal} from "react-dom";
import ErrorModal from "../../components/modals/error/ErrorModal.jsx";
import InfoModal from "../../components/modals/info/InfoModal.jsx";
import SectionHeader from "../../components/sectionHeader/SectionHeader.jsx";
import {useGetQuestionnaireQuestions} from "../../hooks/api-hooks.js";
import {generateFormikFields, generateFormikInitValues, generateYupSchema} from "../../utils/utils.jsx";
import LoadingSpinner from "../../components/loadingSpinner/LoadingSpinner.jsx";

const Questions = ({page}) => {
    const currentPage = page.slice(1);
    const {
        data: questions,
        isSuccess: questionsIsSuccess
    } = useGetQuestionnaireQuestions(currentPage);

    const [sectionErrors, setSectionErrors] = useState({
        hasErrors: false,
        errorMessage: ''
    });

    const [info, setInfo] = useState({
        hasInfo: false,
        infoMessage: ''
    });

    const handleSubmit = async values => {
        console.log('Values:: ', values);
    };

    const errorModal = (
        createPortal(<ErrorModal
                message={sectionErrors.errorMessage}
                onClose={() => setSectionErrors({
                    hasErrors: false,
                    errorMessage: ''
                })}
            />,
            document.body
        )
    );


    const infoModal = (
        createPortal(<InfoModal
                message={info.infoMessage}
                onClose={() => setInfo({
                    hasInfo: false,
                    infoMessage: ''
                })}
            />,
            document.body
        )
    );

    let weddingQuestionsSchema = {};
    let weddingQuestionInitValues = {};

    if (questionsIsSuccess) {
        weddingQuestionsSchema = generateYupSchema(questions?.data);
        weddingQuestionInitValues = generateFormikInitValues(questions?.data)
    }

    return (
        <div className={styles.outer}>
            {sectionErrors.hasErrors && errorModal}
            {info.hasInfo && infoModal}

            <img src={'../../../api/img/Decor-outline.png'}
                 alt='background image'
                 role='presentation'
                 aria-hidden
                 className={styles.backgroundFlourish_1}
                 loading="lazy"
            />
            <img src={'../../../api/img/Decor-outline.png'}
                 alt='background image'
                 role='presentation'
                 aria-hidden
                 className={styles.backgroundFlourish_2}
                 loading="lazy"
            />
            <img src={'../../../api/img/Decor.png'}
                 alt='background image'
                 role='presentation'
                 aria-hidden
                 className={styles.backgroundFlourish_3}
                 loading="lazy"
            />
            <img src={'../../../api/img/Decor_2.png'}
                 alt='background image'
                 role='presentation'
                 aria-hidden
                 className={styles.backgroundFlourish_4}
                 loading="lazy"
            />

            <div
                className={styles.questions}
            >
                <SectionHeader
                    sectionHeader='Wedding Questionnaire'
                    subTitle='Risen Rose Creations'
                />

                <p className={styles.questions_blurb}>
                    Congratulations on your engagement! We are thrilled that you’ve chosen Risen Rose Creations to
                    design your perfect wedding day. Every couple is different and that means every design will be
                    completely unique and tailored to your love story and preferences. Please answer this questionnaire
                    with as many details as possible so that I can turn your dreams into reality.
                </p>

                {
                    questionsIsSuccess &&
                    <Formik
                        validationSchema={weddingQuestionsSchema}
                        initialValues={{...weddingQuestionInitValues}}
                        onSubmit={(e) => handleSubmit(e)}
                    >
                        {({
                              isSubmitting,
                              isValid,
                              errors,
                              touched,
                              dirty
                          }) => (
                            <Form className={styles.questions_form}>
                                {
                                    generateFormikFields(questions?.data, errors, touched)
                                }

                                <div className={styles.questions_form_button_container}>
                                    <button
                                        disabled={isSubmitting || !isValid || !dirty}
                                        className={styles.questions_form_button_container_button}
                                        type='submit'
                                        aria-label={isSubmitting
                                            ? 'The' +
                                            ' submit button is currently disabled' +
                                            ' due to the either the form is' +
                                            ' submitting or it is invalid.'
                                            : 'The button to submit your message to the cat' +
                                            ' lady pet sitting service.'}
                                    >
                                        <span>Submit</span>
                                        {
                                            isSubmitting &&
                                            <div className={'loading_spinner'}>
                                                <LoadingSpinner
                                                    role='presentation'
                                                    aria-label='A loading spinner that is on the screen during the form submission.'
                                                />
                                            </div>
                                        }
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                }
            </div>
        </div>
    )
};

export default Questions;