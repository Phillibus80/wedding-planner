<?php
require_once './vendor/autoload.php';

Flight::set('IN_DEVELOPMENT', true);

if (Flight::get('IN_DEVELOPMENT')) {
    header('Access-Control-Allow-Origin: http://localhost:5173');
} else {
    header('Access-Control-Allow-Origin: https://www.risenrose.com');
}
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');

// Constants
Flight::set('SUPER', 'SUPER');
Flight::set('PUBLIC', 'PUBLIC');
Flight::set('PRIVATE', 'PRIVATE');

// DB Connection Constants
if (Flight::get('IN_DEVELOPMENT')) {
    // TEST
    Flight::set('USER', 'root');
    Flight::set('PASS', 'password');
    Flight::set('MYSQL_URL', 'mysql:host=db');
    Flight::set('DATABASE_NAME', 'risen_rose_db');
    Flight::set('secretKey', 'it-is-a-secret');
} else {
    // PROD
    Flight::set('USER', '');
    Flight::set('PASS', '');
    Flight::set('MYSQL_URL', '');
    Flight::set('DATABASE_NAME', '');
    Flight::set('secretKey', '');
}

// Page Constants
Flight::set('MAIN', 'main');
Flight::set('page-image-dir', './img/page-img/');

Flight::map('notFound', function () {
    echo Flight::json(array(
        'status' => '404',
        'message' => 'Not Found'
    ));
});

Flight::register('db', 'PDO',
    array(
        Flight::get('MYSQL_URL') . ';dbname=' . Flight::get('DATABASE_NAME'),
        Flight::get('USER'),
        Flight::get('PASS')
    ),
    function ($db) {
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
);

// Pages
Flight::route('GET /', function () {
    require 'routes/public/home.php';
});

Flight::route('GET /get-home-images', function () {
    require 'routes/public/get-home-images.php';
});

Flight::route('POST /send-email', function () {
    require "routes/public/send-email.php";
});

Flight::route('GET /admin', function () {
    require "routes/admin/admin.php";
});

Flight::route('GET /questionnaire/@questionnaire_page', function ($questionnaire_page) {
    Flight::set('currentQuestionnaire', $questionnaire_page);
    require 'routes/public/wedding-questionnaire.php';
});

// Auth
Flight::route('POST /login', function () {
    require "routes/admin/login.php";
});

Flight::route('POST /logout', function () {
    require "routes/admin/logout.php";
});

// Users
Flight::route('GET /users', function () {
    require "routes/users/getUsers.php";
});

Flight::route('GET /user/@user_username', function ($user_username) {
    Flight::set('currentUser', $user_username);
    require "routes/users/getUser.php";
});

Flight::route('PATCH /update-user/@user_username', function ($user_username) {
    Flight::set('currentUser', $user_username);
    require "routes/users/updateUser.php";
});

Flight::route('PATCH /update-user-password/@user_username', function ($user_username) {
    Flight::set('currentUser', $user_username);
    require 'routes/users/updateUserPass.php';
});

Flight::route('PATCH /update-user-permissions/@user_username', function ($user_username) {
    Flight::set('currentUser', $user_username);
    require 'routes/users/updateUserPermissions.php';
});

Flight::route('POST /create-user', function () {
    require 'routes/users/createUser.php';
});

// Sections
Flight::route('GET /sections', function () {
    require 'routes/sections/getSections.php';
});

Flight::route('GET /section/@page_name', function ($page_name) {
    Flight::set('currentPage', $page_name);
    require 'routes/sections/getSectionsByPage.php';
});

Flight::route('POST /create-section', function () {
    require 'routes/sections/createSection.php';
});

Flight::route('POST /update-section', function () {
    require 'routes/sections/updateSection.php';
});

// Content
// --Images
Flight::route('GET /images', function () {
    require 'routes/images/getImages.php';
});

Flight::route('GET /images/@section_name', function ($section_name) {
    Flight::set('currentSection', $section_name);
    require 'routes/images/getImagesBySectionName.php';
});

Flight::route('POST /create-image', function () {
    require 'routes/images/createImage.php';
});

Flight::route('POST /update-image', function () {
    require 'routes/images/updateImage.php';
});

Flight::route('POST /remove-image', function () {
    require 'routes/images/removeImage.php';
});

// --Why Us
Flight::route('GET /why-us', function () {
    require 'routes/whyUs/getWhyUs.php';
});

Flight::route('POST /create-why-us', function () {
    require 'routes/whyUs/createWhyUs.php';
});

Flight::route('POST /update-why-us', function () {
    require 'routes/whyUs/updateWhyUs.php';
});

Flight::route('POST /remove-why-us', function () {
    require 'routes/whyUs/removeWhyUs.php';
});

// --Planning
Flight::route('GET /planning', function () {
    require 'routes/planning/getPlanning.php';
});

Flight::route('POST /create-planning', function () {
    require 'routes/planning/createPlanning.php';
});

Flight::route('POST /update-planning', function () {
    require 'routes/planning/updatePlanning.php';
});

Flight::route('POST /remove-planning', function () {
    require 'routes/planning/deletePlanning.php';
});

// --Comments
Flight::route('GET /comments', function () {
    require 'routes/comments/getComments.php';
});

Flight::route('GET /comments/@section_name', function ($section_name) {
    Flight::set('currentSection', $section_name);
    require 'routes/comments/getCommentsBySectionName.php';
});

Flight::route('POST /create-comment', function () {
    require 'routes/comments/createComment.php';
});

Flight::route('POST /update-comment', function () {
    require 'routes/comments/updateComment.php';
});

Flight::route('POST /remove-comment', function () {
    require 'routes/comments/removeComment.php';
});

// --Links
Flight::route('GET /links', function () {
    require 'routes/links/getLinks.php';
});

Flight::route('GET /links/@section_name', function ($section_name) {
    Flight::set('currentSection', $section_name);
    require 'routes/links/getLinksBySectionName.php';
});

Flight::route('POST /create-link', function () {
    require 'routes/links/createLink.php';
});

Flight::route('POST /update-link', function () {
    require 'routes/links/updateLink.php';
});

Flight::route('POST /remove-link', function () {
    require 'routes/links/removeLink.php';
});

// --Questionnaire pages
Flight::route('POST /create-question', function () {
    require 'routes/questionnaire/createQuestion.php';
});

Flight::route('PATCH /update-question/@section_name/@question_name/@page_name',
    function ($section_name, $question_name, $page_name) {
    Flight::set('sectionName', $section_name);
    Flight::set('questionName', $question_name);
    Flight::set('pageName', $page_name);
    require 'routes/questionnaire/updateQuestion.php';
});

Flight::route('POST /remove-question', function () {
    require 'routes/questionnaire/removeQuestion.php';
});

session_write_close();

Flight::start();
