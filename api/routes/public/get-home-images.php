<?php
try {
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
        sendResponse(200, null, array(
            "count" => count($imageArray),
            "data" => $imageArray
        ));
    } else {
        sendResponse(500, 'There was an error while trying to retrieve the images.');
    }
} catch (Exception $e) {
    sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
}
