import {Field, Form, Formik} from "formik";
import PropTypes from "prop-types";
import {useContext, useState} from "react";
import {Col, Container, Row} from "react-bootstrap";
import * as Yup from "yup";

import {SECTIONS} from "../../../constants.js";
import {AdminSectionContext} from "../../../context/adminSectionContext/AdminSectionContext.jsx";
import {useUpdateSection} from "../../../hooks/api-hooks.js";
import {capitalizedFirstLetter} from "../../../utils/utils.jsx";
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner.jsx";
import ToggleSwitch from "../../toggleSwitch/ToggleSwitch.jsx";
import AdminMediaContent from "../components/adminMediaContent/AdminMediaContent.jsx";


import styles from './AdminSection.module.scss';


const AdminSection = ({section}) => {
    const [isShowing, setIsShowing] = useState(section.showSection);

    const {setErrors: setSectionErrors, setInfo} = useContext(AdminSectionContext);

    const {
        mutateAsync: updateSection,
        isSuccess
    } = useUpdateSection(setSectionErrors, setInfo);

    const handleSubmit = async values => {
        await updateSection({
            sectionName: section.sectionName,
            pageName: section.pageName,
            title: values.sectionTitle,
            subTitle: values.sectionSubTitle,
            showSection: isShowing,
            sectionContent: values.sectionTextContent || section.content.textContent || '',
        });
    };
    const handleToggleSwitch = async (
        {
            sectionName, pageName, title, subTitle, content
        },
        toggleValue
    ) => {
        await updateSection({
            sectionName: sectionName,
            pageName: pageName,
            title: title,
            subTitle: subTitle,
            showSection: toggleValue,
            sectionContent: content?.textContent || ''
        });

        if (isSuccess) {
            setIsShowing(toggleValue);
        }
    }


    const adminSectionSchema = Yup.object().shape({
        sectionTitle: Yup.string()
            .max(200, 'Please keep the title text to only 200 characters.'),
        sectionSubTitle: Yup.string()
            .max(200, 'Please keep the sub-title text to only 200 characters.'),
        sectionTextContent: Yup.string()
            .max(2000, 'Please keep the text to only 2000 characters.')
    });

    return (
        <Container
            className={styles.adminSection}
            key={section.sectionName}
        >
            <h2>
                {capitalizedFirstLetter(section.sectionName)}
            </h2>

            {/*Section Meta Data updates*/}
            <Formik
                validationSchema={adminSectionSchema}
                initialValues={{
                    sectionTitle: section.title || '',
                    sectionSubTitle: section.subTitle || '',
                    sectionTextContent: section.content.textContent || ''
                }}
                onSubmit={(e) => handleSubmit(e, section.sectionName)}
            >
                {({isSubmitting, isValid, errors, touched, dirty}) => (
                    <Form className={styles.adminSection_form}>
                        <Row className={styles.toggleSwitch}>
                            <ToggleSwitch
                                labelText='Show Section'
                                callbackHandler={(e) => handleToggleSwitch(section, e.target.checked)}
                                isShowingSection={section.showSection}
                            />
                        </Row>

                        <Row>
                            <Col className='gap-0' sm={12} md={{span: 6}}>
                                <Container>
                                    <label
                                        htmlFor='sectionTitle'
                                        id='sectioTitleLabel'
                                    >
                                        Section Title
                                    </label>

                                    <Row>
                                        <Field
                                            type='input'
                                            name='sectionTitle'
                                            className={styles.adminSection_form_input}
                                            aria-labelledby='sectionTitleLabel'
                                        />
                                        {errors.sectionTitle && touched.sectionTitle ? (
                                            <div className='u-error-text'>{errors.sectionTitle}</div>
                                        ) : null}
                                    </Row>
                                </Container>
                            </Col>

                            <Col className='gap-0' sm={12} md={{span: 6}}>
                                <Container>
                                    <label
                                        htmlFor='sectionSubTitle'
                                        id='sectioTitleLabel'
                                    >
                                        Section Subtitle
                                    </label>

                                    <Row>
                                        <Field
                                            type='input'
                                            name='sectionSubTitle'
                                            className={styles.adminSection_form_input}
                                            aria-labelledby='sectionSubTitleLabel'
                                        />
                                        {errors.sectionSubTitle && touched.sectionSubTitle ? (
                                            <div className='u-error-text'>{errors.sectionSubTitle}</div>
                                        ) : null}
                                    </Row>
                                </Container>
                            </Col>

                            <Col className='gap-0' sm={12}>
                                <Container>
                                    <label
                                        htmlFor='sectionTextContent'
                                        id='sectionTextContent'
                                    >
                                        Section Text Content
                                    </label>
                                    <Row>
                                        {
                                            section.sectionName === SECTIONS.PROFILE &&
                                            <b><p className={styles.help_text}>For line breaks use [br] at the end
                                                of the sentence right before
                                                where you want the break to occur.</p></b>
                                        }
                                        <Field
                                            as='textarea'
                                            name='sectionTextContent'
                                            className={styles.form_textArea}
                                            aria-labelledby='textContent'
                                        />
                                        {errors.sectionTextContent && touched.sectionTextContent ? (
                                            <div className='u-error-text'>{errors.sectionTextContent}</div>
                                        ) : null}</Row>
                                </Container>
                            </Col>

                            <div className={styles.adminSection_form_button_container}>
                                <button
                                    disabled={isSubmitting || !isValid || !dirty}
                                    className={styles.adminSection_form_button_container_button}
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
                                        <div className={styles.loading_spinner}>
                                            <LoadingSpinner
                                                role='presentation'
                                                aria-label='A loading spinner that is on the screen during the form submission.'
                                            />
                                        </div>
                                    }
                                </button>
                            </div>
                        </Row>
                    </Form>
                )}
            </Formik>

            {/*Section Media Content updates*/}
            <AdminMediaContent section={section}/>
        </Container>
    )
};

AdminSection.propTypes = {
    section: PropTypes.shape({
        content: PropTypes.object,
        pageName: PropTypes.string,
        sectionName: PropTypes.string,
        showSection: PropTypes.bool,
        subTitle: PropTypes.string,
        title: PropTypes.string
    }).isRequired
}

export default AdminSection;