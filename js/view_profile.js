$(function() {
	pageTitleAndLoader('Profile');
	profileId = getParam('id');
	loadProfile();
	function loadProfile() {
		$.ajax({
			type: 'POST',
			url: ci_base_url+'viewProfile', 
			dataType: "json",
			crossDomain:true,
			data : {'profileId':profileId},
			success : function(data) {
				var data = data.result;
				console.log('datadatadata', data);
				if(data.reviewcount > 0) {
					html = '';
					for(x = 0; x < data.reviewcount; x++) {
						html += '<i class="fa fa-star" aria-hidden="true"></i>';
					}

					$(".star").html(html);
				}else {
					$(".star").hide();
				}
				console.log(data.photo)
				if(data.photo == '' || data.photo == null) {
					$(".profileBlock img").attr("src", "images/blank.png");
				}else {
					$(".profileBlock img").attr("src", base_url+'ci_upload/w131_'+data.photo);
				}

				if(stripSlashes(data.alias) == null || stripSlashes(data.alias) == "") {
					$(".profileName").html(stripSlashes(data.name));
				}else {
					$(".profileName").html(stripSlashes(data.alias));
				}
				

				// $(".profileEmail").html(stripSlashes(data.email));
				$(".notes").html(stripSlashes(data.about));

				$(".msgButton").attr('data-id', data.id);

 			}
		});
	}
});

$(".msgButton").click(function() {
	var userId = $(this).attr("data-id");

	window.location.href = '#create_message.html?receiver='+userId;
	loadPageUrl(window.location.href);
});





