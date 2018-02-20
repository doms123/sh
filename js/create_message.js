$(function() {
	var id = localStorage.getItem("user_id");
	$('.form-control').on('focus blur', function (e) {
	    $(this).parents('.form-group').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
	}).trigger('blur');

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
	
	if(getParam('receiver') != '') {
		var receiver = getParam('receiver');
	}

	if(getParam('linkToReplyMessageId') != '') {
		var linkToReplyMessageId = getParam('linkToReplyMessageId');
		$(".linkToReplyMessageId").val(linkToReplyMessageId);
	}

	pageTitleAndLoader('Create Message');
	$(".userId").val(id);

	selectizeDropdown();
	function selectizeDropdown() {
		selectizeDropdown = $('.msgEmail').selectize({
			create: false,
			sortField: {
				field: 'text',
				direction: 'asc'
			},
			dropdownParent: 'body'
		});
	}

	loadAllEmail();
	function loadAllEmail() {
		$.ajax({
			type: 'POST',
			url: ci_base_url+'loadAllEmail',
			dataType: "json",
			crossDomain:true, 
			data: {'userId':id},
			success: function(data) {
				console.log('data', data)
				var data = data.result;
				var maxLoop = data.length;

				var emailArr = [];
				var emailCount = 1;

				var selectName = "";

				for(x = 0; x < maxLoop; x++) {
					if(data[x].alias == null || data[x].alias == "") {
						selectName = data[x].name;
					}else {
						selectName = data[x].alias;
					}

					var sanitizeTxt = $(".sanitizeTxt").html(selectName);

					selectName = stripSlashes(sanitizeTxt.html());

					emailArr.push({value: data[x].id, text: selectName});

					emailCount++;
				}

				selectizes = selectizeDropdown[0].selectize;
				selectizes.clearOptions()
				selectizes.addOption(emailArr)
				setTimeout(function() {
						if(getParam('receiver') != '') {
							selectizeDropdown[0].selectize.setValue(getParam('receiver')); // set default selected 
							selectizes.disable();
						}
						selectizes.refreshItems();
						$(".emailId").val($("#select-beast").val());
				}, 400);
			}
		});	
	}


	// if draft
	$(".btnDraftMsg").click(function(e) {
		e.preventDefault();
		var draft = $('.is_draft').val('1');
		$(".createMessageForm").submit();
	});

	//if message
	$(".btnSaveMessage").click(function(e) {
		e.preventDefault();
		$('.is_draft').val('0');
		$(".createMessageForm").submit();
	});

	$('.createMessageForm').submit(function(e) {
		e.preventDefault();
		var formData = new FormData(this);                             
		$.ajax({
           	url: ci_base_url+'createMessage',
            dataType: 'json',  
            crossDomain:true,
            contentType: false,
            processData: false,
            data: formData,                         
            type: 'POST',
			beforeSend: function(){
				$(".btnDraftMsg, .btnSaveMessage").attr('disabled', true);
				if($(".is_draft").val() == 1) { // saveDraft button
					$(".btnDraftMsg").find("i").attr('class', 'ion-loading-a').css('top','6px');
				}else {
					$(".btnSaveMessage").find("i").attr('class', 'ion-loading-a').css('top','6px');
				}
			},
            success: function(data) {
            	$.toast().reset('all');
            	$(".btnDraftMsg, .btnSaveMessage").attr('disabled', false);
            	if($(".is_draft").val() == 1) { // saveDraft button
            		$(".btnDraftMsg").find("i").attr('class', 'ion-archive').css('top','inherit');
            	}else {
            		$(".btnSaveMessage").find("i").attr('class', 'ion-paper-airplane').css('top','inherit');
            	}
                if(data.success == 1) {
                	$(".msgSubject, .msgBody, .userFile").val('');
	            	$.toast({
					    text: 'Message was sent',
					    allowToastClose: false,
					    showHideTransition: 'fade',
					    position: 'bottom-center',
					    textAlign: 'center',
					    loader: false,
					    stack: false,  
					});
					window.location.href = '#messaging.html';
					loadPageUrl(window.location.href);
                }else if(data.success == 0) {
                	var error = data.error.split('</p>');
                	var error = error[0].replace('<p>','');
                	$.toast({
					    text: error,
					    allowToastClose: false,
					    showHideTransition: 'fade',
					    position: 'bottom-center',
					    textAlign: 'center',
					    loader: false,
					    stack: false,  
					});
                }
                else if(data.success == 2) {
                	$.toast({
					    text: 'Sending failed, all fields are required',
					    allowToastClose: false,
					    showHideTransition: 'fade',
					    position: 'bottom-center',
					    textAlign: 'center',
					    loader: false,
					    stack: false,  
					});
                }else if(data.success == 3) {
                	$(".msgSubject, .msgBody, .userFile").val('');
                	$.toast({
					    text: 'Messages is saved in your draft',
					    allowToastClose: false,
					    showHideTransition: 'fade',
					    position: 'bottom-center',
					    textAlign: 'center',
					    loader: false,
					    stack: false,
					});
                }
            }
		 });
		return false;
	});

	if(getParam('messageId') != '') { // if draft message
		var messageId = getParam('messageId');
		$(".isContinueDraftId").val(messageId);
		draftMessageContent();
		function draftMessageContent() {

			$.ajax({
	           	url: ci_base_url+'draftMessageContent',
	            dataType: 'json',  
	            crossDomain:true,
	            data: {'messageId': messageId},
	            type: 'POST',
	            success: function(data) {
	            	var data = data.result;
	            	console.log(data)
	            	$(".msgSubject").val(stripSlashes(data.subject));
	            	$(".msgBody").val(stripSlashes(data.message));
	            }
	        });
		}
		$(".btnDraftMsg").hide();

		$(".msgEmail").change(draftRealTimeSaveUpdate);
		$(".msgSubject, .msgBody").keyup(draftRealTimeSaveUpdate);
		function draftRealTimeSaveUpdate() {
			var toId = $(".msgEmail").val();
			var subject = $(".msgSubject").val();
			var msgBody = $(".msgBody").val();

			$.ajax({
	           	url: ci_base_url+'draftRealTimeSaveUpdate',
	            dataType: 'json',  
	            crossDomain:true,
	            data: {'messageId': messageId, 'toId': toId, 'subject': subject, 'msgBody': msgBody},
	            type: 'POST',
	            success: function(data) {
	            	
	            }
	        });
		}
	}else {
		$(".btnDraftMsg").show();
	}
});

