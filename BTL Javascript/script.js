document.querySelector('.img-btn').addEventListener('click', function()
	{
		document.querySelector('.cont').classList.toggle('s-signup')
	}
);

if (localStorage.getItem('LoggedIn') === "true") {
	window.location.href = "BTL.html";
}
var ten_dang_nhap_element =document.getElementById("name_login");
var mat_khau_element = document.getElementById("password_login")
function login() {
	var ten_dang_nhap = ten_dang_nhap_element.value;
	var mat_khau = mat_khau_element.value;
	if (ten_dang_nhap === "truongthk024@gmail" && mat_khau === "123456") {
		localStorage.setItem('LoggedIn','true');
		window.location.href = "BTL.html";
	}
	else {
		message.textContent = "Tài khoản hoặc mật khẩu không đúng !";
	}
}
