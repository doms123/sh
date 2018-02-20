$(function() {
	$(".page-title").text("Settings");

	$(".logoutBtn").click(function( ){
		window.plugins.googleplus.logout(
		    function (msg) {
		    }
		);

		cordova.plugins.notification.badge.clear();

		localStorage.removeItem("UserEmail");
		localStorage.removeItem("user_id");
		localStorage.removeItem("role");

		window.location.href = "#login.html";
		setTimeout(function() {
			loadPageUrl(window.location.href);
		}, 400);

		return false;
	});

	$(".settingNav button").click(function() {
			if($(this).hasClass('logoutBtn') == false) {
			var href = $(this).attr('href');
			
			window.location.href = $(this).attr('href');
			setTimeout(function() {
				loadPageUrl(window.location.href);
			}, 400);
		}
	});

	if(localStorage.getItem("role") == "Corporate") {
		$(".settingNav li:nth-child(3)").removeAttr("class");
	}
	console.log(localStorage.getItem("role"));
});