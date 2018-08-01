<?php

$frm_name  = "Youname";
$recepient = "youmail@ya.ru";
$sitename  = "Armata Financial Group";
$subject   = "Новая заявка с сайта \"$sitename\"";

$name = trim($_POST["name"]);
$email = trim($_POST["phone"]);
$forname = trim($_POST["forname"]);

$message = "
Форма: $forname <br>
E-mail: $email <br>
Имя: $phone
";

mail($recepient, $subject, $message, "From: $frm_name <$email>" . "\r\n" . "Reply-To: $email" . "\r\n" . "X-Mailer: PHP/" . phpversion() . "\r\n" . "Content-type: text/html; charset=\"utf-8\"");
