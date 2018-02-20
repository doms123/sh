var id 			= localStorage.getItem("user_id");
var base_url 	= "https://sellinghive.applite.com/";
var ci_base_url = "https://sellinghive.applite.com/service/";
var rootDir  	= "https://sellinghive.applite.com/";

$(function() {
	$('.text-area').each(function(){
	  	autosize(this);
	}).on('autosize:resized', function(){});

	getMobileOperatingSystem();
	function getMobileOperatingSystem() {
	  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

	      // Windows Phone must come first because its UA also contains "Android"
	    if (/windows phone/i.test(userAgent)) {
	        return "Windows Phone";
	    }

	    // iOS detection from: http://stackoverflow.com/a/9039885/177710
	    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
	     	var css = "";

		       css += '<style class="iosStyle">';
		        css += '#page-header {';
		            css += 'top: 0 !important';
		        css += '}';

		        css += '#main-content {';
		            css += 'top: 120px !important;';
		        css += '}';

		        css += '.editOfferPage #main-content {';
		            css += 'top: 100px !important;';
		        css += '}';

		        css += '.historyPage #main-content {';
		            css += 'top: 100px !important;';
		        css += '}';

		        css += '#sh_content .settingsWrap #main-content {';
		            css += 'top: 140px !important;';
		        css += '}';

		        css += '.salesOfferPage #main-content, .messagingPage #main-content {';
		            css += 'top: 110px !important;';
		        css += '}';

		        css += '.resetPass #main-content {';
		        	css += 'top: 220px !important;';
		        css += '}';

		        css += '.subWrap {';
		        	css += 'padding-top: 20px;';
		        css += '}';

		        css += '.back_button {';
		        	css += 'top: 25px;';
		        css += '}';

		        css += '#page-header {';
		            css += 'padding-top: 20px;';
		        css += '}';
		    css += '<style>';
	    

	        $("body").append(css);
	    }

	    if (/android/i.test(userAgent)) {
	        $(".iosStyle").remove();
		}	

	    return "unknown";
	}
});

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function spaceTrim(str) {
	return str.replace(/\s/g, '');
}

function stripSlashes(str) {
	if(str != 'undefined' && str != '' && str != null) {
		var match = str.match(/\\/g);
		return str.replace(new RegExp("\\\\", "g"), "");
	}else {
		return str;
	}
}
function pageTitleAndLoader(title) {
	$(".page-title").text(title);

	$(".users-btn").attr('data-href','#dashboard_corporate.html');
}

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

function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}	

function convertDate(usDate) {
	var dateParts = usDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
	return dateParts[3] + "-" + dateParts[1] + "-" + dateParts[2];
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

checkUnreadMessage();
function checkUnreadMessage() {
	var id = localStorage.getItem("user_id");
	$.ajax({
		type: 'POST',
		url: ci_base_url+'checkUnreadMessage',
		data: {'userId': id},
		crossDomain:true,
		success: function(data) {
			if(data.unreadCount != 0) {
				if($(".messaging-btn").find("span").length > 0) { // span exist
					$(".messaging-btn").find("span").html(data.unreadCount);
					$(".messaging-btn i").css("margin-left", "10px");
				}else {
					$(".messaging-btn").append('<span>'+data.unreadCount+'</span>');
					$(".messaging-btn i").css("margin-left", "10px");
				}
			}else {
				$(".messaging-btn").find("span").remove();
			}
		}
	});
}

