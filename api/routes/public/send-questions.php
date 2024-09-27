<?php

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

// Validate required fields
if ((!isset(Flight::request()->data->coupleName) || Flight::request()->data->coupleName == '')
    || (!isset(Flight::request()->data->email) || Flight::request()->data->email == '')
    || (!isset(Flight::request()->data->pageName) || Flight::request()->data->pageName == '')
    || (!isset(Flight::request()->data->phoneNumber) || Flight::request()->data->phoneNumber == '')) {
    sendResponse(400, 'All fields are required: coupleName, phoneNumber, pageName, and email.');
}

try {
    $mail = new PHPMailer(true);

    $mail->isSMTP();
    $mail->SMTPAuth = true;

    // Personal data
    $mail->Host = 'smtp.ionos.com';
    $mail->Port = 587;
    $mail->Username = Flight::get('EMAIL');
    $mail->Password = Flight::get('SMTP_PASSWORD');;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

    // Sender
    $mail->setFrom(Flight::get('EMAIL'), Flight::request()->data->pageName . ' Form');

    // Recipient, the name can also be stated
    $mail->addAddress(Flight::get('EMAIL'), Flight::get('FORWARD_EMAIL'));
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';
    $mail->isHTML(true);
    $mail->Subject = "Wedding Questionnaire answers from Risen Rose Creations' website.";
    $mail->Body = Flight::request()->data;
    $mail->send();
} catch (Exception $e) {
    sendResponse(500, 'Trouble sending questionnaire email, please again later.', [
        'additionalInfo' => $e->getMessage()
    ]);
}