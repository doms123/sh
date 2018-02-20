$(function() {
	pageTitleAndLoader('Message Detail');

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

	var messageId = getParam("messageId");
	var id = localStorage.getItem("user_id");
	var receiver;
	loadAllMessage();
	function loadAllMessage() {
		$.ajax({
			type: 'POST',
			url: ci_base_url+'viewMessageDetail', 
			dataType: "json",
			crossDomain:true, 
			data : {messageId: messageId},
			beforeSend: function(){
				$('body').removeClass('loaded');
				$(".preloadLogo").show();
			},
			success : function(data) {
				console.log('data', data);
				var toName = data.toName;
				var toAlias = data.toAlias;
				var data = data.result;
				if(data.photo != '' && data.photo != null) {
					$(".latestMessage .senderPhoto").html('<a href="#view_profile.html?id='+data.fromID+'"><img class="hasPhoto" src="'+base_url+'ci_upload/w45_'+data.photo+'"></a>');
				}else {
					if(stripSlashes(data.alias) == '') {
						$(".latestMessage .senderPhoto").html('<a href="#view_profile.html?id='+data.fromID+'"><span class="noPhoto">'+data.name.charAt(0)+'</span></a>');
					}else {
						$(".latestMessage .senderPhoto").html('<a href="#view_profile.html?id='+data.fromID+'"><span class="noPhoto">'+data.alias.charAt(0)+'</span></a>');
					}
				}
				receiver = data.fromID;

				$(".replyBtn").click(function() {
					setTimeout(function() {
						window.location.href = '#create_message.html?receiver='+data.fromID+'&linkToReplyMessageId='+data.messageID;
						loadPageUrl(window.location.href);
					}, 200);
				});

				if(stripSlashes(data.alias) == '') {
					$(".latestMessage .senderName").html(stripSlashes(data.name));
				}else {
					$(".latestMessage .senderName").html(stripSlashes(data.alias));
				}
				
				if(id == data.fromID) { // your own message
					if(toAlias == null || toAlias == '') {
						$(".latestMessage .msgTo").html('to '+toName+' - '+data.dateFormatted);
					}else {
						$(".latestMessage .msgTo").html('to '+toAlias+' - '+data.dateFormatted);
					}
				}else {
					$(".latestMessage .msgTo").html('to me - '+data.dateFormatted);
				}

				$(".latestMessage .messageTitle").html(stripSlashes(data.subject));
				$(".latestMessage .messageBody").html(stripSlashes(data.message));
	
				if(data.file != null) {
					var file = data.file;
					var fileArr = file.split(".");
					var fileName = fileArr[0];
					var fileType = fileArr[1];
					if(fileType != 'jpeg' && fileType != 'jpg' && fileType != 'png' && fileType != 'gif') {
						$(".latestMessage .fileWrap").html('<button class="button1 button" data-file="'+file+'"><i class="ion-android-folder" aria-hidden="true"></i> &nbsp;Open file</button>');
					}else {
						$(".latestMessage .fileWrap").html('<button class="button2 button" data-file="'+file+'"><i class="ion-android-folder" aria-hidden="true"></i> &nbsp;Open file</button>');
					}
				}

				if(receiver == id) {
					$(".replyBtn").hide();
				}else {
					$(".replyBtn").show();
				}

				if(data.linkToReplyMessageId != 0) {
					origMessageDetail(data.linkToReplyMessageId);
					$(".origMessage").show();
				}else {
					$(".origMessage").hide();
				}
			}
		});
	}

	function origMessageDetail(replyMessageId) {
		$.ajax({
			type: 'POST',
			url: ci_base_url+'viewMessageDetail', 
			dataType: "json",
			crossDomain:true, 
			data : {messageId: replyMessageId},
			success : function(data) {
				var toName = data.toName;
				var toAlias = data.toAlias;
				var data = data.result;
				if(data.photo != '' && data.photo != null) {
					$(".origMessage .senderPhoto").html('<a href="#view_profile.html?id='+data.fromID+'"><img class="hasPhoto" src="'+base_url+'ci_upload/w45_'+data.photo+'"></a>');
				}else {
					if(stripSlashes(data.alias) == '') {
						$(".origMessage .senderPhoto").html('<a href="#view_profile.html?id='+data.fromID+'"><span class="noPhoto">'+data.name.charAt(0)+'</span></a>');
					}else {
						$(".origMessage .senderPhoto").html('<a href="#view_profile.html?id='+data.fromID+'"><span class="noPhoto">'+data.alias.charAt(0)+'</span></a>');
					}
				}

				if(stripSlashes(data.alias) == '') {
					$(".origMessage .senderName").html(stripSlashes(data.name));
				}else {
					$(".origMessage .senderName").html(stripSlashes(data.alias));
				}

				if(id == data.fromID) { // your own message
					if(toAlias == null || toAlias == '') {
						$(".origMessage .msgTo").html('to '+toName+' - '+data.dateFormatted);
					}else {
						$(".origMessage .msgTo").html('to '+toAlias+' - '+data.dateFormatted);
					}
				}else {
					$(".origMessage .msgTo").html('to me - '+data.dateFormatted);
				}


				$(".origMessage .messageTitle").html(stripSlashes(data.subject));
				$(".origMessage .messageBody").html(stripSlashes(data.message));

				if(data.file != null) {
					var file = data.file;
					var fileArr = file.split(".");
					var fileName = fileArr[0];
					var fileType = fileArr[1];
					if(fileType != 'jpeg' && fileType != 'jpg' && fileType != 'png' && fileType != 'gif') {
						$(".origMessage .fileWrap").html('<button class="button1 button" data-file="'+file+'"><i class="ion-android-folder" aria-hidden="true"></i> &nbsp;Open file</button>');
					}else {
						$(".origMessage .fileWrap").html('<button class="button2 button" data-file="'+file+'"><i class="ion-android-folder" aria-hidden="true"></i> &nbsp;Open file</button>');
					}
				}
			}
		});
	}


	$("body").delegate(".fileWrap .button1", "click", function() {
		var file = $(this).attr('data-file');
		window.open('https://docs.google.com/viewer?url=https://sellinghive.applite.com/ci_upload/'+file+'', '_blank', 'location=yes');
	});

	$("body").delegate(".fileWrap .button2", "click", function() {
		var file = $(this).attr('data-file');
		window.open('https://sellinghive.applite.com/ci_upload/'+file+'', '_blank', 'location=yes');
	});

	updateUnreadMessage();
	function updateUnreadMessage() {
		$.ajax({
			type: 'POST',
			url: ci_base_url+'updateUnreadMessage', 
			dataType: "json",
			crossDomain:true, 
			data: {'messageId': messageId},
			success : function(data) {
				if(data.success == 1) {
					checkUnreadMessage();
				}
			}
		});
	}

	function checkOfferCreator() {
		$.ajax({
			type: 'GET',
			url: base_url+'message/check_offer_creator.php', 
			dataType: "jsonp",
			crossDomain:true, 
			data : {'message_offerID': message_offerID},
			success : function(data){
				if(data.creator_id != id) {
					$(".btnAccept").hide();
				}else {
					$(".btnAccept").show();
				}
			}
		});
	}


});

