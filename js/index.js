$(document).ready(function() {
  $.ajaxSetup({ cache: true });
});
var url = window.location.href;

function loadPageUrl(url) {
    var urlsArr  = url.split("#");
    var url = urlsArr[1];

    if(localStorage.getItem("user_id")) {
        $("#sh_content").css('visibility', 'hidden');
        $(".preloader").fadeIn('fast', function() {
            
        });

        if(urlsArr.length == 1) {
            window.location.href = '#dashboard_corporate.html';
            loadPageUrl(window.location.href);
        }else {
            $('#sh_content').load(url, function() {
                var urlPageArr = url.split('.');
                var pageUrl = urlPageArr[0];
                
                $.when(
                    $.getScript("js/"+pageUrl+".js")
                ).then(function() {
                    $(".preloader").fadeOut('fast', function() {
                        $("#sh_content").removeAttr('style');
                    });
                });

                if(url == 'dashboard_corporate.html') {
                    $("#main-nav").find("button").removeClass("active");
                    $(".users-btn").attr('href', 'javascript:void(0)');
                    $(".back_button").hide();
                    $(".dashboardPage .btnCreate").show();

                }else {
                   $(".users-btn").attr('href', '#dashboard_corporate.html');
                   $(".branch a").html('<i class="ion-ios-home" aria-hidden="true"></i>');
                   $(".backWrap").html('<button type="button" class="back_button"><i class="ion-android-arrow-back"></i></button>');
                }

                if(url == 'award.html') {
                    $(".award-btn").attr('href', 'javascript:void(0)');
                }else {
                    $(".award-btn").attr('href', '#award.html');
                }

                if(url == 'messaging.html') {
                    $(".messaging-btn").attr('href', 'javascript:void(0)');
                }else {
                    $(".messaging-btn").attr('href', '#messaging.html');
                }

                if(url == 'setting.html') {
                    $(".setting-btn").attr('href', 'javascript:void(0)');
                }else {
                    $(".setting-btn").attr('href', '#setting.html');
                }

                if(url != 'dashboard_corporate.html' && url != 'award.html' && url != 'messaging.html' && url != 'setting.html') {
                   $(".users-btn").attr('href', '#dashboard_corporate.html'); 
                   $(".award-btn").attr('href', '#award.html');
                   $(".messaging-btn").attr('href', '#messaging.html');
                   $(".setting-btn").attr('href', '#setting.html');
                   $("#main-nav").find("button").removeClass("active");
                }
            });
        }
    }else {
        if(url == 'reset_pass.html' || url == 'register.html') {
            $('#sh_content').load(url, function() {
              var urlPageArr = url.split('.');
              var pageUrl = urlPageArr[0];
              
              $.when(
                  $.getScript("js/"+pageUrl+".js")
              ).then(function() {
                  $(".preloader").fadeOut('fast', function() {
                      $("#sh_content").removeAttr('style');
                  });
              });
           });
        }else {
            $('#sh_content').load('login.html', function() {
                $.when(
                     $.getScript("js/login.js")
                ).then(function() {
                    $(".preloader").fadeOut('fast', function() {
                         $("#sh_content").removeAttr('style');
                    });
                });
            });
        }
    }
}

$(function() {
    // FastClick.attach(document.body);
    loadPageUrl(window.location.href);
    $("body").on( 'click','a', function() {
        var href = $(this).attr('href');
        if(href.match(/.html/g)) {
           loadPageUrl(href);
        }
    });

    $(".shNav").on("click", "button", function() {
        if($(this).hasClass('active') == false) {
            var href = $(this).attr("data-href");
            $(".shNav").find("button").removeClass("active");
            $(this).addClass("active");
            window.location.href = href;
            loadPageUrl(window.location.href);
        }
    });

	document.addEventListener('backbutton', function(e) {
		$(".modal").modal('hide');
		var checkdash = $(".dashboardCheck").length;
        	if(checkdash == 1) {
                window.plugins.appMinimize.minimize();
            }else {
                if($('.modal').is(':visible')) {
                    $(".modal").modal('hide');
                }else {
                    history.back();

                    setTimeout(function() {
                        loadPageUrl(window.location.href);
                    }, 200);
                }   
            }
	}, false);

    $("body").on( 'focus','input, textarea, select', function() {
        $(".mainNavWrap, #main-nav, .createOfferButton, .createOffer, .addContact").hide();
        $("#main-content").css("bottom", "0");
    });

    $("body").on( 'blur','input, textarea, select', function(){
        $(".mainNavWrap, #main-nav, .createOfferButton, .createOffer, .addContact").show();
        $("#main-content").css("bottom", "60px");
    });

	ios_statusbar();
	function ios_statusbar() {
		var iDevices = [
			'iPad Simulator',
			'iPhone Simulator',
			'iPod Simulator',
			'iPad',
			'iPhone',
			'iPod'
		];

		if (!!navigator.platform) {
			while (iDevices.length) {
				if (navigator.platform === iDevices.pop()){ 
					$(".back_button, .back_button1, .backToLogin").css('top', "35px");
				}
			}
		}
	}

    $("body").on( 'click','.back_button, .backToLogin', function() {
        $(this).attr('disabled', true);
        history.back();
        setTimeout(function() {
            loadPageUrl(window.location.href);
        }, 200);
	})
});



