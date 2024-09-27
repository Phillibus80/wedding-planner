<?php

$authHeader = getAuthHeader();
$token = $authHeader ? str_replace('Bearer ', '', $authHeader) : null;
$secret = Flight::get('secretKey');
$requestData = Flight::request()->data;

// Missing required fields
if (
    (!isset(Flight::request()->data->id)
        || Flight::request()->data->id == "")
    || (!isset(Flight::request()->data->column_title)
        || Flight::request()->data->column_title == "")
    || (!isset(Flight::request()->data->title)
        || Flight::request()->data->title == "")
    || (!isset(Flight::request()->data->planning_text)
        || Flight::request()->data->planning_text == "")
) {
    sendResponse(400, 'All fields are required: id, column_title, title, and planning_text.');
}
if (!isset($token)) {
    unauthorizedResponse('Please sign in.');
}

$decodedToken = validateToken($token, $secret);

// Update the Planning
if ($decodedToken) {
    try {
        $db = Flight::db();

        $statement = $db->prepare('
                    UPDATE PLANNING P
                    SET P.COLUMN_TITLE=?, P.TITLE=?, P.PLANNING_TEXT=?
                    WHERE P.ID=?
            ');
        $statement->execute([
            Flight::request()->data->column_title,
            Flight::request()->data->title,
            Flight::request()->data->planning_text,
            Flight::request()->data->id
        ]);

        sendResponse(200, 'Planning Item Updated.');
    } catch (Exception $e) {
        sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
    }
    $db = null;
} else {
    unauthorizedResponse('Please sign in.');
}
