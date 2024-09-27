<?php
$authHeader = getAuthHeader();
$token = isset($authHeader) ? str_replace('Bearer ', '', $authHeader) : null;
$secret = Flight::get('secretKey');

//Missing required fields
if (
    !isset(Flight::request()->data->image_id)
) {
    sendResponse(400, 'All fields are required: image_id.');
}

// Not signed in or wrong permissions
if (!isset($token)) {
    unauthorizedResponse('Please sign in.');
}

$decodedToken = validateToken($token, $secret);

if ($decodedToken) {
    try {
        $db = Flight::db();
        $statement = $db->prepare('
                    DELETE FROM IMAGES
                    WHERE IMAGES.ID = ?
            ');

        $searchImageId = (int)Flight::request()->data->image_id;
        $statement->execute([
            $searchImageId
        ]);

        sendResponse(200, 'Image removed.');
    } catch (Exception $e) {
        sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
    }
    $db = null;
} else {
    unauthorizedResponse('Please sign in.');
}
