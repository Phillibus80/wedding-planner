<?php

$authHeader = getAuthHeader();
$token = $authHeader ? str_replace('Bearer ', '', $authHeader) : null;
$secret = Flight::get('secretKey');
$requestData = Flight::request()->data;

// Missing required fields
if (
    (!isset(Flight::request()->data->section_name)
        || Flight::request()->data->section_name == "")
    || (!isset(Flight::request()->data->title)
        || Flight::request()->data->title == "")
    || (!isset(Flight::request()->data->url)
        || Flight::request()->data->url == "")
) {
    sendResponse(400, 'All fields are required: section_name, url, and title.');
} // Not signed in or wrong permissions

if (!isset($token)) {
    unauthorizedResponse('Please sign in.');
} // Add the link

$decodedToken = $decodedToken = validateToken($token, $secret);

if ($decodedToken) {
    try {
        $db = Flight::db();
        $statement = $db->prepare('
            INSERT INTO LINKS (title, url, section_name) 
            VALUES (?, ?, ?)
            ');
        $statement->execute([
            Flight::request()->data->title,
            Flight::request()->data->url,
            Flight::request()->data->section_name
        ]);

        sendResponse(200, 'Link Created.');
    } catch (Exception $e) {
        sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
    }
    $db = null;
} else {
    unauthorizedResponse('Please sign in.');
}
