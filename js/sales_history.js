$(function() {
	$(".page-title").text("History");
	var id = localStorage.getItem("user_id");
	var historyType = 1;

	var jroll = new JRoll("#historyWrap", {
      scrollBarY: false
    });

    jroll.pulldown({
      	refresh: function(complete) {
      		pulldown = 1;
			start = 1;
			currentPage = 1;

			$("#historyBody").html('<tr><td rowspan="3" class="loadingMsg"><i class="ion-loading-a"></i> &nbsp;Loading . . .</td></tr>');
			loadHistory(historyType);
      		complete();
      	}
    });

    $(".historyNav button").click(function() {
    	historyType = $(this).attr("data-id");
    	loadHistory(historyType);
    });

    loadHistory(historyType);

    function loadHistory(type) {
    	$(".historyNav button").removeAttr('style');
    	if(type == 1) {
    		$(".historyBtn1").css("background", "#c9b56a");
    	}else {
    		$(".historyBtn2").css("background", "#c9b56a");
    	}

		$.ajax({
			url: ci_base_url+'loadHistory',  	
			type: "POST",  		
			dataType: 'json',
			data: {'userId':id, 'historyType': historyType},
			crossDomain: true,
			beforeSend: function(){
				$("#historyBody").html('<tr><td class="loadingMsg"><i class="ion-loading-a"></i> &nbsp;Loading . . .</td></tr>');
			},
			success: function(data) {
				var data = data.result;
				var maxLoop = data.length;

				var html = "";
				if(maxLoop > 0) {
					for(var x = 0; x < maxLoop; x++) {
					   	html += '<tr class="tr" data-id="'+data[x].accepted_message_id+'">';
							html += '<td>';
								if(data[x].offer_creator_id == id) { // you are offer Creator
									html += '<img src="https://sellinghive.applite.com/ci_upload/w45_'+data[x].negotiatorPhoto+'">';
								}else {
									html += '<img src="https://sellinghive.applite.com/ci_upload/w45_'+data[x].creatorPhoto+'">';
								}
							html += '</td>';
							html += '<td>';
								html += '<h6><span class="color-green fsize13 fwB">$'+numberWithCommas(data[x].acceptedOfferAmount)+'</span> for <span class="fwB">Test message</span></h6>';
								if(data[x].offer_creator_id == id) { // you are offer Creator
									html += '<p>with <span class="fwB">'+data[x].negotiatorName+'</span></p>';
								}else {
									html += '<p>with <span class="fwB">'+data[x].creatorName+'</span></p>';
								}
							html += '</td>';
							html += '<td>'+data[x].historyDateFormatted+'</td>';
						html += '</tr>';
					}
					
					$("#historyBody").html(html);
				}else {
					$("#historyBody").html('<td class="noResult">No History yet.</td>');
				}
			}
		});
    }

    $("#historyBody").on("click", ".tr", function() {
    	var historyId = $(this).attr('data-id');

    	window.location.href = '#history_detail.html?message_id='+historyId;
    	loadPageUrl(window.location.href);
    });
});
