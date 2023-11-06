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

$db = Flight::db();

// Not signed in or wrong permissions
if (!isset($token)) {
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

        // Has Token expired
        if (isset($decodedToken->exp) && ($decodedToken->exp > time())) {
            if (isset($decodedToken->user->username) && isset($decodedToken->user->signedIn) && $decodedToken->user->signedIn) {
                // Get all the sections for the page.
                $sectionContentRes = $db->query("
                        SELECT 
                            SECTION_NAME, 
                            PAGE_NAME, 
                            SHOW_SECTION, 
                            TITLE,
                            SUB_TITLE,
                            CONTENT 
                        FROM SECTIONS
                        WHERE PAGE_NAME = 'main'
                        GROUP BY SECTION_NAME"
                );
                $contentResponse = array();

                // Loop through the Sections
                foreach ($sectionContentRes as $row) {

                    // Get all the comments for the section.
                    $commentSectionRes = $db->prepare("
                        SELECT C.AUTHOR as author,
                               C.COMMENT as comment,
                               C.ID as id
                        FROM COMMENTS C
                        WHERE C.SECTION_NAME = ?;
                    ");
                    $commentSectionRes->execute([$row['SECTION_NAME']]);
                    $commentStatementResult = $commentSectionRes->fetchAll(PDO::FETCH_ASSOC);
                    $commentStatementCount = $commentSectionRes->rowCount();

                    // Get all the links for the section.
                    $linkSectionRes = $db->prepare("
                        SELECT L.TITLE as title,
                               L.URL as url,
                               L.ID as id
                        FROM LINKS L
                        WHERE L.SECTION_NAME = ?;
                  ");
                    $linkSectionRes->execute([$row['SECTION_NAME']]);
                    $linkStatementResult = $linkSectionRes->fetchAll(PDO::FETCH_ASSOC);
                    $linkStatementCount = $linkSectionRes->rowCount();

                    // Get all the images for the section.
                    $imageSectionRes = $db->prepare("
                        SELECT I.IMAGE_NAME as imageName,
                               I.SRC as src,
                               I.ALT as alt,
                               I.TAGLINE as tagline,
                               I.PRIORITY_NUMBER as priority
                        FROM IMAGES I 
                        WHERE I.SECTION_NAME = ?
                        ORDER BY I.PRIORITY_NUMBER;
  ");
                    $imageSectionRes->execute([$row['SECTION_NAME']]);
                    $imageStatementResult = $imageSectionRes->fetchAll(PDO::FETCH_ASSOC);
                    $imageStatementCount = $imageSectionRes->rowCount();

                    // Get all the Why Us for the section.
                    $whyUsRes = $db->prepare("
                        SELECT  W.ID as id,
                                W.TITLE as title,
                                W.WHY_TEXT as whyText,
                                W.MUI_ICON as muiIcon,
                                W.ICONIFY_ICON as iconifyIcon
                        FROM WHY_US W 
                        WHERE W.SECTION_NAME = ?;
                    ");
                    $whyUsRes->execute([$row['SECTION_NAME']]);
                    $whyUsStatementResult = $whyUsRes->fetchAll(PDO::FETCH_ASSOC);
                    $whyUsStatementCount = $whyUsRes->rowCount();

                    // Build the Response
                    switch ($row['SECTION_NAME']) {
                        case 'why-us':
                            $contentResponse[] = array(
                                'sectionName' => $row['SECTION_NAME'],
                                'pageName' => $row['PAGE_NAME'],
                                'showSection' => $row['SHOW_SECTION'] == 1,
                                'title' => $row['TITLE'],
                                'subTitle' => $row['SUB_TITLE'],
                                'content' => array(
                                    "whyUs" => array(
                                        "count" => $whyUsStatementCount,
                                        "whyUsList" => $whyUsStatementResult
                                    )
                                )
                            );
                            break;
                        case 'planning':
                            $planningRes = $db->prepare("
                                SELECT P.COLUMN_TITLE as columnTitle,
                                       P.TITLE as title,
                                       P.PLANNING_TEXT as planningText,
                                       P.SECTION_NAME as sectionName,
                                       P.ID as id
                                FROM PLANNING P
                                WHERE P.SECTION_NAME = ?;
                            ");
                            $planningRes->execute([$row['SECTION_NAME']]);
                            $planningStatementResult = $planningRes->fetchAll(PDO::FETCH_ASSOC);
                            $planningStatementCount = $planningRes->rowCount();

                            $contentResponse[] = array(
                                'sectionName' => $row['SECTION_NAME'],
                                'pageName' => $row['PAGE_NAME'],
                                'showSection' => $row['SHOW_SECTION'] == 1,
                                'title' => $row['TITLE'],
                                'subTitle' => $row['SUB_TITLE'],
                                'content' => array(
                                    "planning" => array(
                                        "count" => $planningStatementCount,
                                        "planningList" => $planningStatementResult
                                    ),
                                    "images" => array(
                                        "count" => $imageStatementCount,
                                        "imageList" => $imageStatementResult
                                    )
                                )
                            );
                            break;
                        default:
                            $contentResponse[] = array(
                                'sectionName' => $row['SECTION_NAME'],
                                'pageName' => $row['PAGE_NAME'],
                                'showSection' => $row['SHOW_SECTION'] == 1,
                                'title' => $row['TITLE'],
                                'subTitle' => $row['SUB_TITLE'],
                                'content' => array(
                                    "textContent" => $row['CONTENT'],
                                    "comments" => array(
                                        "count" => $commentStatementCount,
                                        "commentList" => $commentStatementResult
                                    ),
                                    "links" => array(
                                        "count" => $linkStatementCount,
                                        "linkList" => $linkStatementResult
                                    ),
                                    "images" => array(
                                        "count" => $imageStatementCount,
                                        "imageList" => $imageStatementResult
                                    )
                                )
                            );
                            break;
                    }
                }

                Flight::response()->header("type", "application/json");
                Flight::response()->status(200);
                Flight::response()->write(json_encode($contentResponse));
                Flight::response()->send();
                $db = null;
                die();
            } else {
                Flight::response()->header("Content-Type", "application/json");
                Flight::response()->status(401);
                Flight::response()->write(json_encode(array(
                        "message" => "You are not authorized to view this content."
                    )
                ));
                Flight::response()->send();
            }
        } else {
            // Token has expired, send a response that the user needs to log back in
            Flight::response()->header("Content-Type", "application/json");
            Flight::response()->status(401);
            Flight::response()->write(json_encode(array(
                "message" => "Token has expired. Please log in again."
            )));
            Flight::response()->send();
            die();
        }
    } catch (Exception $e) {
        // JWT verification failed, return a 401 Unauthorized response
        Flight::response()->header("Content-Type", "application/json");
        Flight::response()->status(401);
        Flight::response()->write(json_encode(array(
            "message" => "You are not authorized to view this content."
        )));
        Flight::response()->send();
        die();
    }
}
die();
