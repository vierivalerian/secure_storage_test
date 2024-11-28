if(localStorage.getItem('userId') == '1' && localStorage.getItem('userName') == 'Admin'){
    $('#adminCategory').show();
    $('#userCategory').hide();
}else { 
    $('#adminCategory').hide();
    $('#userCategory').show();
}


document.addEventListener("DOMContentLoaded", function () {
    if(localStorage.getItem('userId') == '1' && localStorage.getItem('userName') == 'Admin'){
        getDataCatAdmin();
    }else{
        getDataCat();
    }
});

$("#popUpID").hide();
$("#popUpID2").hide();
$("#popUpID3").hide();
function add() {
    $("#popUpID").show();
}

var proCatID = "";
var newCat = "";

function edit(catId){
    $("#popUpID2").show();
    localStorage.setItem('proCatID', $("#dataCat_" + catId).text());
}

function dlt(catId){
    $("#popUpID3").show();
    localStorage.setItem('proCatID', $("#dataCat_" + catId).text());
}

function EditCat(){
    $.ajax({
        type: 'POST',
        url: '../controller/category.php',
        data: {
            UserId: localStorage.getItem('userId'),
            ProCatID: localStorage.getItem('proCatID'),
            Category: $('#boxInput2').val(),
            action: 'edit'
        },
        success: function(data) {
            localStorage.removeItem('proCatID');
            localStorage.removeItem('newCat');  
            $("#popUpID2").hide();
            getDataCat();   
        },
        error: function() {
            console.log("gagal");
        }
    });
}


function DeleteCat(){
    $.ajax({
        type: 'POST',
        url: '../controller/category.php',
        data: {
            UserId: localStorage.getItem('userId'),
            ProCatID: localStorage.getItem('proCatID'),
            action: 'delete'
        },
        success: function(data) {
            localStorage.removeItem('proCatID');
            localStorage.removeItem('newCat'); 
            $("#popUpID3").hide();
            getDataCat();
        },
        error: function(data) {
            console.log("gagal");
        }
    });
}

function tombolClose() {
    $("#popUpID").hide();
    $("#popUpID2").hide();
    $("#popUpID3").hide(); 
    localStorage.removeItem('proCatID');
    localStorage.removeItem('newCat');  
}
$("#editsub").click(function(){
    var $boxInput2 = $("#boxInput2").val()

    
    $("#popUpID2").hide()
})
$("#dltRow").click(function(){
    var $table = $(".tabel")
    var row = $(this).closest("tr"); 
    row.remove(); 
    $("#popUpID3").hide()
})

function getDataCat() {
    console.log(localStorage.getItem('userId'));
    $.ajax({
        type: "GET",
        url: "../controller/category.php", // Sesuaikan dengan lokasi PHP script Anda
        data: {
            UserId: localStorage.getItem('userId')
        },
        success: function (data) {
            var response = JSON.parse(data); 
            // Tangani respons dari server
            console.log(response, "ini apa");

            // Ambil tabel dan hapus semua baris kecuali baris pertama (header)
            var tabel = $(".tabel");
            tabel.find("tr:gt(0)").remove();

            // Loop melalui data dari respons dan tambahkan setiap entri ke tabel
            $.each(response.categories, function (index, item) {
                var newRow = $("<tr></tr>");
                newRow.append('<td>' + (index + 1) + '.</td>');
                newRow.append('<td id="Cat_' + (index + 1) + '">' + item.CategoryName + '</td>');
                newRow.append('<td style="display: none;" id="dataCat_' + (index + 1) + '">' + item.CategoryId + '</td>');
                newRow.append('<td><button id="editbtn" onclick="edit(' + (index + 1) + ')">Edit</button><button id="dltbtn" onclick="dlt(' + (index + 1) + ')">Delete</button></td>');
                tabel.append(newRow);
            });
            $("#popUpID").hide();
        },
        error: function (error) {
            alert(error);
        }
    });
}

function getDataCatAdmin() {
    console.log(localStorage.getItem('userId'));
    $.ajax({
        type: "POST",
        url: "../controller/category.php", // Sesuaikan dengan lokasi PHP script Anda
        data: {
            UserId: localStorage.getItem('userId'),
            userName: localStorage.getItem('userName')
        },
        success: function (data) {
            console.log(data);
            var response = JSON.parse(data); 
            // Tangani respons dari server
            console.log(response, "ini apa");

            // Ambil tabel dan hapus semua baris kecuali baris pertama (header)
            var tabel = $(".tabel");
            tabel.find("tr:gt(0)").remove();

            // Loop melalui data dari respons dan tambahkan setiap entri ke tabel
            $.each(response.categories, function (index, item) {
                var newRow = $("<tr></tr>");
                newRow.append('<td>' + (index + 1) + '.</td>');
                newRow.append('<td id="Cat_' + (index + 1) + '">' + item.CategoryName + '</td>');
                newRow.append('<td style="display: none;" id="dataCat_' + (index + 1) + '">' + item.CategoryId + '</td>');
                newRow.append('<td id="ownerCat_' + (index + 1) + '">' + item.UserName + '</td>')
                tabel.append(newRow);
            });
            $("#popUpID").hide();
        },
        error: function (error) {
            alert(error);
        }
    });
}


function addcategory(){
    $.ajax({
        type: "post",
        url: "../controller/category.php",
        data: {
            UserId: localStorage.getItem('userId'),
            Category: $("#boxInput").val(),
            action: 'add'
        },
        success: function() {
            getDataCat();
        },
        error: function(error) {
            console.error(error);
        }
    }); 
}
