<?php
    require "../config/database.php";
    
    $con = new mysqli(
        $config["server"],
        $config["username"],
        $config["password"],
        $config["database"]
    );
?>