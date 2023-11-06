import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import styles from './AdminComment.module.scss';
import '../../../scss/main.scss';
import {Field, Form, Formik} from "formik";
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner.jsx";
import {useCreateComment, useRemoveComment, useUpdateComment} from "../../../hooks/api-hooks.js";
import * as Yup from "yup";
import {AdminSectionContext} from "../../../context/adminSectionContext/AdminSectionContext.jsx";

const AdminComment = ({
                          commentResponseObj,
                          sectionName,
                          removeCallback = () => {
                          }
                      }) => {
    if (!commentResponseObj) return;

    const {setErrors, setInfo} = useContext(AdminSectionContext);

    const {id, author, comment} = commentResponseObj;

    const {
        mutateAsync: updateComment,
        isLoading: updateCommentIsLoading,
    } = useUpdateComment(setErrors, setInfo);
    const {
        mutateAsync: createComment
    } = useCreateComment(setErrors, setInfo);
    const {
        mutateAsync: removeComment,
        isLoading: removeCommentIsLoading,
        isSuccess: removeCommentIsSuccess
    } = useRemoveComment(setErrors, setInfo);

    const adminCommentSchema = Yup.object().shape({
        comment: Yup.string()
            .max(1500, 'Comment is too long')
            .required('Comment text is required.'),
        author: Yup.string()
            .max(50, 'Please keep the author text to only 50 characters.')
            .required('Author is required.')
    });

    const initValues = {
        comment: comment || '',
        author: author || ''
    };

    const handleSubmit = async ({author: commentAuthor, comment: commentText}) => {
        // Update Comment
        if (!!id) {
            await updateComment({
                id,
                author: commentAuthor,
                comment: commentText
            });
        }
        // Create Comment
        else {
            await createComment({
                sectionName: sectionName,
                author: commentAuthor,
                comment: commentText
            });
        }

        removeCallback();
    };

    const handleRemove = async () => {
        await removeComment({commentId: id});

        removeCommentIsSuccess && removeCallback();
    }

    return (
        <div className={styles.comments_wrapper}>
            <div className={styles.comments_wrapper_label}>
                <span>Comment Info:</span>
            </div>

            <div className={styles.form_comments_wrapper}>
                <Formik
                    initialValues={initValues}
                    onSubmit={handleSubmit}
                    validationSchema={adminCommentSchema}
                >
                    {({isSubmitting, isValid, errors, touched, dirty}) => (
                        <Form className={styles.inner}>
                            <label>Comment</label>
                            <Field
                                as='textarea'
                                name='comment'
                                className={styles.form_textArea}
                                aria-label={`A field that contains the comment by ${author}`}
                            />
                            {errors.comment && touched.comment ? (
                                <div className='u-error-text'>{errors.comment}</div>
                            ) : null}

                            <label>Author</label>
                            <Field
                                type='input'
                                name='author'
                                className={styles.adminSection_form_input}
                                aria-label={`A field labeling the author: ${author}`}
                            />
                            {errors.author && touched.author ? (
                                <div className='u-error-text'>{errors.author}</div>
                            ) : null}

                            <div className={styles.button_container}>
                                {
                                    !!id
                                    &&
                                    <button
                                        disabled={removeCommentIsLoading}
                                        className={styles.button_container_button_remove}
                                        type='button'
                                        onClick={handleRemove}
                                        aria-label={'A button the removes the image from the current section'}
                                    >
                                        <span>Remove</span>
                                        {
                                            (removeCommentIsLoading) &&
                                            <div className={styles.loading_spinner}>
                                                <LoadingSpinner
                                                    role='presentation'
                                                    aria-label='A loading spinner that is on the screen during the form submission.'
                                                />
                                            </div>
                                        }
                                    </button>}

                                <button
                                    disabled={!isValid || !dirty}
                                    className={styles.button_container_button}
                                    type='submit'
                                    aria-label={isSubmitting
                                        ? 'The button is disabled while submitting your update.'
                                        : 'The button to submit your updated comment.'}
                                >
                                    <span>Submit</span>
                                    {
                                        (updateCommentIsLoading) &&
                                        <div className={styles.loading_spinner}>
                                            <LoadingSpinner
                                                role='presentation'
                                                aria-label='A loading spinner that is on the screen during the form submission.'
                                            />
                                        </div>
                                    }
                                </button>
                            </div>
                        </Form>)
                    }

                </Formik>
            </div>
        </div>
    );
}

AdminComment.propTypes = {
    commentResponseObj: PropTypes.shape({
        id: PropTypes.string,
        author: PropTypes.string,
        comment: PropTypes.string
    }),
    sectionName: PropTypes.string,
    removeCallback: PropTypes.func
};

export default AdminComment;