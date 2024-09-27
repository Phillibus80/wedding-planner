<?php
$authHeader = getAuthHeader();
$token = $authHeader ? str_replace('Bearer ', '', $authHeader) : null;
$secret = Flight::get('secretKey');
$requestData = Flight::request()->data;

// Missing required fields
if (
    (!isset(Flight::request()->data->id)
        || Flight::request()->data->id == "")
    || (!isset(Flight::request()->data->title))
    || (!isset(Flight::request()->data->url)
        || Flight::request()->data->url == "")
) {
    sendResponse(400, 'All fields are required: id, title, and url.');
}

// Not signed in or wrong permissions
if (!isset($token)) {
    unauthorizedResponse('Please sign in.');
}

$decodedToken = validateToken($token, $secret);

// Add the Comment
if ($decodedToken) {
    try {
        $db = Flight::db();
        $statement = $db->prepare('
            UPDATE LINKS L
            SET L.TITLE=?, L.URL=?
            WHERE L.ID = ?
            ');
        $statement->execute([
            Flight::request()->data->title,
            Flight::request()->data->url,
            Flight::request()->data->id
        ]);

        sendResponse(200, 'Link Updated.');
    } catch (Exception $e) {
        sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
    }
    $db = null;
} else {
    unauthorizedResponse('Please sign in.');
}