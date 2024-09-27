<?php

$authHeader = getAuthHeader();
$token = $authHeader ? str_replace('Bearer ', '', $authHeader) : null;
$secret = Flight::get('secretKey');
$requestData = Flight::request()->data;

if (
    (!isset(Flight::request()->data->first_name)
        || Flight::request()->data->first_name == "")
    || (!isset(Flight::request()->data->last_name)
        || Flight::request()->data->last_name == "")
    || (!isset(Flight::request()->data->user_name)
        || Flight::request()->data->user_name == "")
    || (!isset(Flight::request()->data->email)
        || Flight::request()->data->email == "")
) {
    sendResponse(400, 'All fields are required: first_name, last_name, user_name, and email.');
}

if (!isset($token)) {
    unauthorizedResponse('Please sign in.');
}

$decodedToken = validateToken($token, $secret);

if ($decodedToken) {
    try {
        $db = Flight::db();
        $update_user_statement = $db->prepare("
            UPDATE USERS 
            SET F_NAME = ?, 
                L_NAME = ?,
                USERNAME = ?,
                EMAIL = ?
            WHERE USERS.USERNAME = ?
            "
        );
        $update_user_statement->execute([
            Flight::request()->data->first_name,
            Flight::request()->data->last_name,
            Flight::request()->data->user_name,
            Flight::request()->data->email,
            Flight::get('currentUser')
        ]);

        sendResponse(200, Flight::get('currentUser') . " updated");
    } catch (Exception $e) {
        sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
    }

    $db = null;
} else {
    unauthorizedResponse('Please sign in.');
}
