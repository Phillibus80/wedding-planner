import PropTypes from "prop-types";
import {useState} from "react";
import {Col} from "react-bootstrap";

import AdminComment from "../../components/adminComment/AdminComment.jsx";
import * as styles from "../imageList/ImageList.module.scss";

const CommentList = ({count = 0, commentList = [], sectionName = ''}) => {
    const [showNewComment, setShowNewComment] = useState(false);

    const handleRemoveComment = () => setShowNewComment(false);
    const comments = commentList.map((comment, index) =>
        <Col className='gap-0' sm={12} md={3} key={`${comment.author}_${index}`}>
            <AdminComment
                commentResponseObj={{
                    id: comment.id,
                    author: comment.author,
                    comment: comment.comment,
                }}
                sectionName={sectionName}
            />
        </Col>
    );

    const newComment = !commentList?.some(
            ({author, comment}) => (author === '' && comment === ''))
        && <Col className='gap-0' key={`cl-${commentList.length}`}>
            <div className={styles.button_wrapper}>
                {showNewComment
                    ? <AdminComment
                        commentResponseObj={{
                            id: '',
                            author: '',
                            comment: '',
                        }}
                        sectionName={sectionName}
                        removeCallback={handleRemoveComment}
                    />
                    : <button className={styles.navigation__button}
                              onClick={() => setShowNewComment(true)}>
                        <span className={styles.navigation__icon}>&nbsp;</span>
                    </button>
                }
            </div>
        </Col>

    return (count > 0)
        ? [...comments, newComment]
        : [newComment];
}

CommentList.propTypes = {
    count: PropTypes.number,
    sectionName: PropTypes.string,
    commentList: PropTypes.arrayOf(PropTypes.shape({
        author: PropTypes.string,
        comment: PropTypes.string,
        id: PropTypes.string
    })).isRequired
}

export default CommentList;