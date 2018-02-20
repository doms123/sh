$(document).ready(function() {
	var id = localStorage.getItem("user_id");
	var mainContentHeight = $("#main-content").height();
	var pageHeaderHeight = $("#page-header").height();
	var messageType = $("#wrapper").attr('datamessagetype'); // 1 = message | 2 = draft | 3 = sent
	var lock = 0;
	var currentPage = 1;
	var pulldown = 1;
	var start = 1;
	var recordPerPage = 10;
	var receiver;
	pageTitleAndLoader('Messaging');
	selectizeDropdown();

	var jroll = new JRoll("#inboxWrap", {
      scrollBarY: false
    });

	function selectizeDropdown() {
		selectizeDropdown = $('.searchMessageInput').selectize({
			create: true,
			sortField: {
				field: 'text',
				direction: 'asc'
			},
			dropdownParent: 'body'
		});

		$(".searchMessageInput").addClass('noCss');
	}

	loadAllMessageSubject(messageType);
	function loadAllMessageSubject(typeId) {
		$.ajax({
			type: 'POST',
			url: ci_base_url+'loadAllMessageSubject',
			dataType: "json",
			crossDomain:true, 
			data: {'userId':id, 'messageType':typeId},
			success: function(data) {
				var data = data.result;
				var maxLoop = data.length;
				var subjectArr = [];
				var subjectCounter = 1;
				for(x = 0; x < maxLoop; x++) {
					subjectArr.push({value: data[x].subject, text: data[x].subject});
					subjectCounter++;
				}

				selectizes = selectizeDropdown[0].selectize;
				selectizes.clearOptions();
				selectizes.addOption(subjectArr);
				selectizes.refreshItems();
			}
		});	
	}

  	var trWidth = $("table tr td:nth-child(2)").width();
  	$("table tr td:nth-child(2) p").css('width', trWidth+'px');

  	$(".createOffer").click(function() {
  		window.location.href = '#create_message.html';
  		loadPageUrl(window.location.href);
  	});

  	autoHeight();
  	function autoHeight() {
  		var contentHeight 		= $("#page-header").height() + 155;
  		var windowHeight 		= $(window).height();
  		var totalHeight 		= windowHeight - contentHeight - 60;
  		$("#inboxWrap").css('height', totalHeight+'px');
  	}

	
    jroll.pulldown({
      	refresh: function(complete) {
      		pulldown = 1;
			start = 1;
			currentPage = 1;
			var type = $("#wrapper").attr('datamessagetype');
			$("#inboxMessage").html('<tr><td rowspan="3" class="loadingMsg"><i class="ion-loading-a"></i> &nbsp;Loading . . .</td></tr>');
			loadAllMessages(type);
      		complete();
      	}
    });

	jroll.on('scroll', function() {
		if(lock == 0) {
	    	if(this.y == this.maxScrollY) {
	    		lock = 1;
				pulldown = 0;
				start += 1;
				currentPage++;
				loadAllMessages(messageType);
	    	}
		}
		$(".createOffer").fadeOut();
	});

	jroll.on("scrollEnd", function() {
	    $(".createOffer").fadeIn();
	});


	loadAllMessages(messageType);
	function loadAllMessages(messageType) {
		var searchMessageInput = $(".searchMessageInput").val();
		var msgType = $("#wrapper").attr("datamessagetype");
		$.ajax({
			type: 'POST',
			url: ci_base_url+'viewMessage', 
			dataType: "json",
			crossDomain:true, 
			data: {'userId': id, 'recordPerPage':recordPerPage, 'start':start, 'searchMessageInput':searchMessageInput, 'messageType':messageType},
			success : function(data) {
				console.log('data', data);
				var data = data.result;
				var maxLoop = data.length;
				var html = '';
				for(x = 0; x < maxLoop; x++) {
					if(data[x].is_read == 0) {
						if(msgType != 3) {
							html += '<tr class="tr unread" data-messageId='+data[x].messageID+' data-receiver='+data[x].toID+'>';
						}else {
							html += '<tr class="tr" data-messageId='+data[x].messageID+' data-receiver='+data[x].toID+'>';
						}
					}else {
						html += '<tr class="tr" data-messageId='+data[x].messageID+' data-receiver='+data[x].toID+'>';
					}

						if(data[x].photo == null || data[x].photo == '') {
							html += '<td><span class="noPhoto">'+data[x].name.charAt(0)+'</span></td>';
						}else {
					  		html += '<td><img src="https://sellinghive.applite.com/ci_upload/w45_'+data[x].photo+'"></td>';
					  	}
						html += '<td>';
							html += '<h6>'+stripSlashes(data[x].subject)+'</h6>';
							html += '<p>'+stripSlashes(data[x].message)+'</p>';
						html += '</td>';
						html += '<td>'+data[x].dateFormatted;
			
							// if(data[x].is_read == 0) {
							// 	if(msgType != 3) {
							// 		html += '<span class="new">new</span>';
							// 	}
							// }
							if(data[x].linkToReplyMessageId != 0) {
								html += '<span class="replyBadge">Reply</span>';
							}
							
							html += '<span class="deleteCheckBox"><input type="checkbox" class="checkBtn" data-messageId='+data[x].messageID+'></span>';
						html += '</td>';
					html += '</tr>';
				}

				if(pulldown == 0) {
					$("#inboxMessage").append(html);
					lock = 0;
				}else {
					if(maxLoop == 0) {
						var messageType = $("#wrapper").attr('datamessagetype');
						if(messageType == 1) {
							$("#inboxMessage").html('<tr><td rowspan="3" class="loadingMsg">No inbox message yet.</td></tr>');
						}else if(messageType == 2) {
							$("#inboxMessage").html('<tr><td rowspan="3" class="loadingMsg">No draft message yet.</td></tr>');
						}else if(messageType == 3) {
							$("#inboxMessage").html('<tr><td rowspan="3" class="loadingMsg">No sent message yet.</td></tr>');
						}
					}else {
						$("#inboxMessage").html(html);
					}
				}

				jroll.refresh();

				$('tbody tr').longpress(function() {
			    	$(this).addClass('active');

			    	setTimeout(function() {
			    		$("tr").removeClass('active');
			    	}, 600);

			    	$("#deleteModal").modal('show').attr('deleteid', $(this).attr('data-messageid'));
				});

				messagesWidth();
			}
		});
	}

	$("tbody").on("click", ".deleteCheckBox", function(e) {
		e.stopPropagation();

		var checkedBox = $(":checkbox:checked").length;
		if(checkedBox == 0) {
			$(".deleteMsgOffer").hide();
			$(".createOffer").show();
		}else {
			$(".createOffer").hide();
			$(".deleteMsgOffer").show();
		}
	});

	$(".nav .inboxBtn, .nav .sentBtn").click(function() {
		$(".deleteMsgOffer").hide();
		$(".createOffer").show();
	});

	$(".deleteMsgOffer").click(function() {
		var messageIds = [];
		$(".checkBtn").each(function() {
			if($(this).prop("checked")) {
				var mId = $(this).attr('data-messageid');
				messageIds.push(mId);
			}
		});
		$.ajax({
			type: 'POST',
			url: ci_base_url+'deleteMessages',
			dataType: "json",
			crossDomain:true, 
			data: {'deleteIds':messageIds},
			success: function(data) {
				if(data.success == 1) {
					$(".deleteMsgOffer").hide();
					$(".createOffer").show();
					var type = $(".messagingPage").attr('datamessagetype');
					loadAllMessages(type);
					$.toast({
					    text: 'The message has been deleted',
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
	});

	$(".btnSearchMessage").click(function() {
		$("#inboxMessage").html('<tr><td rowspan="3" class="loadingMsg"><i class="ion-loading-a"></i> &nbsp;Loading . . .</td></tr>');
		current_page = 1;
		start = 1;
		pulldown = 1;
		var messageType = $("#wrapper").attr('datamessagetype');
		$(".btnSearchMessage").attr('disabled', true);
		loadAllMessages(messageType);
		setTimeout(function() {
			$(".btnSearchMessage").attr('disabled', false);
			jroll.scrollTo(0, 0, 200);
		}, 400);
	});

	$("#deleteModal").submit(function() {
		var deleteId = $("#deleteModal").attr('deleteid');
		
		$.ajax({
			type: 'POST',
			url: ci_base_url+'deleteMessage',
			dataType: "json",
			crossDomain:true, 
			data: {'deleteId':deleteId},
			beforeSend: function() {
				$("#deleteModal").modal('hide');
				$(".deleteBtn").attr('disabled', true);
			},
			success: function(data) {
				if(data.success == 1) {
					$(".deleteBtn").attr('disabled', false);
					var type = $(".messagingPage").attr('datamessagetype');
					loadAllMessages(type);
					$.toast({
					    text: 'The message has been deleted',
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
	var count = 0;
	$("table").on("click", ".tr", function() {
		var messageId = $(this).attr('data-messageid');
		var type = $("#wrapper").attr('datamessagetype');
		var receiver = $(this).attr('data-receiver');
		if(type == 2) {
			window.location.href = '#create_message.html?messageId='+messageId+'&receiver='+receiver;
		}else {
			window.location.href = '#view_message_details.html?messageId='+messageId;
		}
		loadPageUrl(window.location.href);
		count++;
	});

	$(".navigation").click(function() {
		if($(this).hasClass('active') == false) {
			current_page = 1;
			start = 1;
			pulldown = 1;
			$("#inboxMessage").html('<tr><td rowspan="3" class="loadingMsg"><i class="ion-loading-a"></i> &nbsp;Loading . . .</td></tr>');
			$(".searchMessageInput").val('');
			var type = $(this).attr('data-type');
			$("#wrapper").attr('datamessagetype', type);
			loadAllMessages(type);
			setTimeout(function() {
				jroll.scrollTo(0, 0, 200);
			}, 400);
			$(this).parent().find('button').removeClass('active');
			$(this).addClass('active');
			loadAllMessageSubject(type);
		}
	});

	$(window).resize(messagesWidth);

	function messagesWidth() {
		var width = $("#inboxMessage").find("tr td:nth-child(2)").width();
		$("#inboxMessage").find("tr td:nth-child(2) h6").css("width", width);
		$("#inboxMessage").find("tr td:nth-child(2) p").css("width", width);
	}
});