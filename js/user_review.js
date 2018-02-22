$(function() {
	var id = localStorage.getItem("user_id");
	pageTitleAndLoader('Review');
	$(".reviewBtn").click(function() {
		$("#addReviewModal").modal("show");
	});

	var jroll = new JRoll(".scrollWrap", {
	  scrollBarY: false
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

	reviewStat();
	function reviewStat() {
		var userId = getParam('userid');
		$.ajax({
			type: 'POST',
			url: ci_base_url+'reviewStat',
			data: {
				userId: userId
			},
			success: function(data) {
				console.log('reviewd data', data);
				var data = data.result;
				var totalNoOfPositiveRating = data.totalNoOfPositiveRating;
				var totalNoOfRatings = data.totalNoOfRatings;
				var totalCompleteOffer = data.totalCompleteOffer;
				var positiveRating = 0;

				if(totalNoOfPositiveRating > 0) {
					positiveRating = (totalNoOfPositiveRating / totalNoOfRatings) * 100;
				}

				var allStars = 0;
				positiveRating = parseInt(Math.round(positiveRating));
				$(".data01 .positiveRating").text(positiveRating);
				$(".data02 .totalNoOfRatings").text(totalNoOfRatings);
				$(".data02 .totalCompleteOffer").text(totalCompleteOffer);
				$(".myPhoto").attr('src', rootDir+'ci_upload/w131_'+data.photo);

				if(positiveRating <= 20) {
					allStars = 1;
				}else if(positiveRating > 20 && positiveRating <= 40) {
					allStars = 2;
				}else if(positiveRating > 40 && positiveRating <= 60) {
					allStars = 3;
				}else if(positiveRating > 60 && positiveRating <= 80) {
					allStars = 4;
				}else if(positiveRating > 80 && positiveRating <= 100) {
					allStars = 5;
				}
				html = '';

				if(positiveRating > 0) {
					for(x = 0; x < allStars; x++) {
						html += '<i class="ion-star highlight"></i>';
					}

					var unstar = 5 - allStars;
					for(x = 0; x < unstar; x++) {
						html += '<i class="ion-star"></i>';
					}
				}else {
					for(x = 0; x < 5; x++) {
						html += '<i class="ion-star"></i>';
					}
				}
				
				$(".allStars").html(html);
			}
		})
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
				var data = data.result;
				var html = '';

				for(var x = 0; x < data.length; x++) {
				   	html += '<li>';
						html += '<div>';
							html += '<span class="rateStars">';
								for(var z = 0; z < data[x].reviewStar; z++) {
									html += '<i class="ion-star highlight"></i>';
								}

								for(var b = 0; b < 5 - data[x].reviewStar; b++) {
									html += '<i class="ion-star"></i>';
								}

							html += '</span>';
							html += '<span class="title">'+data[x].r_title+'</span>';
						html += '</div>';
						html += '<div class="mt5">By <a href="#" class="linkToProfile" data-id="'+data[x].fromid+'">'+data[x].reviewerName+'</a> on 01/22/2018</div>';
						html += '<p class="mt10">'+data[x].reviewtext+'</p>';
					html += '</li>';
				}

				$(".reviewSection ul").html(html);

				var mainContentHeight = $("#main-content").outerHeight();
				var wrapperHeight = $("#wrapper").outerHeight();
				var additionalHeight = 0;
				if(wrapperHeight > 544) {
					additionalHeight = wrapperHeight - 544;
				}

				mainContentHeight += additionalHeight;

				$(".scrollWrap").css("height", mainContentHeight);
				var jroll = new JRoll(".scrollWrap", {
				  scrollBarY: false
				});
			}
		});
	}

	$(".reviewSection").on("click", ".linkToProfile", function() {
		var fromId = $(this).attr('data-id');
		window.location.href = '#view_profile.html?userid='+fromId;
		loadPageUrl(window.location.href);
	});

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
				reviewStat();
				loadUserReview();
				checkExistingReview();
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
					// $("#editReviewModal").

						$("#editReviewModal #rateYo").rateYo({
						    rating: reviewStar,
						    fullStar: true,
						    starWidth: "30px",
						   	onChange: function (rating, rateYoInstance) {
					  	      $("#editReviewModal .starCounter").text(rating);
					  	      $("#editReviewModal .reviewStar").val(rating);
  	   						 }
					  	});

						$("#editReviewModal .starCounter").text(reviewStar);
					  	$("#editReviewModal .reviewStar").val(reviewStar);
					  	
					// $(".editReviewForm .reviewStar option[value='"+reviewStar+"']").prop('selected', true);



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

	$(".btnWriteReview").click(function() {
		// var reviewId = $(".addReviewModal").attr('reviewid');
		checkExistingReview();
		$("#addReviewModal").modal("show");
	});

	$(".reviewEditBtn").click(function() {
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
				reviewStat();
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