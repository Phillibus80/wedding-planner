<?php

$authHeader = getAuthHeader();
$token = $authHeader ? str_replace('Bearer ', '', $authHeader) : null;
$secret = Flight::get('secretKey');
$requestData = Flight::request()->data;

// Missing required fields
if (
    !isset(Flight::request()->data->id)
    || Flight::request()->data->id == ""
) {
    sendResponse(400, 'All fields are required: id.');
}

// Not signed in or wrong permissions
if (!isset($token)) {
    unauthorizedResponse('Please sign in.');
}

$decodedToken = validateToken($token, $secret);

// Add the Link
if ($decodedToken) {
    try {
        $db = Flight::db();
        $statement = $db->prepare('
            DELETE FROM LINKS
            WHERE LINKS.ID = ?
            ');
        $statement->execute([
            Flight::request()->data->id
        ]);

        sendResponse(200, 'Link Removed.');
    } catch (Exception $e) {
        sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
    }
    $db = null;
} else {
    unauthorizedResponse('Please sign in.');
}
