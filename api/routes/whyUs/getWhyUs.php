<?php
try {
    $db = Flight::db();
    $data = $db->query("SELECT * FROM WHY_US");
    $comment_response = $data->fetchAll(PDO::FETCH_ASSOC);
    $getWhyUsResponse = array();

    foreach ($comment_response as $row) {
        $getWhyUsResponse[] = array(
            "id" => $row["ID"],
            "title" => $row['TITLE'],
            "whyText" => $row['WHY_TEXT'],
            "muiIcon" => $row['MUI_ICON'],
            "sectionName" => $row['SECTION_NAME']
        );
    }

    sendResponse(200, null, [
        'count' => count($getWhyUsResponse),
        'data' => $getWhyUsResponse
    ]);
} catch (Exception $e) {
    sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
}

$db = null;