<?php
$db = Flight::db();
$data = $db->query("SELECT * FROM WHY_US");
$comment_response = $data->fetchAll(PDO::FETCH_ASSOC);
$getWhyUsResponse = array();

foreach ($comment_response as $row) {
    $getWhyUsResponse[] = array(
        "id" => $row["ID"],
        "title" => $row['TITLE'],
        "subTitle" => $row['SUB_TITLE'],
        "whyText" => $row['WHY_TEXT'],
        "muiIcon" => $row['MUI_ICON'],
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