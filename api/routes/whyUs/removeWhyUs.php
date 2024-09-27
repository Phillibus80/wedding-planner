<?php

$authHeader = getAuthHeader();
$token = $authHeader ? str_replace('Bearer ', '', $authHeader) : null;
$secret = Flight::get('secretKey');
$requestData = Flight::request()->data;

// Missing required fields
if (!isset(Flight::request()->data->id)
    || Flight::request()->data->id == "") {
    sendResponse(400, 'All fields are required: id.');
}
if (!isset($token)) {
    unauthorizedResponse('Please sign in.');
}

$decodedToken = validateToken($token, $secret);

// Remove the Why Us
if ($decodedToken) {
    try {
        $db = Flight::db();
        $statement = $db->prepare('
                    DELETE FROM WHY_US W 
                    WHERE W.ID = ?
            ');
        $statement->execute([
            Flight::request()->data->id
        ]);

        sendResponse(200, 'Why Us removed.');
    } catch (Exception $e) {
        sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
    }

    $db = null;
} else {
    unauthorizedResponse('Please sign in.');
}