function doLogin() {
    const userEmail = $('#email').val();
    const userPassword = $('#password').val();

    if (userEmail == "" || userPassword == "") {
        alert('Mohon lengkapi data.');
        return;
    }

    $.ajax({
        type: 'post',
        url: '../controller/login.php', 
        data: {
            Email: userEmail,
            Password: userPassword
        },
        success: function(data) {
            console.log(data, "Test data");
            var parsedData = JSON.parse(data);
            if (parsedData.status == "success") {
                localStorage.setItem('userId', parsedData.userId);
                localStorage.setItem('userName', parsedData.name);
                localStorage.setItem('sessionToken', parsedData.sessionToken);
                window.location.href = 'home.html';
            } else {
                alert("User tidak ditemukan atau password salah.");
            }
        },        
        error: function(data) {
            
            var parsedData = JSON.parse(data.responseText);
            console.log(parsedData, "error data");
            alert(parsedData.message);
        }
    });
}


    
