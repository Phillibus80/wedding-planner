<?php

$authHeader = getAuthHeader();
$token = $authHeader ? str_replace('Bearer ', '', $authHeader) : null;
$secret = Flight::get('secretKey');
$requestData = Flight::request()->data;

if (!isset($token)) {
    unauthorizedResponse('Please sign in.');
}

$decodedToken = validateToken($token, $secret);

function fetchSectionData($db)
{
    $stmt = $db->prepare("
        SELECT 
            S.SECTION_NAME, 
            S.PAGE_NAME, 
            S.SHOW_SECTION, 
            S.TITLE, 
            S.SUB_TITLE, 
            S.CONTENT, 
            GROUP_CONCAT(DISTINCT C.AUTHOR, ':', C.COMMENT, ':', C.ID SEPARATOR '|') as comments,
            GROUP_CONCAT(DISTINCT L.TITLE, '^', L.URL, '^', L.ID SEPARATOR '+') as links,
            GROUP_CONCAT(DISTINCT I.ID, ':' , I.IMAGE_NAME, ':', I.SRC, ':', I.ALT, ':', I.TAGLINE, ':', I.PRIORITY_NUMBER SEPARATOR '|') as images,
            GROUP_CONCAT(DISTINCT W.ID, ':', W.TITLE, ':', W.WHY_TEXT, ':', W.MUI_ICON, ':', W.ICONIFY_ICON SEPARATOR '|') as why_us,
            GROUP_CONCAT(DISTINCT P.COLUMN_TITLE, ':', P.TITLE, ':', P.PLANNING_TEXT, ':', P.ID SEPARATOR '|') as planning
        FROM SECTIONS S
        LEFT JOIN COMMENTS C ON S.SECTION_NAME = C.SECTION_NAME
        LEFT JOIN LINKS L ON S.SECTION_NAME = L.SECTION_NAME
        LEFT JOIN IMAGES I ON S.SECTION_NAME = I.SECTION_NAME
        LEFT JOIN WHY_US W ON S.SECTION_NAME = W.SECTION_NAME
        LEFT JOIN PLANNING P ON S.SECTION_NAME = P.SECTION_NAME
        WHERE S.PAGE_NAME = 'main'
        GROUP BY S.SECTION_NAME, S.PAGE_NAME, S.SHOW_SECTION, S.TITLE, S.SUB_TITLE, S.CONTENT
        ORDER BY S.SECTION_NAME;
    ");
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

if ($decodedToken) {
    try {
        $db = Flight::db();
        $sectionData = fetchSectionData($db);
        $contentResponse = [];
        $sections = [];

        foreach ($sectionData as $row) {
            $sectionName = $row['SECTION_NAME'];
            if (!isset($sections[$sectionName])) {
                $sections[$sectionName] = [
                    'sectionName' => $row['SECTION_NAME'],
                    'pageName' => $row['PAGE_NAME'],
                    'showSection' => $row['SHOW_SECTION'] == 1,
                    'title' => $row['TITLE'],
                    'subTitle' => $row['SUB_TITLE'],
                    'content' => [
                        'textContent' => $row['CONTENT'],
                        'comments' => [],
                        'links' => [],
                        'images' => [],
                        'whyUs' => [],
                        'planning' => []
                    ]
                ];
            }

            // Process comments
            if (!empty($row['comments'])) {
                $comments = explode('|', $row['comments']);
                foreach ($comments as $comment) {
                    list($author, $text, $id) = explode(':', $comment);
                    $sections[$sectionName]['content']['comments'][] = [
                        'author' => $author,
                        'comment' => $text,
                        'id' => $id
                    ];
                }
            }

            // Process links
            if (!empty($row['links'])) {
                $links = explode('+', $row['links']);
                foreach ($links as $link) {
                    list($title, $url, $id) = explode('^', $link);
                    $sections[$sectionName]['content']['links'][] = [
                        'title' => $title,
                        'url' => $url,
                        'id' => $id
                    ];
                }
            }

            // Process images
            if (!empty($row['images'])) {
                $images = explode('|', $row['images']);
                foreach ($images as $image) {
                    list($id, $name, $src, $alt, $tagline, $priority) = explode(':', $image);
                    $sections[$sectionName]['content']['images'][] = [
                        "id" => $id,
                        'imageName' => $name,
                        'src' => $src,
                        'alt' => $alt,
                        'tagline' => $tagline,
                        'priority' => $priority
                    ];
                }
            }

            // Process why_us
            if (!empty($row['why_us'])) {
                $whyUs = explode('|', $row['why_us']);
                foreach ($whyUs as $why) {
                    list($id, $title, $text, $muiIcon, $iconifyIcon) = explode(':', $why);
                    $sections[$sectionName]['content']['whyUs'][] = [
                        'id' => $id,
                        'title' => $title,
                        'whyText' => $text,
                        'muiIcon' => $muiIcon,
                        'iconifyIcon' => $iconifyIcon
                    ];
                }
            }

            // Process planning
            if (!empty($row['planning'])) {
                $planning = explode('|', $row['planning']);
                foreach ($planning as $plan) {
                    list($columnTitle, $title, $text, $id) = explode(':', $plan);
                    $sections[$sectionName]['content']['planning'][] = [
                        'columnTitle' => $columnTitle,
                        'title' => $title,
                        'planningText' => $text,
                        'id' => $id
                    ];
                }
            }
        }

        foreach ($sections as $section) {
            switch ($section['sectionName']) {
                case 'why-us':
                    break;
                case 'planning':
                    $section['content']['images'] = [
                        'count' => count($section['content']['images']),
                        'imageList' => $section['content']['images']
                    ];
                    break;
                default:
                    $section['content']['comments'] = [
                        'count' => count($section['content']['comments']),
                        'commentList' => $section['content']['comments']
                    ];
                    $section['content']['links'] = [
                        'count' => count($section['content']['links']),
                        'linkList' => $section['content']['links']
                    ];
                    $section['content']['images'] = [
                        'count' => count($section['content']['images']),
                        'imageList' => $section['content']['images']
                    ];
                    break;
            }
            $contentResponse[] = $section;
        }

        sendResponse(200, null, $contentResponse);
    } catch (Exception $e) {
        sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
    }
    $db = null;
} else {
    unauthorizedResponse('Please sign in.');
}
