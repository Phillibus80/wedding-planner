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
    Flight::response()->header("Content-Type", "application/json");
    Flight::response()->status(400);
    Flight::response()->write(json_encode(array(
        'status' => 400,
        'message' => 'All fields are required: first_name, last_name, user_name, email, and password.'
    )));
    Flight::response()->send();
} // Not signed in or wrong permissions
//elseif (!isset($token)) {
//    Flight::response()->header("Content-Type", "application/json");
//    Flight::response()->status(401);
//    Flight::response()->write(json_encode(array(
//        'status' => 401,
//        'message' => 'You are not authorized to view this content.'
//    )));
//    Flight::response()->send();
//} // Add the user
else {
//    try {
//        // Verify the JWT
//        $decodedToken = JWT::decode($token, new Key(Flight::get('secretKey'), 'HS256'));
//        if (isset($decodedToken->exp) && ($decodedToken->exp > time())) {
//            if (isset($decodedToken->user->username) && isset($decodedToken->user->signedIn) && $decodedToken->user->signedIn) {
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

                Flight::response()->header("Content-Type", "application/json");
                Flight::response()->status(200);
                Flight::response()->write(json_encode(array(
                    "status" => 200,
                    "message" => 'User added.'
                )));
//            } else {
//                Flight::response()->header("Content-Type", "application/json");
//                Flight::response()->status(401);
//                Flight::response()->write(json_encode(array(
//                        "message" => "Please sign in."
//                    )
//                ));
//            }
//        } else {
//            Flight::response()->header("Content-Type", "application/json");
//            Flight::response()->status(401);
//            Flight::response()->write(json_encode(array(
//                    "message" => "Your session expired. Please sign back in."
//                )
//            ));
//        }
//        Flight::response()->send();
//    } catch (Exception $e) {
//        Flight::response()->header("Content-Type", "application/json");
//        Flight::response()->status(401);
//        Flight::response()->write(json_encode(array(
//                "message" => "Please sign in."
//            )
//        ));
//        Flight::response()->send();
//    }
    $db = null;
}
die();
