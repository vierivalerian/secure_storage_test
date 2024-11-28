document.addEventListener("DOMContentLoaded", function () {
    
    const userId = localStorage.getItem('userId');
    const sessionToken = localStorage.getItem('sessionToken');

    $.ajax({
        type: 'get',
        url: '../controller/login.php',
        data: {
            action: 'checkSession',
            userId: userId,
            sessionToken: sessionToken
        },
        success: function (data) {
            var parsedData = JSON.parse(data);
            if(parsedData.status != 'success'){
                doLogOut();
            }else { 
                if (localStorage.getItem('userId') == null) {
                    if (window.location.href.indexOf('home.html') === -1 && window.location.href.indexOf('login.html') === -1 && window.location.href.indexOf('register.html') === -1) {
                        window.location.href = 'home.html';
                    }
                    $('.homecontainer').hide();
                } else {
                    var userName = localStorage.getItem('userName');
                    if (userName) {
                        $('#userlogged').text(userName);
                    }
                    $('.homecontainer').show();
                    $('#loginRegister').hide();
                    $('#segitiga').show();
                    $('#userlogged').show();
                }
            }
        },
        error: function () {
            console.log('Gagal memeriksa sesi.');
        }
    });
});



$('#tri').on("change", function() {
    if ($(this).is(":checked")) {
        $('#LogOut').show();
    } else { 
        $('#LogOut').hide();
    }
});

function doLogOut(){
    const userId = localStorage.getItem('userId');
    const sessionToken = localStorage.getItem('sessionToken');
    console.log(userId, sessionToken, "Test Data");
    if (userId && sessionToken) {
        // Panggil AJAX request untuk logout
        $.ajax({
            type: 'GET',
            url: '../controller/login.php',
            data: {
                userId: userId,
                sessionToken: sessionToken,
                action: 'logout'
            },
            success: function(data) {
                var parsedData = JSON.parse(data);
                console.log(parsedData);
                if (parsedData.status == "success") {
                    localStorage.removeItem('userId');
                    localStorage.removeItem('userName');
                    localStorage.removeItem('sessionToken');
                    $('#userlogged').text(null);
                    $('#loginRegister').show();
                    $('.homecontainer').hide();
                    $('#segitiga').hide();
                    $('#userlogged').hide();
                    $('#LogOut').hide();
                    // Redirect ke halaman login atau halaman lain jika diperlukan
                    window.location.href = 'login.html';
                } else {
                    alert(parsedData.message);
                }
            },
            error: function(data) {
                var parsedData = JSON.parse(data);
                alert(parsedData.message);
            }
        });
    } else {
        console.log("Pengguna belum login");
    }
}

function checkSession() {
    const userId = localStorage.getItem('userId');
    const sessionToken = localStorage.getItem('sessionToken');

    $.ajax({
        type: 'get',
        url: '../controller/login.php',
        data: {
            action: 'checkSession',
            userId: userId,
            sessionToken: sessionToken
        },
        success: function (data) {
            var parsedData = JSON.parse(data);
            if(data.status != 'success'){
                doLogOut();
            }
        },
        error: function (data) {
            var parsedData = JSON.parse(data);
            alert(parsedData.message);
        }
    });
}
