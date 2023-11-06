import PropTypes from 'prop-types';
import React from 'react';
import styles from './Comments.module.scss';
import '../../scss/main.scss';
import SectionHeader from "../sectionHeader/SectionHeader.jsx";

const Comments = ({commentResponseObj}) => {
    const {
        title: commentTitle,
        subTitle: commentSubTitle,
        content: {
            comments: {
                commentList: commentList
            }
        }
    } = commentResponseObj;

    return (
        <section className={styles.comments}>
            <div className={styles.comments_header}>
                <SectionHeader
                    sectionHeader={commentTitle}
                    subTitle={commentSubTitle}
                />
            </div>
            <div className={styles.comments_container}>
                {
                    commentList.map(
                        ({comment, author}, index) => (
                            <p key={`comment_${index}`}
                               className={styles.comments_comment}
                            >
                                {`${comment}`}
                                <br/>
                                <br/>
                                {author}
                            </p>
                        )
                    )
                }
            </div>
        </section>
    )

}


Comments.propTypes = {
    commentResponseObj: PropTypes.shape({
        commentTitle: PropTypes.string,
        commentSubTitle: PropTypes.string,
        content: PropTypes.shape({
            comments: PropTypes.shape({
                commentList: PropTypes.arrayOf(
                    PropTypes.shape({
                        author: PropTypes.string,
                        comment: PropTypes.string
                    })
                )
            })
        })
    })
};

export default Comments;