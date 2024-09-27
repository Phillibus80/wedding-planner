<?php

$authHeader = getAuthHeader();
$token = $authHeader ? str_replace('Bearer ', '', $authHeader) : null;
$secret = Flight::get('secretKey');
$requestData = Flight::request()->data;

// Missing required fields
if ((!isset(Flight::request()->data->section_name)
        || Flight::request()->data->section_name == "")
    || (!isset(Flight::request()->data->title)
        || Flight::request()->data->title == "")
    || (!isset(Flight::request()->data->why_text)
        || Flight::request()->data->why_text == "")) {
    sendResponse(400, 'All fields are required: section_name, title, and why_text.');
}

if (!isset($token)) {
    unauthorizedResponse('Please sign in.');
}

$decodedToken = validateToken($token, $secret);

// Add the Why Us
if ($decodedToken) {
    try {
        $db = Flight::db();
        $statement = $db->prepare('
                    INSERT INTO WHY_US (title, why_text, mui_icon, iconify_icon, section_name) 
                    VALUES (?, ?, ?, ?, ?)
                    ');
        $statement->execute([
            Flight::request()->data->title,
            Flight::request()->data->why_text,
            isset(Flight::request()->data->mui_icon)
                ? Flight::request()->data->mui_icon
                : '',
            isset(Flight::request()->data->iconify_icon)
                ? Flight::request()->data->iconify_icon
                : '',
            Flight::request()->data->section_name
        ]);

        sendResponse(200, 'Why Us Created.');
    } catch (Exception $e) {
        sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
    }

    $db = null;
} else {
    unauthorizedResponse('Please sign in.');
}
