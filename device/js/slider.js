var slideButtons = document.querySelectorAll(".dot");


Array.prototype.forEach.call(slideButtons, function(slideButton) {
	slideButton.addEventListener("click", function (evt) {
		var currentDot = evt.currentTarget;
		var slideId = currentDot.dataset.slide;
		var slide = document.getElementById(slideId);


		document.querySelector(".slides-list .active").classList.remove("active");
		document.querySelector(".dot-current").classList.remove("dot-current");

		currentDot.classList.add("dot-current");
		slide.classList.add("active");
	}, false);
});


var serviceButtons = document.querySelectorAll(".service-navigation .button");


Array.prototype.forEach.call(serviceButtons, function(serviceButton) {
	serviceButton.addEventListener("click", function (evt) {
		evt.preventDefault();
		var serviceId = evt.currentTarget.getAttribute("href");
		var service = document.querySelector(serviceId);

		document.querySelector(".service-list .current").classList.remove("current");
		document.querySelector(".button-active").classList.remove("button-active");
		
		service.classList.add("current");
		serviceButton.classList.add("button-active");

	}, false);
});




