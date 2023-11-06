import styles from './AdminQuestionList.module.scss';
import PropTypes from "prop-types";
import {useGetQuestionnaireQuestions} from "../../../hooks/api-hooks.js";
import React from "react";
import AdminQuestionSection from "../adminQuestionSection/AdminQuestionSection.jsx";

const AdminQuestionList = ({pageName}) => {
    const currentPage = pageName.slice(1).replaceAll(' ', '_');
    let questionSections;

    const {
        data: questionData,
        isSuccess: questionsIsSuccess
    } = useGetQuestionnaireQuestions(currentPage);

    if (questionsIsSuccess) {
        questionSections =
            Object.entries(questionData?.data)
                .map(([_, sectionObject]) => sectionObject);
    }

    return (
        <div className={styles.AdminQuestions}>
            {
                questionsIsSuccess &&
                questionSections?.map((section, index) => (
                    <AdminQuestionSection
                        key={`${section?.sectionName}_${currentPage}`}
                        section={section}
                        sectionName={section?.sectionName}
                        currentPage={currentPage}
                        sectionOrder={index + 1}
                    />
                ))
            }
        </div>
    )
};

AdminQuestionList.propTypes = {
    pageName: PropTypes.string
}

export default AdminQuestionList;