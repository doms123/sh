
$(document).ready(function() {
	function getParam(name) {
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
	
	if(getParam("data_offer_id") != '') {
		loadDraftOfferDetails();
		function loadDraftOfferDetails() {
			var data_offer_id = getParam("data_offer_id");

			$.ajax({
				type: 'POST',
				url: ci_base_url+'viewDraftOffer',
				dataType: "json",
				crossDomain:true, 
				data : {'data_offer_id':data_offer_id},
				beforeSend: function(){
					$('body').removeClass('loaded');
					$(".preloadLogo").show();
				},
				success : function(data) {
					console.log(data);

					var data = data.result;
					var startDateObj = new Date(data.startDate);
					var endDateObj 	= new Date(data.endDate);
					var startDate 	= (startDateObj.getMonth() + 1) + '/' + startDateObj.getDate() + '/' +  startDateObj.getFullYear();
					var endDate 	= (endDateObj.getMonth() + 1) + '/' + endDateObj.getDate() + '/' +  endDateObj.getFullYear();
					$("#hiddenDraftID").val(data.offerID);
					$("#txtoffername").val(data.offerName);

					if(data.offerAmount == 0) {
						$("#txtofferamount").val('');
					}else {
						$("#txtofferamount").val(data.offerAmount);
					}
					
					$("#txtofferterms").val(data.offerTerm);
					$("#txtofferterms").val(data.offerTerm);

					if(data.offerCount <= 0) {
						$("#txtnoOfOffer").val('');
					}else {
						$("#txtnoOfOffer").val(data.offerCount);
					}

					if(startDate == '1970-01-01' || startDate == '12/30/1969' || startDate == '12/31/1969') {

						$("#txtstart").val('');
					}else {
						$("#txtstart").val(data.startDate);
					}

					if(endDate == '1970-01-01' || endDate == '12/30/1969' || endDate == '12/31/1969') {
						$("#txtends").val('');
					}else {
						$("#txtends").val(data.endDate);
					}

					$("#txtnotes").val(data.offerNotes);

					emptyfield();
				}
			});
		}
	}

	TinyDatePicker(document.querySelector('.dateStart'));
	TinyDatePicker(document.querySelector('.dateEnd'));
	var id = localStorage.getItem("user_id");

	pageTitleAndLoader('Create Offer');

	function validateEmail(email) {
	    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(email);
	}
	
	$(".dateStart, .dateEnd").focus(function() {
		setTimeout(function() {
			$(".dp-day").attr('href', window.location.href);
		}, 400);
	});


	$('.txtofferamount').keyup(function(event) {

	  // skip for arrow keys
	  if(event.which >= 37 && event.which <= 40) return;

	  // format number
	  $(this).val(function(index, value) {
	    return value
	    .replace(/\D/g, "")
	    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
	    ;
	  });
	});

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

	$( ".createOfferForm input, .back_button" ).on( "blur, click", function() {
		var txtLen = $(".createOfferForm input").val().length;
		var txtoffername = $("#txtoffername").val();
		var txtofferamount = $("#txtofferamount").val();
		txtofferamount = txtofferamount.replace(',','');
		var txtofferterms = $("#txtofferterms").val();
		var txtoffertype = 'Public';
		var startdate = $("#txtstart").val();
		var enddate = $("#txtends").val();
		var txtnotes = $("#txtnotes").val();
		var userid = id;
		var txtnoOfOffer = $("#txtnoOfOffer").val();
		var numberRegex = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
		var txtstart = convertDate(startdate); 
		var txtends = convertDate(enddate);


		if(txtnoOfOffer == 0) {
			txtnoOfOffer = -1;
		}

		if(txtLen > 0) {
			$.ajax({
				url: ci_base_url+'offerSaveDraft', 
				type: "POST",  		
				dataType: 'json',
				data: {'txtoffername': txtoffername, 'txtofferamount': txtofferamount, 'txtofferterms':txtofferterms, 'txtoffertype':txtoffertype, 'txtstart':txtstart, 'txtends':txtends, 'txtnotes':txtnotes, 'userid':userid, 'txtnoOfOffer':txtnoOfOffer},
				crossDomain: true,
				success: function(data) {
				}
			})
		}			
	});

	$('.btnSendPrivate').click(function() {
		$("#privateMsgForm").modal('show');
	});

	function today() {
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();
		
		today = mm + '/' + dd + '/' + yyyy;
		return today;
	}


	$('.btnSubmit').click(function(){
		var statusID = $(this).data("id");
		var txtoffername = $("#txtoffername").val();
		var txtofferamount = $("#txtofferamount").val();
		var txtofferterms = $("#txtofferterms").val();
		var txtoffertype = 'Public';
		var startdate = $("#txtstart").val();
		var enddate = $("#txtends").val();
		var txtnotes = $("#txtnotes").val();
		var userid = id;
		var txtnoOfOffer = $("#txtnoOfOffer").val();
		var unliCheck = $(".unliCheck").prop('checked') ? 1 : 0;
		var dateStartCheck = $(".dateStartCheck").prop('checked') ? 1 : 0;
		var dateEndCheck = $(".dateEndCheck").prop('checked') ? 1 : 0;

		var dateEndIsValid = 1;
		if(txtnoOfOffer == 0) {
			txtnoOfOffer = -1;
		}

		function processDate(date){
		   var parts = date.split("/");
		   return new Date(parts[2], parts[1] - 1, parts[0]);
		}

		var reg = /(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d/;

		if(enddate != '') {
			if(startdate != '') {
				if(processDate(startdate) > processDate(enddate)) {
					dateEndIsValid = 0;
				}else {
					if(processDate(enddate) < processDate(today())) {
						dateEndIsValid = 0;
					}else {
						dateEndIsValid = 1;
					}
				}
			}else {
				if(processDate(enddate) < processDate(today())) {
					dateEndIsValid = 0;
				}else {
					dateEndIsValid = 1;
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
			
			txtofferamount = txtofferamount.replace(',','');
			if(isNumber(txtofferamount)) {
				if (isNumber(txtnoOfOffer)) {
					$.ajax({
						url: ci_base_url+'createOffer',  
						type: "POST",  		
						dataType: 'json',
						data: {
							'txtoffername': txtoffername, 
							'txtofferamount': txtofferamount, 
							'txtofferterms':txtofferterms, 
							'txtoffertype':txtoffertype, 
							'txtstart':txtstart, 
							'txtends':txtends, 
							'txtnotes':txtnotes, 
							'statusID':statusID, 
							'userid':userid, 
							'txtnoOfOffer':txtnoOfOffer,
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
									text: 'Public offer posted',
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

	loadAllEmail();
	function loadAllEmail() {
		$.ajax({
			type: 'POST',
			url: ci_base_url+'loadAllEmail', 
			dataType: "json",
			crossDomain:true, 
			data : {'userId':id},
			success : function(data) {
				var data = data.result;
				var emailArrObj = [];
				var selectName = "";

				for(x = 0; x < data.length; x++) {
					if(data[x].alias == null || data[x].alias == "") {
						selectName = data[x].name;
					}else {
						selectName = data[x].alias;
					}
					
					emailArrObj.push({email:selectName, id:data[x].id});
				}

				var REGEX_EMAIL = '([a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@' +
				                  '(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)';

				$('#privateEmail').selectize({
				    persist: false,
				    maxItems: null,
				    valueField: 'id',
				    labelField: 'name',
				    searchField: ['email'],
				    options: emailArrObj,
				    render: {
				        item: function(item, escape) {
				            return '<div>' +
				                (item.name ? '<span class="name">' + escape(item.name) + '</span>' : '') +
				                (item.email ? '<span class="email">' + escape(item.email) + '</span>' : '') +
				            '</div>';
				        },
				        option: function(item, escape) {
				            var label = item.name || item.email;
				            var caption = item.name ? item.email : null;
				            return '<div>' +
				                '<span class="label">' + escape(label) + '</span>' +
				                (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
				            '</div>';
				        }
				    },
				    createFilter: function(input) {
				        var match, regex;

				        // email@address.com
				        regex = new RegExp('^' + REGEX_EMAIL + '$', 'i');
				        match = input.match(regex);
				        if (match) return !this.options.hasOwnProperty(match[0]);

				        // name <email@address.com>
				        regex = new RegExp('^([^<]*)\<' + REGEX_EMAIL + '\>$', 'i');
				        match = input.match(regex);
				        if (match) return !this.options.hasOwnProperty(match[2]);

				        return false;
				    },
				    create: function(input) {
				        if ((new RegExp('^' + REGEX_EMAIL + '$', 'i')).test(input)) {
				            return {email: input};
				        }
				        var match = input.match(new RegExp('^([^<]*)\<' + REGEX_EMAIL + '\>$', 'i'));
				        if (match) {
				            return {
				                email : match[2],
				                name  : $.trim(match[1])
				            };
				        }
				        return false;
				    },
				    onItemAdd: function() {
						this.close();
					},
				});
			}
		});
	}
	
	$(".sendPrivateForm").submit(function() {
		var privateEmail = $("#privateEmail").val();
		var toArray = privateEmail.split(',');
		var statusID = 2; // private offer
		var txtoffername = $("#txtoffername").val();
		var txtofferamount = $("#txtofferamount").val();

		var txtofferterms = $("#txtofferterms").val();
		var txtoffertype = 'Private';
		var startdate = $("#txtstart").val();
		var enddate = $("#txtends").val();
		var txtnotes = $("#txtnotes").val();
		var userid = id;
		var txtnoOfOffer = $("#txtnoOfOffer").val();
		if(txtnoOfOffer == 0) {
			txtnoOfOffer = -1;
		}

		var unliCheck = $(".unliCheck").prop('checked') ? 1 : 0;
		var dateStartCheck = $(".dateStartCheck").prop('checked') ? 1 : 0;
		var dateEndCheck = $(".dateEndCheck").prop('checked') ? 1 : 0;

		var reg = /(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d/;

		if(startdate != '') {
			var txtstart = convertDate(startdate); 
		}else {
			var txtstart = '';
		}
		
		var txtends = convertDate(enddate);

		$.ajax({
			url: ci_base_url+'createPrivateOffer', 	
			type: "POST",  		
			dataType: 'json',
			data: {'toArray': toArray, 'txtoffername': txtoffername, 'txtofferamount': txtofferamount, 'txtofferterms':txtofferterms, 'txtoffertype':txtoffertype, 'txtstart':txtstart, 'txtends':txtends, 'txtnotes':txtnotes, 'statusID':statusID, 'userid':userid, 'txtnoOfOffer':txtnoOfOffer, 'unliCheck': unliCheck, 'dateStartCheck': dateStartCheck, 'dateEndCheck': dateEndCheck},
			crossDomain: true,
			beforeSend: function(){
				$("#privateMsgForm").modal('show');
			},
			success: function(data) { 
				txtofferamount = txtofferamount.replace(',','');
				if (isNumber(txtofferamount)) {
					if(data.success == 2) {
						$("#privateMsgForm").modal('hide');
						$(".createOfferForm input, .createOfferForm textarea, .removeRecords").val('');
						window.location.href = '#sales_offer.html';
						setTimeout(function() {
							loadPageUrl(window.location.href);
						}, 400);
						$.toast({
						    text: 'Private offer sent',
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
					    text: 'Please enter only numbers on the offer amount field',
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

		return false;
	});

	//if empty field 
	$('.btnSendPrivate, .btnSubmit').prop('disabled',true);

	emptyfield();
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
});

