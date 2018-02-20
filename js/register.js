$(document).ready(function(){
	pageTitleAndLoader("Register");

	$(".back_button").hide();

	$('#register').submit(function() {
		$("#confirmAcceptModal").modal("show");

		return false;
	});

	$('.register-btn').prop('disabled',true);
	emptyfield();
	function emptyfield(){
		if($('.txtname').val() == '' || $('.txtemail').val() == '' || $('.txtpass').val() == '' || $('.txtrepass').val() == '') {
		$('.register-btn').prop('disabled',true);
		}else{
			$('.register-btn').prop('disabled',false);
		}	
	}
	
	$('.txtname, .txtemail, .txtpass, .txtrepass').keyup(function(){
		emptyfield();
	});

	$(".acceptForm").submit(function() {
		var	 name 			= $('#name').val(),
			 email 			= spaceTrim($('#email').val()),
		     password 		= spaceTrim($('#password').val()),
		     re_password 	= spaceTrim($("#re_password").val());

		if($(".licenceCheck").prop('checked') == true) {
			$("#confirmAcceptModal").modal('hide');
			if(validateEmail(email)) {
				if(password.length >= 5) {
					if(password == re_password) {
						if (name != '') {
							$.ajax({
								type: 'POST',
								url: ci_base_url+'register', 
								dataType: "json",
								crossDomain:true, 
								data : {name: name, email: email, password: password},
								beforeSend: function(){
									$(".register-btn").attr('disabled', true).find("i").attr('class', 'ion-loading-a').css('top','6px');
								},
								success : function(data){
									$(".register-btn").attr('disabled', false).find("i").attr('class', 'ion-person-add').css('top','inherit');
								
									if(data.success == 2) {
										$.toast({
										    text: 'Opps! Email is already registered',
										    allowToastClose: false,
										    showHideTransition: 'fade',
										    position: 'bottom-center',
										    textAlign: 'center',
										    loader: false,
										    stack: false
										});
									}else if(data.success == 0) {
										$.toast({
										    text: 'Opps! Dont leave a blank field',
										    allowToastClose: false,
										    showHideTransition: 'fade',
										    position: 'bottom-center',
										    textAlign: 'center',
										    loader: false,
										    stack: false
										});
									}else if(data.success == 3) {
										$.toast({
										    text: 'Error! failed to send an email',
										    allowToastClose: false,
										    showHideTransition: 'fade',
										    position: 'bottom-center',
										    textAlign: 'center',
										    loader: false,
										    stack: false
										});
									}else {
										window.location.href = '#login.html';
										loadPageUrl(window.location.href);
										$("#email, #password").val('');
										$.toast({
										    text: 'Confirmation email successfully sent',
										    allowToastClose: false,
										    showHideTransition: 'fade',
										    position: 'bottom-center',
										    textAlign: 'center',
										    loader: false,
										    stack: false,  
										});
									}
								}
							});
						}else{
							$.toast({
							    text: 'Name field is required',
							    allowToastClose: false,
							    showHideTransition: 'fade',
							    position: 'bottom-center',
							    textAlign: 'center',
							    loader: false,
							    stack: false
							});
						}
					}else {
						$.toast({
						    text: 'Confirm password does not match',
						    allowToastClose: false,
						    showHideTransition: 'fade',
						    position: 'bottom-center',
						    textAlign: 'center',
						    loader: false,
						    stack: false
						});
					}
				}else {
					$.toast({
					    text: 'Password is too short, minimum length is 5 characters',
					    allowToastClose: false,
					    showHideTransition: 'fade',
					    position: 'bottom-center',
					    textAlign: 'center',
					    loader: false,
					    stack: false
					});
				}
			}else{
				$.toast({
				    text: 'Invalid email address',
				    allowToastClose: false,
				    showHideTransition: 'fade',
				    position: 'bottom-center',
				    textAlign: 'center',
				    loader: false,
				    stack: false
				});
			}
		}else {
			$.toast({
			    text: 'You must agree with the terms and conditions',
			    allowToastClose: false,
			    showHideTransition: 'fade',
			    position: 'bottom-center',
			    textAlign: 'center',
			    loader: false,
			    stack: false
			});
		}

		return false;
	});
})