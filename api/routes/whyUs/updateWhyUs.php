<?php

$authHeader = getAuthHeader();
$token = $authHeader ? str_replace('Bearer ', '', $authHeader) : null;
$secret = Flight::get('secretKey');
$requestData = Flight::request()->data;

// Missing required fields
if (
    (!isset(Flight::request()->data->id)
        || Flight::request()->data->id == "")
    || (!isset(Flight::request()->data->title)
        || Flight::request()->data->title == "")
    || (!isset(Flight::request()->data->why_text)
        || Flight::request()->data->why_text == "")
) {
    sendResponse(400, 'All fields are required: id, title, and why_text.');
}
if (!isset($token)) {
    unauthorizedResponse('Please sign in.');
}

$decodedToken = validateToken($token, $secret);

// Update the Why Us
if ($decodedToken) {
    try {
        $db = Flight::db();
        if (
            isset(Flight::request()->data->mui_icon)
            || isset(Flight::request()->data->iconify_icon)
        ) {
            $statement = $db->prepare('
                    UPDATE WHY_US W
                    SET W.TITLE=?, W.MUI_ICON=?, W.ICONIFY_ICON=?, W.WHY_TEXT=?
                    WHERE W.ID = ?
            ');
            $statement->execute([
                Flight::request()->data->title,
                isset(Flight::request()->data->mui_icon)
                    ? Flight::request()->data->mui_icon
                    : '',
                isset(Flight::request()->data->iconify_icon)
                    ? Flight::request()->data->iconify_icon
                    : '',
                Flight::request()->data->why_text,
                Flight::request()->data->id
            ]);
        } else {
            $statement = $db->prepare('
                    UPDATE WHY_US W
                    SET W.TITLE=?, W.WHY_TEXT=?
                    WHERE W.ID = ?
            ');
            $statement->execute([
                Flight::request()->data->title,
                Flight::request()->data->why_text,
                Flight::request()->data->id
            ]);
        }

        sendResponse(200, 'Why Us updated.');
    } catch (Exception $e) {
        sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
    }

    $db = null;
} else {
    unauthorizedResponse('Please sign in.');
}
