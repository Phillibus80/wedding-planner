<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function getAuthHeader()
{
    if (Flight::get('IN_DEVELOPMENT')) {
        $requestHeaders = apache_request_headers();
        return $requestHeaders['Authorization'] ?? null;
    } else {
        return $_SERVER["REDIRECT_HTTP_AUTHORIZATION"] ?? null;
    }
}

function setCorsHeaders($http_origin): void
{
    if (Flight::get('IN_DEVELOPMENT')) {
        if ($http_origin == "http://127.0.0.1:5173" || $http_origin == "http://localhost:5173") {
            header("Access-Control-Allow-Origin: $http_origin");
        }
    } else {
        header("Access-Control-Allow-Origin: " . Flight::get('SITE_URL'));
    }
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: X-Requested-With, Origin, Content-Type, X-CSRF-Token, Accept');
}

function createJwt($user, $expirationTime, $secretKey): string
{
    $payload = [
        'user' => $user,
        'exp' => $expirationTime
    ];
    return JWT::encode($payload, $secretKey, 'HS256');
}

function validateToken($token, $secret): ?stdClass
{
    try {
        $decodedToken = JWT::decode($token, new Key($secret, 'HS256'));

        if (
            isset($decodedToken->exp)
            && ($decodedToken->exp > time())
            && isset($decodedToken->user->username)
            && $decodedToken->user->signedIn) {
            return $decodedToken;
        }
    } catch (Exception $e) {
        return null;
    }
    return null;
}

function unauthorizedResponse($message): void
{
    sendResponse(401, $message, ["token" => null]);
}

function sendResponse($status, $message, $additionalData = []): void
{
    $body = isset($message)
        ? array_merge(['message' => $message], $additionalData)
        : $additionalData;
    Flight::response()->header("Content-Type", "application/json");
    Flight::response()->status($status);
    Flight::response()->write(json_encode($body));
    Flight::response()->send();
    die();
}

function handlePreFlight(): void
{
    // Handle preflight requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header('HTTP/1.1 200 OK');
        exit();
    }
}
