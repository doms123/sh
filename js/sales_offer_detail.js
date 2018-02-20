$(document).ready(function() {
	var offerId 	= getParam("offer_id");
	$(".offerDetailsWrap").attr('dataid', offerId);
	var id = localStorage.getItem("user_id");
	var myElement 	= document.getElementById('wrap');
	var creatorId;
	var messageId;
	var mc = new Hammer(myElement);
	mc.get('pan').set({ direction: Hammer.DIRECTION_ALL, threshold: 300, domEvents: true });

	mc.on("panleft panright", function(ev) {
	    if(ev.type == 'panleft') {
	    	loadSwipe('left');
	    }else {
	    	loadSwipe('right');
	    }
	});

	$(".page-title").text('OFFER DETAILS');
	function convertDateWithSlashes(inputFormat) {
		if(inputFormat == '1970-01-01') {
			return 'Indefinite';
		}else {
			function pad(s) { return (s < 10) ? '0' + s : s; }
		  	var d = new Date(inputFormat);
		  	return [pad(d.getMonth()+1), pad(d.getDate()), d.getFullYear()].join('/');
	  	}
	}

	historyId();
	function historyId() {
		$.ajax({
			type: 'POST',
			url: ci_base_url + 'historyId',
			crossDomain:true,
			data: {'offerId':offerId, 'userid':id},
			success: function(data){
				var historyId = data.historyId;
				$(".historyBtn").attr('data-id', historyId);
			}
		});
	}

	function offerHasRead(offer_id) {
		$.ajax({
			type: 'POST',
			url: ci_base_url + 'offerHasRead',
			crossDomain:true,
			data: {'offerId':offer_id, 'userId':id},
			success: function(data){}
		});
	}

	$(".historyBtn").click(function() {
		var historyId = $(this).attr('data-id');
		window.location.hash = "#sales_history_detail.html?message_id="+messageId; 
		loadPageUrl(window.location.href);
	});


	salesOfferDetail(offerId);
	function salesOfferDetail(offer_id) {
		$.ajax({
			type: 'POST',
			url: ci_base_url+'viewOfferDetails',
			dataType: "json",
			crossDomain:true, 
			data : {'offer_id': offer_id, 'userID':id},
			beforeSend: function() {
				$(".offerNumber, .offerName, .offerCreator, .offerTerm, .offerAmount, .offerType, .newStartDate, .newEndDate, .offerNotes").html("loading . . .");
			},
			success : function(data) {
				console.log('data', data);
				creatorId 			= data.creatorId;
				var creatorName 	= data.creatorName;
				var creatorAlias 	= data.creatorAlias;
				messageId 			= data.messageId;
				var messageCount 	= data.messageCount;
				var offerCount 		= data.offerCount;
				var data = data.result;
				
				$(".offerDetailsWrap").attr('dataid', data.offerID);
				$(".offerNumber").html(data.offerNumber);
				$(".offerName").html(stripSlashes(data.offerName));
				if(creatorId == id) {
					if(creatorAlias == '') {
						$(".offerCreator").html('<span class="creatorName">'+creatorName+'</span>').css("font-weight", "normal");
					}else {
						$(".offerCreator").html('<span class="creatorName">'+creatorAlias+'</span>').css("font-weight", "normal");
					}
				}else {
					if(creatorAlias == '') {
						$(".offerCreator").html('<span class="creatorName">'+creatorName+'</span> <button class="button offerCreatorView"><i class="ion-person"></i>View Profile</button><button class="button offerCreatorMessage"><i class="ion-email"></i>Message</button>');
					}else {
						$(".offerCreator").html('<span class="creatorName">'+creatorAlias+'</span> <button class="button offerCreatorView"><i class="ion-person"></i>View Profile</button><button class="button offerCreatorMessage"><i class="ion-email"></i>Message</button>');
					}
				}
				$(".offerCreator").html();
				$(".offerTerm").html(stripSlashes(data.offerTerm));
				$(".offerAmount").html('$'+numberWithCommas(data.offerAmount));
				$(".offerType").html(stripSlashes(data.offerType));

				if(data.isDSindefinite == 1) {
					$(".newStartDate").html('Indefinite');
				}else {
					$(".newStartDate").html(convertDateWithSlashes(data.startDate));
				}
				
				if(data.isDEindefinite == 1) {
					$(".newEndDate").html('Indefinite');
				}else {
					$(".newEndDate").html(convertDateWithSlashes(data.endDate));
				}

				$(".offerNotes").html(stripSlashes(data.offerNotes));
				
				if(data.offerAddedByID == id) {
					$("#acceptOfferBtn, #negotiateOfferBtn, #skip, #historyBtn").hide();
					$("#reList, .editBtn, .deleteBtn").show();
				}else {
					//acceptedOfferChecker(data.offerID, creatorId);
					if(data.isAccepted == 1) {
						$("#acceptOfferBtn, #negotiateOfferBtn, #skip, #reList, .editBtn, .deleteBtn").hide();
						$("#historyBtn").show();
					}else {
						$("#historyBtn, #reList, .editBtn, .deleteBtn").hide();
						$("#acceptOfferBtn, #negotiateOfferBtn, #skip").show();
					}
				}

				// accept and negotiate
				$("#acceptOfferBtn, #negotiateOfferBtn").attr({
					"data-id" : data.offerID,
					"data-offerto" : data.offerAddedByID,
					"data-offernumber" : data.offerNumber,
					"data-parentid" : data.parent_offer_id,
					"message_id" : messageId,
				});

				$(".reListBtn").attr({
					"href" : "#sales_offer_relist.html?relist_id="+data.offerID+"",
					"data-id" : data.offerID
				});

				$(".offNextButton").attr("data-id", data.nextId);
				$(".offPrevButton").attr("data-id", data.prevId);

				// // if offer is > 1 make the next and prev button show
				// if(offerCount > 1) {
				// 	$(".offNextButton, .offPrevButton").show();
				// }

				offerHasRead(offer_id);

				var jroll = new JRoll(".subWrap", {
			      scrollBarY: false
			    });
			}
		});
	}

	$(".offerCreator").on("click", ".offerCreatorMessage", function() {
		if(creatorId != id) {
			window.location.href = '#create_message.html?receiver='+creatorId;
			loadPageUrl(window.location.href);
		}
	});

	$(".offerCreator").on("click", ".offerCreatorView", function() {
		if(creatorId != id) {
			window.location.href = '#view_profile.html?id='+creatorId;
			loadPageUrl(window.location.href);
		}
	});

	function loadSwipe(direction) {
		if(direction == 'left') {
			var offerID = $(".offNextButton").attr('data-id');
			var pos 	= $(".offNextButton").data('pos');
		}else if(direction == 'right') {
			var offerID = $(".offPrevButton").attr('data-id');
			var pos 	= $(".offPrevButton").data('pos');
		}
		salesOfferDetail(offerID);
	}

	$(".offButton").click(function() {
		var offerID 	= $(this).attr('data-id');
		salesOfferDetail(offerID);
	})

	$(".negotiateOfferBtn").click(function() {
		var message_id = $(this).attr('message_id');
		window.location.href = '#offer_message_reply.html?message_id='+message_id;
		loadPageUrl(window.location.href);
	});

	$(".reListBtn").click(function() {
		var href = $(this).attr('href');
		window.location.href = href;
		loadPageUrl(window.location.href);
	});

	$("body").on("click", ".acceptOfferBtn", function() {
		$(".licenceCheck").prop('checked', false);
		$("#confirmAcceptModal").modal('show');
	});

	$(".acceptForm").submit(function() {
		var offerId = $(".offerDetailsWrap").attr('dataid');
		if($(".licenceCheck").prop('checked') == true) {
			$("#confirmAcceptModal").modal('hide');
			$.ajax({
				type: 'POST',
				url: ci_base_url+ 'acceptOfferOnDetail',
				dataType: "json",
				crossDomain:true, 
				beforeSend: function(){
					$(".fourOfferBtn").attr('disabled', true);
					$(".acceptOfferBtn").find("i").attr('class', 'ion-loading-c').css('top','6px');
				},
				data: {'userId':id, 'offerId':offerId, 'creatorId':creatorId},
				success : function(data) {
					$(".fourOfferBtn").attr('disabled', false);
					salesOfferDetail(offerId);
					$(".acceptOfferBtn").find("i").attr('class', 'ion-checkmark').css('top','inherit');

					$.toast({
					    text: 'Offer Accepted',
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

	function autoHeight() {
		var window_height = $(window).height();
		var total_height = window_height - 245;
		$(".subWrap, .offerDetailsWrap").css('height', total_height+'px');
	}
	autoHeight();

	$("#skip").click(function() {
		var href = $(this).attr('href');

		window.location.href = href;
		loadPageUrl(window.location.href);
	});

	$(".deleteBtn").click(function() {
		$("#confirmDeleteModal").modal("show");
	});

	$(".confirmDelete").click(function() {
		$.ajax({
			type: 'POST',
			url: ci_base_url+ 'deleteOffer',
			dataType: "json",
			crossDomain:true, 
			data: {'offerId':offerId},
			success : function(data) {
				if(data.success == 1) {
					$("#confirmDeleteModal").modal("hide");

					setTimeout(function() {
						window.location.href = '#sales_offer.html';
						loadPageUrl(window.location.href);

						$.toast({
						    text: 'Offer deleted',
						    allowToastClose: false,
						    showHideTransition: 'fade',
						    position: 'bottom-center',
						    textAlign: 'center',
						    loader: false,
						    stack: false,
						});
					}, 600);
				}
			}
		});
	});
	
	$(".editBtn").click(function() {
		var editId = $(".offerDetailsWrap").attr("dataid");
		window.location.href = '#edit_offer.html?editId='+editId;
		loadPageUrl(window.location.href);
	});

});
