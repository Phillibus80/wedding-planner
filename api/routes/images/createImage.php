<?php

$authHeader = getAuthHeader();
$token = $authHeader ? str_replace('Bearer ', '', $authHeader) : null;
$secret = Flight::get('secretKey');
$requestData = Flight::request()->data;

if (empty($requestData->image_name) || empty($requestData->alt)) {
    sendResponse(400, 'All fields are required: image_name, and alt.');
}

if (!isset($token)) {
    unauthorizedResponse('Please sign in.');
}

$decodedToken = validateToken($token, $secret);

if ($decodedToken) {
    try {
        $db = Flight::db();

        // Creating an image entry with a new image file
        if (isset($_FILES["image_file"])) {
            $target_dir = "img/page-img/";
            $target_file = $target_dir . basename($_FILES["image_file"]["name"]);
            $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

            $check = getimagesize($_FILES["image_file"]["tmp_name"]);
            if ($check === false) {
                sendResponse(400, "File is not an image.");
            }

            if (file_exists($target_file)) {
                sendResponse(400, "Sorry, file already exists.");
            }

            if ($_FILES["image_file"]["size"] > 500000) {
                sendResponse(400, "Sorry, your file is too large.");
            }

            $allowedFileTypes = ["jpg", "jpeg", "png", "gif", "ico", "webp"];
            if (!in_array($imageFileType, $allowedFileTypes)) {
                sendResponse(400, "Sorry, only JPG, JPEG, PNG, ICO, WEBP & GIF files are allowed.");
            }

            if (move_uploaded_file($_FILES["image_file"]["tmp_name"], $target_file)) {
                $statement = $db->prepare('
                        INSERT INTO IMAGES (image_name, src, alt, tagline, section_name, priority_number)
                        VALUES (?, ?, ?, ?, ?, ?)
                    ');

                $statement->execute([
                    $requestData->image_name,
                    '/' . $target_file,
                    $requestData->alt ?? '',
                    $requestData->tagline ?? '',
                    $requestData->section_name ?? '',
                    $requestData->priority_number ?? 1
                ]);

                sendResponse(200, "The file has been uploaded.");
            } else {
                sendResponse(500, "Sorry, there was an error uploading your file.");
            }
        } else {
            // Create image entry with existing image file
            $statement = $db->prepare('
                        INSERT INTO IMAGES (image_name, src, alt, tagline, section_name, priority_number)
                        VALUES (?, ?, ?, ?, ?, ?)
                    ');

            $statement->execute([
                $requestData->image_name,
                $requestData->image_src ?? '',
                $requestData->alt ?? '',
                $requestData->tagline ?? '',
                $requestData->section_name ?? '',
                $requestData->priority_number ?? 1
            ]);

            sendResponse(200, "Image for " . $requestData->section_name . " has been created.");
        }

        $db = null;
    } catch (Exception $e) {
        sendResponse(500, "Sorry, there was an error uploading your file.");
    }
} else {
    unauthorizedResponse('Please sign in.');
}
