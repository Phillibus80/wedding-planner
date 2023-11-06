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
                $get_links_statement = $db->prepare("
            SELECT TITLE, URL, SECTION_NAME
            FROM LINKS
            WHERE LINKS.SECTION_NAME = ?
            "
                );
                $get_links_statement->execute([Flight::get('currentSection')]);
                $statementResult = $get_links_statement->fetchAll(PDO::FETCH_ASSOC);
                $linksResponse = array();

                foreach ($statementResult as $row) {
                    $linksResponse[] = array(
                        "title" => $row['TITLE'],
                        "url" => $row['URL'],
                        "sectionName" => $row['SECTION_NAME']
                    );
                }

                Flight::response()->header('type', 'application/json');
                Flight::response()->status(200);
                echo Flight::json(array(
                    "status" => 200,
                    "data" => $linksResponse
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
                "message" => "You are not authorized to view this content."
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