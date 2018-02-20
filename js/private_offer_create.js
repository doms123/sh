$(document).ready(function() {
	var id = localStorage.getItem("user_id");

	$('body').removeClass('loaded');
	$(".preloadLogo").show();

	setTimeout(function() {
		$('body').addClass('loaded');
		$(".preloadLogo").fadeOut();	
	}, 700);

	$(".page-title").text("PRIVATE OFFER");

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
	getOfferName()
	function getOfferName() {
		var offer_parent_id = getParam("parent_id");
	
		$.ajax({
			url: base_url+'offers/get_offername.php',  
			type: "POST",  		
			dataType: 'json',
			data: {'offer_id':offer_parent_id},
			crossDomain: true,
			success: function(data) {
				console.log(data);
				var data = data.result;

				$.each(data, function(key, value) {
					var newValue = value.split('#');
					$("#txtoffername").val(newValue[0]);
				});
			}
		})
	}

	$(".createOfferForm input").blur(function() {
		var txtLen = $(this).val().length;
		var txtoffername = $("#txtoffername").val();
		var txtofferamount = $("#txtofferamount").val();
		var txtofferterms = $("#txtofferterms").val();
		var txtoffertype = $("#txtoffertype").val();
		var startdate = $("#txtstart").val();
		var enddate = $("#txtends").val();
		var txtnotes = $("#txtnotes").val();
		var userid = id;
		var txtnoOfOffer = $("#txtnoOfOffer").val();
		var numberRegex = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;

		var convertDate = function(usDate) {
			var dateParts = usDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
		  	return dateParts[3] + "-" + dateParts[1] + "-" + dateParts[2];
		}
		var txtstart = convertDate(startdate); 
		var txtends = convertDate(enddate);
		if(txtLen > 0) {
			$.ajax({
				url: base_url+'offers/offer_save_draft.php',  
				type: "POST",  		
				dataType: 'json',
				data: {'txtoffername': txtoffername, 'txtofferamount': txtofferamount, 'txtofferterms':txtofferterms, 'txtoffertype':txtoffertype, 'txtstart':txtstart, 'txtends':txtends, 'txtnotes':txtnotes, 'userid':userid, 'txtnoOfOffer':txtnoOfOffer},
				crossDomain: true,
				success: function(data) {
				}
			})
		}			
		return false;
	});

	$(".createOfferForm").submit(function(e) {
			e.preventDefault();
			var statusID = 2;
			var txtoffername = $("#txtoffername").val();
			var txtofferamount = $("#txtofferamount").val();
			var txtofferterms = $("#txtofferterms").val();
			var txtoffertype = $("#txtoffertype").val();
			var startdate = $("#txtstart").val();
			var enddate = $("#txtends").val();
			var txtnotes = $("#txtnotes").val();
			var userid = id;
			var hiddenToId = getParam("offer_to_id");

			var txtnoOfOffer = $("#txtnoOfOffer").val();
			var reg = /(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d/;
			var convertDate = function(usDate) {
				var dateParts = usDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
			  	return dateParts[3] + "-" + dateParts[1] + "-" + dateParts[2];
			}
			var txtstart = convertDate(startdate); 
			var txtends = convertDate(enddate);
			if (startdate != '' && enddate != '') {
				$.ajax({
					url: base_url+'offers/negotiate_private_offer.php',  	
					type: "POST",  		
					dataType: 'json',
					data: {'txtoffername': txtoffername, 'txtofferamount': txtofferamount, 'txtofferterms':txtofferterms, 'txtoffertype':txtoffertype, 'txtstart':txtstart, 'txtends':txtends, 'txtnotes':txtnotes, 'statusID':statusID, 'userid':userid, 'txtnoOfOffer':txtnoOfOffer, 'hiddenToId':hiddenToId},
					crossDomain: true,
					beforeSend: function(){
						$('body').removeClass('loaded');
						$(".preloadLogo").show();
					},
					success: function(data) {
						console.log(data)
						$('body').addClass('loaded');
						$(".preloadLogo").fadeOut();
						setTimeout(function(){
							if(data.success == 3) { 
								$(".modelText").text('Offer sent.');
								$("#myModal").modal('show');
								$(".createOfferForm input, .createOfferForm textarea").val('');
							}else if(data.success == 0) { 
								$(".modelText").text('Please fill up all fields except optional.');
								$("#myModal").modal('show');
							}
						}, 1500);
						$("#message-form").find('.removeRecords').val('');
						$(".fileName").text('');
					}
				})
			}else {
				$(".modelText").text('Opps! Date start and Date end are required.');
				$("#myModal").modal('show');
			}
		

	});

});

