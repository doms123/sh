$(document).ready(function() {
	var loginUserID = localStorage.getItem("user_id");
	var loginUserEmail = localStorage.getItem("UserEmail");
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
	pageTitleAndLoader('Todo Details');

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
		$.ajax({
			type: 'POST',
			url: ci_base_url+'viewMessageCounterDetail', 
			dataType: "json",
			crossDomain:true, 
			data : {'messageID': messageID},
			success : function(data) {
				console.log('datadatadatadata', data);
				$(".sendBox").show();
				var data 	  			= data.offerDetails;
				var offerName 			= stripSlashes(data.offerName);
				var creatorName 		= stripSlashes(data.creatorName);
				var creatorAlias 		= stripSlashes(data.creatorAlias);
				var negotiatorName 		= stripSlashes(data.negotiatorName);
				var negotiatorAlias 	= stripSlashes(data.negotiatorAlias);
				var offerCreatorId      = data.offerCreatorId;
				var offerNegotiatorId   = data.offerNegotiatorId;
				var offerAmount  		= stripSlashes(data.offerAmount);
				var offerTerm			= stripSlashes(data.offerTerm);
				var offer_obj 			= data.offerConvo;
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

				$(".offerIdHidden").val(data.offerId);
				$(".creatorIdHidden").val(offerCreatorId);

				$(".offerTitle").html(offerName);

				if(profileAlias == null || profileAlias == '') {
					$(".negotiatorName").html(profileName);
				}else {
					$(".negotiatorName").html(profileAlias);
				}

				$(".negoProfile").attr('profileid', profileId);
				$(".offTitle, .taskName").html(offerName);
				if(creatorAlias == null || creatorAlias == "") {
					$(".offCreator, .creatorName").html(creatorName);
				}else {
					$(".offCreator, .creatorName").html(creatorAlias);
				}
				$(".creatorNameLink").attr('href', '#user_review.html?userid='+offerCreatorId+'&offerid='+data.offerId);
				$(".negotiatorNameLink").attr('href', '#user_review.html?userid='+offerNegotiatorId+'&offerid='+data.offerId);

				if(negotiatorAlias == null || negotiatorAlias == "") {
					$(".offNegotiator, .negotiatorName").html(negotiatorName);
				}else {
					$(".offNegotiator, .negotiatorName").html(negotiatorAlias);
				}

				$(".origAmount").html('$'+numberWithCommas(offerAmount));
				$(".offerTitle").html(offerName);
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
								if(offer_obj[x].fromID == id) {
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
								html += '<span class="amount">$'+numberWithCommas(offer_obj[x].counterOfferAmount)+'</span>';
								if(offer_obj[x].counterOfferAccepted) {
									removeExcessOffer = 1;
								}
							}else {
								if(removeExcessOffer) {
									html += '<span class="amount">$'+numberWithCommas(offer_obj[0].counterOfferAmount)+'</span>';
								}else {
									if(offer_obj[x].counterOfferAccepted) {
										html += '<span class="amount">$'+numberWithCommas(offer_obj[x].counterOfferAmount)+'</span>';
									}else {
										html += '<span class="amount">$'+numberWithCommas(offer_obj[x].counterOfferAmount)+'</span>';
									}
								}
							}
						html += '</h2>';
						html += '<span class="offerDate">'+offer_obj[x].mdate+'</span>';

						if(counter == 1) { // if 1st offer
							if(offer_obj.length == 1) {
								html += '<span class="offerLabel agreedOffer">Agreed</span>';
							}else {
								html += '<span class="offerLabel">Original</span>';
							}
						}else {
							if(counter == offer_obj.length) {
								if(offer_obj[x].counterOfferAccepted) {
									html += '<span class="offerLabel agreedOffer">Agreed</span>';
								}else {
									if(data.convoCount == 2 || data.isAccepted == 1){
										html += '<span class="offerLabel agreedOffer">Agreed</span>';
									}else {
										html += '<span class="offerLabel">Pending</span>';
									}
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

				var agreedDate = $(".agreedOffer").parent().find(".offerDate").text();
				var agreedAmount =  $(".agreedOffer").parent().find(".amount").text();
				$(".offerAgreed").html(agreedDate);
				$(".offAmount").html(numberWithCommas(agreedAmount));
			}
		});
	}

	loadTodo();
	function loadTodo() {
		$.ajax({
			type: 'POST',
			url: ci_base_url + 'loadAcceptedTodo',
			data: {'messageId': messageID, 'userId': id},
			success: function(data) {
				var data = data.result;
				console.log('data', data);
				defaultEmailForPaypal(data.todo_userid, data.negotiatorEmail);
				
				if(data.is_paid == 1) {
					window.location.href = '#dashboard_corporate.html';
					loadPageUrl(window.location.href);
				}

				$(".paymentHidden").val(data.acceptedOfferAmount);
				$(".offerAcceptedHidden").val(data.offerAcceptedId);
	
				if(data.offerAddedByID == loginUserID) { // you are the offer Creator
					var html = '';
					html += '<p>';
						if(data.creatorAlias == null || data.creatorAlias == "") {
							html += '<span class="offCreator">'+data.creatorName+'</span>';
						}else {
							html += '<span class="offCreator">'+data.creatorAlias+'</span>';
						}
						
						if(data.offererAccepted == 0) {
							html += '<span class="checkbox"><input type="checkbox" id="creatorCheck" data-id="'+data.todo_id+'"><label for="creatorCheck"></label></span>';
						}else {
							html += '<span> - '+data.tododate1+'</span><span class="checkbox"><input type="checkbox" checked id="creatorCheck" data-id="'+data.todo_id+'"><label for="creatorCheck"></label></span>';
						}
					html += '</p>';

					html += '<p>';
						if(data.negotiatorAlias == null || data.negotiatorAlias == "") {
							html += '<span class="offNegotiator">'+data.negotiatorName+'</span>';
						}else {
							html += '<span class="offNegotiator">'+data.negotiatorAlias+'</span>';
						}
		
						if(data.offereeAccepted == 0) {
							html += '<span class="checkbox pending mt8">pending</span>';
						}else {
							html += '<span> - '+data.tododate1+'</span><span class="checkbox"><i class="ion-checkmark-circled green"></i></span>';
						}
					html += '</p>';
					$(".signBoxContent").html(html);
				}else {
					var html = '';
					html += '<p>';
						if(data.creatorAlias == null || data.creatorAlias == "") {
							html += '<span class="offCreator">'+data.creatorName+'</span>';
						}else {
							html += '<span class="offCreator">'+data.creatorAlias+'</span>';
						}
						if(data.offererAccepted == 0) {
							html += '<span class="checkbox pending">pending</span>';
						}else {
							html += '<span> - '+data.tododate1+'</span><span class="checkbox"><i class="ion-checkmark-circled green"></i></span>';
						}
					html += '</p>';

					html += '<p>';
						if(data.negotiatorAlias == null || data.negotiatorAlias == "") {
							html += '<span class="offNegotiator">'+data.negotiatorName+'</span>';
						}else {
							html += '<span class="offNegotiator">'+data.negotiatorAlias+'</span>';
						}
					
						if(data.offereeAccepted == 0) {
							html += '<span class="checkbox"><input type="checkbox" id="negotiatorCheck" data-id="'+data.todo_id+'"><label for="negotiatorCheck"></label></span>';
						}else {
							if(data.offererAccepted == 1) {
								html += '<span> - '+data.tododate1+'</span><span class="checkbox"><i class="ion-checkmark-circled green"></i></span>';
							}else {
								html += '<span> - '+data.tododate1+'</span><span class="checkbox"><input type="checkbox" checked id="negotiatorCheck" data-id="'+data.todo_id+'"><label for="negotiatorCheck"></label></span>';
							}
						}
					html += '</p>';
					$(".signBoxContent").html(html);
				}

				if(data.offereeAccepted == 1 && data.offererAccepted == 1) { // show review link
					$(".reviewWrap .default").hide();
					$(".reviewWrap .accepted").show();

					if(data.offerAddedByID == loginUserID) { 
						$(".payButton").show();
					}
				}else {
					$(".reviewWrap .accepted, .payButton").hide();
					$(".reviewWrap .default").show();
				}

				if(data.accepted_for_todo_creator == 1 && data.accepted_for_todo_negotiator == 1) {
					$(".signBox").show();
					$(".offerAcceptedPage .acceptBox").hide();
				}else {
					$(".signBox").hide();
					if(data.creatorEmail == loginUserEmail) {
						$(".offerAcceptedPage .acceptBox").attr("data-id", data.offerAcceptedId).attr("data-iscreator", 1).show();
					}else {
						$(".offerAcceptedPage .acceptBox").attr("data-id", data.offerAcceptedId).attr("data-iscreator", 0).show();
					}
				}
			}
		});
	}	

	updateOfferAcceptedRead();
	function updateOfferAcceptedRead() {
		$.ajax({
			type: 'POST',
			url: ci_base_url + 'updateOfferAcceptedRead',
			data: {'messageId': messageID, 'userId': id},
			success: function(data) {}
		});
	}

	$("body").on("click", ".negoProfile", function() {
		var profileid = $(this).attr("profileid");
		window.location.href = '#view_profile.html?id='+profileid;
		loadPageUrl(window.location.href);
	});

	$("body").on("click", "#negotiatorCheck", function() {
		var status = $(this).prop('checked');
		var todoId = $(this).attr('data-id');
		$("#completeModal, #removeCompleteModal").attr('data-id', todoId);
		if(status == true) {
			$("#completeModal").modal("show");
		}else {
			$("#removeCompleteModal").modal("show");
		}
	});

	$("#removeCompleteModal .cancelBtn, #creatorRemoveCompleteModal .cancelBtn").click(function() {
		loadTodo();
	});

	$("#removeCompleteModal, #creatorRemoveCompleteModal").on('hidden.bs.modal', function () {
	    loadTodo();
	})

	$("#completeModal .cancelBtn, #creatorCompleteModal .cancelBtn").click(function() {
		loadTodo();
	});

	$("#completeModal, #creatorCompleteModal").click(function() {
		loadTodo();
	});

	$("#completeModal form").submit(function() {
		var todoId = $("#completeModal").attr('data-id');

		$.ajax({
			type: 'POST',
			url: ci_base_url+'completeTodo', 
			dataType: "json",
			crossDomain:true, 
			data: {'userid':id, 'todoId': todoId},
			success : function(data) {
				if(data.success == 1) {
					$("#completeModal").modal('hide');	
					$.toast({
					    text: 'Todo task completed',
					    allowToastClose: false,
					    showHideTransition: 'fade',
					    position: 'bottom-center',
					    textAlign: 'center',
					    loader: false,
					    stack: false
					});

					loadTodo();
				}
			}
		});

		return false;
	});

	$("#confirmAcceptModal .acceptForm").submit(function() {
		var offerAcceptedId = $(".offerAcceptedPage .acceptBox").attr('data-id');
		var offerIsCreator = $(".offerAcceptedPage .acceptBox").attr('data-iscreator');
		console.log('offerAcceptedId', offerAcceptedId);
		if($(".licenceCheck").prop('checked') == true) {
			$("#confirmAcceptModal").modal('hide');
			$.ajax({
				type: 'POST',
				url: ci_base_url+ 'acceptedOfferForTodo',
				dataType: "json",
				crossDomain:true, 
				beforeSend: function(){
					$(".fourOfferBtn").attr('disabled', true);
					$(".acceptOfferBtn").find("i").attr('class', 'ion-loading-c').css('top','6px');
				},
				data: {'userId':loginUserID, 'offerAcceptedId':offerAcceptedId, 'offerIsCreator': offerIsCreator},
				success : function(data) {
					loadTodo();
					$.toast({
					    text: 'Offer Accepted and todo task was assigned',
					    allowToastClose: false,
					    showHideTransition: 'fade',
					    position: 'bottom-center',
					    textAlign: 'center',
					    loader: false,
					    stack: false,
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

	$("#removeCompleteModal form").submit(function() {
		var todoId = $("#removeCompleteModal").attr('data-id');
		console.log(todoId);
		$.ajax({
			type: 'POST',
			url: ci_base_url+'removeCompleteTodo', 
			dataType: "json",
			crossDomain:true, 
			data: {'userid':id, 'todoId': todoId},
			success : function(data) {
				if(data.success == 1) {
					$("#removeCompleteModal").modal('hide');	
					$.toast({
					    text: 'Todo task updated',
					    allowToastClose: false,
					    showHideTransition: 'fade',
					    position: 'bottom-center',
					    textAlign: 'center',
					    loader: false,
					    stack: false
					});

					loadTodo();
				}
			}
		});

		return false;
	});

	$("body").on("click", "#creatorCheck", function() {
		var status = $(this).prop('checked');
		var todoId = $(this).attr('data-id');
		$("#creatorCompleteModal, #creatorRemoveCompleteModal").attr('data-id', todoId);
		if(status == true) {
			if($(".pending").html() == 'pending') {
				$.toast({
				    text: 'Error! Offeree task completion is required',
				    allowToastClose: false,
				    showHideTransition: 'fade',
				    position: 'bottom-center',
				    textAlign: 'center',
				    loader: false,
				    stack: false
				});

				$(this).prop('checked', false);
			}else {
				$("#creatorCompleteModal").modal("show");
			}
		}else {
			if($(".pending").html() != 'pending') {
				$("#creatorRemoveCompleteModal").modal("show");
			}
		}
	});


	$("#creatorCompleteModal form").submit(function() {
		var todoId = $("#creatorCompleteModal").attr('data-id');

		$.ajax({
			type: 'POST',
			url: ci_base_url+'creatorCompleteTodo', 
			dataType: "json",
			crossDomain:true, 
			data: {'userid':id, 'todoId': todoId},
			success : function(data) {
				console.log('new', data);
				if(data.success == 1) {
					$("#creatorCompleteModal").modal('hide');	
					$.toast({
					    text: 'Todo Completed',
					    allowToastClose: false,
					    showHideTransition: 'fade',
					    position: 'bottom-center',
					    textAlign: 'center',
					    loader: false,
					    stack: false
					});

					loadTodo();
				}
			}
		});

		return false;
	});

	$("#creatorRemoveCompleteModal form").submit(function() {
		var todoId = $("#creatorRemoveCompleteModal").attr('data-id');

		$.ajax({
			type: 'POST',
			url: ci_base_url+'creatorRemoveCompleteTodo', 
			dataType: "json",
			crossDomain:true, 
			data: {'userid':id, 'todoId': todoId},
			success : function(data) {
				if(data.success == 1) {
					$("#creatorRemoveCompleteModal").modal('hide');	
					$.toast({
					    text: 'Todo Updated',
					    allowToastClose: false,
					    showHideTransition: 'fade',
					    position: 'bottom-center',
					    textAlign: 'center',
					    loader: false,
					    stack: false
					});
					$("#creatorCheck, #negotiatorCheck").prop('checked', false);
					loadTodo();
				}
			}
		});

		return false;
	});

	function defaultEmailForPaypal(uid, uEmail) {
		$.ajax({
			type: 'POST',
			url: ci_base_url+'defaultEmailForPaypal',
			dataType: "json",
			crossDomain:true, 
			data: {'userId': uid, 'userEmail': uEmail},
			success: function(data) {
				$(".receiverHidden").val(data.email);
			}
		});
	}
	

	$(".creatorAcceptBtn").click(function() {
		$("#confirmAcceptModal").modal("show");
	});
});