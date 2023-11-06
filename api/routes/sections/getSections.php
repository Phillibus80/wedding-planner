<?php
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

Flight::response()->header("type", "application/json");
Flight::response()->status(200);
echo Flight::json(array(
        'status' => 200,
        'count' => count($response),
        'data' => $response
    )
);
$db = null;
die();
