<?php

if (Flight::get('IN_DEVELOPMENT')) {
    $requestHeaders = apache_request_headers();
    $authHeader = $requestHeaders['Authorization'] ?? null;
} else {
    $authHeader = $_SERVER["REDIRECT_HTTP_AUTHORIZATION"] ?? null;
}

$db = Flight::db();

// Get all the sections for the page.
$questionnaireRes = $db->prepare("
        SELECT Q.QUESTION_SECTION as section,
               Q.SECTION_ORDER as section_order,
               Q.QUESTION_NAME as name,
               Q.QUESTION_TYPE as type,
               Q.QUESTION_TEXT as question,
               Q.QUESTION_OPTIONS as options,
               Q.REQUIRED as required
        FROM QUESTIONS Q
        WHERE Q.PAGE_NAME = ?;
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

Flight::response()->header("type", "application/json");
Flight::response()->status(200);
echo Flight::json($groupedQuestions);
$db = null;
die();