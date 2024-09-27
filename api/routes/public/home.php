<?php
try {
    $db = Flight::db();

// Get all the sections for the page
    $sectionContentRes = $db->query("
    SELECT 
        SECTION_NAME, 
        PAGE_NAME, 
        SHOW_SECTION, 
        TITLE,
        SUB_TITLE,
        CONTENT 
    FROM SECTIONS
    WHERE PAGE_NAME = 'main'
    GROUP BY SECTION_NAME"
    );

    $contentResponse = [];

// Function to fetch data
    function fetchData($db, $query, $params)
    {
        $statement = $db->prepare($query);
        $statement->execute($params);
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }

    foreach ($sectionContentRes as $row) {
        $sectionName = $row['SECTION_NAME'];

        // Fetch comments, links, and images
        $comments = fetchData($db, "SELECT AUTHOR as author, COMMENT as comment FROM COMMENTS WHERE SECTION_NAME = ?", [$sectionName]);
        $links = fetchData($db, "SELECT TITLE as title, URL as url FROM LINKS WHERE SECTION_NAME = ?", [$sectionName]);
        $images = fetchData($db, "SELECT IMAGE_NAME as imageName, SRC as src, ALT as alt, TAGLINE as tagline, PRIORITY_NUMBER as priority FROM IMAGES WHERE SECTION_NAME = ? ORDER BY PRIORITY_NUMBER", [$sectionName]);

        $content = [
            "textContent" => $row['CONTENT'],
            "comments" => ["count" => count($comments), "commentList" => $comments],
            "links" => ["count" => count($links), "linkList" => $links],
            "images" => ["count" => count($images), "imageList" => $images]
        ];

        // Handle special cases for 'why-us' and 'planning'
        if ($sectionName === 'why-us') {
            $whyUsItems = fetchData($db, "SELECT TITLE as title, WHY_TEXT as whyText, MUI_ICON as muiIcon, ICONIFY_ICON as iconifyIcon FROM WHY_US WHERE SECTION_NAME = ?", [$sectionName]);
            $content = ["count" => count($whyUsItems), "whyUsList" => $whyUsItems];
        } elseif ($sectionName === 'planning') {
            $planningItems = fetchData($db, "SELECT COLUMN_TITLE as columnTitle, TITLE as title, PLANNING_TEXT as planningText, SECTION_NAME as sectionName, ID as id FROM PLANNING WHERE SECTION_NAME = ?", [$sectionName]);
            $content = [
                "planning" => ["count" => count($planningItems), "planningList" => $planningItems],
                "images" => ["count" => count($images), "imageList" => $images]
            ];
        }

        // Build the response
        $contentResponse[] = [
            'sectionName' => $sectionName,
            'pageName' => $row['PAGE_NAME'],
            'showSection' => $row['SHOW_SECTION'] == 1,
            'title' => $row['TITLE'],
            'subTitle' => $row['SUB_TITLE'],
            'content' => $content
        ];
    }

// Send the response
    sendResponse(200, null, $contentResponse);
} catch (Exception $e) {
    sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
}

$db = null;
