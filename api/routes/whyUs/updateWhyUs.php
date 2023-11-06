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
    (!isset(Flight::request()->data->id)
        || Flight::request()->data->id == "")
    || (!isset(Flight::request()->data->title)
        || Flight::request()->data->title == "")
    || (!isset(Flight::request()->data->why_text)
        || Flight::request()->data->why_text == "")
) {
    Flight::response()->header("Content-Type", "application/json");
    Flight::response()->status(400);
    Flight::response()->write(json_encode(array(
        'status' => 400,
        'message' => 'All fields are required: id, title, and why_text.'
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
} // Update the Comment
else {
    try {
        $decodedToken = JWT::decode($token, new Key(Flight::get('secretKey'), 'HS256'));
        if (isset($decodedToken->exp) && ($decodedToken->exp > time())) {
            if (isset($decodedToken->user->username) && isset($decodedToken->user->signedIn) && $decodedToken->user->signedIn) {
                $db = Flight::db();
                if (
                    isset(Flight::request()->data->mui_icon)
                    || isset(Flight::request()->data->iconify_icon)
                ) {
                    $statement = $db->prepare('
                    UPDATE WHY_US W
                    SET W.TITLE=?, W.MUI_ICON=?, W.ICONIFY_ICON=?, W.WHY_TEXT=?
                    WHERE W.ID = ?
            ');
                    $statement->execute([
                        Flight::request()->data->title,
                        isset(Flight::request()->data->mui_icon)
                            ? Flight::request()->data->mui_icon
                            : '',
                        isset(Flight::request()->data->iconify_icon)
                            ? Flight::request()->data->iconify_icon
                            : '',
                        Flight::request()->data->why_text,
                        Flight::request()->data->id
                    ]);
                } else {
                    $statement = $db->prepare('
                    UPDATE WHY_US W
                    SET W.TITLE=?, W.WHY_TEXT=?
                    WHERE W.ID = ?
            ');
                    $statement->execute([
                        Flight::request()->data->title,
                        Flight::request()->data->why_text,
                        Flight::request()->data->id
                    ]);
                }

                Flight::response()->header('type', 'application/json');
                Flight::response()->status(200);
                echo Flight::json(array(
                    "status" => 200,
                    "message" => 'Why Us Updated.'
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