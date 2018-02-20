$(document).ready(function() {
	pageTitleAndLoader('Forgot Password');
	
	$('.forgotForm').submit(function() {
		var email = spaceTrim($('#email').val());

		$.ajax({
			type: 'POST',
			url: ci_base_url + 'forgotPassword',
			dataType: 'json',
			crossDomain: true,
			data: {'email': email},				
			beforeSend: function(){
				$(".reset-btn").attr('disabled', true).find("i").attr('class', 'ion-loading-a').css('top','6px');
			},
			success: function(data) {
				$(".reset-btn").attr('disabled', false).find("i").attr('class', 'ion-unlocked').css('top','inherit');
				if(email.length < 5) {
					$.toast({	
					    text: 'Please enter a valid email address',
					    allowToastClose: false,
					    showHideTransition: 'fade',
					    position: 'bottom-center',
					    textAlign: 'center',
					    loader: false,
					    stack: false
					})
				}else {
					if(data.success == 1) {
						$.toast({
						    text: data.message,
						    allowToastClose: false,
						    showHideTransition: 'fade',
						    position: 'bottom-center',
						    textAlign: 'center',
						    loader: false,
						    stack: false,
						});

						$("#email, #password").val('');
						window.location.href = '#login.html';
						loadPageUrl(window.location.href);

					} else if (data.success == 0) {
						$.toast({
						    text: data.message,
						    allowToastClose: false,
						    showHideTransition: 'fade',
						    position: 'bottom-center',
						    textAlign: 'center',
						    loader: false,
						    stack: false
						});
					}
				}
			}
		});

		return false;
	});

	$("#email").keyup(checkField);
	
	checkField();
	function checkField() {
		var email = $("#email").val();

		if(email.length == 0) {
			$(".reset-btn").attr('disabled', true);
		}else {
			$(".reset-btn").attr('disabled', false);
		}
	}
});
