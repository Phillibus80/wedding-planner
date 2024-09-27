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
        $get_user_statement = $db->prepare("
                SELECT F_NAME, L_NAME, USERNAME, EMAIL
                FROM USERS
                WHERE USERS.USERNAME = ?"
        );
        $get_user_statement->execute([Flight::get('currentUser')]);
        $statementResult = $get_user_statement->fetch(PDO::FETCH_ASSOC);
        $userResponse = array();

        if ($statementResult) {
            $userResponse = array(
                'firstName' => $statementResult['F_NAME'],
                'lastName' => $statementResult['L_NAME'],
                'username' => $statementResult['USERNAME'],
                'email' => $statementResult['EMAIL'],
                'token' => $token
            );

            sendResponse(200, null, ["data" => $userResponse]);
        } else {
            sendResponse(400, 'User not found.');
        }
    } catch (Exception $e) {
        sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
    }

    $db = null;
} else {
    unauthorizedResponse('Please sign in.');
}