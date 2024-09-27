<?php

$authHeader = getAuthHeader();
$token = $authHeader ? str_replace('Bearer ', '', $authHeader) : null;
$secret = Flight::get('secretKey');
$requestData = Flight::request()->data;

// Missing required fields
if ((!isset(Flight::request()->data->question_section)
        || Flight::request()->data->question_section == "")
    || (!isset(Flight::request()->data->question_name)
        || Flight::request()->data->question_name == "")
    || (!isset(Flight::request()->data->page_name)
        || Flight::request()->data->page_name == "")) {
    sendResponse(400, 'All fields are required: question_section, question_name, and page_name.');
}
if (!isset($token)) {
    unauthorizedResponse('Please sign in.');
}

$decodedToken = validateToken($token, $secret);

// Remove the Question
if ($decodedToken) {
    try {
        $db = Flight::db();
        $statement = $db->prepare('
                    DELETE FROM QUESTIONS
                    WHERE QUESTIONS.QUESTION_SECTION = ? AND QUESTIONS.QUESTION_NAME = ? AND QUESTIONS.PAGE_NAME = ?
                ');
        $statement->execute([
            Flight::request()->data->question_section,
            Flight::request()->data->question_name,
            Flight::request()->data->page_name
        ]);

        sendResponse(200, 'Question removed.');
    } catch (Exception $e) {
        sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
    }
    $db = null;
} else {
    unauthorizedResponse('Please sign in.');
}
