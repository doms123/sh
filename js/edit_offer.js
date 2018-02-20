$(document).ready(function() {
	TinyDatePicker(document.querySelector('.dateStart'));
	TinyDatePicker(document.querySelector('.dateEnd'));
	var id = localStorage.getItem("user_id");
	var offerId = getParam("editId");

	function today() {
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();
		
		today = mm + '/' + dd + '/' + yyyy;
		return today;
	}

	function convertDateWithSlashes(inputFormat) {
		if(inputFormat == '1970-01-01') {
			return 'N/A';
		}else {
			function pad(s) { return (s < 10) ? '0' + s : s; }
		  	var d = new Date(inputFormat);
		  	return [pad(d.getMonth()+1), pad(d.getDate()), d.getFullYear()].join('/');
	  	}
	}

	$(".unliCheck").click(function() {
		if($(this).prop('checked') == true) {
			$(".txtnoOfOffer").hide().val('');
		}else {
			$(".txtnoOfOffer").show().focus();
		}
	});

	$(".dateStartCheck").click(function() {
		if($(this).prop('checked') == true) {
			$(".dateStart").hide().val('');
		}else {
			$(".dateStart").show().focus();
		}
	});

	$(".dateEndCheck").click(function() {
		if($(this).prop('checked') == true) {
			$(".dateEnd").hide().val('');
		}else {
			$(".dateEnd").show().focus();
		}
	});

	salesOfferDetail(offerId);
	function salesOfferDetail(offerId) {
		$.ajax({

			type: 'POST',
			url: ci_base_url+'viewOfferDetails',
			dataType: "json",
			crossDomain:true, 
			data : {'offer_id': offerId, 'userID':id},
			beforeSend: function() {
				$(".offerNumber, .offerName, .offerCreator, .offerTerm, .offerAmount, .offerType, .newStartDate, .newEndDate, .offerNotes").html("loading . . .");
			},
			success : function(data) {
				var data = data.result;
				console.log(data)
				$(".btnSubmit").attr('data-id', data.offerStatus);
				$(".tempStorage").html(data.offerName);
				var offerName = $(".tempStorage").text();
				$(".txtoffername").val(stripSlashes(offerName));

				$(".tempStorage").html(data.offerAmount);
				var offerAmount = $(".tempStorage").text();
				$(".txtofferamount").val(stripSlashes(offerAmount));

				$(".tempStorage").html(data.offerTerm);
				var offerTerm = $(".tempStorage").text();
				$(".txtofferterms").val(stripSlashes(offerTerm));

				if(data.offerCount != -1) {
					$(".txtnoOfOffer").val(data.offerCount);
				}

				$(".dateStart").val(convertDateWithSlashes(data.startDate));

				if(data.endDate != '1970-01-01') {
					$(".dateEnd").val(convertDateWithSlashes(data.endDate));
				}

				$(".tempStorage").html(data.offerNotes);
				var offerNotes = $(".tempStorage").text();
				$(".txtnotes").val(stripSlashes(offerNotes));

				if(data.isDSindefinite == 1) {
					$(".dateStartCheck").prop('checked', true);
					$(".dateStart").hide().val('');
				}else {
					$(".dateStartCheck").prop('checked', false);
					$(".dateStart").show();
				}

				if(data.isDEindefinite == 1) {
					$(".dateEndCheck").prop('checked', true);
					$(".dateEnd").hide().val('');
				}else {
					$(".dateEndCheck").prop('checked', false);
					$(".dateEnd").show();
				}

				if(data.isOfferUnli == 1) {
					$(".unliCheck").prop('checked', true);
					$(".txtnoOfOffer").hide().val('');
				}else {
					$(".unliCheck").prop('checked', false);
					$(".txtnoOfOffer").show();
				}
			}
		});
	}







	pageTitleAndLoader('Edit Offer');
	
	$(".dateStart, .dateEnd").focus(function() {
		setTimeout(function() {
			$(".dp-day").attr('href', window.location.href);
		}, 400);
	});


	$('.btnSubmit').click(function(){
		var statusID = $(this).data("id");
		var txtoffername = $("#txtoffername").val();
		var txtofferamount = $("#txtofferamount").val();
		txtofferamount = Math.floor(txtofferamount);
		var txtofferterms = $("#txtofferterms").val();
		var txtoffertype = 'Public';
		var startdate = $("#txtstart").val();
		var enddate = $("#txtends").val();
		var txtnotes = $("#txtnotes").val();
		var userid = id;
		var txtnoOfOffer = $("#txtnoOfOffer").val();
		var dateEndIsValid = 1;
		var unliCheck = $(".unliCheck").prop('checked') ? 1 : 0;
		var dateStartCheck = $(".dateStartCheck").prop('checked') ? 1 : 0;
		var dateEndCheck = $(".dateEndCheck").prop('checked') ? 1 : 0;

		if(txtnoOfOffer == 0) {
			txtnoOfOffer = -1;
		}

		var reg = /(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d/;

		if(enddate != '') {
			if(startdate != '') {
				if(convertDate(startdate) > convertDate(enddate)) {
					dateEndIsValid = 0;
				}
			}else {
				if(enddate < today()) {
					dateEndIsValid = 0;
				}
			}
		}

		if(startdate != '') {
			var txtstart = convertDate(startdate); 
		}else {
			var txtstart = '';
		}

		var txtends = convertDate(enddate);
		if(dateEndIsValid) {
			if(isNumber(txtofferamount)) {
				if (isNumber(txtnoOfOffer)) {
					$.ajax({
						url: ci_base_url+'createOfferForEdit',  
						type: "POST",  		
						dataType: 'json',
						data: {'txtoffername': txtoffername, 
								'txtofferamount': txtofferamount, 
								'txtofferterms':txtofferterms, 
								'txtoffertype':txtoffertype, 
								'txtstart':txtstart, 
								'txtends':txtends, 
								'txtnotes':txtnotes, 
								'statusID':statusID, 
								'userid':userid, 
								'txtnoOfOffer':txtnoOfOffer, 
								'offerId': offerId, 
								'unliCheck': unliCheck, 
								'dateStartCheck': dateStartCheck,
								'dateEndCheck': dateEndCheck
							},
						crossDomain: true,
						beforeSend: function(){
							$(".btnSubmit").attr('disabled', true);
							$(".btnSubmit").find("i").attr('class', 'ion-loading-a').css('top','6px');
							
						},
						success: function(data) {
							$(".btnSubmit").attr('disabled', false);
							$(".btnSubmit").find("i").attr('class', 'ion-pin left13').css('top','inherit');
							

							if(data.success == 3) { 
								$(".createOfferForm input, .createOfferForm textarea").val('');
								window.location.href = '#sales_offer.html';
								loadPageUrl(window.location.href);
								
								$.toast({
									text: 'Offer saved',
									allowToastClose: false,
									showHideTransition: 'fade',
									position: 'bottom-center',
									textAlign: 'center',
									loader: false,
									stack: false,
								});
							}else if(data.success == 0) { 
								$.toast({
									text: 'Please fill up all fields except optional',
									allowToastClose: false,
									showHideTransition: 'fade',
									position: 'bottom-center',
									textAlign: 'center',
									loader: false,
									stack: false
								});
							}
						}
					});
				}else{
					$.toast({
						text: 'Please enter only numbers on the number of offers field',
						allowToastClose: false,
						showHideTransition: 'fade',
						position: 'bottom-center',
						textAlign: 'center',
						loader: false,
						stack: false
					});
				}
			}else{
				$.toast({
					text: 'Please enter only numbers on the offer amount field',
					allowToastClose: false,
					showHideTransition: 'fade',
					position: 'bottom-center',
					textAlign: 'center',
					loader: false,
					stack: false
				});
			}
		}else {
			$.toast({
				text: 'Please select a valid offer end date',
				allowToastClose: false,
				showHideTransition: 'fade',
				position: 'bottom-center',
				textAlign: 'center',
				loader: false,
				stack: false
			});
		}
	});

	 $(".createOfferForm").submit(function(e) {
	 	e.preventDefault();
	});

	function emptyfield(){
		if($('#txtoffername').val() == '' || $('#txtofferamount').val() == '' || $('#txtofferterms').val() == '' || $('#txtoffertype').val() == '') {
		$('.btnSendPrivate, .btnSubmit').prop('disabled',true);
		}else{
			$('.btnSendPrivate, .btnSubmit').prop('disabled',false);
		}	
	}
	
	$('#txtoffername, #txtofferamount, #txtofferterms').keyup(function(){
		emptyfield();
	});

	$('#txtoffertype').change(function(){
		emptyfield();
	});

	$(".backBtn").click(function(){
		history.back();
		setTimeout(function() {
		    loadPageUrl(window.location.href);
		}, 200);
	});
});

