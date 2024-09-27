<?php
$authHeader = getAuthHeader();
$token = isset($authHeader) ? str_replace('Bearer ', '', $authHeader) : null;
$secret = Flight::get('secretKey');

if (!isset(Flight::request()->data->id) || Flight::request()->data->id == "") {
    sendResponse(400, 'All fields are required: id.');
}

if (!isset($token)) {
    unauthorizedResponse('Please sign in.');
}

$decodedToken = validateToken($token, $secret);

if ($decodedToken) {
    try {
        $db = Flight::db();
        $statement = $db->prepare('DELETE FROM COMMENTS WHERE ID = ?');
        $statement->execute([Flight::request()->data->id]);

        sendResponse(200, 'Comment removed.');
    } catch (Exception $e) {
        sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
    }
    $db = null;
} else {
    unauthorizedResponse('Please sign in.');
}
