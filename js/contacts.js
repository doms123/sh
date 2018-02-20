$(function() {
	var id = localStorage.getItem("user_id");
	pageTitleAndLoader('Contacts');

	function validateEmail(email) {
	    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(email);
	}
	
	ellipsisTr();
	function ellipsisTr() {
		var trWidth = $(".componentTbl tr td:nth-child(2)").width();
		$(".componentTbl tr td:nth-child(2)").find("h6").css('width', trWidth);
		$(".componentTbl tr td:nth-child(2)").find("p").css('width', trWidth);
	}


	loadContact();
	function loadContact() {
		$.ajax({
			type: 'POST',
			url: ci_base_url+'loadContact', 
			dataType: "json",
			crossDomain:true, 	
			data : {'userId':id},
			success : function(data) {
				if(data.isSync == 1) {
					document.addEventListener("deviceready", init, false);
				}
			}
		});
	}

	$(".contact-btn").click(function() {
		$.ajax({
			type: 'POST',
			url: ci_base_url+'checkContact', 
			dataType: "json",
			crossDomain:true, 
			beforeSend: function(){
				$(".contact-btn").attr('disabled', true).find("i").attr('class', 'ion-loading-a').css('top', '6px');
			},
			data : {'userId':id},
			success : function(data) {
				$(".contact-btn").attr('disabled', false).find("i").attr('class', 'ion-upload').css('top', 'inherit');
				if(data.isSync == 1) {
					$.toast({
					    text: 'Import successful',
					    allowToastClose: false,
					    showHideTransition: 'fade',
					    position: 'bottom-center',
					    textAlign: 'center',
					    loader: false,
					    stack: false
					});
					document.addEventListener("deviceready", init, false);
				}else {
					$.toast({
					    text: 'Connection Success',
					    allowToastClose: false,
					    showHideTransition: 'fade',
					    position: 'bottom-center',
					    textAlign: 'center',
					    loader: false,
					    stack: false
					});

					document.addEventListener("deviceready", init, false);
				}
			}
		});
	});

	function init() {
		var options = new ContactFindOptions();
		options.filter = "";
		options.multiple = true;
		var fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
	  	navigator.contacts.find(fields,gotContacts,errorHandler, options);
	}

	function errorHandler(e) {
	 	console.log("errorHandler: "+e);
	}

	function gotContacts(c) {
		html = "";
		if(c.length != 0) {
			for(var i = 0, len = c.length; i < len; i++) {
				var name = c[i].name;
				html += '<tr class="tr">';
					if(c[i].phoneNumbers && c[i].phoneNumbers.length > 0) {
						if(!c[i].displayName || c[i].displayName === '') {
							html += '<td>';
								html += '<span class="noPhoto">'+name.givenName.charAt(0)+'</span>';
							html += '</td>';
							html += '<td>';
							html += '<h6>'+name.givenName+'</h6>';
						}else {
							html += '<td>';
								html += '<span class="noPhoto">'+c[i].displayName.charAt(0)+'</span>';
							html += '</td>';
							html += '<td>';
							html += '<h6>'+c[i].displayName+'</h6>';
						}
					}

					html += '<p>Mobile: '+c[i].phoneNumbers[0].value+'</p>';

					if(c[i].emails && c[i].emails.length > 0) {
						html += '<p>Email: '+c[i].emails[0].value+'</p>';
					}
					html += '</td>';
					html += '<td class="delContact" data-contactid="'+c[i].id+'"><i class="ion-trash-a"></i></td>';
				html += '</tr>';
			}
		}else {
			html += '<tr><td rowspan="3" class="loadingMsg">No Contacts yet.</td></tr>';
		}

		$(".contactList").html(html);
	}

	$(".contactList").delegate(".delContact", "click", function(){
    	var contactId = $(this).attr('data-contactid');
    	$(".deleteHiddenId").val(contactId);

		$("#deleteContactModal").modal('show');
	});


	$(".deleteContactForm").submit(function() {
		var contactId = $(".deleteHiddenId").val();
		$("#deleteContactModal").modal('hide');

    	var options = new ContactFindOptions();
    	   options.filter = contactId;
    	   options.multiple = false;
    	   fields = ["id"];
    	   navigator.contacts.find(fields, contactfindSuccess, contactfindError, options);

    	   function contactfindSuccess(contacts) {
    	      var contact = contacts[0];
    	      contact.remove(contactRemoveSuccess, contactRemoveError);

    	      function contactRemoveSuccess(contact) {
    	      	document.addEventListener("deviceready", init, false);
    	      	$.toast({
    	      	    text: 'The contact was deleted',
    	      	    allowToastClose: false,
    	      	    showHideTransition: 'fade',
    	      	    position: 'bottom-center',
    	      	    textAlign: 'center',
    	      	    loader: false,
    	      	    stack: false
    	      	});
    	      }

    	      function contactRemoveError(message) {
    	         console.log('Failed because: ' + message);
    	      }
    	   }

    	   function contactfindError(message) {
    	      console.log('Failed because: ' + message);
    	   }

		return false;
	});

	$(".addContact").click(function() {
		$("#addContactModal").modal("show");
	});

	$(".saveNewForm").submit(function(e) {
		e.preventDefault();
		var displayName = $(".addContactName").val().replace(/\s/g, '');
		var phoneNo = $(".addMobile").val().replace(/\s/g, '');
		var phoneEmail = $(".addEmail").val().replace(/\s/g, '');
		var regex=/^[0-9]+$/;

		if(phoneNo.match(regex)) {
			if (validateEmail(phoneEmail)) {
				var contactNames = [];
				$(".contactName").each(function() {
			    	contactNames.push($(this).text().replace(/\s/g, ''));
				});

				var contactNumbers = [];
				$(".contactNumber").each(function() {
			    	contactNumbers.push($(this).text().replace(/\s/g, ''));
				});

				var contactEmails = [];
				$(".contactEmail").each(function() {
			    	contactEmails.push($(this).text().replace(/\s/g, ''));
				});

				if(jQuery.inArray(displayName, contactNames) === -1) {
					if(jQuery.inArray(phoneNo, contactNumbers) === -1) {
						if(jQuery.inArray(phoneEmail, contactEmails) === -1) {
							var myContact = navigator.contacts.create({"displayName": displayName});

							var name = new ContactName();
							name.givenName = displayName;
							myContact.name = name;

							var phoneNumbers = [];
							phoneNumbers[0] = new ContactField('work', phoneNo, false);
							phoneNumbers[1] = new ContactField('mobile', phoneNo, true); // preferred number
							phoneNumbers[2] = new ContactField('home', phoneNo, false);
							myContact.phoneNumbers = phoneNumbers;

							var phoneEmails = [];
							phoneEmails[0] = new ContactField('work', phoneEmail, false);
							phoneEmails[1] = new ContactField('mobile', phoneEmail, true); // preferred number
							phoneEmails[2] = new ContactField('home', phoneEmail, false);
							myContact.emails = phoneEmails;

							myContact.save(onSuccessCallBack, onErrorCallBack);
						}else {
							$.toast({
							    text: 'Contact email already exist!',
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
						    text: 'Contact number already exist!',
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
					    text: 'Contact name already exist!',
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
				    text: 'Email address is invalid!',
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
			    text: 'Mobile number is invalid!',
			    allowToastClose: false,
			    showHideTransition: 'fade',
			    position: 'bottom-center',
			    textAlign: 'center',
			    loader: false,
			    stack: false
			});
		}

		return false;
	});

	function onSuccessCallBack(contact) {
		$("#addContactModal").modal('hide');
		$(".addContactName, .addMobile, .addEmail").val("");

		document.addEventListener("deviceready", init, false);

		$.toast({
		    text: 'Contact saved',
		    allowToastClose: false,
		    showHideTransition: 'fade',
		    position: 'bottom-center',
		    textAlign: 'center',
		    loader: false,
		    stack: false
		});
	};

	function onErrorCallBack(contactError) {
	    console.log("Error = " + contactError.code);
	};
});
