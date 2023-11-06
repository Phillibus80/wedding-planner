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
    (!isset(Flight::request()->data->section_name)
        || Flight::request()->data->section_name == "")
    || (!isset(Flight::request()->data->question_name)
        || Flight::request()->data->question_name == "")
    || (!isset(Flight::request()->data->question_text)
        || Flight::request()->data->question_text == "")
    || (!isset(Flight::request()->data->question_type)
        || Flight::request()->data->question_type == "")
    || (!isset(Flight::request()->data->page_name)
        || Flight::request()->data->page_name == "")
    || (!isset(Flight::request()->data->section_order)
        || Flight::request()->data->section_order == "")
) {
    Flight::response()->header("Content-Type", "application/json");
    Flight::response()->status(400);
    Flight::response()->write(json_encode(array(
        'status' => 400,
        'message' => 'All fields are required: section_name, question_name, question_text, question_type, section_order, and page_name.'
    )));
    Flight::response()->send();
} // Not signed in or wrong permissions
elseif (!isset($token)) {
    Flight::response()->header('type', 'application/json');
    Flight::response()->status(401);
    Flight::response()->write(json_encode(array(
        'status' => 401,
        'message' => 'You are not authorized to view this content.'
    )));
    Flight::response()->send();
} // Add the Comment
else {
    try {
        // Verify the JWT
        $decodedToken = JWT::decode($token, new Key(Flight::get('secretKey'), 'HS256'));
        // Has Token expired
        if (isset($decodedToken->exp) && ($decodedToken->exp > time())) {
            if (isset($decodedToken->user->username) && isset($decodedToken->user->signedIn) && $decodedToken->user->signedIn) {
                $db = Flight::db();
                $statement = $db->prepare('
                    INSERT INTO QUESTIONS (QUESTION_SECTION, QUESTION_NAME, QUESTION_TEXT, QUESTION_TYPE, 
                                           QUESTION_OPTIONS, REQUIRED, PAGE_NAME, SECTION_ORDER) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    ');
                $statement->execute([
                    Flight::request()->data->section_name,
                    Flight::request()->data->question_name,
                    Flight::request()->data->question_text,
                    Flight::request()->data->question_type,
                    isset(Flight::request()->data->question_options) ? Flight::request()->data->question_options : '',
                    (isset(Flight::request()->data->required) && Flight::request()->data->required) ? 1 : 0,
                    Flight::request()->data->page_name,
                    isset(Flight::request()->data->section_order) ? Flight::request()->data->section_order : 1
                ]);

                Flight::response()->header('type', 'application/json');
                Flight::response()->status(200);
                echo Flight::json(array(
                    "status" => 200,
                    "message" => 'Question Created.'
                ));
                $db = null;
            } else {
                Flight::response()->header("Content-Type", "application/json");
                Flight::response()->status(401);
                Flight::response()->write(json_encode(array(
                        "message" => "You are not authorized to view this content."
                    )
                ));
                Flight::response()->send();
                die();
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
            die();
        }
    } catch (Exception $e) {
        // JWT verification failed, return a 401 Unauthorized response
        Flight::response()->header("Content-Type", "application/json");
        Flight::response()->status(401);
        Flight::response()->write(json_encode(array(
                "message" => "You are not authorized to view this content."
            )
        ));
        Flight::response()->send();
        die();
    }
}
die();