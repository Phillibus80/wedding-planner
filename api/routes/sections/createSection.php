<?php

$authHeader = getAuthHeader();
$token = $authHeader ? str_replace('Bearer ', '', $authHeader) : null;
$secret = Flight::get('secretKey');
$requestData = Flight::request()->data;

// Missing required fields
if ((!isset(Flight::request()->data->sectionName)
        || Flight::request()->data->sectionName == "")
    || (!isset(Flight::request()->data->pageName)
        || Flight::request()->data->pageName == "")
    || !isset(Flight::request()->data->showSection)
    || (!isset(Flight::request()->data->sectionContent)
        || Flight::request()->data->sectionContent == "")
    || (!isset(Flight::request()->data->permissionLevel)
        || Flight::request()->data->permissionLevel == "")) {
    sendResponse(400, 'All fields are required: sectionName, pageName, showSection, sectionContent, and permissionLevel.');
}
if (!isset($token)) {
    unauthorizedResponse('Please sign in.');
}

$decodedToken = validateToken($token, $secret);

// Add the section
if ($decodedToken) {
    try {
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

        sendResponse(200, 'Section created.');
    } catch (Exception $e) {
        sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
    }

    $db = null;
} else {
    unauthorizedResponse('Please sign in.');
}