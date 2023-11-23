<?php
if(isset($_POST['subject'])) {
    $to = 'jc5892@rit.edu';
    $subject = $_POST['subject'];
    $message = 'Name: ' . $_POST['firstname'] . ' ' . $_POST['lastname'] . "\r\n\r\n";
    $message .= 'Subject: ' . $subject;

    mail($to, $subject, $message);

    header('Location: ' . $_SERVER['HTTP_REFERER']);
    exit();
}
?>