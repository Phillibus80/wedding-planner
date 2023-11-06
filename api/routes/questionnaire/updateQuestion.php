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
) {
    Flight::response()->header("Content-Type", "application/json");
    Flight::response()->status(400);
    Flight::response()->write(json_encode(array(
        'status' => 400,
        'message' => 'All fields are required: section_name, question_name, question_text, question_type, and page_name.'
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
} // Update the Question
else {
    try {
        $decodedToken = JWT::decode($token, new Key(Flight::get('secretKey'), 'HS256'));
        if (isset($decodedToken->exp) && ($decodedToken->exp > time())) {
            if (isset($decodedToken->user->username) && isset($decodedToken->user->signedIn) && $decodedToken->user->signedIn) {
                $db = Flight::db();
                $statement = $db->prepare('
                    UPDATE QUESTIONS Q
                    SET Q.QUESTION_SECTION=?, Q.QUESTION_NAME=?, Q.QUESTION_TEXT=?,
                        Q.QUESTION_TYPE=?, Q.QUESTION_OPTIONS=?, Q.REQUIRED=?,
                        Q.PAGE_NAME=?
                    WHERE Q.QUESTION_SECTION=? AND Q.QUESTION_NAME=? AND Q.PAGE_NAME=?
            ');
                $statement->execute([
                    Flight::request()->data->section_name,
                    Flight::request()->data->question_name,
                    Flight::request()->data->question_text,
                    Flight::request()->data->question_type,
                    isset(Flight::request()->data->question_options) ? Flight::request()->data->question_options : '',
                    (isset(Flight::request()->data->question_required) && Flight::request()->data->question_required) ? 1 : 0,
                    Flight::request()->data->page_name,
                    Flight::get('sectionName'),
                    Flight::get('questionName'),
                    Flight::get('pageName')
                ]);

                Flight::response()->header('type', 'application/json');
                Flight::response()->status(200);
                echo Flight::json(array(
                    "status" => 200,
                    "message" => 'Question Updated.',
                    "section_name" => Flight::get('sectionName'),
                    "question_name" => Flight::get('questionName'),
                ));
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
        Flight::response()->header("Content-Type", "application/json");
        Flight::response()->status(401);
        Flight::response()->write(json_encode(array(
                "message" => "Please sign in."
            )
        ));
        Flight::response()->send();
    }
    $db = null;
}
die();