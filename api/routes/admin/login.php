<?php

use Firebase\JWT\JWT;

$http_origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (Flight::get('IN_DEVELOPMENT')) {
    if ($http_origin == "http://127.0.0.1:5173" || $http_origin == "http://localhost:5173") {
        header("Access-Control-Allow-Origin: $http_origin");
    }
} else {
    header("Access-Control-Allow-Origin: https://www.thecatladypetsitting.com");
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: X-Requested-With, Origin, Content-Type, X-CSRF-Token, Accept');

if (
    (!isset(Flight::request()->data->username)
        || Flight::request()->data->username == "")
    || (!isset(Flight::request()->data->password)
        || Flight::request()->data->password == ""
    )
) {
    Flight::response()->header("Content-Type", "application/json");
    Flight::response()->status(401);
    Flight::response()->write(json_encode(array(
            'message' => 'Username and/or Password field(s) are required.'
        )
    ));
    Flight::response()->send();
} else {
    $db = Flight::db();

    // Search for the user
    $statement = $db->prepare('SELECT USERNAME, PASSWORD, PERMISSION_LEVEL
          FROM USERS
          WHERE USERNAME = ?'
    );
    $statement->execute([Flight::request()->data->username]);
    $statementResult = $statement->fetch(PDO::FETCH_ASSOC);
    $statementCount = $statement->rowCount();

    // If there is a user
    if ($statementCount > 0) {

        // Check the password
        if (password_verify(Flight::request()->data->password, $statementResult['PASSWORD'])) {
            // Set the JWT
            $user = [
                'signedIn' => true,
                'username' => $statementResult['USERNAME'],
                'permLevel' => $statementResult['PERMISSION_LEVEL']
            ];

            $payload = [
                'user' => $user,
                'exp' => time() + (60 * 45), // Token expiration time (45 min from now)
            ];

            // Generate the JWT
            $jwt = JWT::encode($payload, Flight::get('secretKey'), 'HS256');

            Flight::response()->header("Content-Type", "application/json");
            Flight::response()->status(200);
            Flight::response()->write(json_encode(array(
                "status" => 200,
                "token" => $jwt,
                "message" => 'Signed In ' . $statementResult['USERNAME']
            )));
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
}
die();