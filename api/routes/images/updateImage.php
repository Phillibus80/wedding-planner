<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

if (Flight::get('IN_DEVELOPMENT')) {
    $requestHeaders = apache_request_headers();
    $authHeader = $requestHeaders['Authorization'] ?? null;
} else {
    $authHeader = $_SERVER["REDIRECT_HTTP_AUTHORIZATION"] ?? null;
}
$token = isset($authHeader) ? str_replace('Bearer ', '', $authHeader) : null;
$secret = Flight::get('secretKey');

// Missing required fields
if (
    (!isset(Flight::request()->data->image_name)
        || Flight::request()->data->image_name == "")
    || (!isset(Flight::request()->data->src)
        || Flight::request()->data->src == "")
) {
    Flight::response()->header("Content-Type", "application/json");
    Flight::response()->status(400);
    Flight::response()->write(json_encode(array(
        'status' => 400,
        'message' => 'All fields are required: imageName, and src.'
    )));
    Flight::response()->send();
} // Not signed in or wrong permissions
elseif (!isset($token)) {
    Flight::response()->header('type', 'application/json');
    Flight::response()->status(401);
    Flight::response()->write(json_encode(array(
        'status' => 401,
        'message' => 'You are not authorized to view this content.'
    )));
    Flight::response()->send();
} else {
    try {
        $decodedToken = JWT::decode($token, new Key(Flight::get('secretKey'), 'HS256'));
        if (isset($decodedToken->exp) && ($decodedToken->exp > time())) {
            if (isset($decodedToken->user->username) && isset($decodedToken->user->signedIn) && $decodedToken->user->signedIn) {
                $db = Flight::db();
                //Check if the user is uploading an image
                if (isset($_FILES["image_file"])) {
                    $target_dir = "img/page-img/";
                    $target_file = $target_dir . basename($_FILES["image_file"]["name"]);
                    $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

                    //--Begin Validation--//

                    $check = getimagesize($_FILES["image_file"]["tmp_name"]);
                    if ($check === false) {
                        Flight::response()->header("Content-Type", "application/json");
                        Flight::response()->status(400);
                        Flight::response()->write(json_encode(array(
                            'status' => 400,
                            'message' => "File is not an image."
                        )));
                        Flight::response()->send();
                        die();
                    }

                    // Check if file already exists
                    if (file_exists($target_file)) {
                        Flight::response()->header("Content-Type", "application/json");
                        Flight::response()->status(400);
                        Flight::response()->write(json_encode(array(
                            'status' => 400,
                            'message' => "Sorry, file already exists."
                        )));
                        Flight::response()->send();
                        die();
                    }

                    // Check file size
                    if ($_FILES["image_file"]["size"] > 500000) {
                        Flight::response()->header("Content-Type", "application/json");
                        Flight::response()->status(400);
                        Flight::response()->write(json_encode(array(
                            'status' => 400,
                            'message' => "Sorry, your file is too large."
                        )));
                        Flight::response()->send();
                        die();
                    }

                    // Allow certain file formats
                    if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
                        && $imageFileType != "gif" && $imageFileType != 'ico') {
                        Flight::response()->header("Content-Type", "application/json");
                        Flight::response()->status(400);
                        Flight::response()->write(json_encode(array(
                            'status' => 400,
                            'message' => "Sorry, only JPG, JPEG, PNG, ICO, & GIF files are allowed."
                        )));
                        Flight::response()->send();
                        die();
                    }

                    //--End Validation--//

                    Flight::response()->header("Content-Type", "application/json");
                    if (move_uploaded_file($_FILES["image_file"]["tmp_name"], $target_file)) {

                        // Update with existing image
                        $statement = $db->prepare('
            UPDATE IMAGES I
            SET I.SRC=?, I.ALT=?, I.TAGLINE=?
            WHERE I.IMAGE_NAME = ?
            ');

                        $statement->execute([
                            '/' . $target_file,
                            isset(Flight::request()->data->alt) ? Flight::request()->data->alt : '',
                            isset(Flight::request()->data->tagline) ? Flight::request()->data->tagline : '',
                            Flight::request()->data->imageName
                        ]);

                        Flight::response()->status(200);
                        Flight::response()->write(json_encode(array(
                            'status' => 200,
                            'message' => "The file " . htmlspecialchars(basename($_FILES["image_file"]["name"])) . " has been uploaded."
                        )));
                    } else {
                        Flight::response()->status(500);
                        Flight::response()->write(json_encode(array(
                            'status' => 500,
                            'message' => "Sorry, there was an error uploading your file."
                        )));
                    }
                    Flight::response()->send();
                    die();
                } // Only updating meta-data
                else {
                    $statement = $db->prepare('
            UPDATE IMAGES I
            SET I.SRC=?, I.ALT=?, I.TAGLINE=?
            WHERE I.IMAGE_NAME = ?
            ');

                    $statement->execute([
                        Flight::request()->data->src,
                        isset(Flight::request()->data->alt) ? Flight::request()->data->alt : '',
                        isset(Flight::request()->data->tagline) ? Flight::request()->data->tagline : '',
                        Flight::request()->data->image_name
                    ]);

                    Flight::response()->status(200);
                    Flight::response()->write(json_encode(array(
                        'status' => 200,
                        'message' => "The image has been updated."
                    )));
                    Flight::response()->send();
                }
            } else {
                Flight::response()->header("Content-Type", "application/json");
                Flight::response()->status(401);
                Flight::response()->write(json_encode(array(
                        "message" => "Please sign in."
                    )
                ));
                Flight::response()->send();
            }
        } else {
            // Set the JWT
            $user = [
                'signedIn' => false,
                'username' => "",
                'permLevel' => ""
            ];

            $payload = [
                'user' => $user,
                'exp' => time(), // Token expiration time (45 min from now)
            ];

            // Generate the JWT
            $jwt = JWT::encode($payload, Flight::get('secretKey'), 'HS256');

            Flight::response()->header("Content-Type", "application/json");
            Flight::response()->status(401);
            Flight::response()->write(json_encode(array(
                    "token" => $jwt,
                    "message" => "Your session expired. Please sign back in."
                )
            ));
            Flight::response()->send();
        }
    } catch (Exception $e) {
        Flight::response()->header("Content-Type", "application/json");
        Flight::response()->status(401);
        Flight::response()->write(json_encode(array(
                "message" => "Please sign in."
            )
        ));
        Flight::response()->send();
    }
}