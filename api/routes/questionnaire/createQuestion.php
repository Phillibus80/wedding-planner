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
    || (!isset(Flight::request()->data->section_order)
        || Flight::request()->data->section_order == "")
) {
    sendResponse(400, 'All fields are required: section_name, question_name, question_text, question_type, section_order, and page_name.');
}
if (!isset($token)) {
    unauthorizedResponse('Please sign in.');
}

$decodedToken = validateToken($token, $secret);

// Create the Question
if ($decodedToken) {
    try {
        $db = Flight::db();
        $statement = $db->prepare('
                    INSERT INTO QUESTIONS (QUESTION_SECTION, QUESTION_NAME, QUESTION_TEXT, QUESTION_TYPE, 
                                           QUESTION_OPTIONS, REQUIRED, PAGE_NAME, SECTION_ORDER) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    ');
        $statement->execute([
            Flight::request()->data->section_name,
            Flight::request()->data->question_name,
            Flight::request()->data->question_text,
            Flight::request()->data->question_type,
            isset(Flight::request()->data->question_options) ? Flight::request()->data->question_options : '',
            (isset(Flight::request()->data->required) && Flight::request()->data->required) ? 1 : 0,
            Flight::request()->data->page_name,
            isset(Flight::request()->data->section_order) ? Flight::request()->data->section_order : 1
        ]);

        sendResponse(200, 'Question created.');
    } catch (Exception $e) {
        sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
    }

    $db = null;
} else {
    unauthorizedResponse('Please sign in.');
}
