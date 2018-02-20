$(function() {
	var id = localStorage.getItem("user_id");
	pageTitleAndLoader('Review');
	$(".reviewBtn").click(function() {
		$("#addReviewModal").modal("show");
	});

	function getParam( name ) {
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
	loadUserReview();
	function loadUserReview() {
		var revieweeId = getParam('userid');
	
		$.ajax({
			url: ci_base_url+'loadUserReview', 	
			type: "POST",  		
			dataType: 'json',
			data: {'revieweeId': revieweeId},
			crossDomain: true,
			beforeSend: function() {
				$("#reviewBody").html('<tr><td rowspan="3" class="loadingMsg"><i class="ion-loading-a"></i> &nbsp;Loading . . .</td>');
			},
			success: function(data) { 
				console.log('data', data);
				var data = data.result;
				var maxLoop = data.length;
				var html = "";

				for(x = 0; x < maxLoop; x++) {
				   	html += '<tr class="tr detailsBtn" data-reviewee="'+data[x].toid+'" data-reviewer="'+data[x].fromid+'" data-offerid="'+data[x].r_offerid+'">';
						if(data[x].reviewerPhoto == null || data[x].reviewerPhoto == '') {
							html += '<td><span class="noPhoto">'+data[x].revieweeName.charAt(0)+'</span></td>';
						}else {
					  		html += '<td><img src="https://sellinghive.applite.com/ci_upload/w45_'+data[x].reviewerPhoto+'"></td>';
					  	}
						html += '<td>';
							html += '<h6>'+data[x].r_title+'</h6>';
							html += '<p>'+data[x].reviewtext+'</p>';
							html += '<p class="stars">';
								for(y = 0; y < data[x].reviewStar; y++) {
									html += '<i class="ion-star"></i>';
								}
							html += '<span>('+data[x].reviewStar+')</span>';
							html += '</p>';
						html += '</td>';
						html += '<td>'+data[x].reviewDate+'</td>';
					html += '</tr>';
				}
				$("#reviewBody").html(html);

				var width = $(".tr td:nth-child(2)").width();
				$(".tr td:nth-child(2) p").css('width', width);

				if(maxLoop == 0) {
					$("#reviewBody").html('<tr><td rowspan="3" class="loadingMsg">No review yet.</td></tr>');
				} 
			}
		});
	}

	$("#reviewBody").on("click", ".detailsBtn", function() {
		var reviewee = $(this).attr("data-reviewee");
		var offerid = $(this).attr("data-offerid");
		var reviewer = $(this).attr("data-reviewer");
		
		window.location.href = '#review_detail.html?userid='+reviewee+'&offerid='+offerid+'&reviewerid='+reviewer;
		loadPageUrl(window.location.href);

	});

	$(".addReviewForm").submit(function() {
		var reviewTitle 	= $(".addReviewForm .reviewTitle").val();
		var reviewDetails 	= $(".addReviewForm .reviewDetails").val();
		var reviewStar 		= $(".addReviewForm .reviewStar").val();
		var revieweeId 		= getParam('userid');
		var offerId 		= getParam('offerid');
		
		$.ajax({
			url: ci_base_url+'addUserReview', 	
			type: "POST",  		
			dataType: 'json',
			data: {'reviewTitle': reviewTitle, 'reviewDetails': reviewDetails, 'reviewStar': reviewStar, 'revieweeId': revieweeId, 'reviewerId': id, 'offerId': offerId},
			crossDomain: true,
			beforeSend: function(){
				//$("#privateMsgForm").modal('show');
			},
			success: function(data) { 
				$("#addReviewModal").modal('hide');
				$(".addReviewForm .reviewTitle, .addReviewForm .reviewDetails, .addReviewForm .reviewStar").val('');
				loadUserReview();

				$.toast({
					text: 'Review was added',
					allowToastClose: false,
					showHideTransition: 'fade',
					position: 'bottom-center',
					textAlign: 'center',
					loader: false,
					stack: false,
				});
			}
		});
		return false;
	});
	checkExistingReview();
	function checkExistingReview() {
		var revieweeId 		= getParam('userid');
		var offerId 		= getParam('offerid');

		$.ajax({
			url: ci_base_url+'checkExistingReview', 	
			type: "POST",  		
			dataType: 'json',
			data: {'revieweeId': revieweeId, 'offerId': offerId, 'reviewerId': id},
			crossDomain: true,
			beforeSend: function(){
			},
			success: function(data) {
				if(data.reviewExist == 1) {
					$(".reviewBtn").hide();
					$(".reviewEditBtn").show();
					var data = data.row;
					$(".reviewEditBtn").attr('reviewid', data.review_id);

					$(".tempInput").val(data.r_title);
					var reviewTitle = stripSlashes($(".tempInput").val());
					$(".editReviewForm .reviewTitle").val(reviewTitle);

					$(".tempInput").val(data.reviewtext);
					var reviewDetails = stripSlashes($(".tempInput").val());
					$(".editReviewForm .reviewDetails").val(reviewDetails);

					$(".tempInput").val(data.reviewStar);
					var reviewStar = stripSlashes($(".tempInput").val());
					$(".editReviewForm .reviewStar option[value='"+reviewStar+"']").prop('selected', true);
				}else {
					$(".reviewEditBtn").hide();
					$(".reviewBtn").show();
				}
				if(revieweeId == id) {
					$(".reviewBtn, .reviewEditBtn").hide();
				}
			}
		});
	}

	$(".reviewEditBtn").click(function() {
		var reviewId = $(".reviewEditBtn").attr('reviewid');
		checkExistingReview();
		$("#editReviewModal").modal("show");
	});

	$(".editReviewForm").submit(function() {
		var reviewId 		= $(".reviewEditBtn").attr('reviewid');
		var reviewTitle 	= $(".editReviewForm .reviewTitle").val();
		var reviewDetails 	= $(".editReviewForm .reviewDetails").val();
		var reviewStar 		= $(".editReviewForm .reviewStar").val();

		$.ajax({
			url: ci_base_url+'updateUserReview', 	
			type: "POST",  		
			dataType: 'json',
			data: {'reviewId': reviewId, 'reviewTitle': reviewTitle, 'reviewDetails': reviewDetails, 'reviewStar': reviewStar},
			crossDomain: true,
			beforeSend: function(){
			},
			success: function(data) {
				$("#editReviewModal").modal('hide');
				$(".editReviewForm .reviewTitle, .editReviewForm .reviewDetails, .editReviewForm .reviewStar").val('');
				loadUserReview();

				$.toast({
					text: 'Review was updated',
					allowToastClose: false,
					showHideTransition: 'fade',
					position: 'bottom-center',
					textAlign: 'center',
					loader: false,
					stack: false,
				});
			}
		});
		return false;
	});

	$(window).resize(function() {
		var width = $(".tr td:nth-child(2)").width();
		$(".tr td:nth-child(2) p").css('width', width);
	});

	$("#rateYo").rateYo({
	    rating: 0,
	    fullStar: true,
	    starWidth: "30px",
	    onChange: function (rating, rateYoInstance) {
  	      $(".starCounter").text(rating);
  	      $(".reviewStar").val(rating);
  	    }
  	});


});