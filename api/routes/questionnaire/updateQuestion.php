<?php

$authHeader = getAuthHeader();
$token = $authHeader ? str_replace('Bearer ', '', $authHeader) : null;
$secret = Flight::get('secretKey');
$requestData = Flight::request()->data;

// Missing required fields
if (
    (!isset(Flight::request()->data->section_name)
        || Flight::request()->data->section_name == "")
    || (!isset(Flight::request()->data->question_name)
        || Flight::request()->data->question_name == "")
    || (!isset(Flight::request()->data->question_text)
        || Flight::request()->data->question_text == "")
    || (!isset(Flight::request()->data->question_type)
        || Flight::request()->data->question_type == "")
    || (!isset(Flight::request()->data->page_name)
        || Flight::request()->data->page_name == "")
) {
    sendResponse(400, 'All fields are required: section_name, question_name, question_text, question_type, and page_name.');
}
if (!isset($token)) {
    unauthorizedResponse('Please sign in.');
}

$decodedToken = validateToken($token, $secret);

// Update the Question
if ($decodedToken) {
    try {
        $db = Flight::db();
        $statement = $db->prepare('
                    UPDATE QUESTIONS
                    SET 
                        QUESTIONS.QUESTION_TEXT=?,
                        QUESTIONS.QUESTION_TYPE=?, 
                        QUESTIONS.QUESTION_OPTIONS=?, 
                        QUESTIONS.REQUIRED=?
                    WHERE QUESTIONS.QUESTION_SECTION=? 
                      AND QUESTIONS.QUESTION_NAME=? 
                      AND QUESTIONS.PAGE_NAME=?
            ');
        $statement->execute([
            Flight::request()->data->question_text,
            Flight::request()->data->question_type,
            isset(Flight::request()->data->question_options) ? Flight::request()->data->question_options : '',
            (isset(Flight::request()->data->question_required) && Flight::request()->data->question_required) ? 1 : 0,
            Flight::request()->data->section_name,
            Flight::request()->data->question_name,
            Flight::request()->data->page_name,
        ]);

        sendResponse(200, 'Question Updated.');
    } catch (Exception $e) {
        sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
    }

    $db = null;
} else {
    unauthorizedResponse('Please sign in.');
}
