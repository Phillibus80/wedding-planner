<?php

$authHeader = getAuthHeader();
$token = $authHeader ? str_replace('Bearer ', '', $authHeader) : null;
$secret = Flight::get('secretKey');
$requestData = Flight::request()->data;

// Missing required fields
if (
    (!isset(Flight::request()->data->id)
        || Flight::request()->data->id == "")
    || (!isset(Flight::request()->data->image_name)
        || Flight::request()->data->image_name == "")
    || (!isset(Flight::request()->data->src)
        || Flight::request()->data->src == "")
) {
    sendResponse(400, 'All fields are required: image_name, id, and src.');
} // Not signed in or wrong permissions

if (!isset($token)) {
    unauthorizedResponse('Please sign in.');
}

$decodedToken = validateToken($token, $secret);

if ($decodedToken) {
    try {
        $db = Flight::db();
        //Check if the user is uploading an image
        if (isset($_FILES["image_file"])) {
            $target_dir = "img/page-img/";
            $target_file = $target_dir . basename($_FILES["image_file"]["name"]);
            $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

            //--Begin Validation--//

            $check = getimagesize($_FILES["image_file"]["tmp_name"]);
            if ($check === false) {
                sendResponse(400, 'File is not an image.');
            }

            // Check if file already exists
            if (file_exists($target_file)) {
                sendResponse(400, 'File already exists.');
            }

            // Check file size
            if ($_FILES["image_file"]["size"] > 500000) {
                sendResponse(400, 'File is too large.');
            }

            // Allow certain file formats
            if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
                && $imageFileType != "gif" && $imageFileType != 'ico' && $imageFileType != 'webp') {
                sendResponse(400, "Sorry, only JPG, JPEG, PNG, ICO, WEBP & GIF files are allowed.");
            }

            //--End Validation--//

            if (move_uploaded_file($_FILES["image_file"]["tmp_name"], $target_file)) {
                $statement = $db->prepare('
                                UPDATE IMAGES I
                                SET I.IMAGE_NAME = ?, I.SRC=?, I.ALT=?, I.TAGLINE=?
                                WHERE I.ID = ?
                              ');

                $statement->execute([
                    Flight::request()->data->image_name,
                    '/' . $target_file,
                    isset(Flight::request()->data->alt) ? Flight::request()->data->alt : '',
                    isset(Flight::request()->data->tagline) ? Flight::request()->data->tagline : '',
                    isset(Flight::request()->data->id) ? Flight::request()->data->id : ''
                ]);

                sendResponse(200, "The file " . htmlspecialchars(basename($_FILES["image_file"]["name"])) . " has been uploaded.");
            } else {
                sendResponse(500, "Sorry, there was an error uploading your file.");
            }
        } // Only updating meta-data
        else {
            $statement = $db->prepare('
                                    UPDATE IMAGES I
                                    SET I.IMAGE_NAME = ?, I.SRC=?, I.ALT=?, I.TAGLINE=?
                                    WHERE I.id = ?
                                ');

            // Update with existing image
            $statement->execute([
                Flight::request()->data->image_name,
                Flight::request()->data->src,
                isset(Flight::request()->data->alt) ? Flight::request()->data->alt : '',
                isset(Flight::request()->data->tagline) ? Flight::request()->data->tagline : '',
                Flight::request()->data->id
            ]);

            sendResponse(200, 'The image has been updated.');
            $db = null;
        }
    } catch (Exception $e) {
        sendResponse(500, 'There was a problem uploading your image.', [
            "errorMessage" => $e->getMessage()
        ]);
    }
} else {
    unauthorizedResponse('Please sign in.');
}