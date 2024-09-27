<?php

$authHeader = getAuthHeader();
$token = $authHeader ? str_replace('Bearer ', '', $authHeader) : null;
$secret = Flight::get('secretKey');
$requestData = Flight::request()->data;

if (!isset($token)) {
    unauthorizedResponse('Please sign in.');
}

$decodedToken = validateToken($token, $secret);

if ($decodedToken) {
    try {
        $db = Flight::db();
        $data = $db->query("SELECT * FROM USERS");
        $response = array();

        foreach ($data as $row) {
            $response[] = array(
                'firstname' => $row['F_NAME'],
                'lastname' => $row['L_NAME'],
                'username' => $row['USERNAME'],
                'permission_level' => $row['PERMISSION_LEVEL']
            );
        }

        sendResponse(200, null, ['count' => count($response), 'data' => $response]);
    } catch (Exception $e) {
        sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
    }

    $db = null;
} else {
    unauthorizedResponse('Please sign in.');
}