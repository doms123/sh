$(document).ready(function() {
	if (localStorage.getItem("UserEmail") === null) {
		$('#sh_content').load('login.html');
	}

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

	loadReviewList();
	function loadReviewList() {
		var sales_id = getParam('review_id');
		var fromID = localStorage.getItem("user_id");
		$.ajax({
			type: 'GET',
			url: base_url+'settings/review/load_review_details.php', 
			dataType: "jsonp",
			crossDomain:true,
			data: {'sales_id':sales_id, 'fromID':fromID},
			beforeSend: function(){
				$('body').removeClass('loaded');
				$(".preloadLogo").show();
			},
			success : function(response) {
				console.log(response)
				$('body').addClass('loaded');
				$(".preloadLogo").fadeOut();
				// console.log(response)
				var data = response.result;
				console.log(data);
				if(response.success == 1) { 
					
					html = '';
					var counter = 0;
					var reviewCount = 0;
					$.each(data, function(key, value) {
						var newValue = value.split('#');
						html += '<tr>';
							html += '<td><i class="fa fa-comment" aria-hidden="true"></i></td>';
							html += '<td class="reviewDisplay">'+newValue[2]+'</td>';
						html += '</tr>';
						counter++;
						reviewCount += parseInt(newValue[1]);
					});
					var totalStars = Math.ceil(reviewCount / counter);
					var star = '';

					for(x = 0; x < totalStars; x++) {
						star += '<i class="fa fa-star" aria-hidden="true"></i>';
					}
					$(".starCount").text("("+totalStars+")");
					updateTotalStar(totalStars, sales_id);
					$(".starRating").html(star);
					$(".table-review").html(html);
				}

				if(response.check_exist == 0) {
					$("#reviewAddModal").find("form").attr('class', 'addReviewForm');
					$("#reviewAdd").text('Add').attr('class', 'reviewAdd');
					$(".modalTitle").text('Add Review');
				}else {
					$("#reviewAddModal").find("form").attr('class', 'editReviewForm');
					$("#reviewAdd").text('Edit').attr('class', 'reviewEdit rad15');
					$(".modalTitle").text('Edit Review');
				}

				$(".person-name").text(response.sales_name);
			}
		});
	}

	function updateTotalStar(total_stars, sales_id) {
		$.ajax({
			type: 'GET',
			url: base_url+'settings/review/updateTotalStar.php', 
			dataType: "jsonp",
			crossDomain:true,
			data: {'user_id':sales_id, 'total_stars':total_stars},
			success : function(response) {
				console.log('doms'+response);
			}
		});	
	}

	$("#reviewAdd").click(function() {
		
		if($(this).hasClass("reviewEdit")) {
			var sales_id = getParam('review_id');
			var user_id = localStorage.getItem("user_id");

			$.ajax({
				type: 'GET',
				url: base_url+'settings/review/load_edit_review.php', 
				dataType: "jsonp",
				crossDomain:true,
				data: {'sales_id':sales_id, 'user_id':user_id},
				beforeSend: function(){
					$('body').removeClass('loaded');
					$(".preloadLogo").show();
				},
				success : function(response) {
					$('body').addClass('loaded');
					$(".preloadLogo").fadeOut();

					var data = response.result;
					$.each(data, function(key, value) {
						var newValue = value.split('#');
						$('#reviewriting_edit option[value='+newValue[1]+']').attr('selected','selected');
						$('#reviewtext_edit').val(newValue[0]);
						setTimeout(function() {
							$("#reviewEditModal").modal('show');
						}, 1500);
					});
				}
			});	
		}else {
			$("#reviewAddModal").modal('show');
		}
	});

	$(".addReviewForm").submit(function() {
		$("#reviewAddModal").modal('hide');
		var sales_id = getParam('review_id');
		var reviewriting = $(".reviewriting").val();
		var reviewtext = $(".reviewtext").val().replace(/\s/g, '');
		var user_id = localStorage.getItem("user_id");
		$.ajax({
			type: 'GET',
			url: base_url+'settings/review/add_sales_review.php', 
			dataType: "jsonp",
			crossDomain:true,
			data: {'sales_id':sales_id, 'reviewriting':reviewriting, 'reviewtext':reviewtext, 'user_id':user_id},
			beforeSend: function(){
				$('body').removeClass('loaded');
				$(".preloadLogo").show();
			},
			success : function(response) {
				$('body').addClass('loaded');
				$(".preloadLogo").fadeOut();
				setTimeout(function() {
					if(response.success == 1) {
						$(".modelText").text('Success! review saved');
						$("#myModal").modal('show');
						loadReviewList();
					}	
				}, 1500);
			}
		});
		return false;
	});

	$(".editReviewForm").submit(function(e) {
		$("#reviewEditModal").modal('hide');
		var reviewriting_edit = $("#reviewriting_edit").val();
		var reviewtext_edit = $("#reviewtext_edit").val();
		var sales_id = getParam('review_id');
		var user_id = localStorage.getItem("user_id");
		$.ajax({
			type: 'GET',
			url: base_url+'settings/review/save_edit_review.php', 
			dataType: "jsonp",
			crossDomain:true,
			data: {'sales_id':sales_id, 'reviewriting':reviewriting_edit, 'reviewtext':reviewtext_edit, 'user_id':user_id},
			beforeSend: function(){
				$('body').removeClass('loaded');
				$(".preloadLogo").show();
			},
			success : function(response) {
				$('body').addClass('loaded');
				$(".preloadLogo").fadeOut();
				setTimeout(function() {
					if(response.success == 1) {
						$(".modelText").text('Success! review saved');
						$("#myModal").modal('show');
						loadReviewList();
					}	
				}, 1500);
			}
		});

		return false;
	});



});