
function doRegister(){
    const userName = $('#name').val();
    const userEmail = $('#email').val();
    const userPassword = $('#password').val();
    const PasswordConfirm = $('#confirm').val();
    const clickbox = $('#kotak').prop('checked');

    if(userName == "" || userEmail == "" || userPassword == "" || PasswordConfirm == ""){
        alert('Data harus di isi!')
        return;
    }

    if (!validateEmail(userEmail)) {
        alert('Format email tidak valid!');
        return;
    }

    if (!validatePassword(userPassword)) {
        alert('Password harus terdiri dari angka, symbol, huruf besar, huruf kecil, dan minimal 8 karakter!');
        return;
    }

    if(PasswordConfirm !== userPassword){
        alert('Konfirmasi password salah');
        return;
    }

    if (!clickbox) {
        alert("Anda harus menyetujui syarat dan ketentuan.");
        return;
    }
    
    $.ajax({
        type: 'POST',
        url: '../controller/register.php',
        data:{
            Email: userEmail,
            Name: userName,
            Password: userPassword
        },
        success: function(data) {
            if (data != null) {
                location.reload();
            }
        },
        error: function(data) {
            var parsedData = JSON.parse(data);
            alert(parsedData.message);
        }
    });
    
}

// Fungsi validasi email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Fungsi validasi password
function validatePassword(password) {
    // Sesuaikan persyaratan sesuai kebutuhan
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
}




