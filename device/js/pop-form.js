var link = document.querySelector(".js-write-us");
var popup = document.querySelector(".write-us");
var close = popup.querySelector(".modal-close");
var form = popup.querySelector(".form-login");
var login = popup.querySelector("[name=user-login]");
var email = popup.querySelector("[name=user-email]");
var isStorageSupport = true;
var storage = "";

try {
	storage = localStorage.getItem("login");
} catch (err) {
	isStorageSupport = false;
}

link.addEventListener("click", function (evt) {
	evt.preventDefault();
	popup.classList.add("modal-show");

	if (storage) {
		login.value = storage;
	} 
});

close.addEventListener("click", function (evt) {
	evt.preventDefault();
	popup.classList.remove("modal-show");
	popup.classList.remove("modal-error");
});

form.addEventListener("submit", function (evt) {
	if (!login.value || !email.value) {
		evt.preventDefault();
		popup.classList.remove("modal-error");
		popup.offsetWidth = popup.offsetWidth;
		popup.classList.add("modal-error");
	} else {
		if (isStorageSupport) {
			localStorage.setItem("login", login.value);
		}
	}
});

window.addEventListener("keydown", function (evt) {
	if (evt.keyCode === 27) {
		evt.preventDefault();
		if (popup.classList.contains("modal-show")) {			
			popup.classList.remove("modal-show");
			popup.classList.remove("modal-error");
		}
	}
});