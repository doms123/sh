$(function() {
	var id = localStorage.getItem("user_id");
	var reviewerId = getParam('reviewerid');
	pageTitleAndLoader('Review Details');
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

	loadReviewDetails();
	function loadReviewDetails() {
		var revieweeId = getParam('userid');
		var offerId = getParam('offerid');
		
		$.ajax({
			url: ci_base_url+'loadReviewDetails', 	
			type: "POST",  		
			dataType: 'json',
			data: {'revieweeId': revieweeId, 'offerId': offerId, 'reviewerId': reviewerId},
			crossDomain: true,
			beforeSend: function(){
				
			},
			success: function(data) { 
				var data = data.row;
					
				if(data.photo == null || data.photo == '') {
					$(".reviewImg").html('<span>'+data.name.charAt(0)+'</span>');
				}else {
					$(".reviewImg").html('<img src="https://sellinghive.applite.com/ci_upload/w131_'+data.photo+'">');
				}
					
				$(".reviewUserName").html(stripSlashes(data.name));


				if(data.reviewStar > 0) {
					var star = "";
					for(y = 0; y < data.reviewStar; y++) {
						star += '<i class="ion-star"></i>';
					}

					$(".reviewStars .starLoop").html(star);
					$(".starCount").html('('+data.reviewStar+')');
				}else {
					$(".reviewStars .starLoop").html('');
					$(".starCount").html('');
				}

				$(".reviewTitle").html(data.r_title);
				$(".reviewText").html(data.reviewtext);


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
			}
		});
	}

	if(reviewerId == id) {
		console.log('true');
		$(".reviewEditBtn").show();
	}else {
		$(".reviewEditBtn").hide();
		console.log('false');
	}

	$(".reviewEditBtn").click(function() {
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
				loadReviewDetails();

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
});