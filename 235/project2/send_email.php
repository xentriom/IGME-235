<?php
if(isset($_POST['subject'])) {
    $to = 'jc5892@rit.edu';
    $subject = 'Contact via Pokemon Website';
    $message = 'Name: ' . $_POST['fullname'] . ' / ' . $_POST['email'] . "\r\n\r\n";
    $message .= 'Subject: ' . $_POST['subject'];

    mail($to, $subject, $message);

    header('Location: ' . $_SERVER['HTTP_REFERER']);
    exit();
}
?>