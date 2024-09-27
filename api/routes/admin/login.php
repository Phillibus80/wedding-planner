<?php

use Firebase\JWT\JWT;

function getUserData($db, $username)
{
    $stmt = $db->prepare('SELECT USERNAME, PASSWORD, PERMISSION_LEVEL FROM USERS WHERE USERNAME = ?');
    $stmt->execute([$username]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

$http_origin = $_SERVER['HTTP_ORIGIN'] ?? '';
setCorsHeaders($http_origin);

handlePreFlight();

$username = Flight::request()->data->username ?? '';
$password = Flight::request()->data->password ?? '';

if (empty($username) || empty($password)) {
    unauthorizedResponse('Username and/or Password field(s) are required.');
}

try {
    $db = Flight::db();
    $userData = getUserData($db, $username);

    if ($userData && password_verify($password, $userData['PASSWORD'])) {
        $user = [
            'signedIn' => true,
            'username' => $userData['USERNAME'],
            'permLevel' => $userData['PERMISSION_LEVEL']
        ];

        $payload = [
            'user' => $user,
            'exp' => time() + (60 * 45), // Token expiration time (45 min from now)
        ];

        $jwt = JWT::encode($payload, Flight::get('secretKey'), 'HS256');
        sendResponse(200, 'Signed In', ["token" => $jwt, "status" => 200, "username" => $userData['USERNAME']]);
    } else {
        unauthorizedResponse('Username and Password combination do not match.');
    }
} catch (Exception $e) {
    sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
}
$db = null;
