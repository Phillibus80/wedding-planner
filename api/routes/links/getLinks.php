<?php
try {
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

    sendResponse(200, null, array(
        'count' => count($getLinksResponse),
        'data' => $getLinksResponse
    ));
} catch (Exception $e) {
    sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
}
$db = null;