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
	pageTitleAndLoader('Offer History');

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
				console.log('data', data)
				$(".sendBox").show();
				var data 	  			= data.offerDetails;
				var offerName 			= stripSlashes(data.offerName);
				var creatorName 		= stripSlashes(data.creatorName);
				var negotiatorName 		= stripSlashes(data.negotiatorName);
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
				if(loginUserID == offerCreatorId) {
					profileId = offerNegotiatorId;
				}else {
					profileId = offerCreatorId;
				}

				if(loginUserID == offerCreatorId) {
					profileName = negotiatorName;
				}else {
					profileName = creatorName;
				}

				$(".offerTitle").html(offerName);
				$(".negotiatorName").html(profileName);
				$(".negoProfile").attr('profileid', profileId);
				$(".offTitle, .taskName").html(offerName);
				$(".offCreator, .creatorName").html(creatorName);
				$(".creatorNameLink").attr('href', '#user_review.html?userid='+offerCreatorId+'&offerid='+data.offerId);
				$(".negotiatorNameLink").attr('href', '#user_review.html?userid='+offerNegotiatorId+'&offerid='+data.offerId);

				$(".offNegotiator, .negotiatorName").html(negotiatorName);
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
								if(offer_obj[x].fromID == id) {
									html += '<span>You</span>';
								}else {
									html += '<span>'+creatorName+'</span>';
								}
							}else { // offer Negotiator
								if(offer_obj[x].fromID == id) {
									html += '<span>You</span>';
								}else {
									html += '<span>'+negotiatorName+'</span>';
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
				console.log(data);
				var data = data.result;
	
				if(data.offerAddedByID == loginUserID) { // you are the offer Creator
					var html = '';
					html += '<p>';
						html += '<span class="offCreator">'+data.creatorName+'</span>';
						if(data.offererAccepted == 0) {
							html += '<span class="checkbox"><input type="checkbox" id="creatorCheck" data-id="'+data.todo_id+'"><label for="creatorCheck"></label></span>';
						}else {
							html += '<span> - '+data.tododate1+'</span><span class="checkbox"><input type="checkbox" checked id="creatorCheck" data-id="'+data.todo_id+'"><label for="creatorCheck"></label></span>';
						}
					html += '</p>';

					html += '<p>';
						html += '<span class="offNegotiator">'+data.negotiatorName+'</span>';
						
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
						html += '<span class="offCreator">'+data.creatorName+'</span>';
						if(data.offererAccepted == 0) {
							html += '<span class="checkbox pending">pending</span>';
						}else {
							html += '<span> - '+data.tododate1+'</span><span class="checkbox"><i class="ion-checkmark-circled green"></i></span>';
						}
					html += '</p>';

					html += '<p>';
						html += '<span class="offNegotiator">'+data.negotiatorName+'</span>';
						
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
				}else {
					$(".reviewWrap .accepted").hide();
					$(".reviewWrap .default").show();
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

	$("#removeCompleteModal .cancelBtn").click(function() {
		$("#creatorCheck, #negotiatorCheck").prop('checked', true);
	});

	$("#completeModal .cancelBtn, #creatorCompleteModal .cancelBtn").click(function() {
		$("#creatorCheck, #negotiatorCheck").prop('checked', false);
	});

	$(".completeBtn").click(function() {
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
	});

	$(".removeCompleteBtn").click(function() {
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

	$(".creatorCompleteBtn").click(function() {
		var todoId = $("#creatorCompleteModal").attr('data-id');
		console.log(todoId)
		$.ajax({
			type: 'POST',
			url: ci_base_url+'creatorCompleteTodo', 
			dataType: "json",
			crossDomain:true, 
			data: {'userid':id, 'todoId': todoId},
			success : function(data) {
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
	});

	$(".creatorRemoveCompleteBtn").click(function() {
		var todoId = $("#creatorRemoveCompleteModal").attr('data-id');
		console.log(todoId)
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

					loadTodo();
				}
			}
		});
	});

});