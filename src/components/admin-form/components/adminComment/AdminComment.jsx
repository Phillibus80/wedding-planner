import {Field, Form, Formik} from "formik";
import PropTypes from 'prop-types';
import {useContext} from 'react';
import {Col, Row} from "react-bootstrap";
import * as Yup from "yup";

import {AdminSectionContext} from "../../../../context/adminSectionContext/AdminSectionContext.jsx";
import {useCreateComment, useRemoveComment, useUpdateComment} from "../../../../hooks/api-hooks.js";
import AdminSectionButtons from "../adminSectionButtons/AdminSectionButtons.jsx";

import * as styles from './AdminComment.module.scss'

export const AdminComment = ({
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
        if (id) {
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

            <Formik
                initialValues={initValues}
                onSubmit={handleSubmit}
                validationSchema={adminCommentSchema}
            >
                {({
                      isSubmitting,
                      isValid,
                      errors,
                      touched,
                      dirty
                  }) => (
                    <Form className={styles.inner}>
                        <Row>
                            <Col>
                                <label>Comment</label>
                            </Col>

                            <Col>
                                <Field
                                    as='textarea'
                                    name='comment'
                                    className={styles.form_textArea}
                                    aria-label={`A field that contains the comment by ${author}`}
                                />
                                {errors.comment && touched.comment ? (
                                    <div className='u-error-text'>{errors.comment}</div>
                                ) : null}
                            </Col>

                            <Col className='gap-0' sm={12}>
                                <label>Author</label>
                            </Col>

                            <Col>
                                <Field
                                    type='input'
                                    name='author'
                                    className={styles.adminSection_form_input}
                                    aria-label={`A field labeling the author: ${author}`}
                                />
                                {errors.author && touched.author ? (
                                    <div className='u-error-text'>{errors.author}</div>
                                ) : null}
                            </Col>

                            <AdminSectionButtons
                                dirty={dirty}
                                handleRemove={handleRemove}
                                id={id}
                                isLoading={removeCommentIsLoading}
                                isSubmitting={isSubmitting}
                                isValid={isValid}
                            />
                        </Row>
                    </Form>)
                }
            </Formik>
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