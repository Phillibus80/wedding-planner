<?php

function fetchComments($db)
{
    $statement = $db->query("SELECT ID, AUTHOR, COMMENT, SECTION_NAME FROM COMMENTS");
    return $statement->fetchAll(PDO::FETCH_ASSOC);
}

function buildCommentResponse($comments): array
{
    $commentResponse = [];
    foreach ($comments as $row) {
        $commentResponse[] = [
            "id" => $row["ID"],
            "author" => $row['AUTHOR'],
            "comment" => $row['COMMENT'],
            "sectionName" => $row['SECTION_NAME']
        ];
    }
    return $commentResponse;
}

try {
    $db = Flight::db();
    $comments = fetchComments($db);
    $commentResponse = buildCommentResponse($comments);
    sendResponse(200, null, [
        "count" => count($commentResponse),
        "commentList" => $commentResponse
    ]);
} catch (Exception $e) {
    sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
}
$db = null;
