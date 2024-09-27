<?php

$authHeader = getAuthHeader();
$token = $authHeader ? str_replace('Bearer ', '', $authHeader) : null;
$secret = Flight::get('secretKey');
$requestData = Flight::request()->data;

if ((!isset(Flight::request()->data->current_password)
        || Flight::request()->data->current_password == "")
    || (!isset(Flight::request()->data->password)
        || Flight::request()->data->password == "")) {
    sendResponse(400, 'All fields are required: current_password, and password.');
}

if (!isset($token)) {
    unauthorizedResponse('Please sign in.');
}

$decodedToken = validateToken($token, $secret);

if ($decodedToken) {
    try {
        $db = Flight::db();

        // Search for the user
        $statement = $db->prepare('
                    SELECT USERNAME, PASSWORD, PERMISSION_LEVEL
                    FROM USERS
                    WHERE USERNAME = ?
          '
        );
        $statement->execute([Flight::get('currentUser')]);
        $statementResult = $statement->fetch(PDO::FETCH_ASSOC);
        $statementCount = $statement->rowCount();

        // If there is a user
        if ($statementCount > 0) {

            // Check the current password
            if (password_verify(Flight::request()->data->current_password, $statementResult['PASSWORD'])) {
                $temp_password = password_hash(Flight::request()->data->password, PASSWORD_BCRYPT);
                $get_user_statement = $db->prepare("
                            UPDATE USERS
                            SET PASSWORD = ?
                            WHERE USERS.USERNAME = ?
            "
                );
                $get_user_statement->execute([
                    $temp_password,
                    Flight::get('currentUser')
                ]);

                sendResponse(200, Flight::get('currentUser') . "'s password has been updated");
            } else {
                sendResponse(400, "Username and Password combination do not match.");
            }
        } else {
            sendResponse(400, "Username and Password combination do not match.");
        }
    } catch (Exception $e) {
        sendResponse(500, 'There was an error.', ["errorMessage" => $e->getMessage()]);
    }

    $db = null;
} else {
    unauthorizedResponse('Please sign in.');
}
