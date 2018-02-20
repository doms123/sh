$(document).ready(function() {
	$(".users-btn").attr('data-href','#dashboard_corporate.html');
	var senderID1 = '';
	var senderID = '';
	var message_offerID = '';
	var loginUserID = localStorage.getItem("user_id");
	pageTitleAndLoader('Counter Offer');

	$(".skipButton").click(function() {
 		window.history.back();
	});

	$(".btnSendCounter").click(function() {
		var messageID 			= getParam("messageId");
		var counterOfferAmount 	= $("#counterOffer").val();
		$.ajax({
			type: 'POST',
			url: ci_base_url+'sendCounterOffer',
			dataType: "json",
			crossDomain:true, 
			beforeSend: function(){
				$(".btnSendCounter").attr('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> &nbsp;Sending');
			},
			data: {'loginUserID':loginUserID, 'messageID':messageID, 'counterOfferAmount': counterOfferAmount},
			success : function(response) {
				$(".btnSendCounter").attr('disabled', false).html('Send');
				if(response.status == 0) { // counter button should be disabled
					$.toast({
					    text: 'Cannot make multiple counter offer at a time!',
					    allowToastClose: false,
					    showHideTransition: 'fade',
					    position: 'bottom-center',
					    textAlign: 'center',
					    loader: false,
					    stack: false
					});
				}else if(response.status == 2) { // counter button should be disabled
					$.toast({
					    text: 'Cannot bid for lower than original offer!',
					    allowToastClose: false,
					    showHideTransition: 'fade',
					    position: 'bottom-center',
					    textAlign: 'center',
					    loader: false,
					    stack: false
					});
				}else if(response.status == 1) { // counter button should be disabled
					viewOfferConversation();
					$.toast({
					    text: 'Counter offer sent!',
					    allowToastClose: false,
					    showHideTransition: 'fade',
					    position: 'bottom-center',
					    textAlign: 'center',
					    loader: false,
					    stack: false
					});
				}else if(response.status == 3) { // counter button should be disabled
					$.toast({
					    text: 'You cannot negotiate a counter-offer that is lower than the original offer, lower than your previous offer amounts, or higher than the other party\'s counter-offers.',
					    allowToastClose: false,
					    showHideTransition: 'fade',
					    position: 'bottom-center',
					    textAlign: 'center',
					    loader: false,
					    stack: false,
					    hideAfter: 7000
					});
				}else if(response.status == 4) { // counter button should be disabled
					$.toast({
					    text: 'Cannot bid higher than previous offer',
					    allowToastClose: false,
					    showHideTransition: 'fade',
					    position: 'bottom-center',
					    textAlign: 'center',
					    loader: false,
					    stack: false
					});
				}else if(response.status == 5) { // counter button should be disabled
					$.toast({
					    text: 'Cannot bid for higher than any of your own previous bids',
					    allowToastClose: false,
					    showHideTransition: 'fade',
					    position: 'bottom-center',
					    textAlign: 'center',
					    loader: false,
					    stack: false
					});
				}else if(response.status == 6) { // counter button should be disabled
					$.toast({
					    text: 'Cannot bid for lower than original offer or creator previous offer',
					    allowToastClose: false,
					    showHideTransition: 'fade',
					    position: 'bottom-center',
					    textAlign: 'center',
					    loader: false,
					    stack: false
					});
				}




				$("#counterOffer").val('');	
			}
		});
	});

	$("#counterOffer").keyup(function() {
		var this_val = $(this).val();

		if(this_val != '') {
			if(!isNaN(this_val)) {
				$(".btnSendCounter").removeAttr('disabled');
			}else {
				$(".btnSendCounter").attr('disabled');
			}
			
		}else {
			$(".btnSendCounter").attr('disabled', true);
		}
	});

	function getParam(name) {
	 name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	 var regexS = "[\\?&]"+name+"=([^&#]*)";
	 var regex = new RegExp( regexS );
	 var results = regex.exec( window.location.href );
	 	if( results == null ) {
	  		return "";
		}else {
	 		return results[1];
		}
	}

	function convertDateWithSlashes(inputFormat) {
		if(inputFormat == '1970-01-01') {
			return 'N/A';
		}else {
			function pad(s) { return (s < 10) ? '0' + s : s; }
		  	var d = new Date(inputFormat);
		  	return [pad(d.getMonth()+1), pad(d.getDate()), d.getFullYear()].join('/');
	  	}
	}

	viewOfferConversation();
	function viewOfferConversation() {
		var messageID = getParam("messageId");
		$.ajax({
			type: 'POST',
			url: ci_base_url+'viewMessageCounterDetail', 
			dataType: "json",
			crossDomain:true, 
			data : {'messageID': messageID},
			success : function(data) {
				$(".sendBox").show();
				var data 	  			= data.offerDetails;
				var offerName 			= stripSlashes(data.offerName);
				var creatorName 		= stripSlashes(data.creatorName);
				var negotiatorName 		= stripSlashes(data.negotiatorName);
				var offer_obj 			= data.offerConvo;
				var html 				= '';
				var counter 			= 1;
				var removeExcessOffer 	= 0;
				var hideSendBtn			= 0;

				$(".offerTitle").html(offerName);

				function isOdd(n) {
				   return Math.abs(n % 2) == 1;
				}

				for(x = 0; x < offer_obj.length; x++) {
					html += '<div class="offerBlock">';
						html += '<h2>';
							if(isOdd(counter)) { // offer Creator
								if(offer_obj[x].fromID == loginUserID) {
									html += '<span>You</span>';
								}else {
									html += '<span>'+creatorName+'</span>';
								}
							}else { // offer Negotiator
								if(offer_obj[x].fromID == loginUserID) {
									html += '<span>You</span>';
								}else {
									html += '<span>'+negotiatorName+'</span>';
								}
							}
							html += ' - ';

							if(counter == 1) { // if 1st offer
								html += '<span>'+numberWithCommas(offer_obj[x].counterOfferAmount)+'</span>';
								if(offer_obj[x].counterOfferAccepted) {
									removeExcessOffer = 1;
								}
							}else {
								if(removeExcessOffer) {
									html += '<span>'+numberWithCommas(offer_obj[0].counterOfferAmount)+'</span>';
								}else {
									if(offer_obj[x].counterOfferAccepted) {
										html += '<span>'+numberWithCommas(offer_obj[x].counterOfferAmount)+'</span>';
									}else {
										html += '<span>'+numberWithCommas(offer_obj[x].counterOfferAmount)+'</span>';
									}
								}
							}
						html += '</h2>';
						html += '<span class="offerDate">'+convertDateWithSlashes(offer_obj[x].messageDate)+'</span>';

						if(counter == 1) { // if 1st offer
							html += '<span class="offerLabel">Original</span>';
						}else {
							if(counter == offer_obj.length) {
								html += '<span class="offerLabel">Pending</span>';
							}else {
								html += '<span class="offerLabel">Counter</span>';
							}
						}
					html += '</div>';

					if(offer_obj[x].counterOfferAccepted) {
						hideSendBtn = 1;
					}
					counter++;
				}

				if(hideSendBtn) {
					$(".sendBox").hide();
				}
				// <div class="offerBlock">
				// 	<h2>You - <span>$2,000</span></h2> 
				// 	<span class="offerDate">07/26/2017</span>
				// 	<span class="offerLabel">Counter</span>
				// </div>
				$(".offerConvoSection").html(html);
			}
		});
	}

	function checkOfferCreator() {
		$.ajax({
			type: 'GET',
			url: base_url+'message/check_offer_creator.php', 
			dataType: "jsonp",
			crossDomain:true, 
			data : {'message_offerID': message_offerID},
			success : function(data){
				if(data.creator_id != id) {
					$(".btnAccept").hide();
				}else {
					$(".btnAccept").show();
				}
			}
		});
	}

	$("body").on("touchstart, click", ".btnAccept", function() {
		var messageID = getParam("messageId");

		$.ajax({
			type: 'GET',
			url: base_url+'offers/acceptCounterOffer.php', 
			dataType: "jsonp",
			crossDomain:true, 
			beforeSend: function(){
				$('body').removeClass('loaded');
				$(".preloadLogo").show();
			},
			data: {'userid':id, 'messageID':messageID},
			success : function(response){
				$('body').addClass('loaded');
				$(".preloadLogo").fadeOut();
				console.log(response)
				if(response.success == 1) {
					setTimeout(function() {
						$(".modelText").text('Offer accepted successfully');
						$("#myModal").modal('show');
					}, 1500);

					setTimeout(function() {
						location.reload();
					}, 3500);
				}
			}
		});
	});
});
