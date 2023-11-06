<?php
$db = Flight::db();
$data = $db->query("SELECT * FROM IMAGES ORDER BY PRIORITY_NUMBER");
$response = $data->fetchAll(PDO::FETCH_ASSOC);
$getImageResponse = array();

foreach ($response as $raw) {
    $getImageResponse[] = array(
        "imageName" => $raw['IMAGE_NAME'],
        "src" => $raw['SRC'],
        "alt" => $raw['ALT'],
        "tagline" => $raw['TAGLINE'],
        "priority" => $raw['PRIORITY_NUMBER']
    );
}

Flight::response()->header("type", "application/json");
Flight::response()->status(200);
Flight::response()->write(json_encode(array(
    'status' => 200,
    'count' => count($response),
    'data' => $getImageResponse
)));
Flight::response()->send();
$db = null;
die();
