$(document).ready(function(){
	var email = localStorage.getItem("UserEmail");
	var id = localStorage.getItem("user_id");
	$(".page-title").text("Security");

	
	$('#reset-pass').submit(function(e) {
	    oldpass = $('#oldpass').val().replace(/\s/g, ''),
	    confirm_newpass = $('#confirm-newpass').val().replace(/\s/g, ''),
	    newpass = $('#newpass').val().replace(/\s/g, '');
	    $.ajax({
	    	type: 'POST',
	    	url: ci_base_url + 'changePassword',
	    	dataType: 'json',
	    	crossDomain: true,
	    	data: {email : email, oldPass : oldpass, confirmPass: confirm_newpass, newPass: newpass},
	    	beforeSend: function(){
	    		$(".reset-btn").attr('disabled', true).find('i').attr('class', 'ion-loading-c').css('top','6px');
	    	},
	    	success: function(data) {
	    		$(".reset-btn").find('i').attr('class', 'ion-refresh').css('top','inherit');
				if(data.success == 1) {
					localStorage.removeItem("UserEmail");
					localStorage.removeItem("user_id");
					localStorage.removeItem("role");
					   $("#oldpass, #confirm-newpass, #newpass").val('');
					$.toast({
					    text: 'Reset successful, you will be logout . . .',
					    allowToastClose: false,
					    showHideTransition: 'fade',
					    position: 'bottom-center',
					    textAlign: 'center',
					    loader: true,
					    stack: false,
					    afterHidden: function () {
					    	window.location.href = '#login.html';
					    	loadPageUrl(window.location.href);
					    }
					});
				}else if(data.success == 2) {
					$.toast({
					    text: 'Password is too short, minimum length is 5 characters',
					    allowToastClose: false,
					    showHideTransition: 'fade',
					    position: 'bottom-center',
					    textAlign: 'center',
					    loader: false,
					    stack: false
					});
				}else if(data.success == 3) {
					$.toast({
					    text: 'Password does not match the confirm password',
					    allowToastClose: false,
					    showHideTransition: 'fade',
					    position: 'bottom-center',
					    textAlign: 'center',
					    loader: false,
					    stack: false
					});
				}else if(data.success == 4) {
					$.toast({
					    text: 'Incorrect old password',
					    allowToastClose: false,
					    showHideTransition: 'fade',
					    position: 'bottom-center',
					    textAlign: 'center',
					    loader: false,
					    stack: false
					});
				}
	    	}
	    });
	    return false;
	});

	// if empty field 
	$('.reset-btn').prop('disabled',true);

	emptyfield();
	function emptyfield(){
		if($('#oldpass').val() == '' || $('#confirm-newpass').val() == '' || $('#newpass').val() == '') {
		$('.reset-btn').prop('disabled',true);
		}else{
			$('.reset-btn').prop('disabled',false);
		}	
	}
	

	$('#oldpass, #confirm-newpass, #newpass').keyup(function(){
		emptyfield();
	});
	// if empty field

});