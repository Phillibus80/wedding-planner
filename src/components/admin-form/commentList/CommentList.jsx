import AdminComment from "../adminComment/AdminComment.jsx";
import PropTypes from "prop-types";

const CommentList = ({count, commentList, sectionName}) => {
    return (count > 0) &&
        commentList.map((comment, index) => (
                <AdminComment key={`${comment.author}_${index}`}
                              commentResponseObj={{
                                  id: comment.id,
                                  author: comment.author,
                                  comment: comment.comment,
                              }}
                              sectionName={sectionName}
                />
            )
        );
}

CommentList.propTypes = {
    count: PropTypes.number,
    sectionName: PropTypes.string,
    commentList: PropTypes.arrayOf(PropTypes.shape({
        author: PropTypes.string,
        comment: PropTypes.string,
        id: PropTypes.string
    }))
}

export default CommentList;