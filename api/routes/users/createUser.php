<?php

// There is a toggle for IN_DEVELOPMENT = true
// - updates the headers
// - ignores the bearer token
// - allows to simply create a new user
// For IN_DEVELOPMENT = false
// - all above will be set to false
if (Flight::get('IN_DEVELOPMENT')) {
    $requestHeaders = apache_request_headers();
    $authHeader = $requestHeaders['Authorization'] ?? null;
} else {
    $authHeader = $_SERVER["REDIRECT_HTTP_AUTHORIZATION"] ?? null;
}
$token = isset($authHeader) ? str_replace('Bearer ', '', $authHeader) : '';
$secret = Flight::get('secretKey');

// Missing required fields
if (
    (!isset(Flight::request()->data->first_name)
        || Flight::request()->data->first_name == "")
    || (!isset(Flight::request()->data->last_name)
        || Flight::request()->data->last_name == "")
    || (!isset(Flight::request()->data->user_name)
        || Flight::request()->data->user_name == "")
    || (!isset(Flight::request()->data->email)
        || Flight::request()->data->email == "")
    || (!isset(Flight::request()->data->password)
        || Flight::request()->data->password == "")
) {
    sendResponse(400, 'All fields are required: first_name, last_name, user_name, email, and password.');
} // Not signed in or wrong permissions

if (!isset($token) && !Flight::get('IN_DEVELOPMENT')) {
    unauthorizedResponse('Please sign in.');
}

$decodedToken = validateToken($token, $secret);

// Add the user
// IN_DEVELOPMENT will allow the user to create another user
// without checking permissions
if (($decodedToken && !Flight::get('IN_DEVELOPMENT')) || Flight::get('IN_DEVELOPMENT')) {
    try {
        $db = Flight::db();
        $temp_password = password_hash(Flight::request()->data->password, PASSWORD_BCRYPT);
        $statement = $db->prepare('
            INSERT INTO USERS (F_NAME, L_NAME, USERNAME, EMAIL, PASSWORD) 
            VALUES (?, ?, ?, ?, ?)
            ');
        $statement->execute([
            Flight::request()->data->first_name,
            Flight::request()->data->last_name,
            Flight::request()->data->user_name,
            Flight::request()->data->email,
            $temp_password
        ]);

        sendResponse(200, 'User added.');
    } catch (Exception $e) {
        sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
    }

    $db = null;
} else {
    unauthorizedResponse('Please sign in.');
}
