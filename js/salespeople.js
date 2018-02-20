$(function() {
	pageTitleAndLoader('Sales people');

	// var jroll = new JRoll(".content", {
 //      scrollBarY: false
 //    });

   //  jroll.pulldown({
   //    	refresh: function(complete) 	{
   //    		pulldown = 1;
			// $(".loadSalesOffer").html('<tr><td rowspan="3" class="loadingMsg"><i class="ion-loading-a"></i> &nbsp;Loading . . .</td></tr>');
			// viewSalesPeople();
   //    		complete();
   //    	}
   //  });

	var id = localStorage.getItem("user_id");
	viewSalesPeople();
	function viewSalesPeople() {
		$.ajax({
			type: 'POST',
			url: ci_base_url+'viewSalesPeople', 
			dataType: "json",
			crossDomain:true, 
			data: {'userId':id},
			success: function(data) {
				console.log('data', data)
				var data = data.result;
				var html = "";
				
				for(x = 0; x < data.length; x++) {
				   	html += '<tr class="tr height70" data-profile="'+data[x].id+'">';
				   		html += '<td>';
				   			if(data[x].photo == '' || data[x].photo == null) {
				   				if(data[x].alias == null || data[x].alias == "") {
				   					html += '<span class="noPhoto">'+data[x].name.charAt(0)+'</span>';
				   				}else {
				   					html += '<span class="noPhoto">'+data[x].alias.charAt(0)+'</span>';
				   				}
				   			}else {
				   				html += '<img src="https://sellinghive.applite.com/ci_upload/w45_'+data[x].photo+'">';
				   			}
				   		html += '</td>';
				   		html += '<td>';
				   			if(data[x].alias == null || data[x].alias == "") {
				   				html += '<h6>'+data[x].name+'</h6>';
				   			}else {
				   				html += '<h6>'+data[x].alias+'</h6>';
				   			}
				   			html += '<span class="salesRating">';
				   				if(data[x].reviewcount != 0) {
				   					for(y = 0; y < data[x].reviewcount; y++) {
				   						html += '<i class="ion-star"></i>';
				   					}
				   				}
				   			html += '</span>';
				   			var offerAccepted = data[x].offerAcceptedIds;
				   			for(y = 0; y < offerAccepted.length; y++) {
				   				html += '<p>'+offerAccepted[y].offerName+' - <span class="color-green">  $'+numberWithCommas(offerAccepted[y].offerAmount)+'</span></p>';
				   			}
				   			
				   		html += '</td>';
				   	html += '</tr>';
				}

				if(data.length != null && data.length != 0) {
					$(".loadSalesOffer").html(html);
				}else {
					html += '<tr class="tr height70">';
						html += '<td class="noSalesYet">No sales people yet.</td>';
					html += '</tr>';
					$(".loadSalesOffer").html(html);
				}

				// jroll.refresh();
			}
		});
	}

	$("table").on("click", ".tr", function() {
		var profileId = $(this).attr('data-profile');
		if(profileId != null) {
			window.location.href = '#view_profile.html?id='+profileId;
			loadPageUrl(window.location.href);
		}
	});
});
