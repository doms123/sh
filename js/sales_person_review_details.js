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
			url: ci_base_url+'loadReviewDetails1', 	
			type: "POST",  		
			dataType: 'json',
			data: {'revieweeId': revieweeId, 'offerId': offerId, 'reviewerId': reviewerId},
			crossDomain: true,
			success: function(data) { 
				var data = data.row;

				console.log('data', data);
					
				if(data.photo == null || data.photo == '') {
					$(".reviewImg").html('<span>'+data.name.charAt(0)+'</span>');
				}else {
					$(".reviewImg").html('<img src="https://sellinghive.applite.com/ci_upload/w131_'+data.photo+'">');
				}
					
				$(".reviewUserName").html(stripSlashes(data.name));

				$(".offerName").html(stripSlashes(data.offerName));


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
});