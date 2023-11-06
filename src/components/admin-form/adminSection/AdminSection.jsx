import styles from './AdminSection.module.scss';
import React, {useContext, useState} from "react";
import {useUpdateSection} from "../../../hooks/api-hooks.js";
import {capitalizedFirstLetter} from "../../../utils/utils.jsx";
import {Field, Form, Formik} from "formik";
import ToggleSwitch from "../../toggleSwitch/ToggleSwitch.jsx";
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner.jsx";
import CommentList from "../commentList/CommentList.jsx";
import LinkList from "../linkList/LinkList.jsx";
import ImageList from "../imageList/ImageList.jsx";
import {SECTIONS} from "../../../constants.js";
import * as Yup from "yup";
import AdminComment from "../adminComment/AdminComment.jsx";
import AdminImage from "../adminImage/AdminImage.jsx";
import AdminLink from "../adminLink/AdminLink.jsx";
import AdminWhyUsList from "../adminWhyUsList/AdminWhyUsList.jsx";
import AdminWhyUs from "../adminWhyUs/AdminWhyUs.jsx";
import AdminPlanningList from "../adminPlanningList/AdminPlanningList.jsx";
import AdminPlanning from "../adminPlanning/AdminPlanning.jsx";
import {AdminSectionContext} from "../../../context/adminSectionContext/AdminSectionContext.jsx";


