<?php
try {
    $db = Flight::db();
    $data = $db->query("SELECT * FROM IMAGES ORDER BY PRIORITY_NUMBER");
    $response = $data->fetchAll(PDO::FETCH_ASSOC);
    $getImageResponse = array();

    foreach ($response as $raw) {
        $getImageResponse[] = array(
            "id" => $raw['ID'],
            "imageName" => $raw['IMAGE_NAME'],
            "src" => $raw['SRC'],
            "alt" => $raw['ALT'],
            "tagline" => $raw['TAGLINE'],
            "priority" => $raw['PRIORITY_NUMBER']
        );
    }

    sendResponse(200, null, [
        'count' => count($response),
        'data' => $getImageResponse
    ]);
} catch (Exception $e) {
    sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
}
$db = null;