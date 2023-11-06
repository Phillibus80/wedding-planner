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
    (!isset(Flight::request()->data->sectionName)
        || Flight::request()->data->sectionName == "")
    || (!isset(Flight::request()->data->pageName)
        || Flight::request()->data->pageName == "")
    || !isset(Flight::request()->data->showSection)
    || (!isset(Flight::request()->data->sectionContent)
        || Flight::request()->data->sectionContent == "")
    || (!isset(Flight::request()->data->permissionLevel)
        || Flight::request()->data->permissionLevel == "")
) {
    Flight::response()->header("Content-Type", "application/json");
    Flight::response()->status(400);
    Flight::response()->write(json_encode(array(
        'status' => 400,
        'message' => 'All fields are required: sectionName, pageName, showSection, sectionContent, and permissionLevel.'
    )));
    Flight::response()->send();
} // Not signed in or wrong permissions
elseif (!isset($token)) {
    Flight::response()->header("Content-Type", "application/json");
    Flight::response()->status(401);
    Flight::response()->write(json_encode(array(
        'status' => 401,
        'message' => 'You are not authorized to view this content.'
    )));
    Flight::response()->send();
    die();
} // Add the section
else {
    try {
        // Verify the JWT
        $decodedToken = JWT::decode($token, new Key(Flight::get('secretKey'), 'HS256'));
        if (isset($decodedToken->exp) && ($decodedToken->exp > time())) {
            if (isset($decodedToken->user->username) && isset($decodedToken->user->signedIn) && $decodedToken->user->signedIn) {
                $db = Flight::db();
                $convertBoolToInt = Flight::request()->data->showSection ? 1 : 0;
                $statement = $db->prepare('
            INSERT INTO SECTIONS (SECTION_NAME, PAGE_NAME, SHOW_SECTION, TITLE, SUB_TITLE, CONTENT, PERMISSION_LEVEL) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ');
                $statement->execute([
                    Flight::request()->data->sectionName,
                    Flight::request()->data->pageName,
                    $convertBoolToInt,
                    isset(Flight::request()->data->title)
                        ? Flight::request()->data->title
                        : '',
                    isset(Flight::request()->data->subTitle)
                        ? Flight::request()->data->subTitle
                        : '',
                    Flight::request()->data->sectionContent,
                    Flight::request()->data->permissionLevel
                ]);

                Flight::response()->header("Content-Type", "application/json");
                Flight::response()->status(200);
                echo Flight::json(array(
                    "status" => 200,
                    "message" => 'Section Created.'
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
    die();
}
