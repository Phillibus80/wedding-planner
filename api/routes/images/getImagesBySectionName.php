<?php

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

        sendResponse(200, ["status" => 200, "data" => $imagesResponse]);
    } catch (Exception $e) {
        sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
    }
    $db = null;
} else {
    unauthorizedResponse("Please sign in.");
}
unauthorizedResponse("Please sign in.");
die();
