import PropTypes from 'prop-types';
import {Col, Container, Row} from "react-bootstrap";

import SectionHeader from "../sectionHeader/SectionHeader.jsx";

import styles from './Comments.module.scss';
import '../../scss/main.scss';

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
        <Container className={styles.comments}>
            <Row>
                <SectionHeader
                    sectionHeader={commentTitle}
                    subTitle={commentSubTitle}
                />
            </Row>

            <Row>
                {
                    commentList.map(
                        ({comment, author}, index) => (
                            <Col
                                className='gap-0'
                                sm={12}
                                lg={{span: 4}}
                                key={`${comment}_${author}`}
                            >

                                <p key={`comment_${index}`}
                                   className={styles.comments_comment}
                                >
                                    {`${comment}`}
                                    <br/>
                                    <br/>
                                    {author}
                                </p>
                            </Col>
                        )
                    )
                }
            </Row>
        </Container>
    );
}


Comments.propTypes = {
    commentResponseObj: PropTypes.shape({
        title: PropTypes.string,
        subTitle: PropTypes.string,
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