<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $userEmail = $_POST["Email"];
    $userPassword = $_POST["Password"];

    if (empty($userEmail) || empty($userPassword)) {
        echo json_encode(["status" => "error", "message" => "Mohon lengkapi data."]);
        exit();
    }

    require('connection.php');

    if ($con->connect_error) {
        http_response_code(500); 
        echo json_encode(["status" => "error", "message" => "Koneksi database gagal: " . $con->connect_error]);
        exit();
    }

    $checkUserQuery = "SELECT users.UserId, Name, password FROM users 
                        INNER JOIN passwords ON users.UserId = passwords.UserId
                        WHERE Email = ?";
    $checkUserStmt = $con->prepare($checkUserQuery);
    $checkUserStmt->bind_param("s", $userEmail);
    $checkUserStmt->execute();
    $resultUser = $checkUserStmt->get_result();
    $checkUserStmt->close();

    if ($resultUser->num_rows > 0) {
        $userRow = $resultUser->fetch_assoc();
        $hashedPassword = $userRow["password"];

        // Memeriksa kecocokan kata sandi
        if (password_verify($userPassword, $hashedPassword)) {
            // Login berhasil
            $sessionToken = bin2hex(random_bytes(32));

            // Hapus sesi yang sudah ada
            $deleteExistingSessionsQuery = "DELETE FROM sessions WHERE UserId = ?";
            $deleteExistingSessionsStmt = $con->prepare($deleteExistingSessionsQuery);
            $deleteExistingSessionsStmt->bind_param("i", $userRow["UserId"]);
            $deleteExistingSessionsStmt->execute();

            $insertSessionQuery = "INSERT INTO sessions (UserId, SessionToken) VALUES (?, ?)";
            $insertSessionStmt = $con->prepare($insertSessionQuery);
            $insertSessionStmt->bind_param("is", $userRow["UserId"], $sessionToken);
            $insertSessionStmt->execute();

            $insertSessionStmt->close();
            $deleteExistingSessionsStmt->close();

            echo json_encode([
                "status" => "success",
                "sessionToken" => $sessionToken,
                "userId" => $userRow["UserId"],
                "name" => $userRow["Name"]
            ]);

        } else {
            echo json_encode(["status" => "error", "message" => "User tidak ditemukan atau password salah."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "User tidak ditemukan atau password salah."]);
    }

    $con->close();
} else if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET["action"])) {
    if ($_GET["action"] == "logout") {
        // Metode GET untuk logout
        $userId = $_GET["userId"];
        $sessionToken = $_GET["sessionToken"];

        require('../controller/connection.php');
        $deleteSessionQuery = "DELETE FROM sessions WHERE UserId = ? AND SessionToken = ?";
        $deleteSessionStmt = $con->prepare($deleteSessionQuery);
        $deleteSessionStmt->bind_param("is", $userId, $sessionToken);

        if ($deleteSessionStmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Logout berhasil."]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Logout gagal."]);
        }

        $deleteSessionStmt->close();
    } else if ($_GET["action"] == "checkSession") {
        // Metode GET untuk memeriksa sesi
        $userId = $_GET["userId"];
        $sessionToken = $_GET["sessionToken"];

        require('../controller/connection.php');
        $checkSessionQuery = "SELECT * FROM sessions WHERE UserId = ? AND SessionToken = ?";
        $checkSessionStmt = $con->prepare($checkSessionQuery);
        $checkSessionStmt->bind_param("is", $userId, $sessionToken);
        $checkSessionStmt->execute();
        $checkSessionResult = $checkSessionStmt->get_result();

        if ($checkSessionResult->num_rows > 0) {
            echo json_encode(["status" => "success", "message" => "Sesi valid."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Sesi tidak valid."]);
        }

        $checkSessionStmt->close();
    } else {
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Metode request tidak valid."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Metode request tidak valid."]);
}
?>
