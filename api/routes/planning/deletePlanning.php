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

if ($decodedToken) {
    try {
        $db = Flight::db();
        $statement = $db->prepare('
                    DELETE FROM PLANNING 
                    WHERE PLANNING.ID = ?
            ');

        $searchPlanningId = (int)Flight::request()->data->id;
        $statement->execute([
            $searchPlanningId
        ]);

        sendResponse(200, 'Planning removed.');
    } catch (Exception $e) {
        sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
    }
    $db = null;
} else {
    unauthorizedResponse('Please sign in.');
}