document.addEventListener('deviceready', function() {
	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
}, false);

function fail(error) {
    console.log(error.code);
}


function gotFS(fileSystem) {
    console.log("got filesystem");
    console.log(fileSystem.root.toURL());
    window.rootFS = fileSystem.root;

	cordova.file.applicationDirectory
}


$("body").delegate(".downloadFile", "click", download);

function download() {

	$.toast({
	    text: '<i class="fa fa-spinner fa-spin"></i> Downloading . . .',
	    allowToastClose: false,
	    showHideTransition: 'fade',
	    position: 'bottom-center',
	    textAlign: 'center',
	    loader: false,
	    stack: false
	});

	var iDevices = [
		'iPad Simulator',
		'iPhone Simulator',
		'iPod Simulator',
		'iPad',
		'iPhone',
		'iPod'
	];

	var download_name = $(".downloadFile").attr('data-uri');
	var file_to_download = $(".downloadFile").attr('download');


	var filePath = cordova.file.dataDirectory+''+download_name;

	var fileTransfer = new FileTransfer();
	var uri = encodeURI(file_to_download);

	fileTransfer.download(
	    uri,
	    filePath,
	    function(entry) {
	    	// moveFile(filePath);
	    	$.toast({
	    	    text: 'Download Completed',
	    	    allowToastClose: false,
	    	    showHideTransition: 'fade',
	    	    position: 'bottom-center',
	    	    textAlign: 'center',
	    	    loader: false,
	    	    stack: false
	    	});

	    },
	    function(error) {
	        console.log("download error source " + error.source);
	        console.log("download error target " + error.target);
	        console.log("upload error code" + error.code);
	    }
	);
}


