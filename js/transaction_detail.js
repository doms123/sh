$(function() {
	pageTitleAndLoader('Transaction Detail');

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

	var trasactionId = getParam("detail");
	var id = localStorage.getItem("user_id");

	transactionDetail();

	function transactionDetail() {
		$.ajax({
			type: 'POST',
			url: ci_base_url + 'transactionDetail',
			data: {'trasactionId': trasactionId},
			crossDomain: true,
			success: function(data) {
				var data = data.result;
				if(data.offer_creator_id == id) { // you are the offer creator
					if(data.negotiatorPhoto == null || data.negotiatorPhoto == '') {
						$(".senderPhoto").html('<a href="#view_profile.html?id='+data.offer_creator_id+'"><span class="noPhoto">'+data.negotiatorName.charAt(0)+'</span></a>');
					}else {
						$(".senderPhoto").html('<a href="#view_profile.html?id='+data.offer_negotiator_id+'"><img src="https://sellinghive.applite.com/ci_upload/w45_'+data.negotiatorPhoto+'" class="hasPhoto"></a>');
				  		
				  	}
				  	$(".senderName").html(stripSlashes(data.negotiatorName));
				  	$(".msgTo").html('to '+stripSlashes(data.creatorName));
				  	$(".messageBody").html("You have successfully sent an amount of $"+numberWithCommas(data.acceptedOfferAmount)+' to '+data.negotiatorName+ ' for the completion of his/her task on '+ data.acceptedOfferName+'.');
				 	
				}else {
					$(".senderName").html(stripSlashes(data.creatorName));
					$(".msgTo").html('to '+stripSlashes(data.negotiatorName));
					$(".messageBody").html("You have successfully receive an amount of $"+numberWithCommas(data.acceptedOfferAmount)+' from '+data.creatorName+ ' for the completion of your task on '+ data.acceptedOfferName+'.');
				}

				$(".messageTitle").html(data.acceptedOfferName);
				$(".historyBtn").attr('data-messageid', data.accepted_message_id);
			}
		});
	}

	$(".historyBtn").click(function() {
		var messageId = $(this).attr('data-messageid');

		window.location.href = '#history_detail.html?message_id='+messageId;
		loadPageUrl(window.location.href);
	});
});