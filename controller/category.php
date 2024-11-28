<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
require('connection.php');

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["action"])) {
    $UserId = $_POST['UserId'];
    $CategoryName = $_POST['Category'];

    if ($_POST["action"] == "add") {
        // Aksi tambah kategori
        $insertCategoryQuery = "INSERT INTO categories (UserId, CategoryName, CategoryDate) VALUES (?, ?, NOW())";
        $insertCategoryQuery = $con->prepare($insertCategoryQuery);
        $insertCategoryQuery->bind_param("is", $UserId, $CategoryName);

        if ($insertCategoryQuery->execute()) {
            echo json_encode(["status" => "success", "message" => "Add Category berhasil."]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Add Category gagal."]);
        }

        $insertCategoryQuery->close();
    } else if ($_POST["action"] == "edit") {
        // Aksi edit kategori
        $CategoryId = $_POST['ProCatID']; 
        $updateCategoryQuery = "UPDATE categories SET CategoryName = ? WHERE CategoryId = ? AND UserId = ?";
        $updateCategoryQuery = $con->prepare($updateCategoryQuery);
        $updateCategoryQuery->bind_param("sii", $CategoryName, $CategoryId, $UserId);

        if ($updateCategoryQuery->execute()) {
            echo json_encode(["status" => "success", "message" => "Edit Category berhasil."]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Edit Category gagal."]);
        }

        $updateCategoryQuery->close();
    } else if ($_POST["action"] == "delete") {
        // Aksi hapus kategori
        $CategoryId = $_POST['ProCatID']; 
        $deleteCategoryQuery = "DELETE FROM categories WHERE CategoryId = ? AND UserId = ?";
        $deleteCategoryQuery = $con->prepare($deleteCategoryQuery);
        $deleteCategoryQuery->bind_param("ii", $CategoryId, $UserId);

        if ($deleteCategoryQuery->execute()) {
            echo json_encode(["status" => "success", "message" => "Delete Category berhasil."]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Delete Category gagal."]);
        }

        $deleteCategoryQuery->close();
    }

    $con->close();
} else if ($_SERVER["REQUEST_METHOD"] == "GET") {

    
    // Aksi mendapatkan semua kategori berdasarkan UserId dan diurutkan berdasarkan tanggal
    $UserId = $_GET['UserId']; // Sesuaikan dengan nama parameter yang digunakan untuk UserId
    $getCategoriesQuery = "SELECT CategoryId, CategoryName, CategoryDate FROM categories WHERE UserId = ? ORDER BY CategoryDate DESC";
    $getCategoriesQuery = $con->prepare($getCategoriesQuery);
    $getCategoriesQuery->bind_param("i", $UserId);

    $getCategoriesQuery->execute();
    $result = $getCategoriesQuery->get_result();
    $categories = [];

    while ($row = $result->fetch_assoc()) {
        $categories[] = [
            'CategoryId' => $row['CategoryId'],
            'CategoryName' => $row['CategoryName'],
            'CategoryDate' => $row['CategoryDate']
        ];
    }

    echo json_encode(["status" => "success", "categories" => $categories]);

    $getCategoriesQuery->close();
    $con->close();
}else if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['userName']) && isset($_POST['UserId'])){
    $getCategoriesQuery = "SELECT CategoryId, CategoryName, CategoryDate, UserId FROM categories ORDER BY CategoryDate DESC";
    $result = $con->query($getCategoriesQuery);
    $categories = [];

    while ($row = $result->fetch_assoc()) {
        $query = "SELECT Name FROM users WHERE UserId = ?";
        $stmt = $con->prepare($query);
        $stmt->bind_param("i", $row['UserId']);
        $stmt->execute();
        $resultName = $stmt->get_result();
        $userRow = $resultName->fetch_assoc();

        $categories[] = [
            'UserName' => $userRow['Name'], 
            'CategoryId' => $row['CategoryId'],
            'CategoryName' => $row['CategoryName'],
            'CategoryDate' => $row['CategoryDate']
        ];
    }

    echo json_encode(["status" => "success", "categories" => $categories]);
    $con->close();
}


?>
