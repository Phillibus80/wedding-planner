<?php
$pageImages = scandir(Flight::get('page-image-dir'));
$imageArray = array();

for ($n = 2; $n < count($pageImages); $n++) {
    $imgPath = Flight::get('page-image-dir') . $pageImages[$n];
    $imgDimensions = getimagesize($imgPath);

    $imageArray[] = array(
        "src" => $imgPath,
        "width" => strval($imgDimensions[0]),
        "height" => strval($imgDimensions[1])
    );
}

Flight::response()->header("type", "application/json");
if (sizeof($imageArray) > 0) {
    Flight::response()->status(200);
    echo Flight::json(array(
            "status" => 200,
            "count" => count($imageArray),
            "data" => $imageArray
        )
    );
} else {
    Flight::response()->status(500);
    echo Flight::json(array(
            "status" => 500,
            "message" => 'There was an error while trying to retrieve the images.'
        )
    );
}


die();
