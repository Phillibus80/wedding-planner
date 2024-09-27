<?php

try {
    $db = Flight::db();
    $data = $db->query("SELECT * FROM SECTIONS");
    $allSections = $data->fetchAll(PDO::FETCH_ASSOC);

    foreach ($allSections as $row) {
        $response[] = array(
            'sectionName' => $row['SECTION_NAME'],
            'pageName' => $row['PAGE_NAME'],
            'showSection' => $row['SHOW_SECTION'] == 1,
            'permissionLevel' => $row['PERMISSION_LEVEL'],
            'title' => $row["TITLE"],
            'subTitle' => $row["SUB_TITLE"],
            'content' => $row["CONTENT"],
            'createdOn' => $row["created_on"],
            'updatedOn' => $row["updated_on"]
        );
    }

    sendResponse(200, null, [
        'count' => count($response),
        'data' => $response
    ]);
} catch (Exception $e) {
    sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
}

$db = null;