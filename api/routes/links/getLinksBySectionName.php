<?php

$authHeader = getAuthHeader();
$token = $authHeader ? str_replace('Bearer ', '', $authHeader) : null;
$secret = Flight::get('secretKey');
$requestData = Flight::request()->data;

$decodedToken = validateToken($token, $secret);

if ($decodedToken) {
    try {
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

        sendResponse(200, null, ["data" => $linksResponse]);
    } catch (Exception $e) {
        sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
    }
    $db = null;
} else {
    unauthorizedResponse('Please sign in.');
}
