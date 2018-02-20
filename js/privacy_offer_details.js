$(document).ready(function() {
	$(".page-title").text('OFFER DETAILS');
	var id = localStorage.getItem("user_id");
	var url = window.location.href;
	var parts = url.split('/z');

	part = parts[1];

	offerDetails();
	function offerDetails() {
		$.ajax({
			type: 'GET',
			url: base_url+'offers/offerDetails.php', 
			dataType: "jsonp",
			crossDomain:true, 
			data: {'id':part, 'accepted_by': parts[2]},
			beforeSend: function(){
				$('body').removeClass('loaded');
				$(".preloadLogo").show();
			},
			success : function(response) {
				$('body').addClass('loaded');
				$(".preloadLogo").fadeOut();
				var data = response.result;
				var html = "";
				$.each(data, function(key, value) {
					var newValue = value.split('#');
					html += '<div class="privateBox">';
					 	html += '<p class="mt10"><strong>Offer name:</strong> <span>'+newValue[1]+'</span></p>';
					 	html += '<p class="mt10"><strong>Offer amount:</strong> <span>$'+newValue[2]+'</span></p>';
					 	html += '<p class="mt10"><strong>Offer term:</strong> <span>'+newValue[3]+'</span></p>';
					 	html += '<p class="mt10"><strong>Offer type:</strong> <span>'+newValue[4]+'</span></p>';

					 	if(newValue[7] == '') {
					 		html += '<p class="mt10"><strong>Offer notes:</strong> <span>N/A</span></p>';
					 	}else {
					 		html += '<p class="mt10"><strong>Offer notes:</strong> <span>'+newValue[7]+'</span></p>';
					 	}

					 	if(newValue[8] == 2) {
					 		html += '<p class="mt10"><strong>Offer type:</strong> <span>Private</span></p>';
					 	}else if(newValue[8] == 3) {
					 		html += '<p class="mt10"><strong>Post type:</strong> <span>Public</span></p>';
					 	}

					 		html += '<p class="mt10"><strong>Accepted by:</strong> <span>'+newValue[10]+'</span></p>';

					 	if(newValue[12] == 1) {
					 		html += '<p class="mt10"><strong>Status:</strong> <span>Completed</span></p>';
					 	}
					 	html += '<div class="centerDiv">';
					 		if(newValue[12] != 1) {
						 		html += '<button class="AcceptOfferBtn rad15" style="margin-top: 20px;" data-replyid='+newValue[0]+'> Make a Payment </button>';
						 	}
						html += '</div>';
				 	html += '</div>';
				})
				// html += '<a href="#" class="viewAllBtn">View All</a>';
				$(".privateDetailContent").html(html);
			}
		});
	}

	$("body").delegate(".AcceptOfferBtn", "click", function(event) {
		$.ajax({
			type: 'GET',
			url: base_url+'offers/paymentRidirect.php', 
			dataType: "jsonp",
			crossDomain:true, 
			data: {'id':part, 'accepted_by': parts[2]},
			beforeSend: function(){
				$('body').removeClass('loaded');
				$(".preloadLogo").show();
			},
			success : function(data) {
				window.open("https://sellinghive.applite.com/paypal/Pay.php?token1="+data.offer_id+'&'+'token2='+data.accepted_by);
			}
		});
		
	})

	$("body").delegate(".btnReplyMsg", "click", function() {
		var replyID = $(this).data('replyid');;
		var session = readCookie('UserEmail'),
		    textBlk = session.split('/'),
		    email = textBlk[0],
		    role = textBlk[1],
		    id = textBlk[2],
		    method = textBlk[3];
		    
		$(".page-title").text('CREATE MESSAGE');
		var html = "";
 		html += '<form class="message-form mt30" id="message-form">';
            html += '<input type="hidden" name="fromId" id="fromId" value='+id+'>';
            html += '<div class="form-group mt15">';
                html += '<span class="msg-label">To:</span>';
                html += '<div class="input-group col-xs-12">';
                    html += '<input type="hidden" name="hiddenToId" id="hiddenToId" value='+replyID+' class="removeRecords" autocomplete="off">';
                    html += '<input type="text" class="form-control input01 removeRecords"  tabindex="1" name="msg-to" id="msg-to" list="auto_email" readonly>';
                    html += '<datalist id="auto_email"></datalist>';
                html += '</div>';
            html += '</div>';

            html += '<div class="form-group mt15">';
                html += '<span class="msg-label">Subject:</span>';
                html += '<div class="input-group col-xs-12">';
                    html += '<input type="text" class="form-control input01 removeRecords" name="msg-subject" id="msg-subject" tabindex="1" placeholder="" required>';
                html += '</div>';
            html += '</div>';

            html += '<p class="body-label" style="text-align:left;">Body:</p>';
            html += '<textarea class="form-control input01 removeRecords" name="message-body" cols="70" rows="50" id="message-body" required></textarea>';

            html += '<div class="file-upload mt10" style="text-align: left; display: inline; position: relative; top: 5px;">';
                html += '<label for="file-input">';
                    html += '<i class="fa fa-paperclip" aria-hidden="true"></i>';
                html += '</label>';
                html += '<input id="file-input" type="file" class="removeRecords" name="file"/> <span class="fileName"></span>';
            html += '</div>';
            html += '<small class="fileNotes"><strong>NOTE:</strong> <i>Accepted formats are: jpg, png, pdf, doc, excel, and text.</small>';
            html += '<div class="button-wrap tCenter mt20">';
                html += '<input type="submit" name="save-draft" class="btnDraftMsg fL" value="Save Draft">';
                html += '<button type="submit" class="btnSaveMessage fR" name="send">Send</button>';
            html += '</div>';
        html += '</form>';

        $(".content").html(html);

		$.ajax({
			type: 'GET',
			url: base_url+'offers/offer_reply_to.php', 
			dataType: "jsonp",
			crossDomain:true, 
			data: {'replyID':replyID},
			beforeSend: function(){
				$('body').removeClass('loaded');
				$(".preloadLogo").show();
			},
			success: function(response) {
				$('body').addClass('loaded');
				$(".preloadLogo").fadeOut();
				$("#msg-to").val(response.email);
				$("#hiddenToId").val(replyID);
			}
		})
	});

	$("body").delegate("#message-form", "submit", function() {
		$.ajax({
			url: base_url+'message/send_message.php',  	
			type: "POST",             		// Type of request to be send, called as method
			// data: {formData: new FormData(this), opt: processOpt} , 		
			data: new FormData(this) , 		
			contentType: false,       		// The content type used when sending data to the server.
			cache: false,             		// To unable request pages to be cached
			processData:false,        		// To send DOMDocument or non processed data file it is set to false
			beforeSend: function(){
				$('body').removeClass('loaded');
				$(".preloadLogo").show();
			},
			success: function(data) {
				$('body').addClass('loaded');
				$(".preloadLogo").fadeOut();
				if(data.success == 1) { // message sent
					$("#myModal").modal('show');
					$(".modelText").text('Message successfully sent');
				}else if(data.success == 2) { // message save to draft
					$(".modelText").text('Message Save to draft');
					$("#myModal").modal('show');

				}else if(data.success == 3) { // error message invalid file type
					$(".modelText").text('Opps! Invalid file type');
					$("#myModal").modal('show');

				}else if(data.success == 4) { // error message file is too big 
					$(".modelText").text('The file that you are trying to upload is too large');
					$("#myModal").modal('show');

				}else if(data.success == 5) { // error message 'to' is empty
					$(".modelText").text('Error! the email address you entered doesn\'t exist');
					$("#myModal").modal('show');
				}

				$("#message-form").find('.removeRecords').val('');
				$(".fileName").text('');
			}
		});
		return false;
	});
});
