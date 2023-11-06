import styles from "./AdminQuestionSection.module.scss";
import AdminQuestion from "../adminQuestion/AdminQuestion.jsx";
import {useState} from "react";
import PropTypes from "prop-types";

const AdminQuestionSection = ({section, sectionName, currentPage, sectionOrder}) => {
    const [showNewQuestion, setShowNewQuestion] = useState(false);

    const handleRemoveNewQuestion = () => setShowNewQuestion(false);

    return (
        <div className={styles.AdminSection}>
            <h2 className={styles.AdminSection_header}>{sectionName}</h2>
            <div className={styles.AdminSection_questions}>
                {
                    section?.questionList?.map(question =>
                        <AdminQuestion
                            key={question?.name}
                            questionObject={question}
                            removeCallback={handleRemoveNewQuestion}
                            sectionName={sectionName}
                            pageName={currentPage}
                            sectionOrder={sectionOrder}
                        />
                    )
                }

                {
                    showNewQuestion
                        ? <AdminQuestion
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
                        :
                        <div className={styles.button_wrapper}>
                            <button className={styles.navigation__button}
                                    onClick={() => setShowNewQuestion(true)}>
                                <span className={styles.navigation__icon}>&nbsp;</span>
                            </button>
                        </div>
                }
            </div>
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
    currentPage: PropTypes.string
};

export default AdminQuestionSection;