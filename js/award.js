$(document).ready(function() {
	var id = localStorage.getItem("user_id");
	$(".users-btn").attr('data-href','#dashboard_corporate.html');
	$(".hideAward").click(function() {
		$(this).parent().parent().hide();
	});

	$(".page-title").text('AWARDS, BADGES, RIBBONS');

	if (localStorage.getItem("UserEmail") === null) {
		$('#sh_content').load('login.html');
	}
	$('body').removeClass('loaded');
	$(".preloadLogo").show();
	setTimeout(function() {
		$('body').addClass('loaded');
		$(".preloadLogo").fadeOut();
	}, 700);

	$("#main-nav").find("a").removeClass("active");
	$("#main-nav").find(".award-btn").addClass('active');

});