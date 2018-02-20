$(document).ready(function() {
	var loginUserID = localStorage.getItem("user_id");
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

	var messageID = getParam("message_id");
	pageTitleAndLoader('Counter Offer');

	viewOfferConversation();
	function viewOfferConversation() {
		$.ajax({
			type: 'POST',
			url: ci_base_url+'viewMessageCounterDetail', 
			dataType: "json",
			crossDomain:true, 
			data : {'messageID': messageID},
			success : function(data) {
				console.log('data', data);
				$(".sendBox").show();
				var data 	  			= data.offerDetails;
				var offerName 			= data.offerName;
				var creatorName 		= stripSlashes(data.creatorName);
				var creatorAlias 		= stripSlashes(data.creatorAlias);
				var negotiatorName 		= stripSlashes(data.negotiatorName);
				var negotiatorAlias 		= stripSlashes(data.negotiatorAlias);
				var offerCreatorId      = data.offerCreatorId;
				var offerNegotiatorId   = data.offerNegotiatorId;
				var offer_obj 			= data.offerConvo;
				var offerTerm			= stripSlashes(data.offerTerm);
				var offerAmount  		= data.offerAmount;
				var html 				= '';
				var counter 			= 1;
				var removeExcessOffer 	= 0;
				var hideSendBtn			= 0;
				var profileId;
				var profileName;
				var profileAlias;
				if(loginUserID == offerCreatorId) {
					profileId = offerNegotiatorId;
				}else {
					profileId = offerCreatorId;
				}

				if(loginUserID == offerCreatorId) {
					profileName = negotiatorName;
					profileAlias = negotiatorAlias;
				}else {
					profileName = creatorName;
					profileAlias = creatorAlias;
				}

				$(".offerTitle").html(offerName);

				if(profileAlias == null || profileAlias == "") {
					$(".negotiatorName").html(profileName);
				}else {
					$(".negotiatorName").html(profileAlias);
				}
				

				$(".negoProfile").attr('profileid', profileId);
				$(".origAmount").html('$'+numberWithCommas(offerAmount));
				$(".offTitle").html(offerName);
				$(".term").html(offerTerm);

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
									if(creatorAlias == null || creatorAlias == "") {
										html += '<span>'+creatorName+'</span>';
									}else {
										html += '<span>'+creatorAlias+'</span>';
									}
								}
							}else { // offer Negotiator
								if(offer_obj[x].fromID == loginUserID) {
									html += '<span>You</span>';
								}else {
									if(negotiatorAlias == null || negotiatorAlias == "") {
										html += '<span>'+negotiatorName+'</span>';
									}else {
										html += '<span>'+negotiatorAlias+'</span>';
									}
								}
							}
							html += ' - ';

							if(counter == 1) { // if 1st offer
								html += '<span>$'+numberWithCommas(offer_obj[x].counterOfferAmount)+'</span>';
								if(offer_obj[x].counterOfferAccepted) {
									removeExcessOffer = 1;
								}
							}else {
								if(removeExcessOffer) {
									html += '<span>$'+numberWithCommas(offer_obj[0].counterOfferAmount)+'</span>';
								}else {
									if(offer_obj[x].counterOfferAccepted) {
										html += '<span>$'+numberWithCommas(offer_obj[x].counterOfferAmount)+'</span>';
									}else {
										html += '<span>$'+numberWithCommas(offer_obj[x].counterOfferAmount)+'</span>';
									}
								}
							}
						html += '</h2>';
						html += '<span class="offerDate">'+offer_obj[x].mdate+'</span>';

						if(counter == 1) { // if 1st offer
							html += '<span class="offerLabel">Original</span>';
						}else {
							if(counter == offer_obj.length) {
								if(offer_obj[x].counterOfferAccepted) {
									html += '<span class="offerLabel">Agreed</span>';
								}else {
									html += '<span class="offerLabel">Pending</span>';
								}
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

				$(".offerConvoSection").html(html);
			}
		});
	}

	$("body").on("click", ".acceptOfferBtn", function() {
		$("#confirmAcceptModal").modal('show');
	});


	$("body").on("click", ".negoProfile", function() {
		var profileid = $(this).attr("profileid");
		window.location.href = '#view_profile.html?id='+profileid;
		loadPageUrl(window.location.href);
	});
	

	$(".acceptForm").submit(function() {
		if($(".licenceCheck").prop('checked') == true) {
			$("#confirmAcceptModal").modal('hide');
			$.ajax({
				type: 'POST',
				url: ci_base_url+ 'acceptOffer',
				dataType: "json",
				crossDomain:true, 
				beforeSend: function(){
					$(".offerBtns button").attr('disabled', true);
				},
				data: {'userID':loginUserID, 'messageID':messageID},
				success : function(response) {
					history.back();
					setTimeout(function() {
						loadPageUrl(window.location.href);
					}, 200);

					$.toast({
					    text: 'Offer Accepted',
					    allowToastClose: false,
					    showHideTransition: 'fade',
					    position: 'bottom-center',
					    textAlign: 'center',
					    loader: false,
					    stack: false
					});
				}
			});
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

	$(".btnSendCounter").click(function() {
		var counterOfferAmount 	= $("#counterOffer").val();
		$.ajax({
			type: 'POST',
			url: ci_base_url+'sendCounterOffer',
			dataType: "json",
			crossDomain:true, 
			beforeSend: function() {
				$(".offerBtns button, .btnSendCounter").attr('disabled', true);
				$(".btnSendCounter").find("i").attr('class', 'ion-loading-a').css('top','6px');
			},
			data: {'loginUserID':loginUserID, 'messageID':messageID, 'counterOfferAmount': counterOfferAmount},
			success : function(response) {
				$(".offerBtns button, .btnSendCounter").attr('disabled', false);
				$(".btnSendCounter").find("i").attr('class', 'ion-paper-airplane').css('top','inherit');
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

				$(".btnSendCounter").attr('disabled', true);
				$("#counterOffer").val('');	
			}
		});
	});

	$(".skipBtn").click(function() {
		history.back();

		setTimeout(function() {
			loadPageUrl(window.location.href);
		}, 200);
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

	function convertDateWithSlashes(inputFormat) {
		if(inputFormat == '1970-01-01') {
			return 'N/A';
		}else {
			function pad(s) { return (s < 10) ? '0' + s : s; }
		  	var d = new Date(inputFormat);
		  	return [pad(d.getMonth()+1), pad(d.getDate()), d.getFullYear()].join('/');
	  	}
	}

	updateOfferRead();
	function updateOfferRead() {
		$.ajax({
			type: 'POST',
			url: ci_base_url + 'updateOfferRead',
			data: {'messageId': messageID, 'userId': loginUserID},
			success: function(data) {}
		});
	}
});