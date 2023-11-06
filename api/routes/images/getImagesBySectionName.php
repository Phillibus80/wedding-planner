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

if (isset($token)) {
    try {
        $decodedToken = JWT::decode($token, new Key(Flight::get('secretKey'), 'HS256'));
        if (isset($decodedToken->exp) && ($decodedToken->exp > time())) {
            if (isset($decodedToken->user->username) && isset($decodedToken->user->signedIn) && $decodedToken->user->signedIn) {
                $db = Flight::db();
                $get_images_statement = $db->prepare("
                    SELECT IMAGE_NAME, SRC, ALT, TAGLINE, PRIORITY_NUMBER
                    FROM IMAGES 
                    WHERE IMAGES.SECTION_NAME = ?
                    "
                );
                $get_images_statement->execute([Flight::get('currentSection')]);
                $statementResult = $get_images_statement->fetchAll(PDO::FETCH_ASSOC);
                $imagesResponse = array();

                foreach ($statementResult as $raw) {
                    $imagesResponse[] = array(
                        "imageName" => $raw['IMAGE_NAME'],
                        "src" => $raw['SRC'],
                        "alt" => $raw['ALT'],
                        "tagline" => $raw['TAGLINE'],
                        "priority" => $raw['PRIORITY_NUMBER']
                    );
                }

                Flight::response()->header("Content-Type", "application/json");
                Flight::response()->status(200);
                Flight::response()->write(json_encode(array(
                    "status" => 200,
                    "count" => count($imagesResponse),
                    "images" => $imagesResponse
                )));
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
        Flight::response()->send();
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
