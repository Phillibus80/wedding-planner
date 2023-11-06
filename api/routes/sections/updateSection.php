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
    (!isset(Flight::request()->data->sectionName)
        || Flight::request()->data->sectionName == "")
    || (!isset(Flight::request()->data->pageName)
        || Flight::request()->data->pageName == "")
    || !isset(Flight::request()->data->showSection)
    || !isset(Flight::request()->data->sectionContent)
) {
    Flight::response()->header("Content-Type", "application/json");
    Flight::response()->status(400);
    Flight::response()->write(json_encode(array(
        'status' => 400,
        'message' => 'All fields are required: sectionName, pageName, showSection, AND sectionContent.'
    )));
    Flight::response()->send();
    die();
} elseif (isset($token)) {
    try {
        // Verify the JWT
        $decodedToken = JWT::decode($token, new Key(Flight::get('secretKey'), 'HS256'));
        if (isset($decodedToken->exp) && ($decodedToken->exp > time())) {
            if (isset($decodedToken->user->username) && isset($decodedToken->user->signedIn) && $decodedToken->user->signedIn) {
                $db = Flight::db();
                $convertBoolToInt = Flight::request()->data->showSection ? 1 : 0;
                $updatePermissionLevel = isset(Flight::request()->data->permissionLevel)
                    ? Flight::request()->data->permissionLevel
                    : Flight::get('PUBLIC');
                $get_user_statement = $db->prepare("
            UPDATE SECTIONS 
            SET SECTION_NAME = ?, 
                PAGE_NAME = ?,
                SHOW_SECTION = ?,
                TITLE = ?,
                SUB_TITLE = ?,
                CONTENT = ?,
                PERMISSION_LEVEL = ?
            WHERE SECTIONS.SECTION_NAME = ?
            "
                );
                $get_user_statement->execute([
                    Flight::request()->data->sectionName,
                    Flight::request()->data->pageName,
                    $convertBoolToInt,
                    isset(Flight::request()->data->title)
                        ? Flight::request()->data->title
                        : '',
                    isset(Flight::request()->data->sub_title)
                        ? Flight::request()->data->sub_title
                        : '',
                    Flight::request()->data->sectionContent,
                    $updatePermissionLevel,
                    Flight::request()->data->sectionName
                ]);

                Flight::response()->header("Content-Type", "application/json");
                Flight::response()->status(200);
                echo Flight::json(array(
                    "status" => 200,
                    "message" => Flight::request()->data->sectionName . " updated"
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
        $db = null;
    } catch (Exception $e) {
        Flight::response()->header("Content-Type", "application/json");
        Flight::response()->status(401);
        Flight::response()->write(json_encode(array(
                "message" => "Please sign in."
            )
        ));
        Flight::response()->send();
    }
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