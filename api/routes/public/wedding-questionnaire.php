<?php

if (Flight::get('IN_DEVELOPMENT')) {
    $requestHeaders = apache_request_headers();
    $authHeader = $requestHeaders['Authorization'] ?? null;
} else {
    $authHeader = $_SERVER["REDIRECT_HTTP_AUTHORIZATION"] ?? null;
}

try {
    $db = Flight::db();

// Get all the sections for the page.
    $questionnaireRes = $db->prepare("
        SELECT QUESTIONS.QUESTION_SECTION as section,
               QUESTIONS.SECTION_ORDER as section_order,
               QUESTIONS.QUESTION_NAME as name,
               QUESTIONS.QUESTION_TYPE as type,
               QUESTIONS.QUESTION_TEXT as question,
               QUESTIONS.QUESTION_OPTIONS as options,
               QUESTIONS.REQUIRED as required
        FROM QUESTIONS
        WHERE QUESTIONS.PAGE_NAME = ?;
    ");
    $questionnaireRes->execute([
        Flight::get('currentQuestionnaire')
    ]);
    $questionnaireStatementResult = $questionnaireRes->fetchAll(PDO::FETCH_ASSOC);
    $questionnaireStatementCount = $questionnaireRes->rowCount();

// Group the questions by section
    $groupedQuestions = [];
    $sectionOrder = [];

    foreach ($questionnaireStatementResult as $question) {
        $section = $question['section'];
        $sectionOrder[] = $question['section_order'];

        unset($question['section']);
        $section_order = $question['section_order'];
        unset($question['section_order']);

        $question['required'] = $question['required'] == "1";

        if (!isset($groupedQuestions[$section_order])) {
            $groupedQuestions[$section_order] = [];
        }

        if (!isset($groupedQuestions[$section_order]['questionList'])) {
            $groupedQuestions[$section_order]['questionList'] = [];
        }

        $groupedQuestions[$section_order]['sectionName'] = $section;
        $groupedQuestions[$section_order]['questionList'][] = $question;
    }

    ksort($groupedQuestions);

    sendResponse(200, null, $groupedQuestions);
} catch (Exception $e) {
    sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
}
$db = null;