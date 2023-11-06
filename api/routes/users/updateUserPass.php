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
    (!isset(Flight::request()->data->current_password)
        || Flight::request()->data->current_password == "")
    || (!isset(Flight::request()->data->password)
        || Flight::request()->data->password == "")
) {
    Flight::response()->header("Content-Type", "application/json");
    Flight::response()->status(401);
    Flight::response()->write(json_encode(array(
            'message' => 'All fields are required: current_password, and password.'
        )
    ));
    Flight::response()->send();
} elseif (isset($token)) {
    try {
        // Verify the JWT
        $decodedToken = JWT::decode($token, new Key(Flight::get('secretKey'), 'HS256'));
        if (isset($decodedToken->exp) && ($decodedToken->exp > time())) {
            if (isset($decodedToken->user->username) && isset($decodedToken->user->signedIn) && $decodedToken->user->signedIn) {
                $db = Flight::db();

                // Search for the user
                $statement = $db->prepare('
                    SELECT USERNAME, PASSWORD, PERMISSION_LEVEL
                    FROM USERS
                    WHERE USERNAME = ?
          '
                );
                $statement->execute([Flight::get('currentUser')]);
                $statementResult = $statement->fetch(PDO::FETCH_ASSOC);
                $statementCount = $statement->rowCount();

                // If there is a user
                if ($statementCount > 0) {

                    // Check the current password
                    if (password_verify(Flight::request()->data->current_password, $statementResult['PASSWORD'])) {
                        $temp_password = password_hash(Flight::request()->data->password, PASSWORD_BCRYPT);
                        $get_user_statement = $db->prepare("
                            UPDATE USERS
                            SET PASSWORD = ?
                            WHERE USERS.USERNAME = ?
            "
                        );
                        $get_user_statement->execute([
                            $temp_password,
                            Flight::get('currentUser')
                        ]);

                        Flight::response()->header("Content-Type", "application/json");
                        Flight::response()->status(200);
                        echo Flight::json(array(
                            "status" => 200,
                            "message" => Flight::get('currentUser') . "'s password has been updated"
                        ));
                        Flight::response()->send();
                        $db = null;
                    } else {
                        Flight::response()->header("Content-Type", "application/json");
                        Flight::response()->status(401);
                        Flight::response()->write(json_encode(array(
                                "message" => "Username and Password combination do not match."
                            )
                        ));
                        Flight::response()->send();
                    }
                } else {
                    Flight::response()->header("Content-Type", "application/json");
                    Flight::response()->status(401);
                    Flight::response()->write(json_encode(array(
                            "message" => "Username and Password combination do not match."
                        )
                    ));
                    Flight::response()->send();
                }
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
            "status" => 401,
            "message" => "You are not authorized to view this content."
        )
    ));
    Flight::response()->send();
}
die();
