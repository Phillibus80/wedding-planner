<?php

$authHeader = getAuthHeader();
$token = $authHeader ? str_replace('Bearer ', '', $authHeader) : null;
$secret = Flight::get('secretKey');
$requestData = Flight::request()->data;

if ((!isset(Flight::request()->data->sectionName)
        || Flight::request()->data->sectionName == "")
    || (!isset(Flight::request()->data->pageName)
        || Flight::request()->data->pageName == "")
    || !isset(Flight::request()->data->showSection)
    || !isset(Flight::request()->data->sectionContent)) {
    sendResponse(400, 'All fields are required: sectionName, pageName, showSection, AND sectionContent.');
}
if (!isset($token)) {
    unauthorizedResponse('Please sign in.');
}

$decodedToken = validateToken($token, $secret);

if ($decodedToken) {
    try {
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

        sendResponse(200, Flight::request()->data->sectionName . " updated");
    } catch (Exception $e) {
        sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
    }

    $db = null;
} else {
    unauthorizedResponse('Please sign in.');
}