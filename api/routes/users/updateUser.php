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

if (
    (!isset(Flight::request()->data->first_name)
        || Flight::request()->data->first_name == "")
    || (!isset(Flight::request()->data->last_name)
        || Flight::request()->data->last_name == "")
    || (!isset(Flight::request()->data->user_name)
        || Flight::request()->data->user_name == "")
    || (!isset(Flight::request()->data->email)
        || Flight::request()->data->email == "")
) {
    Flight::response()->header("Content-Type", "application/json");
    Flight::response()->status(400);
    Flight::response()->write(json_encode(array(
        'status' => 400,
        'message' => 'All fields are required: first_name, last_name, user_name, and email.'
    )));
    Flight::response()->send();
} elseif (isset($token)) {
    try {
        // Verify the JWT
        $decodedToken = JWT::decode($token, new Key(Flight::get('secretKey'), 'HS256'));
        if (isset($decodedToken->exp) && ($decodedToken->exp > time())) {
            if (isset($decodedToken->user->username) && isset($decodedToken->user->signedIn) && $decodedToken->user->signedIn) {
                $db = Flight::db();
                $get_user_statement = $db->prepare("
            UPDATE USERS 
            SET F_NAME = ?, 
                L_NAME = ?,
                USERNAME = ?,
                EMAIL = ?
            WHERE USERS.USERNAME = ?
            "
                );
                $get_user_statement->execute([
                    Flight::request()->data->first_name,
                    Flight::request()->data->last_name,
                    Flight::get('currentUser'),
                    Flight::request()->data->email,
                    Flight::get('currentUser')
                ]);

                Flight::response()->header("Content-Type", "application/json");
                Flight::response()->status(200);
                echo Flight::json(array(
                    "status" => 200,
                    "message" => Flight::get('currentUser') . " updated"
                ));
            } else {
                Flight::response()->header("Content-Type", "application/json");
                Flight::response()->status(401);
                Flight::response()->write(json_encode(array(
                        "message" => "Please sign in."
                    )
                ));
                Flight::response()->send();
            }
        } else {
            // Set the JWT
            $user = [
                'signedIn' => false,
                'username' => "",
                'permLevel' => ""
            ];

            $payload = [
                'user' => $user,
                'exp' => time(), // Token expiration time (45 min from now)
            ];

            // Generate the JWT
            $jwt = JWT::encode($payload, Flight::get('secretKey'), 'HS256');

            Flight::response()->header("Content-Type", "application/json");
            Flight::response()->status(401);
            Flight::response()->write(json_encode(array(
                    "token" => $jwt,
                    "message" => "Your session expired. Please sign back in."
                )
            ));
            Flight::response()->send();
        }
    } catch (Exception $e) {
        Flight::response()->header("Content-Type", "application/json");
        Flight::response()->status(401);
        Flight::response()->write(json_encode(array(
                "message" => "Please sign in."
            )
        ));
        Flight::response()->send();
    }
    $db = null;
} else {
    Flight::response()->header("Content-Type", "application/json");
    Flight::response()->status(401);
    Flight::response()->write(json_encode(array(
            "message" => "You are not authorized to view this content."
        )
    ));
    Flight::response()->send();
}
die();
