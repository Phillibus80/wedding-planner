<?php

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

// Validate required fields
if ((!isset(Flight::request()->data->client_name) || Flight::request()->data->client_name == '')
    || (!isset(Flight::request()->data->email) || Flight::request()->data->email == '')
    || (!isset(Flight::request()->data->client_message) || Flight::request()->data->client_message == '')) {
    sendResponse(400, 'All fields are required: client_name, client_message and email.');
}

try {
    $mail = new PHPMailer(true);

    $mail->isSMTP();
    $mail->SMTPAuth = true;

    // Personal data
    $mail->Host = 'smtp.ionos.com';
    $mail->Port = 587;
    $mail->Username = Flight::get('EMAIL');
    $mail->Password = Flight::get('SMTP_PASSWORD');
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

    // Sender
    $mail->setFrom(Flight::get('EMAIL'), 'Contact Form');

    // Recipient, the name can also be stated
    $mail->addAddress(Flight::get('EMAIL'), Flight::get('FORWARD_EMAIL'));
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';
    $mail->isHTML(true);
    $mail->Subject = "Contact request generated from Risen Rose Creations' website.";
    $mail->Body = "FROM:: " . Flight::request()->data->client_name . "<br/>"
        . "EMAIL:: " . Flight::request()->data->email . "<br/>"
        . "MESSAGE:: " . Flight::request()->data->client_message;
    $mail->send();
} catch (Exception $e) {
    sendResponse(500, 'Trouble sending email, please again later.', [
        'additionalInfo' => $e->getMessage()
    ]);
}