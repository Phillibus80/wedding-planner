<?php

$authHeader = getAuthHeader();
$token = $authHeader ? str_replace('Bearer ', '', $authHeader) : null;
$secret = Flight::get('secretKey');
$requestData = Flight::request()->data;

if (empty($requestData->id) || empty($requestData->author) || empty($requestData->comment)) {
    sendResponse(400, 'All fields are required: id, author, and comment.');
}
if (!isset($token)) {
    unauthorizedResponse('Please sign in.');
}

$decodedToken = validateToken($token, $secret);

if ($decodedToken) {
    try {
        $db = Flight::db();
        $statement = $db->prepare('UPDATE COMMENTS SET AUTHOR = ?, COMMENT = ? WHERE ID = ?');
        $statement->execute([$requestData->author, $requestData->comment, $requestData->id]);

        sendResponse(200, 'Comment Updated.');
    } catch (Exception $e) {
        sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
    }
    $db = null;
} else {
    unauthorizedResponse('Please sign in.');
}
