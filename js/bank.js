$(document).ready(function() {
	var id = localStorage.getItem("user_id");
	var email = localStorage.getItem("UserEmail");
	
	$(".page-title").text("PAYPAL");

	// var jroll = new JRoll("#inboxWrap", {
 //      scrollBarY: false
 //    });

 //    jroll.pulldown({
 //      	refresh: function(complete) {
 //      		pulldown = 1;
	// 		$(".bankBody").html('<tr><td rowspan="3" class="loadingMsg"><i class="ion-loading-a"></i> &nbsp;Loading . . .</td></tr>');
	// 		paymentTransact();
 //      		complete();
 //      	}
 //    });

	paymentTransact();
	function paymentTransact() {
		$.ajax({
			type: 'POST',
			url: ci_base_url+'paymentTransact',
			dataType: "json",
			crossDomain:true, 
			data: {'userId': id},
			success: function(data) {
				var data = data.result;
				var maxLoop = data.length;
				var html = '';

				if(maxLoop == 0) {
					for(x = 0; x < maxLoop; x++) {		
						html += '<tr data-id="'+data[x].offerAcceptedID+'">';
							if(data[x].offer_creator_id == id) { // you are the payment sender
								if(data[x].negotiatorPhoto == null || data[x].negotiatorPhoto == '') {
									html += '<td><span class="noPhoto">'+data[x].negotiatorName.charAt(0)+'</span></td>';
								}else {
							  		html += '<td><img src="https://sellinghive.applite.com/ci_upload/w45_'+data[x].negotiatorPhoto+'"></td>';
							  	}
							}else {
						  		if(data[x].creatorPhoto == null || data[x].creatorPhoto == '') {
						  			html += '<td><span class="noPhoto">'+data[x].creatorName.charAt(0)+'</span></td>';
						  		}else {
						  	  		html += '<td><img src="https://sellinghive.applite.com/ci_upload/w45_'+data[x].creatorPhoto+'"></td>';
						  	  	}
							}
							

							html += '<td>';
								html += '<h6>'+data[x].acceptedOfferName+'</h6>';
								if(data[x].offer_creator_id == id) { // you are the payment sender
									html += '<p>Payment has been sent</p>';
								}else {
									html += '<p>Payment has been received</p>';
								}
							html += '</td>';
							html += '<td>'+data[x].dateFormatted+'</td>';
						html += '</tr>';
					}
				}else {
					html += '<tr><td rowspan="3" class="loadingMsg">No payment transactions yet.</td></tr>';
				}
				$(".bankBody").html(html);

				//jroll.refresh();
			}
		});
	}

	$(".bankBody").on("click", "tr", function() {
		var trasactionId = $(this).attr("data-id");
		if(trasactionId > 0) {
			window.location.href = '#transaction_detail.html?detail='+trasactionId;
			loadPageUrl(window.location.href);
		}
	});

	$(".editEmail").click(function() {
		$("#editEmailModal").modal("show");
	});


	defaultEmailForPaypal();
	function defaultEmailForPaypal() {
		$.ajax({
			type: 'POST',
			url: ci_base_url+'defaultEmailForPaypal',
			dataType: "json",
			crossDomain:true, 
			data: {'userId': id, 'userEmail': email},
			success: function(data) {
				$(".txtemail").val(stripSlashes(data.email));
			}
		});
	}

	function validateEmail(email) {
	    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(email);
	}

	$(".editEmailForm").submit(function() {
		var userEmail = stripSlashes($(this).find(".txtemail").val());
		
		if(validateEmail(userEmail)) {
			$.ajax({
				type: 'POST',
				url: ci_base_url+'editEmail',
				dataType: "json",
				crossDomain:true, 
				data: {'userId': id, 'userEmail': userEmail},
				success: function(data) {
					if(data.success == 1) {
						$.toast({
							text: 'Email was saved',
							allowToastClose: false,
							showHideTransition: 'fade',
							position: 'bottom-center',
							textAlign: 'center',
							loader: false,
							stack: false,
						});
					}
					$("#editEmailModal").modal("hide");
					defaultEmailForPaypal();
				}
			});
		}else {
			$.toast({
				text: 'Error! invalid email address',
				allowToastClose: false,
				showHideTransition: 'fade',
				position: 'bottom-center',
				textAlign: 'center',
				loader: false,
				stack: false,
			});
		}
	
		return false;
	});
});