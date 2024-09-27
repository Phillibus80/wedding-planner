<?php
try {
    $db = Flight::db();
    $data = $db->query("SELECT * FROM PLANNING");
    $comment_response = $data->fetchAll(PDO::FETCH_ASSOC);
    $getWhyUsResponse = array();

    foreach ($comment_response as $row) {
        $getWhyUsResponse[] = array(
            "id" => $row["ID"],
            "column_title" => $row["COLUMN_TITLE"],
            "title" => $row['TITLE'],
            "planning_text" => $row['PLANNING_TEXT'],
            "sectionName" => $row['SECTION_NAME']
        );
    }

    sendResponse(200,
        null,
        [
            'count' => count($getWhyUsResponse),
            'data' => $getWhyUsResponse
        ]);
} catch (Exception $e) {
    sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
}

$db = null;
