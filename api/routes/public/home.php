<?php
$db = Flight::db();

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
               C.COMMENT as comment
        FROM COMMENTS C
        WHERE C.SECTION_NAME = ?;
    ");
    $commentSectionRes->execute([$row['SECTION_NAME']]);
    $commentStatementResult = $commentSectionRes->fetchAll(PDO::FETCH_ASSOC);
    $commentStatementCount = $commentSectionRes->rowCount();

    // Get all the links for the section.
    $linkSectionRes = $db->prepare("
        SELECT L.TITLE as title,
               L.URL as url
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

    // Build the Response
    switch ($row['SECTION_NAME']) {
        case 'why-us' :
            // Get all the Why Us items.
            $whyUsRes = $db->prepare("
            SELECT W.TITLE as title,
                   W.WHY_TEXT as whyText,
                   W.MUI_ICON as muiIcon,
                   W.ICONIFY_ICON as iconifyIcon
            FROM WHY_US W 
            WHERE W.SECTION_NAME = ?;
        ");
            $whyUsRes->execute([$row['SECTION_NAME']]);
            $whyUsStatementResult = $whyUsRes->fetchAll(PDO::FETCH_ASSOC);
            $whyUsStatementCount = $whyUsRes->rowCount();

            $contentResponse[] = array(
                'sectionName' => $row['SECTION_NAME'],
                'pageName' => $row['PAGE_NAME'],
                'showSection' => $row['SHOW_SECTION'] == 1,
                'title' => $row['TITLE'],
                'subTitle' => $row['SUB_TITLE'],
                'content' => array(
                    "count" => $whyUsStatementCount,
                    "whyUsList" => $whyUsStatementResult
                )
            );
            break;
        case 'planning':
            // Get all the Why Us items.
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

// Remove any hidden sections
//     $filteredContentResponse = array_filter($contentResponse, function ($field) {
//        return $field['showSection'] == true || $field['showSection'] == 1;
//    });

Flight::response()->header("type", "application/json");
Flight::response()->status(200);
echo Flight::json($contentResponse);
$db = null;
die();
