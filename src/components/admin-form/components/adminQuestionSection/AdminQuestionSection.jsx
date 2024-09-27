import PropTypes from "prop-types";
import {useState} from "react";
import {Col, Row} from "react-bootstrap";

import AdminQuestion from "../adminQuestion/AdminQuestion.jsx";

import styles from "./AdminQuestionSection.module.scss";

const AdminQuestionSection = ({section, sectionName, currentPage, sectionOrder}) => {
    const [showNewQuestion, setShowNewQuestion] = useState(false);

    const handleRemoveNewQuestion = () => setShowNewQuestion(false);

    const questions = section?.questionList?.map(
        question =>
            <Col className='gap-0' sm={12} md={4} key={question?.name}>
                <AdminQuestion
                    questionObject={question}
                    removeCallback={handleRemoveNewQuestion}
                    sectionName={sectionName}
                    pageName={currentPage}
                    sectionOrder={sectionOrder}
                />
            </Col>
    );

    const additionalQuestion = showNewQuestion
        ? <Col className='gap-0' sm={12} md={4} key={`aq-${section?.questionList?.length}`}>
            <AdminQuestion
                questionObject={{
                    question: '',
                    name: '',
                    options: '',
                    required: false,
                    type: 'input'
                }}
                removeCallback={handleRemoveNewQuestion}
                sectionName={section?.sectionName}
                pageName={currentPage}
                sectionOrder={sectionOrder}
            />
        </Col>
        : <Col key={`aq-${section?.questionList?.length}`} sm={12} md={4}>
            <div className={styles.button_wrapper}>
                <button className={styles.navigation__button}
                        onClick={() => setShowNewQuestion(true)}>
                    <span className={styles.navigation__icon}>&nbsp;</span>
                </button>
            </div>
        </Col>;

    const finalQuestions = questions.length > 0
        ? [...questions, additionalQuestion]
        : [additionalQuestion];

    return (
        <div className={styles.AdminSection}>
            <h2 className={styles.AdminSection_header}>{sectionName}</h2>
            <Row>
                {[...finalQuestions]}
            </Row>
        </div>
    )
}

AdminQuestionSection.propTypes = {
    section: PropTypes.shape({
        sectionName: PropTypes.string,
        questionList: PropTypes.arrayOf(
            PropTypes.shape({
                question: PropTypes.string,
                name: PropTypes.string,
                options: PropTypes.string,
                required: PropTypes.bool,
                type: PropTypes.string
            })
        )
    }),
    sectionName: PropTypes.string,
    sectionOrder: PropTypes.number,
    currentPage: PropTypes.string
};

export default AdminQuestionSection;