<?php
function fetchComments($db, $sectionName)
{
    $statement = $db->prepare("SELECT AUTHOR, COMMENT, SECTION_NAME FROM COMMENTS WHERE SECTION_NAME = ?");
    $statement->execute([$sectionName]);
    return $statement->fetchAll(PDO::FETCH_ASSOC);
}

$authHeader = getAuthHeader();
$token = isset($authHeader) ? str_replace('Bearer ', '', $authHeader) : null;
$secret = Flight::get('secretKey');

if (!$token) {
    unauthorizedResponse("Please sign in.");
}

$decodedToken = validateToken($token, $secret);

if ($decodedToken) {
    try {
        $db = Flight::db();
        $comments = fetchComments($db, Flight::get('currentSection'));

        $response = [];
        foreach ($comments as $row) {
            $response[] = [
                "author" => $row['AUTHOR'],
                "comment" => $row['COMMENT'],
                "sectionName" => $row['SECTION_NAME']
            ];
        }

        sendResponse(200, null, ["data" => $response]);
    } catch (Exception $e) {
        sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
    }
    $db = null;
} else {
    unauthorizedResponse("Please sign in.");
}
