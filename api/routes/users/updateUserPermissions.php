<?php

$authHeader = getAuthHeader();
$token = $authHeader ? str_replace('Bearer ', '', $authHeader) : null;
$secret = Flight::get('secretKey');
$requestData = Flight::request()->data;

if (!isset(Flight::request()->data->permissionLevel)
    || Flight::request()->data->permissionLevel == "") {
    sendResponse(400, 'All fields are required: permissionLevel.');
}
if (!isset($token)) {
    unauthorizedResponse('Please sign in.');
}

$decodedToken = validateToken($token, $secret);

if ($decodedToken) {
    try {
        $db = Flight::db();
        $get_user_statement = $db->prepare("
            UPDATE USERS 
            SET PERMISSION_LEVEL = ?
            WHERE USERS.USERNAME = ?
            "
        );
        $get_user_statement->execute([
            Flight::request()->data->permissionLevel,
            Flight::get('currentUser')
        ]);

        sendResponse(200, Flight::get('currentUser') . "'s permission level has been updated");
    } catch (Exception $e) {
        sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
    }

    $db = null;
} else {
    unauthorizedResponse('Please sign in.');
}
