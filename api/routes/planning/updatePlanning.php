<?php

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
    || (!isset(Flight::request()->data->column_title)
        || Flight::request()->data->column_title == "")
    || (!isset(Flight::request()->data->title)
        || Flight::request()->data->title == "")
    || (!isset(Flight::request()->data->planning_text)
        || Flight::request()->data->planning_text == "")
) {
    Flight::response()->header("Content-Type", "application/json");
    Flight::response()->status(400);
    Flight::response()->write(json_encode(array(
        'status' => 400,
        'message' => 'All fields are required: id, column_title, title, and planning_text.'
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
//        $decodedToken = JWT::decode($token, new Key(Flight::get('secretKey'), 'HS256'));
//        if (isset($decodedToken->exp) && ($decodedToken->exp > time())) {
//            if (isset($decodedToken->user->username) && isset($decodedToken->user->signedIn) && $decodedToken->user->signedIn) {
                $db = Flight::db();

                $statement = $db->prepare('
                    UPDATE PLANNING P
                    SET P.COLUMN_TITLE=?, P.TITLE=?, P.PLANNING_TEXT=?
                    WHERE P.ID=?
            ');
                $statement->execute([
                    Flight::request()->data->column_title,
                    Flight::request()->data->title,
                    Flight::request()->data->planning_text,
                    Flight::request()->data->id
                ]);

                Flight::response()->header('type', 'application/json');
                Flight::response()->status(200);
                echo Flight::json(array(
                    "status" => 200,
                    "message" => 'Planning Item Updated.'
                ));
//            } else {
//                Flight::response()->header("Content-Type", "application/json");
//                Flight::response()->status(401);
//                Flight::response()->write(json_encode(array(
//                        "message" => "You are not authorized to view this content."
//                    )
//                ));
//                Flight::response()->send();
//                die();
//            }
//        } else {
//            // Set the JWT
//            $user = [
//                'signedIn' => false,
//                'username' => "",
//                'permLevel' => ""
//            ];
//
//            $payload = [
//                'user' => $user,
//                'exp' => time(), // Token expiration time (45 min from now)
//            ];
//
//            // Generate the JWT
//            $jwt = JWT::encode($payload, Flight::get('secretKey'), 'HS256');
//
//            Flight::response()->header("Content-Type", "application/json");
//            Flight::response()->status(401);
//            Flight::response()->write(json_encode(array(
//                    "token" => $jwt,
//                    "message" => "Your session expired. Please sign back in."
//                )
//            ));
//            Flight::response()->send();
//            die();
//        }
    } catch
    (Exception $e) {
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