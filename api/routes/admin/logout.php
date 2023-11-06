<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

if (Flight::get('IN_DEVELOPMENT')) {
    $requestHeaders = apache_request_headers();
    $authHeader = $requestHeaders['Authorization'] ?? null;
} else {
    $authHeader = $_SERVER["REDIRECT_HTTP_AUTHORIZATION"] ?? null;
}
$token = isset($authHeader) ? str_replace('Bearer ', '', $authHeader) : null;
$secret = Flight::get('secretKey');

// Not signed in or wrong permissions
if (!isset($token)) {
    Flight::response()->header('type', 'application/json');
    Flight::response()->status(401);
    Flight::response()->write(json_encode(array(
        'status' => 401,
        'message' => 'You are not logged in.'
    )));
    Flight::response()->send();
} else {
    $decodedToken = JWT::decode($token, new Key(Flight::get('secretKey'), 'HS256'));

    if (isset($decodedToken->user->username) && isset($decodedToken->user->signedIn) && $decodedToken->user->signedIn) {
        // Set the JWT
        $user = [
            'signedIn' => false,
            'username' => '',
            'permLevel' => ''
        ];

        $payload = [
            'user' => $user,
            'exp' => time()
        ];

        // Generate the JWT
        $jwt = JWT::encode($payload, Flight::get('secretKey'), 'HS256');

        Flight::response()->header("Content-Type", "application/json");
        Flight::response()->status(200);
        Flight::response()->write(json_encode(array(
            "status" => 200,
            "token" => $jwt,
            "message" => 'Signed out.'
        )));
        Flight::response()->send();
        $db = null;
        die();
    } else {
        Flight::response()->header("Content-Type", "application/json");
        Flight::response()->status(401);
        Flight::response()->write(json_encode(array(
                "message" => "You are not logged in."
            )
        ));
        Flight::response()->send();
    }
}
die();
