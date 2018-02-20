$(function() {
	var id = localStorage.getItem("user_id");
	var counter = 3;
	var totalRecords = 0;
	var number_of_page = 0;
	var records_per_page = 10;
	var current_page = 1;
	var start = 1;
	var swipeStart = '';
	var pulldown = 0;
	var preventUp = 0;
	var lock = 0;
	var selectizeDropdown;
	pageTitleAndLoader('Offers');

	$(".createOfferButton").click(function() {
		window.location.href = '#sales_offer_create.html';
		loadPageUrl(window.location.href);
	});

	selectizeDropdown();
	function selectizeDropdown() {
		selectizeDropdown = $('.searchOfferInput').selectize({
			create: true,
			sortField: {
				field: 'text',
				direction: 'asc'
			},
			dropdownParent: 'body'
		});

		$(".searchOfferInput").addClass('noCss');
	}

	function offerNotifCount() {
		$.ajax({
			type: 'POST',
			url: ci_base_url + 'offerNotifCount',
			dataType: "json",
			crossDomain:true, 
			data: {'userId':id},
			success: function(data) {
				var notifCount = data.result;

				if(notifCount > 0) {
					$(".filterBtn").append('<span class="notifCount">'+notifCount+'</span>');
				}else {
					$(".filterBtn .notifCount").remove();
				}
			}
		})
	}

	loadAllOfferName();
	function loadAllOfferName() {
		$.ajax({
			type: 'POST',
			url: ci_base_url+'loadAllOfferName',
			dataType: "json",
			crossDomain:true, 
			data: {'userId':id, 'offerTypeId':counter},
			success: function(data) {
				var data = data.result;
				var maxLoop = data.length;

				var offerArr = [];
				var offerCounter = 1;
				for(x = 0; x < maxLoop; x++) {
					offerArr.push({value: data[x].offerName, text: data[x].offerName});

					offerCounter++;
				}

				selectizes = selectizeDropdown[0].selectize;
				selectizes.clearOptions()
				selectizes.addOption(offerArr)
				selectizes.refreshItems();
			}
		});	
	}

	autoHeight();
	function autoHeight() {
		var window_height = $(window).height();
		var total_height = window_height - 170;
		$(".offerViewWrap, #swipeContent, #main-content").css('height', total_height+'px');
	}

	var jroll = new JRoll(".offerViewWrap", {
      scrollBarY: false
    });

    jroll.pulldown({
      refresh: function(complete) {
      	pulldown = 1;
		start = 1;
		current_page = 1;
		lock = 0;
		$(".searchOfferInput").val('');
		loadAllOfferName();
		$(".wall .offerView").html('<li class="offersNone" style="text-align: left;"><i class="ion-loading-a"></i> &nbsp;Loading . . .</li>').find("li").css('border','0');
		loadAllOffers(counter);
		  complete();
      }
    });

    jroll.on('scroll', function() {
    	if(lock == 0) {
	    	if(this.y < 0) {
	    		lock = 1;
				pulldown = 0;
				start += 1;
				current_page++;
				loadAllOffers(counter);
	    	}
    	}
    	$(".createOfferButton").fadeOut();
    });

    jroll.on("scrollEnd", function() {
		$(".createOfferButton").fadeIn();
		lock = 0;
    });

	$("body").attr('data-offertypeid', '3');
	offerCount(3);
	function offerCount(offerTypeID) {
		$.ajax({
			type: 'POST',
			url: ci_base_url+'offerRowCount',
			dataType: "json",
			crossDomain:true, 
			data: {'offerTypeID':offerTypeID},
			success: function(data) {
				totalRecords = data.count;
				number_of_page = Math.ceil(totalRecords / records_per_page);
			}
		});	
	}
	
	loadAllOffers(counter);
	function loadAllOffers(counter) {
		var userid = id;
		var searchInput = $(".searchOfferInput").val();

		if(searchInput != '') {
			start = 1;
			current_page = 1;
		}

		var offer_active = $(".active").data('id');
		
		$.ajax({
			type: 'POST',
			url: ci_base_url+'viewOffer', 
			dataType: "json",
			crossDomain:true, 
			data : {'userid': id,'counter':counter, 'recordPerPage':records_per_page, 'start':start, 'searchInput':searchInput, 'offerActive':offer_active},
			beforeSend: function() {
				//$(".filterBtn, .filterPastBtn, .btnSearchOffer").attr('disabled', true);
			},
			success : function(data) {
				console.log('data', data);
				$(".filterBtn, .filterPastBtn").attr('disabled', false);
				$(".loadingContent, .offersNone").remove();
				$(".btnSearchOffer").attr('disabled', false).html('Search');
				if(data.success == 0) {
					var $listCount = $(".wall .offerView").find("li").length;
					if($listCount == 0) {
						$(".wall .offerView").append('<li class="offersNone" style="text-align: left;">No Offers yet.</li>').find("li").css('border','0');
					}
				}else {
					var data 		= data.result;
					var noOfRecord 	= data.length;
					var html 		= "";

					for(x = 0; x < noOfRecord; x++) {
						html += '<li class="offerid li'+x+'" data-offer_id='+data[x].offerID+' draft_id='+data[x].offerID+' is_accepted="0">';
							html += '<div class="photoBox">';
								if(data[x].creatorPhoto == null || data[x].creatorPhoto == '') {
									if(stripSlashes(data[x].creatorAlias) == '') {
										html += '<span class="noPhoto">'+data[x].creatorName.charAt(0)+'</td>';
									}else {
										html += '<span class="noPhoto">'+data[x].creatorAlias.charAt(0)+'</td>';
									}
								}else {
							  		html += '<img src="https://sellinghive.applite.com/ci_upload/w45_'+data[x].creatorPhoto+'">';
							  	}
						  	html += '</div>';
							html += '<span class="fsize13">'+data[x].id+'</span>';
	                        html += ' + <span class="color-green fsize13">  $'+numberWithCommas(data[x].offerAmount)+'</span>';
	                        if(data[x].offerAddedByID == userid) {
	                        	if(data[x].unpaidCount == 0) {
	                        		html += '<span class="offerOwner">Mine</span>';
	                        	}else {
	                        		html += '<span class="paymentNotice">Payment ('+data[x].unpaidCount+')</span>';
	                        	}
	                        	
	                        }else {
	                        	if(data[x].isRead == null) {
	                        		html += '<span class="offerNew">New</span>';
	                        	}else {
	                        		if(data[x].isAccepted == 1) { // accepted
	                        			$("li[data-offer_id="+data[x].offerID+"] .offerAccepted").text('Accepted').show();
	                        			html += '<span class="offerAccepted">Accepted</span>';
	                        		}else {
	                        			if(data[x].isNegotiated == 1) {
	                        				html += '<span class="offerNegotiate">Pending</span>';
	                        			}
	                        		}
	                        	}
	                        }
	                        
	                        html += '<br><p class="mt3 textElipsis">for <span class="font-bold">'+stripSlashes(data[x].offerName)+'</span></p>';

	                        if(stripSlashes(data[x].creatorAlias) == '') {
	                       	 	html += '<p class="mt3 textElipsis">posted by: <span class="font-bold">'+stripSlashes(data[x].creatorName)+'</span></p>';
	                        }else {
	                        	html += '<p class="mt3 textElipsis">posted by: <span class="font-bold">'+stripSlashes(data[x].creatorAlias)+'</span></p>';
	                        }

	                        html += '<span class="offerDatePosted">'+data[x].dateAdded+'</span>';
	                    html += '</li>';
					}
					
					$(".offersNone").remove();
					if(pulldown == 0) {
						$(".offerView").append(html);
					}else {
						$(".wall .offerView").html('');
						$(".offerView").html(html);
					}

					if(noOfRecord == 0) {
						if(counter == 2) { // Past Offer
							$(".wall .offerView").append('<li class="offersNone" style="text-align: left;">No past offers yet.</li>').find("li").css('border','0');
						}else if(counter == 3) { // Current Offer
							$(".wall .offerView").append('<li class="offersNone" style="text-align: left;">No offers yet.</li>').find("li").css('border','0');
						}else if(counter == 4) { // Draft Offer
							$(".wall .offerView").append('<li class="offersNone" style="text-align: left;">No draft offer yet.</li>').find("li").css('border','0');
						}else if(counter == 5) { // Archive Offer
							$(".wall .offerView").append('<li class="offersNone" style="text-align: left;">No archive offer yet.</li>').find("li").css('border','0');
						}
						
					}else {
						if(counter == 4) {
							$(".offerView").find("li").removeClass("offerid");
						}else {
							$(".offerView").find("li").addClass("offerid");
						}
					}

					if($(".offerView li").length > 1) {
						$(".offerView .offersNone").remove();
					}

					var li_length = $(".offerView").find("li").length;
					var li_height = $(".offerView").find("li").outerHeight();
					var total_height = li_length * li_height;
					total_height += 150;
					$(".offerView, .offerViewSub").css('height', total_height);					
					offerNotifCount();
					setTimeout(function() {
						$(".pullUp, .pulldown").removeClass('loading').hide();
						jroll.refresh();
					}, 400);
					
					$("li .offerNew").parent('li').addClass('new');

					textElipsis();
				}
			}
		});
	}

	$(".filterPastBtn").click(function() {
		$(".filterBtn, .filterPastBtn").removeClass('active');
		$(".wall .offerView").html('<li class="loadingContent"><i class="ion-loading-a"></i> &nbsp;Loading . . .</li>').find("li").css('border', 0);
		$(".offerView").removeClass('viewDrafts');
		$offID = $(this).data('id');
		$("body").attr('data-offertypeid', $offID);
		$(".nav").find('a').removeClass('active');
		$(".myOfferDraft, .myOfferArchive").removeAttr('style');
		$(this).addClass('active');
		counter = 2;
		current_page = 1;
		start = 1;
		$(".offersNone").remove();

		loadAllOfferName();
		loadAllOffers(counter);
		jroll.scrollTo(0, 0, 200);
	});

	$(".filterBtn").click(function() {
		$(".filterBtn, .filterPastBtn").removeClass('active');
		$(".offerView").html('');
		$offID = $(this).data('id');
		$("body").attr('data-offertypeid', $offID);
		$(".offerView").removeClass('viewDrafts');
		$(".nav").find('a').removeClass('active');
		$(".myOfferDraft, .myOfferArchive").removeAttr('style');
		$(this).addClass('active');
		counter = 3;
		current_page = 1;
		start = 1;
		$(".wall .offerView").append('<li class="loadingContent"><i class="ion-loading-a"></i> &nbsp;Loading . . .</li>').find("li").css('border', 0);
		$(".offersNone").remove();

		loadAllOfferName();
		loadAllOffers(counter);
		jroll.scrollTo(0, 0, 200);
	});

	$(".myOfferDraft").click(function() {
		$(".offerView").html('');
		$(".offerView").addClass('viewDrafts');
		$(".filterBtn, .filterPastBtn").removeClass('active');
		$(".myOfferDraft, .myOfferArchive").removeAttr('style');
		$(this).css('background','#c9b56a');
		$("body").attr('data-offertypeid', 4);
		counter = 4;
		current_page = 1;
		start = 1;
		offerCount(1);
		loadAllOfferName();
		$(".wall .offerView").append('<li class="loadingContent"><i class="ion-loading-a"></i> &nbsp;Loading . . .</li>').find("li").css('border', 0);
		$(".offersNone").remove();
	
		loadAllOffers(4);
		jroll.scrollTo(0, 0, 200);
	});

	$(".myOfferArchive").click(function() {
		$(".offerView").html('');
		$(".offerView").removeClass('viewDrafts');
		$(".filterBtn, .filterPastBtn").removeClass('active');
		$(".myOfferDraft, .myOfferArchive").removeAttr('style');
		$(this).css('background','#c9b56a');

		$offID = $(this).data('id');
		$("body").attr('data-offertypeid', $offID);

		counter = 5;
		current_page = 1;
		start = 1;
		offerCount(1);
		$(".wall .offerView").append('<li class="loadingContent"><i class="ion-loading-a"></i> &nbsp;Loading . . .</li>').find("li").css('border', 0);
		$(".offersNone").remove();
	
		loadAllOfferName();
		loadAllOffers(5);
		return false;
	});

	$('.offerView').on('click', '.offerid', function() {
		var offer_id = $(this).data('offer_id');
		var offertypeid = $("body").attr('data-offertypeid');
		var msg_id = $(this).attr('msg-id');
		var is_accepted = $(this).attr('is_accepted');
		if(offertypeid == 3) { // if current offer
			window.location.href = "#sales_offer_detail.html?offer_id="+offer_id+"&offer_typeid="+offertypeid+"&is_accepted="+is_accepted;
		}else { // if past offer
			return false;
			//window.location.href = "#view_negotiate_detail.html?message_id="+msg_id+"&is_accepted="+is_accepted;
		}

		loadPageUrl(window.location.href);
	});

	$(".btnSearchOffer").click(function() {
		$(".offerView").html('');
		$(".wall .offerView").append('<li class="loadingContent"><i class="ion-loading-a"></i> &nbsp;Loading . . .</li>').find("li").css('border', 0);
		$(".offersNone").remove();
		loadAllOffers(counter);
		jroll.scrollTo(0, 0, 200);
	});

	function convertDate(inputFormat) {
		function pad(s) { return (s < 10) ? '0' + s : s; }
	  	var d = new Date(inputFormat);
	  	return [pad(d.getMonth()+1), pad(d.getDate()+1), d.getFullYear()].join('/');
	}

	$("body").on("click", ".viewDrafts li", function() {
		if($(this).hasClass('offersNone') == 0) {
			var data_offer_id = $(this).attr('draft_id');
			window.location.href = "#sales_offer_create.html?data_offer_id="+data_offer_id;
			loadPageUrl(window.location.href);
		}
	});

	
	function textElipsis() {
		var textWidth = $(window).width() - 143;
		$(".salesOfferPage .textElipsis").css("width", textWidth+"px");
	}

	$(window).resize(textElipsis);

	$('.offerView').on('click', '.paymentNotice', function(e) {
		window.location.href = '#payment.html';
		loadPageUrl(window.location.href);
		console.log('ewe');	
		e.stopPropagation();
	});
});