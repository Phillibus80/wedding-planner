<?php
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

Flight::response()->header("type", "application/json");
Flight::response()->status(200);
echo Flight::json(array(
        'status' => 200,
        'count' => count($getWhyUsResponse),
        'data' => $getWhyUsResponse
    )
);
$db = null;
die();