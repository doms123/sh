$(document).ready(function() { 
	var id = localStorage.getItem("user_id");
	var role = localStorage.getItem("role");
	var userPriv = localStorage.getItem("userPriv");
	var acceptedAndTodoUnread = 0;

	document.addEventListener('deviceready', function () {
    	//cordova.plugins.notification.badge.set(10);
    	console.log('trrr');
		function notifCounter() {
	    	$.ajax({
	    		type: 'POST',
	    		url: ci_base_url+'allNotifCount',
	    		dataType: "json",
	    		crossDomain:true, 
	    		data: {'userid':id},
	    		success: function(data) {
	    			var notifCount = data.unreadCount;
	    			notifCount += acceptedAndTodoUnread;
	    			if(localStorage.getItem("user_id")) {
		    			if(notifCount > 0) {
		    				// $(".offerNav").append('<span class="notifCount">'+notifCount+'</span>');
		    				cordova.plugins.notification.badge.set(notifCount);
		    			}else {
		    				cordova.plugins.notification.badge.clear();
		    			}
	    			}else {
	    				cordova.plugins.notification.badge.clear();
	    			}
	    		}
	    	});
		}
		
		// Prevent the app from going to sleep in background
		cordova.plugins.backgroundMode.enable();

		// Get informed when the background mode has been activated
		cordova.plugins.backgroundMode.onactivate = function () {
			setTimeout(notifCounter, 600);
		    var eventCallback = function() {
		    	// notifCounter();
		    }

		    var successCallback = function() {
		    	// timer plugin configured successfully
		    }

		    var errorCallback = function(e) {
		    	// an error occurred
		    }

		    var settings = {
		    	timerInterval: 5000, // interval between ticks of the timer in milliseconds (Default: 60000)
		    	startOnBoot: true, // enable this to start timer after the device was restarted (Default: false)
		    	stopOnTerminate: true, // set to true to force stop timer in case the app is terminated (User closed the app and etc.) (Default: true)

		    	// hours: 12, // delay timer to start at certain time (Default: -1)
		    	minutes: 0, // delay timer to start at certain time (Default: -1)
		    }

		    window.BackgroundTimer.onTimerEvent(eventCallback); // subscribe on timer event
		    // timer will start at 12:00
		    window.BackgroundTimer.start(successCallback, errorCallback, settings);
		};

		// Get informed when the background mode has been deactivated
		cordova.plugins.backgroundMode.ondeactivate = function () {
				setTimeout(notifCounter, 600);
		};

		cordova.plugins.backgroundMode.enable = function () {
				setTimeout(notifCounter, 600);
		};

		cordova.plugins.backgroundMode.disable = function () {
				setTimeout(notifCounter, 600);
		};
	}, false);

	pageTitleAndLoader('Dashboard');
	var pos;
	var jroll1 = new JRoll(".dashboardWrap");
	var yScroll;
	var privateUnreadCount = 0;
	if(role == "Corporate") {
		$(".salePeopleNav").removeClass("hidden");
	}else {
		if(userPriv == 1) {
			$(".salePeopleNav").removeClass("hidden");
		}else {
			$(".salePeopleNav").addClass("hidden");
		}
	}

	function offerNotifCount() {
		$.ajax({
			type: 'POST',
			url: ci_base_url + 'offerNotifCount',
			dataType: "json",
			crossDomain:true, 
			data: {'userId':id},
			success: function(data) {
				var notifCount = data.result;

				if(notifCount > 0) {
					$(".offerNav").append('<span class="notifCount">'+notifCount+'</span>');
				}else {
					$(".offerNav .notifCount").remove();
				}
			}
		});
	}

	var dashboardWrapInnerHeight = $("#main-content").outerHeight() - 145;
	$(".dashboardInnerWrap").css('height', dashboardWrapInnerHeight);

	function ajax(params) {
	  setTimeout(function() {
	    params.success();
	  }, 800);
	}

	jroll1.pulldown({
	  	refresh: function(complete) {
	    	ajax({
	      		success: function() {
	      			reload();
					setTimeout(function() {
						complete();
					}, 400);
	      		}
	    	});
	  	}
	});
	
	reload();
	function reload() {
		checkUnreadMessage();
		offerNotifCount();
		viewAcceptedOffer();
		loadAllTodo();
		viewPendingNegotiation();
		viewPrivateOffer();
	}

	function allNotifCount() {
		$.ajax({
			type: 'POST',
			url: ci_base_url+'allNotifCount', 
			dataType: "json",
			crossDomain:true, 
			data: {'userid':id},
			success: function(data) {

			}
		});
	}

	function viewAcceptedOffer() {
		var jroll2 = new JRoll(".offerAcceptedWrap", {scrollBarY:false});
		jroll2.on("scrollStart", function() {
		    pos = this.y;
		});

		jroll2.on("scroll", function(e) {
		    if ((this.y - pos > 0 && pos === 0) || (this.y - pos < 0 && pos === this.maxScrollY)) {
		        jroll2.call(jroll1, e);
		    }
		});

		$.ajax({
			type: 'POST',
			url: ci_base_url+'viewAcceptedOffer',
			dataType: "json",
			crossDomain:true, 
			data: {'userid':id},
			beforeSend: function(){$(".offerAcceptedWrap ul").html('<li><a href="javascript:void(0)"><i class="ion-loading-a"></i> &nbsp;loading . . .</a></li>');},
			success : function(data) {
				var data = data.result;
				var maxLoop = data.length;
				html = '';
				if(data.length > 0) {
					var totalUnread = 0;
					for(x = 0; x < maxLoop; x++) {
						if(id == data[x].offer_creator_id) { // you are offer creator
							if(data[x].accepted_for_todo_negotiator == 1) {
								if(data[x].is_read_creator == 1) { // you already read the offer
									html += '<li class="acceptedOferLi" data-messageToken="'+data[x].accepted_msg_token+'"><a style="color:#7b692b;" href="#offer_accepted.html?message_id='+data[x].accepted_message_id+'"><span class="color-green">$'+numberWithCommas(data[x].acceptedOfferAmount)+'</span> for <span class="offName">'+stripSlashes(data[x].offerName)+'</span></a></li>';
								}else {
									totalUnread++;
									html += '<li class="acceptedOferLi unread" data-messageToken="'+data[x].accepted_msg_token+'"><a style="color:#7b692b;" href="#offer_accepted.html?message_id='+data[x].accepted_message_id+'"><span class="color-green">$'+numberWithCommas(data[x].acceptedOfferAmount)+'</span> for <span class="offName">'+stripSlashes(data[x].offerName)+'</span><span class="newUnread">new</span></a></li>';
								}
							}
						}else { // you are offer negotiator
							if(data[x].accepted_for_todo_creator == 1) {
								if(data[x].is_read_negotiator == 1) { // you already read the offer
									html += '<li class="acceptedOferLi" data-messageToken="'+data[x].accepted_msg_token+'"><a style="color:#7b692b;" href="#offer_accepted.html?message_id='+data[x].accepted_message_id+'"><span class="color-green">$'+numberWithCommas(data[x].acceptedOfferAmount)+'</span> for <span class="offName">'+stripSlashes(data[x].offerName)+'</span></a></li>';
								}else {
									if(data[x].accepted_for_todo_creator == 1) {
										totalUnread++;
										html += '<li class="acceptedOferLi unread" data-messageToken="'+data[x].accepted_msg_token+'"><a style="color:#7b692b;" href="#offer_accepted.html?message_id='+data[x].accepted_message_id+'"><span class="color-green">$'+numberWithCommas(data[x].acceptedOfferAmount)+'</span> for <span class="offName">'+stripSlashes(data[x].offerName)+'</span><span class="newUnread">new</span></a></li>';
									}
								}
							}
						}
					}

					acceptedAndTodoUnread += totalUnread;

					if(totalUnread) {
						if($(".sectionBlock1 .headTitle span").length) {
							$(".sectionBlock1 .headTitle span").html(totalUnread);
						}else {
							$(".sectionBlock1 .headTitle").append('<span>'+totalUnread+'</span>');
						}
					}else {
						$(".sectionBlock1 .headTitle").find("span").remove();
					}

					$(".offerAcceptedWrap ul").html(html);

					var liCount = $(".offerAcceptedWrap ul").find("li").length;

					if(liCount == 0) {
						$(".offerAcceptedWrap ul").html('<li class="noBorderBot"><a href="javascript:void(0)">No accepted offer yet</a></li>');
					}
				}else {
					$(".sectionBlock1 .headTitle").find("span").remove();
					$(".offerAcceptedWrap ul").html('<li class="noBorderBot"><a href="javascript:void(0)">No accepted offer yet</a></li>');
				}	

				var offerAcceptedWrapHeight = $(".sectionBlock1").outerHeight() - $(".sectionBlock1 h2").outerHeight();
				$(".offerAcceptedWrap").css('height', offerAcceptedWrapHeight);

				if($(".offerAcceptedWrap").height() >= $(".offerAcceptedWrap ul").height()) {
					jroll2.destroy();
				}else {
					jroll2.refresh();
				}	
			}
		});
	}

	function loadAllTodo() {
		var jroll3 = new JRoll(".todoWrap", {scrollBarY:false});
		jroll3.on("scrollStart", function() {
		    pos = this.y;
		});

		jroll3.on("scroll", function(e) {
		    if ((this.y - pos > 0 && pos === 0) || (this.y - pos < 0 && pos === this.maxScrollY)) {
		        jroll3.call(jroll1, e);
		    }
		});

		var todoWrapHeight = $(".sectionBlock2").outerHeight() - $(".sectionBlock2 .headTitle").outerHeight();
		$(".todoWrap").css('height', todoWrapHeight);

		$.ajax({
			type: 'POST',
			url: ci_base_url+'viewAllTodo', 
			dataType: "json",
			crossDomain:true, 
			data: {'userid':id},
			beforeSend: function(){$(".todoWrap ul").html('<li><a href="javascript:void(0)"><i class="ion-loading-a"></i> &nbsp;loading . . .</p></a></li>');},
			success : function(data) {
				var data = data.result;
				var maxLoop = data.length;
				var totalUnread = 0;
				html = '';
				if(data.length > 0) {
					for(x = 0; x < maxLoop; x++) {
						if(data[x].isread == 1) {
							html += '<li class="todoLi" data-todoid="'+data[x].todo_id+'"><a style="color:#7b692b;" data-messageToken="'+data[x].messageID+'" href="#todo_view.html?message_id='+data[x].messageID+'"><span class="color-green">$'+numberWithCommas(data[x].acceptedOfferAmount)+'</span> for '+stripSlashes(data[x].offerName)+'</a></li>';
						}else {
							if(data[x].offererAccepted == 0) {
								totalUnread++;
								if(data[x].todoLinkId == 1) {
									html += '<li class="todoLi unread" data-todoid="'+data[x].todo_id+'"><a style="color:#7b692b;" data-messageToken="'+data[x].messageID+'" href="#todo_view.html?message_id='+data[x].messageID+'"><span class="color-green">$'+numberWithCommas(data[x].acceptedOfferAmount)+'</span><span class="offName"> for '+stripSlashes(data[x].offerName)+'</span><span class="newUnread">Payment</span></a></li>';
								}else {
									html += '<li class="todoLi unread" data-todoid="'+data[x].todo_id+'"><a style="color:#7b692b;" data-messageToken="'+data[x].messageID+'" href="#todo_view.html?message_id='+data[x].messageID+'"><span class="color-green">$'+numberWithCommas(data[x].acceptedOfferAmount)+'</span><span class="offName"> for '+stripSlashes(data[x].offerName)+'</span><span class="newUnread">new</span></a></li>';
								}
								
							}else {
								if(data[x].todoLinkId != 1) {
									html += '<li class="todoLi" data-todoid="'+data[x].todo_id+'"><a style="color:#7b692b;" data-messageToken="'+data[x].messageID+'" href="#todo_view.html?message_id='+data[x].messageID+'"><span class="color-green">$'+numberWithCommas(data[x].acceptedOfferAmount)+'</span><span class="offName"> for '+stripSlashes(data[x].offerName)+'</span><span class="newUnread">Payment</span></a></li>';
								}else {
									html += '<li class="todoLi" data-todoid="'+data[x].todo_id+'"><a style="color:#7b692b;" data-messageToken="'+data[x].messageID+'" href="#todo_view.html?message_id='+data[x].messageID+'"><span class="color-green">$'+numberWithCommas(data[x].acceptedOfferAmount)+'</span><span class="offName"> for '+stripSlashes(data[x].offerName)+'</span></a></li>';
								}
							}
						}
					}

					acceptedAndTodoUnread += totalUnread;

					$(".todoWrap ul").html(html);

					if(totalUnread) {
						if($(".sectionBlock2 .headTitle span").length) {
							$(".sectionBlock2 .headTitle span").html(totalUnread);
						}else {
							$(".sectionBlock2 .headTitle").append('<span>'+totalUnread+'</span>');
						}
					}else {
						$(".sectionBlock2 .headTitle").find("span").remove();
					}
				}else {
					$(".sectionBlock2 .headTitle").find("span").remove();
					$(".todoWrap ul").html('<li class="noBorderBot"><a href="javascript:void(0)">No To Do-s yet</a></li>');
				}	

				if($(".todoWrap").height() >= $(".todoWrap ul").height()) {
					jroll3.destroy();
				}else {
					jroll3.refresh();
				}
			}
		});
	}

	$(".todoWrap").on("click", ".todoLi", function() {
		var todoId = $(this).attr("data-todoid");

		$.ajax({
			type: 'POST',
			url: ci_base_url+'todoRead', 
			dataType: "json",
			crossDomain:true, 
			data: {'userid':id, 'todoId': todoId},
			success : function(data) {

			}
		});
	});

	function viewPendingNegotiation() {
		var jroll4 = new JRoll(".negotiateWrap", {scrollBarY:false});
		jroll4.on("scrollStart", function() {
		    pos = this.y;
		});

		jroll4.on("scroll", function(e) {
		    if ((this.y - pos > 0 && pos === 0) || (this.y - pos < 0 && pos === this.maxScrollY)) {
		        jroll4.call(jroll1, e);
		    }
		});

		$("document").ajaxStop(function() {
			var negotiateWrapHeight = $(".sectionBlock3").outerHeight() - $(".sectionBlock3 .headTitle").outerHeight();
			$(".negotiateWrap").css('height', negotiateWrapHeight);
		});

		$.ajax({
			type: 'POST',
			url: ci_base_url+'viewPendingNegotiation', 
			dataType: "json",
			crossDomain:true, 
			data: {'userid':id},
			beforeSend: function(){$(".negotiateWrap ul").html('<li><a href="javascript:void(0)"><i class="ion-loading-a"></i> &nbsp;loading . . .</a></li>');},
			success : function(data) {
				var data = data.result;
				var maxLoop = data.length;
				html = '';

				if(data.length > 0) {
					var offerIds = [];
					var totalUnread = 0;
					for(x = 0; x < maxLoop; x++) {
						if(jQuery.inArray(data[x].negotiate_msg_token, offerIds) == -1) {
							if(id == data[x].unreadUserId) { // you are the users with unread offer
								if(data[x].unreadId == data[x].messageID) { // has unread offer
									totalUnread++;
									html += '<li class="pendingOfferLi unread" data-messageToken="'+data[x].negotiate_msg_token+'" data-messageId='+data[x].messageID+'><a style="color:#7b692b;" href="#offer_message_reply.html?message_id='+data[x].messageID+'"><span class="color-green">$'+numberWithCommas(data[x].offerAmount)+'</span> for <span class="offName">'+stripSlashes(data[x].offerName)+'</span><span class="newUnread">new</span></a></li>';
								}else {
									html += '<li class="pendingOfferLi" data-messageToken="'+data[x].negotiate_msg_token+'" data-messageId='+data[x].messageID+'><a style="color:#7b692b;" href="#offer_message_reply.html?message_id='+data[x].messageID+'"><span class="color-green">$'+numberWithCommas(data[x].offerAmount)+'</span> for <span class="offName">'+stripSlashes(data[x].offerName)+'</span></a></li>';
									
								}
							}else {

								html += '<li class="pendingOfferLi" data-messageToken="'+data[x].negotiate_msg_token+'" data-messageId='+data[x].messageID+'><a style="color:#7b692b;" href="#offer_message_reply.html?message_id='+data[x].messageID+'"><span class="color-green">$'+numberWithCommas(data[x].offerAmount)+'</span> for <span class="offName">'+stripSlashes(data[x].offerName)+'</span></a></li>';
							}
							offerIds.push(data[x].negotiate_msg_token);
						}
					}

					if(totalUnread) {
						if($(".sectionBlock3 .headTitle span").length) {
							$(".sectionBlock3 .headTitle span").html(totalUnread);
						}else {
							$(".sectionBlock3 .headTitle").append('<span>'+totalUnread+'</span>');
						}
					}else {
						$(".sectionBlock3 .headTitle").find("span").remove();
					}

					$(".negotiateWrap ul").html(html);
				}else {
					$(".sectionBlock3 .headTitle").find("span").remove();
					$(".negotiateWrap ul").html('<li class="noBorderBot"><a href="javascript:void(0)">No pending negotiation yet</a></li>');
				}	

				var negotiateWrapHeight = $(".sectionBlock3").outerHeight() - $(".sectionBlock3 .headTitle").outerHeight();
				$(".negotiateWrap").css('height', negotiateWrapHeight);


				if($(".negotiateWrap").height() >= $(".negotiateWrap ul").height()) {
					jroll4.destroy();
				}else {
					jroll4.refresh();
				}	
			}
		});
	}

	function viewPrivateOffer() {
		var jroll5 = new JRoll(".privateWrap", {scrollBarY:false});
		jroll5.on("scrollStart", function() {
		    pos = this.y;
		});

		jroll5.on("scroll", function(e) {
		    if ((this.y - pos > 0 && pos === 0) || (this.y - pos < 0 && pos === this.maxScrollY)) {
		        jroll5.call(jroll1, e);
		    }
		});

		$(document).ajaxStop(function() {
			var privateWrapHeight = $(".sectionBlock4").outerHeight() - $(".sectionBlock4 .headTitle").outerHeight();
			$(".privateWrap").css('height', privateWrapHeight);
		});

		$.ajax({
			type: 'POST',
			url: ci_base_url+'viewPrivateOffer', 
			dataType: "json",
			crossDomain:true, 
			data: {'userid':id},
			beforeSend: function(){$(".privateWrap ul").html('<li><a href="javascript:void(0)"><i class="ion-loading-a"></i> &nbsp;loading . . .</a></li>');},
			success : function(data) {
				var unread = data.unreadCount;
				var data = data.result;
				var maxLoop = data.length;
				
				html = '';

				if(data.length > 0) {
					for(x = 0; x < maxLoop; x++) {
						if(data[x].is_read == 0) { // private offer is unread
							html += '<li class="privateOfferLi unread" data-messageToken="'+data[x].negotiate_msg_token+'" data-messageId='+data[x].messageID+'><a style="color:#7b692b;" href="#offer_message_reply.html?message_id='+data[x].messageID+'"><span class="color-green">$'+numberWithCommas(data[x].offerAmount)+'</span> for '+stripSlashes(data[x].offerName)+'<span class="newUnread">new</span></a></li>';
						}else {
						html += '<li class="privateOfferLi" data-messageToken="'+data[x].negotiate_msg_token+'" data-messageId='+data[x].messageID+'><a style="color:#7b692b;" href="#offer_message_reply.html?message_id='+data[x].messageID+'"><span class="color-green">$'+numberWithCommas(data[x].offerAmount)+'</span> for '+stripSlashes(data[x].offerName)+'</a></li>';
						}
					}

					$(".privateWrap ul").html(html);
				}else {
					$(".privateWrap ul").html('<li class="noBorderBot"><a href="javascript:void(0)">No private offer yet</a></li>');
				}	

				if($(".negotiateWrap").height() >= $(".privateWrap ul").height()) {
					jroll5.destroy();
				}else {
					jroll5.refresh();
				}

				if(unread > 0) {
					if($(".sectionBlock4 .headTitle span").length) {
						$(".sectionBlock4 .headTitle span").html(unread);
					}else {
						$(".sectionBlock4 .headTitle").append('<span>'+unread+'</span>');
					}
				}else {
					$(".sectionBlock4 .headTitle span").remove();
				}
			}
		});
	}
	
	$(".btnCreate").click(function() {
		window.location.href = '#sales_offer_create.html';
		loadPageUrl(window.location.href);
	});
});


