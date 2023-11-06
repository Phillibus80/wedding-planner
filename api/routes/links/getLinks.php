<?php
$db = Flight::db();
$data = $db->query("SELECT * FROM LINKS");
$links_response = $data->fetchAll(PDO::FETCH_ASSOC);
$getLinksResponse = array();

foreach ($links_response as $row) {
    $getLinksResponse[] = array(
        "id" => $row['ID'],
        "title" => $row['TITLE'],
        "url" => $row['URL'],
        "sectionName" => $row['SECTION_NAME']
    );
}

Flight::response()->header('type', 'application/json');
Flight::response()->status(200);
echo Flight::json(array(
        'status' => 200,
        'count' => count($getLinksResponse),
        'data' => $getLinksResponse
    )
);
$db = null;
die();