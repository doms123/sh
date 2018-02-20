$(document).ready(function() {

		document.addEventListener('deviceready', function () {
	    	cordova.plugins.notification.badge.clear();
		}, false);

	$(".page-title").text('Welcome To SellingHive');
	var myParam = location.search.split('successreg=')[1] ? location.search.split('successreg=')[1] : 0;

	if(myParam == 1) {
		setTimeout(function() {
			$("#myModal").modal('show');
			$(".modelText").text('Email verification sent, you can now check your email to activate your account');
		}, 2000);
		setTimeout(function() {
			window.location = "index.html";
		}, 5000);
	}

	$("#page-header").find(".type").text(localStorage.getItem("role"));

	loadRemember();
	function loadRemember() {
		if (typeof(Storage) !== "undefined") {
			if (localStorage.getItem("remember_email") !== null) {
				var priv_email = localStorage.getItem("remember_email");
				var priv_pass = localStorage.getItem("remember_private");
			  	$("#email").val(priv_email);
			  	$("#password").val(priv_pass);
			  	$('#rememberCheck').attr('checked', true);
			}else {
				$("#email").val('');
				$("#password").val('');
				$('#rememberCheck').attr('checked', false);
			}
		}
	}

	$(".loginFbBtn").click(login);
	$(".loginGoogleBtn").click(callGoogle);
	$('form#sigin').submit(function() {
		var email = spaceTrim($('#email').val()),
		password = spaceTrim($('#password').val()),
		rememberCheck = $("#rememberCheck").is(":checked");
		$.ajax({
			type: "POST",
			url: ci_base_url+'login', 
			dataType: "json",
			crossDomain: true,
			data : {email: email, password: password},
			beforeSend: function(){
				$(".loginBtn").attr('disabled', true).find("i").attr('class', 'ion-loading-a').css('top','6px');
			},
			success : function(response) {
				$(".loginBtn").attr('disabled', false).find("i").attr('class', 'ion-log-in').css('top','inherit');
				if(validateEmail(email)) {
					if(response.status == 'Success') {
						if(rememberCheck == true) {
							if (typeof(Storage) !== "undefined") {
								localStorage.setItem("remember_email", email);
								localStorage.setItem("remember_private", password);
							}
						}else {
							localStorage.removeItem("remember_email");
							localStorage.removeItem("remember_private");
						}

					    localStorage.setItem("UserEmail", email);
					    localStorage.setItem("user_id", response.key);
					    localStorage.setItem("role", response.role);
					    localStorage.setItem("userPriv", response.userPriv);
					    $(".preloader").hide();
						window.location.href = '#dashboard_corporate.html';
						loadPageUrl(window.location.href);
					}else {
						$.toast({
						    text: 'Incorrect Email or Password',
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
					    text: 'Invalid email address',
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

	/* FACEBOOK LOGIN */

	// Defaults to sessionStorage for storing the Facebook token
	 openFB.init({appId: '528314980661545'});

	//  Uncomment the line below to store the Facebook token in localStorage instead of sessionStorage
	 openFB.init({appId: '528314980661545', tokenStore: window.localStorage});

	function login() {
		openFB.login(
	        function(response) {
	            if(response.status === 'connected') {
	                getInfo(response.authResponse.accessToken);
	                // alert('Facebook login succeeded, got access token: ' + response.authResponse.accessToken);
	            } else {
	               // alert('Facebook login failed: ' + response.error);
	            }
	        }, {scope: 'email,publish_actions'}
	    );
	}

	function getInfo(fbtoken) {
	    openFB.api({
			path: '/v2.8/me',
            params: { "access_token": fbtoken, "fields":"id,name,email" },
	        success: function(data) {
	            console.log(JSON.stringify(data));
	            // $("#sh_content").css('visibility', 'hidden');
				// $(".preloader").fadeIn('fast');
	            check_fbid_exist(data.id, data.name, fbtoken, data.email);
	            // document.getElementById("userName").innerHTML = data.name;
	            // document.getElementById("userPic").src = 'http://graph.facebook.com/' + data.id + '/picture?type=small';
	        },
	        error: errorHandler}
	    );
	}

	function check_fbid_exist(fbid, fbusername, fbtoken, email) {
	    $.ajax({
	        type: 'POST',
	       	url: ci_base_url+'checkFbExist', 
	       	dataType: "json",
	       	crossDomain: true,
	        data: {'fbid':fbid, 'email':email},
	        success: function(data) {
	           if(data.success == 1) { // if record exist in the database
	                get_user_rec(fbid, email);
	           }else { 
	                reg_fb_user(fbid, fbusername, fbtoken, email);
	           }
	        }
	    }); 
	}

	function reg_fb_user(fbid, fbusername, fbtoken, email) {
	    $.ajax({
	        type: 'POST', 
	        url: ci_base_url+'registerFbUser', 
	        dataType: "json",
	        crossDomain:true, 
	        data: {'fbid':fbid, 'fbusername':fbusername, 'fbtoken':fbtoken, 'fbemail':email},
	        success: function(data) {
	           if(data.success == 1) {
	                get_user_rec(fbid, email);
	           }
	        }
	    });  
	}

	function get_user_rec(fbid, email) {
	    $.ajax({
	        type: 'POST',
	        url: ci_base_url+'userRecord', 
	        dataType: "json",
	        crossDomain:true, 
	        data: {'fbid':fbid, 'email': email},
	        success : function(response) {
	            if (response.status == 'Success') {
				    localStorage.setItem("UserEmail", email);
				    localStorage.setItem("user_id", response.key);
					localStorage.setItem("userPriv", response.userPriv);

	                window.location.href = '#dashboard_corporate.html';
	                loadPageUrl(window.location.href);
	            }
	        }
	    });  
	}

	function logout() {
    	openFB.logout(
            function() {

            },
            errorHandler
        );
	}

	function errorHandler(error) {

	}

	// if empty field 
	$('.loginBtn').prop('disabled',true);

	emptyfield();
	function emptyfield(){
		if($('.txtemail').val() == '' || $('.txtpassword').val() == '') {
		$('.loginBtn').prop('disabled',true);
		}else{
			$('.loginBtn').prop('disabled',false);
		}	
	}
	
	$('.txtemail, .txtpassword').keyup(function(){
		emptyfield();
	});
});

/* GOOGLE LOGIN */

 function isAvailable() {
    window.plugins.googleplus.isAvailable(function(avail) {
		// alert(avail)
	});
  }

function callGoogle() {
	window.plugins.googleplus.logout(
	    function (msg) {
	      
	    }
	);
	window.plugins.googleplus.login(
	    {},
	    function (obj) {

	      check_gmail_exist(obj.displayName, obj.email);

	      $("#sh_content").css('visibility', 'hidden');
	      $(".preloader").fadeIn('fast');
	      
	    },
	    function (msg) {
	    }
	);
}

  window.onerror = function(what, line, file) {
  };
  function handleOpenURL (url) {
  }

function check_gmail_exist(g_name, g_email) {
    $.ajax({
        type: 'POST',
        url: ci_base_url+'checkGmailExist', 
        dataType: "json",
        crossDomain:true, 
        data: {'g_email':g_email},
        success: function(data) {
           if(data.success == 1) { // if record exist in the database
                get_user_rec_email(g_email);
           }else { 
                reg_gmail_user(g_name, g_email);
           }
        }
    }); 
}

function get_user_rec_email(g_email) {
    $.ajax({
        type: 'POST',
        url: ci_base_url+'userGoogleRecord', 
        dataType: "json",
        crossDomain:true, 
        data: {'g_email':g_email},
        success : function(response) {
            if (response.status == 'Success') {
			    localStorage.setItem("UserEmail", response.email);
			    localStorage.setItem("user_id", response.key);
			    localStorage.setItem("userPriv", response.userPriv);
			    window.location.href = '#dashboard_corporate.html';
			    loadPageUrl(window.location.href);
			}
        }
    });  
}

function reg_gmail_user(g_name, g_email) {
    $.ajax({
        type: 'POST',
        url: ci_base_url+'registerGmailAccount', 
        dataType: "json",
        crossDomain:true, 
        data: {'g_email':g_email, 'g_name' : g_name},
        success: function(data) {
           if(data.success == 1) {
                get_user_rec_email(g_email);
           }
        }
    });  
}


