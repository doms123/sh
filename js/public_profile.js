$(function() {
	pageTitleAndLoader('Profile');
	var id = localStorage.getItem("user_id");
	$(".hiddenUserId").val(id);

	$(document).on('click touchstart', '.publicPhoto img, .publicPhoto i', function(e){
  		$(".profilePhoto").trigger('click');
	});

	$(document).on('click touchstart', '.privatePhoto img, .privatePhoto i', function(e){
  		$(".privProfilePhoto").trigger('click');
	});

	$(".profilePhoto").change(function() {
		if($(this).val() != '') {
			$(".profileUploadForm").submit();
		}
	});

	$(".privProfilePhoto").change(function() {
		if($(this).val() != '') {
			$(".privProfileUploadForm").submit();
		}
	});

	$(".publicBtn, .privateBtn").click(function() {
		var type = $(this).attr("data-type");
		$(".publicBtn, .privateBtn").removeClass("active");
		$(this).addClass("active");

		if(type == "public") {
			$(".privateProfile, .privatePhoto").hide();
			$(".publicProfile, .publicPhoto").show();
		}else {
			$(".publicProfile, .publicPhoto").hide();
			$(".privateProfile, .privatePhoto").show();
		}
	});


	$(".profileUploadForm").submit(function() {
		var formData = new FormData(this);
		$.ajax({
			type: 'POST',
			url: ci_base_url + 'profilePhotoUpload',
			dataType: 'json',
			contentType: false,
			processData: false,
			crossDomain:true,
			data: formData,			
			beforeSend: function() {
				$(".profilePic").find("i").attr('class', 'ion-loading-a').css({
					'right': 0,
					'width': '22.5px',
					'margin': 'auto',
					'left': 0,
					'top': 0,
					'bottom': 0,
					'height': '31px'
				});
				$(".profilePic").find("img").css('opacity', '.7');
			},
			success: function(data) {
				console.log('data', data)
				$(".profilePic").find("i").attr('class', 'ion-camera').removeAttr('style');
				$(".profilePic").find("img").removeAttr('style');
				
				if(data.success == 1) {
					viewProfileInfo();
					$.toast({
					    text: 'Photo has been successfully updated',
					    allowToastClose: false,
					    showHideTransition: 'fade',
					    position: 'bottom-center',
					    textAlign: 'center',
					    loader: false,
					    stack: false
					});
				}else {
					$.toast({
					    text: 'Upload failed, accepted formats are: jpg, png and gif only.',
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

	$(".privProfileUploadForm").submit(function() {
		var formData = new FormData(this);
		$.ajax({
			type: 'POST',
			url: ci_base_url + 'privProfilePhotoUpload',
			dataType: 'json',
			contentType: false,
			processData: false,
			crossDomain:true,
			data: formData,			
			beforeSend: function() {
				$(".profilePic").find("i").attr('class', 'ion-loading-a').css({
					'right': 0,
					'width': '22.5px',
					'margin': 'auto',
					'left': 0,
					'top': 0,
					'bottom': 0,
					'height': '31px'
				});
				$(".profilePic").find("img").css('opacity', '.7');
			},
			success: function(data) {
				console.log('data', data);
				$(".profilePic").find("i").attr('class', 'ion-camera').removeAttr('style');
				$(".profilePic").find("img").removeAttr('style');
				
				if(data.success == 1) {
					viewProfileInfo();
					$.toast({
					    text: 'Photo has been successfully updated',
					    allowToastClose: false,
					    showHideTransition: 'fade',
					    position: 'bottom-center',
					    textAlign: 'center',
					    loader: false,
					    stack: false
					});
				}else {
					$.toast({
					    text: 'Upload failed, accepted formats are: jpg, png and gif only.',
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

	viewProfileInfo();
	function viewProfileInfo() {
		$.ajax({
			type: 'POST',
			url: ci_base_url + 'viewProfileInfo',
			dataType: 'json',
			crossDomain:true,
			data: {'userId': id},
			success: function(data) {
				var data = data.result;
				if(data.photo != null && data.photo != '') {
					$(".publicPhoto img").attr('src', rootDir+'ci_upload/w131_'+data.photo);
				}
				
				if(data.privPhoto != null && data.photo != '') {
					$(".privatePhoto img").attr('src', rootDir+'ci_upload/w131_'+data.privPhoto);
				}
				
				$(".tempValue").html(data.name);
				$(".corporateName").val(stripSlashes($(".tempValue").text()));

				$(".tempValue").html(data.alias);
				$(".nickName").val(stripSlashes($(".tempValue").text()));

				$(".tempValue").html(data.contact_email);
				$(".emailAdd").val(stripSlashes($(".tempValue").text()));

				$(".tempValue").html(data.url);
				$(".webUrl").val(stripSlashes($(".tempValue").text()));

				$(".tempValue").html(data.phonenumber);
				$(".primaryPhoneNumber").val(stripSlashes($(".tempValue").text()));

				$(".tempValue").html(data.about);
				$(".about").val(stripSlashes($(".tempValue").text()));

				$(".tempValue").html(data.privCorporateName);
				$(".privCorporateName").val(stripSlashes($(".tempValue").text()));

				$(".tempValue").html(data.priveintaxid);
				$(".priveintaxid").val(stripSlashes($(".tempValue").text()));

				$(".tempValue").html(data.privphoneNumber);
				$(".privPhoneNumber").val(stripSlashes($(".tempValue").text()));

				$(".tempValue").html(data.privAddress);
				$(".privAddress").val(stripSlashes($(".tempValue").text()));
			}
		});
	}

	$(".updateProfile").click(function() {
		var corporateName 		= $(".corporateName").val();
		var nickName 			= $(".nickName").val();
		var emailAdd 			= $(".emailAdd").val();
		var webUrl 				= $(".webUrl").val();
		var primaryPhoneNumber 	= $(".primaryPhoneNumber").val();
		var about 				= $(".about").val();
		var privCorporateName	= $(".privCorporateName").val();
		var priveintaxid		= $(".priveintaxid").val();
		var privPhoneNumber 	= $(".privPhoneNumber").val();
		var privAddress			= $(".privAddress").val();
		validEmail = 0;

		if(emailAdd == '') {
			validEmail = 1;
		}else {
			if(validateEmail(emailAdd)) {
				validEmail = 1;
			}else {
				validEmail = 0;
			}
		}

		if(validEmail == 1) {
			$.ajax({
				type: 'POST',
				url: ci_base_url + 'updateProfile',
				dataType: 'json',
				crossDomain:true,
				data: {
						'userId': id, 
						'corporateName':corporateName, 
						'nickName':nickName, 
						'emailAdd':emailAdd, 
						'webUrl':webUrl, 
						'primaryPhoneNumber':primaryPhoneNumber, 
						'about':about,
						'privCorporateName':privCorporateName,
						'priveintaxid':priveintaxid,
						'privPhoneNumber':privPhoneNumber,
						'privAddress':privAddress
					},
				beforeSend: function() {
					$(".updateProfile").find('i').attr('class', 'ion-loading-c').css('top', '6px').parent().attr('disabled', true);
				},
				success: function(data) {
					$(".updateProfile").find('i').attr('class', 'ion-compose').css('top', 'inherit').parent().attr('disabled', false);
					if(data.success == 1) {
						viewProfileInfo();
						$.toast({
						    text: 'Profile information has been successfully updated',
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
		
	});
});