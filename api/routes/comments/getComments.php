<?php
$db = Flight::db();
$data = $db->query("SELECT * FROM COMMENTS");
$comment_response = $data->fetchAll(PDO::FETCH_ASSOC);
$getCommentResponse = array();

foreach ($comment_response as $row) {
    $getCommentResponse[] = array(
        "id" => $row["ID"],
        "author" => $row['AUTHOR'],
        "comment" => $row['COMMENT'],
        "sectionName" => $row['SECTION_NAME']
    );
}

Flight::response()->header("type", "application/json");
Flight::response()->status(200);
echo Flight::json(array(
        'status' => 200,
        'count' => count($getCommentResponse),
        'data' => $getCommentResponse
    )
);
$db = null;
die();