const AdminSection = ({section}) => {
    const [isShowing, setIsShowing] = useState(section.showSection);
    const [showNewImage, setShowNewImage] = useState(false);
    const [showNewComment, setShowNewComment] = useState(false);
    const [showNewLink, setShowNewLink] = useState(false);
    const [showNewPlanning, setShowNewPlanning] = useState(false);
    const [showNewWhyUs, setShowNewWhyUs] = useState(false);

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
    const handleToggleSwitch = async (sectionName, toggleValue) => {
        await updateSection({
            sectionName: section.sectionName,
            pageName: section.pageName,
            showSection: toggleValue,
            sectionContent: section.content.textContent || '',
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

    const handleRemoveComment = () => setShowNewComment(false);
    const handleRemoveImage = () => setShowNewImage(false);
    const handleRemoveLink = () => setShowNewLink(false);
    const handleRemoveWhyUs = () => setShowNewWhyUs(false);
    const handleRemovePlanning = () => setShowNewPlanning(false);

    return (
        <div
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
                        <div className={styles.toggleSwitch}>
                            <ToggleSwitch
                                labelText='Show Section'
                                callbackHandler={(e) => handleToggleSwitch(section.sectionName, e.target.checked)}
                                isShowingSection={section.showSection}
                            />
                        </div>

                        <div
                            className={styles.sectionTitle}
                        >
                            <label
                                htmlFor='sectionTitle'
                                id='sectioTitleLabel'
                            >
                                Section Title
                            </label>
                            <Field
                                type='input'
                                name='sectionTitle'
                                className={styles.adminSection_form_input}
                                aria-labelledby='sectionTitleLabel'
                            />
                            {errors.sectionTitle && touched.sectionTitle ? (
                                <div className='u-error-text'>{errors.sectionTitle}</div>
                            ) : null}
                        </div>

                        <div
                            className={styles.sectionTitle}
                        >
                            <label
                                htmlFor='sectionSubTitle'
                                id='sectioTitleLabel'
                            >
                                Section Subtitle
                            </label>
                            <Field
                                type='input'
                                name='sectionSubTitle'
                                className={styles.adminSection_form_input}
                                aria-labelledby='sectionSubTitleLabel'
                            />
                            {errors.sectionSubTitle && touched.sectionSubTitle ? (
                                <div className='u-error-text'>{errors.sectionSubTitle}</div>
                            ) : null}
                        </div>

                        <div className={styles.adminSection_form_textContent}>
                            <label
                                htmlFor='sectionTextContent'
                                id='sectionTextContent'
                            >
                                Section Text Content
                            </label>
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
                            ) : null}
                        </div>

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
                    </Form>
                )}
            </Formik>

            {/*Section Media Content updates*/}
            <section className={styles.media_content}>
                <div className={styles.media_content_header}>Media Content</div>
                {
                    section?.sectionName === SECTIONS.SOCIAL_MEDIA &&
                    <>
                        <p className={styles.help_text}>
                            In order for the logo to be tied to the link, the Link <u><i><b>title</b></i></u>
                            &nbsp;<b>must be included</b> in some shape or form the
                            image <u><i><b>alt</b></i></u> text.
                            This matching
                            is case <b>insensitive</b>.
                            <br/>
                            For example:
                        </p>
                        <ul className={styles.help_text_examples}>
                            <li>
                                Link <u>title</u>: yelp<br/>
                                Image <u>alt</u> text: yelp!<br/>
                                <b>Will Match</b>
                            </li>

                            <br/>

                            <li>
                                Link <u>title</u>: yelp<br/>
                                Image <u>alt</u> text: YElps!<br/>
                                <b>Will Match</b>
                            </li>

                            <br/>

                            <li>
                                Link <u>title</u>: yelp<br/>
                                Image <u>alt</u> text: I yelped when the dog bit me.<br/>
                                <b>Will Match</b>
                            </li>

                            <br/>
                        </ul>
                    </>
                }

                {
                    section?.sectionName === SECTIONS.PLANNING &&
                    <>
                        <div className={styles.help_text}>
                            In order for the logo to be tied to the correct column, the image <u><i><b>title</b></i></u>
                            &nbsp;<b>must be labeled</b> as
                            <pre>planning-column-&#123;your planning column number goes here&#125;</pre>
                            <br/>
                            For example:
                        </div>
                        <ul className={styles.help_text_examples}>
                            <li>
                                You are creating a new column, let's say column 4. Your image name should be&nbsp;
                                <b>planning-column-4</b>.
                            </li>
                        </ul>
                    </>
                }

                {
                    section?.content?.comments?.count >= 0 &&
                    section?.sectionName === SECTIONS.COMMENTS &&
                    (
                        <section className={styles.adminSection_form_comments}>
                            <CommentList
                                count={section?.content?.comments?.count}
                                commentList={section.content.comments.commentList}
                                sectionName={section.sectionName}
                            />

                            {
                                !section?.content?.comments?.commentList?.some(({author, comment}) =>
                                    (author === '' && comment === '')) &&
                                <div className={styles.button_wrapper}>
                                    {
                                        showNewComment &&
                                        <AdminComment
                                            commentResponseObj={{
                                                id: '',
                                                author: '',
                                                comment: '',
                                            }}
                                            sectionName={section?.sectionName}
                                            removeCallback={handleRemoveComment}
                                        />
                                    }
                                    {
                                        !showNewComment &&
                                        <button className={styles.navigation__button}
                                                onClick={() => setShowNewComment(true)}>
                                            <span className={styles.navigation__icon}>&nbsp;</span>
                                        </button>
                                    }
                                </div>
                            }

                        </section>
                    )
                }

                {
                    section?.content?.links?.count >= 0 &&
                    (section?.sectionName === SECTIONS.SOCIAL_MEDIA ||
                        section?.sectionName === SECTIONS.YOUTUBE) &&
                    (
                        <section className={styles.adminSection_form_links}>
                            <LinkList
                                count={section?.content?.links?.count}
                                linkList={section.content.links.linkList}
                                sectionName={section.sectionName}
                            />

                            {
                                (
                                    !section.content.links.linkList.some(({url}) => url === '')
                                    && section.sectionName !== SECTIONS.YOUTUBE
                                ) &&
                                <div className={styles.button_wrapper}>
                                    {
                                        showNewLink &&
                                        <AdminLink
                                            linkResponseObj={{
                                                id: '',
                                                title: '',
                                                url: '',
                                            }}
                                            sectionName={section?.sectionName}
                                            removeCallback={handleRemoveLink}
                                        />
                                    }
                                    {
                                        !showNewLink &&
                                        <button className={styles.navigation__button}
                                                onClick={() => setShowNewLink(true)}>
                                            <span className={styles.navigation__icon}>&nbsp;</span>
                                        </button>
                                    }
                                </div>
                            }
                        </section>
                    )
                }

                {
                    section?.content?.images?.count >= 0 &&
                    (section?.sectionName !== SECTIONS.TAGLINE &&
                        section?.sectionName !== SECTIONS.COMMENTS)
                    &&
                    (
                        <section className={styles.adminSection_form_image}>
                            <ImageList
                                count={section?.content?.images?.count}
                                imageList={section?.content?.images?.imageList}
                                sectionName={section?.sectionName}
                                removeCallback={handleRemoveImage}
                            />


                            {
                                (!section?.content?.images?.imageList?.some(({imageName}) => !imageName))
                                &&
                                <div className={styles.button_wrapper}>
                                    {
                                        showNewImage &&
                                        <AdminImage
                                            imageResponseObj={{
                                                imageName: '',
                                                src: '',
                                                alt: '',
                                                tagline: '',
                                                sectionName: section?.sectionName
                                            }}
                                            removeCallback={handleRemoveImage}
                                        />
                                    }
                                    {
                                        !showNewImage
                                        && section?.sectionName !== SECTIONS.FOOTER
                                        && section?.sectionName !== SECTIONS.PROFILE
                                        && <button className={styles.navigation__button}
                                                   onClick={() => setShowNewImage(true)}>
                                            <span className={styles.navigation__icon}>&nbsp;</span>
                                        </button>
                                    }
                                </div>
                            }
                        </section>
                    )
                }

                {
                    section?.content?.whyUs?.count >= 0
                    && section?.sectionName === SECTIONS.WHY_US
                    &&
                    <section className={styles.adminSection_form_whyUs}>
                        <AdminWhyUsList
                            count={section?.content?.whyUs?.count}
                            whyUsList={section?.content?.whyUs?.whyUsList}
                            sectionName={section?.sectionName}
                            removeCallback={handleRemoveWhyUs}
                        />

                        {
                            (
                                !section?.content?.whyUs?.whyUsList?.some(({id}) => !id)
                                && section?.sectionName !== SECTIONS.PROFILE
                            )
                            &&
                            <div className={styles.button_wrapper}>
                                {
                                    showNewWhyUs &&
                                    <AdminWhyUs
                                        id=''
                                        title=''
                                        whyUsText=''
                                        muiIcon=''
                                        iconifyIcon=''
                                        removeCallback={handleRemoveWhyUs}
                                    />
                                }
                                {
                                    !showNewWhyUs &&
                                    <button className={styles.navigation__button}
                                            onClick={() => setShowNewWhyUs(true)}>
                                        <span className={styles.navigation__icon}>&nbsp;</span>
                                    </button>
                                }
                            </div>
                        }
                    </section>
                }

                {
                    section?.content?.planning?.count >= 0
                    && section?.sectionName === SECTIONS.PLANNING
                    &&
                    <section className={styles.adminSection_form_planning}>
                        <AdminPlanningList
                            count={section?.content?.planning?.count}
                            planningList={section?.content?.planning?.planningList}
                            sectionName={section?.sectionName}
                            removeCallback={handleRemovePlanning}
                        />

                        {
                            (
                                !section?.content?.planning?.planningList?.some(({id}) => !id)
                            )
                            &&
                            <div className={styles.button_wrapper}>
                                {
                                    showNewPlanning &&
                                    <AdminPlanning
                                        id=''
                                        columanTitle=''
                                        title=''
                                        PlanningText=''
                                        removeCallback={handleRemovePlanning}
                                    />
                                }
                                {
                                    !showNewPlanning &&
                                    <button className={styles.navigation__button}
                                            onClick={() => setShowNewPlanning(true)}>
                                        <span className={styles.navigation__icon}>&nbsp;</span>
                                    </button>
                                }
                            </div>
                        }
                    </section>
                }
            </section>
        </div>
    )
};

export default AdminSection;