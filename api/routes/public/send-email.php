<?php
if (
    !isset(Flight::request()->data->client_name)
    || !isset(Flight::request()->data->email)
    || !isset(Flight::request()->data->client_message)
) {
    Flight::response()->header("Content-Type", "application/json");
    Flight::response()->status(400);
    Flight::response()->write(json_encode(array(
        "status" => 400,
        'message' => 'All fields are required: client_name, client_message and email.'
    )));
} else {
    $to = Flight::get('IN_DEVELOPMENT') ?
        "philmcelroy80@gmail.com" :
        "gg@thecatladypetsitting.com";

    $from = Flight::request()->data->client_name . ' <' . Flight::request()->data->email . '>';

    $headers = "Organization: The Cat Lady Pet Sitting\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/plain; charset=utf-8\r\n";
    $headers .= "From:" . $from . "\r\n";
    $headers .= "Reply-To:" . Flight::request()->data->email . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

    $email_send = mail(
        $to,
        "Service Request generated from TheCatLadyPetSitting.com",
        Flight::request()->data->client_message,
        $headers
    );

    Flight::response()->header("Content-Type", "application/json");
    if ($email_send) {
        Flight::response()->status(200);
        Flight::response()->write(json_encode(array(
            "status" => 200,
            "message" => 'Your email has been sent.  Someone will be with you soon.'
        )));
    } else {
        Flight::response()->status(500);
        Flight::response()->write(json_encode(array(
            "status" => 500,
            "message" => 'There was a problem sending your email.  Please try again later.'
        )));
    }
}
Flight::response()->send();
die();