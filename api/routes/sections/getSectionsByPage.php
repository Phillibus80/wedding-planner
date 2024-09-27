<?php

$authHeader = getAuthHeader();
$token = $authHeader ? str_replace('Bearer ', '', $authHeader) : null;
$secret = Flight::get('secretKey');
$requestData = Flight::request()->data;

if (!isset($token)) {
    unauthorizedResponse('Please sign in.');
}

$decodedToken = validateToken($token, $secret);

if ($decodedToken) {
    try {
        $db = Flight::db();
        $get_user_statement = $db->prepare("
            SELECT SECTION_NAME, SHOW_SECTION, PERMISSION_LEVEL, TITLE, SUB_TITLE, CONTENT
            FROM SECTIONS 
            WHERE SECTIONS.PAGE_NAME = ?
            "
        );
        $get_user_statement->execute([Flight::get('currentPage')]);
        $statementResult = $get_user_statement->fetchAll(PDO::FETCH_ASSOC);

        sendResponse(200, null, ["data" => $statementResult]);
    } catch (Exception $e) {
        sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
    }
    $db = null;
} else {
    unauthorizedResponse('Please sign in.');
}
