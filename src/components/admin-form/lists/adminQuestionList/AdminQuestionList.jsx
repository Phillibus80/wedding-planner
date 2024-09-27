import PropTypes from "prop-types";
import React from "react";
import {Container} from "react-bootstrap";

import {useGetQuestionnaireQuestions} from "../../../../hooks/api-hooks.js";
import AdminQuestionSection from "../../components/adminQuestionSection/AdminQuestionSection.jsx";


import styles from './AdminQuestionList.module.scss';

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
                .map(([, sectionObject]) => sectionObject);
    }

    return (
        <Container className={styles.AdminQuestions}>
            {
                questionsIsSuccess && questionSections?.map((section, index) => (
                        <AdminQuestionSection
                            key={`${section?.sectionName}_${currentPage}`}
                            section={section}
                            sectionName={section?.sectionName}
                            currentPage={currentPage}
                            sectionOrder={index + 1}
                        />
                    )
                )
            }
        </Container>
    )
};

AdminQuestionList.propTypes = {
    pageName: PropTypes.string
}

export default AdminQuestionList;