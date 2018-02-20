$(function() {
	pageTitleAndLoader('Pending Payments');

	var id = localStorage.getItem("user_id");
	viewSalesPeople();
	function viewSalesPeople() {
		$.ajax({
			type: 'POST',
			url: ci_base_url+'pendingPayment', 
			dataType: "json",
			crossDomain:true, 
			data: {'userId':id},
			success: function(data) {
				console.log('data', data)
				var data = data.result;
				var html = "";
				var maxLoop  = data.length;

				for(x = 0; x < maxLoop; x++) {
					html += '<tr class="tr" data-messageid="'+data[x].accepted_message_id+'">';

						if(data[x].photo == null || data[x].photo == '') {
							html += '<td><span class="noPhoto">'+data[x].name.charAt(0)+'</span></td>';
						}else {
					  		html += '<td><img src="https://sellinghive.applite.com/ci_upload/w45_'+data[x].photo+'"></td>';
					  	}

						html += '<td>';
							html += '<h6><span class="color-green">$'+numberWithCommas(data[x].acceptedOfferAmount)+'</span> for '+stripSlashes(data[x].acceptedOfferName)+'</h6>';
							html += '<p>'+stripSlashes(data[x].acceptedOfferTerm)+'</p>';
						html += '</td>';
						html += '<td>'+data[x].todoDate;
						html += '</td>';
					html += '</tr>';
				}

				if(data.length != null && data.length != 0) {
					$(".loadSalesOffer").html(html);
				}else {
					html += '<tr class="tr height70">';
						html += '<td class="noSalesYet">No pending payments yet.</td>';
					html += '</tr>';
					$(".loadSalesOffer").html(html);
				}

			}
		});
	}

	$("table").on("click", ".tr", function() {
		var messageId = $(this).attr('data-messageid');
		if(messageId != null) {
			window.location.href = '#offer_accepted.html?message_id='+messageId;
			loadPageUrl(window.location.href);
		}
	});
});