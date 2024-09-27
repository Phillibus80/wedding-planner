<?php
$authHeader = getAuthHeader();
$token = $authHeader ? str_replace('Bearer ', '', $authHeader) : null;
$secret = Flight::get('secretKey');
$requestData = Flight::request()->data;

// Missing required fields
if ((!isset(Flight::request()->data->column_title)
        || Flight::request()->data->column_title == "")
    || (!isset(Flight::request()->data->title)
        || Flight::request()->data->title == "")
    || (!isset(Flight::request()->data->planning_text)
        || Flight::request()->data->planning_text == "")
    || (!isset(Flight::request()->data->section_name)
        || Flight::request()->data->section_name == "")) {
    sendResponse(400, 'All fields are required: column_title, title, planning_text, and section_name.');
}

if (!isset($token)) {
    unauthorizedResponse('Please sign in.');
}

$decodedToken = validateToken($token, $secret);

// Add the Planning Column
if ($decodedToken) {
    try {
        $db = Flight::db();
        $statement = $db->prepare('
                    INSERT INTO PLANNING (column_title, title, planning_text, section_name) 
                    VALUES (?, ?, ?, ?)
                    ');
        $statement->execute([
            Flight::request()->data->column_title,
            Flight::request()->data->title,
            Flight::request()->data->planning_text,
            Flight::request()->data->section_name
        ]);

        sendResponse(200, 'Planning Column Created.');
    } catch (Exception $e) {
        sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
    }
    $db = null;
} else {
    unauthorizedResponse('Please sign in.');
}