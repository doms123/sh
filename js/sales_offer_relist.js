$(function() {
    pageTitleAndLoader('Offer Re-List');
    var offerId = getParam("relist_id");
    TinyDatePicker(document.querySelector('.dateStart'));
    TinyDatePicker(document.querySelector('.dateEnd'));

    var convertDate = function(usDate) {
        var dateParts = usDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        return dateParts[3] + "-" + dateParts[1] + "-" + dateParts[2];
    }

    $(".dateStart, .dateEnd").focus(function() {
        setTimeout(function() {
            $(".dp-day").attr('href', window.location.href);
        }, 400);
    });

    loadRelist();
    function loadRelist() {
        $.ajax({
            url: ci_base_url+'viewRelist',  
            type: "POST",       
            dataType: 'json',
            data: {'offerId':offerId},
            crossDomain: true,
            success: function(data) {
                var data = data.result;
                var startDate = data.startDate1;
                var endDate = data.endDate1;
                if(startDate != '01/01/1970') {
                    $(".dateStart").val(startDate);
                }

                if(endDate != '01/01/1970') {
                   $(".dateEnd").val(endDate);
                }
  
            }
        })
    }

    function today() {
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();
		
		today = mm + '/' + dd + '/' + yyyy;
		return today;
    }
    
    $(".btnUpdateRelist").click(function() {
        var startDate = $("#txtstart").val();
        var endDate = $("#txtends").val();
        var dateEndIsValid = 1;

        if(endDate != '') {
			if(startDate != '') {
				if(convertDate(startDate) > convertDate(endDate)) {
                    dateEndIsValid = 0;
				}else {
                }
			}else {
				if(endDate < today()) {
					dateEndIsValid = 0;
				}
			}
        }
        
        if(startDate != '') {
            var relistStartDate = convertDate(startDate); 
        }else {
            var relistStartDate = 'now';
        }

        if(endDate != '') {
            var relistEndDate = convertDate(endDate); 
        }else {
            var relistEndDate = 'unli';
        }

        if(dateEndIsValid == 1) {
            $.ajax({
                url: ci_base_url+'updeRelistOffer',  
                type: "POST",       
                dataType: 'json',
                data: {'relistStartDate': relistStartDate, 'relistEndDate':relistEndDate, 'offerId':offerId},
                crossDomain: true,
                beforeSend: function(){
                    $(".btnUpdateRelist").attr('disabled', true).find("i").attr('class', 'ion-loading-c').css('top', '6px');
                },
                success: function(data) {
                    $(".btnUpdateRelist").attr('disabled', false).find("i").attr('class', 'ion-archive').css('top', 'inherit');
                    history.back();

                    setTimeout(function() {
                        loadPageUrl(window.location.href);
                        
                        $.toast({
                            text: 'Offer Re-list successfully',
                            allowToastClose: false,
                            showHideTransition: 'fade',
                            position: 'bottom-center',
                            textAlign: 'center',
                            loader: false,
                            stack: false
                        });
                    }, 400);
                }
            });
        }else {
            $.toast({
                text: 'Please select a valid offer end date',
                allowToastClose: false,
                showHideTransition: 'fade',
                position: 'bottom-center',
                textAlign: 'center',
                loader: false,
                stack: false
            })
        }
    });
});
