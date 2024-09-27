<?php

$authHeader = getAuthHeader();
$token = $authHeader ? str_replace('Bearer ', '', $authHeader) : null;
$secret = Flight::get('secretKey');
$requestData = Flight::request()->data;

if (empty($requestData->section_name) || empty($requestData->author) || empty($requestData->comment)) {
    sendResponse(400, 'All fields are required: section_name, author, and comment.');
}
if (!isset($token)) {
    unauthorizedResponse('Please sign in.');
}

$decodedToken = validateToken($token, $secret);

if ($decodedToken) {
    try {
        $db = Flight::db();
        $statement = $db->prepare('INSERT INTO COMMENTS (author, comment, section_name) VALUES (?, ?, ?)');
        $statement->execute([$requestData->author, $requestData->comment, $requestData->section_name]);

        sendResponse(200, 'Comment Created.');
    } catch (Exception $e) {
        sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
    }
    $db = null;
} else {
    unauthorizedResponse('Please sign in.');
}