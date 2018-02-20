$(document).ready(function() {
	var id = localStorage.getItem("user_id");
	pageTitleAndLoader('Tax');

	loadTaxInfo();
	function loadTaxInfo() {
		$.ajax({
			type: 'POST',
			url: ci_base_url+'loadTaxInfo',
			dataType: 'json',
			crossDomain: true,
			data: {userId: id},
			success: function(data) {
				var data = data.result[0];
				
				$(".tempValue").html(data.companyname);
				$(".corporateName").val(stripSlashes($(".tempValue").text()));

				$(".tempValue").html(data.eintaxid);
				$(".ein").val(stripSlashes($(".tempValue").text()));

				$(".tempValue").html(data.address1);
				$(".address").val(stripSlashes($(".tempValue").text()));

				$(".tempValue").text(data.entity);
				$(".entity option[value='"+data.entity+"']").prop('selected', true);
			}
		});
	}

	$(".btnSave").click(function() {
		var corporateName 	= $(".corporateName").val();
		var ein 			= $(".ein").val();
		var address 		= $(".address").val();
		var entity 			= $(".entity").val();

		$.ajax({
			type: 'POST',
			url: ci_base_url+'saveTaxInfo',
			dataType: 'json',
			crossDomain: true,
			data: {userId: id, 'corporateName': corporateName, 'ein':ein, 'address':address, 'entity': entity},
			beforeSend: function() {
				$(".btnSave").attr('disabled', true).find("i").attr("class", "ion-loading-a").css("top", "6px");
			},
			success: function(data) {
				$(".btnSave").attr('disabled', false).find("i").attr("class", "ion-archive").css("top", "inherit");	
				loadTaxInfo();
				$.toast({
				    text: 'Record was saved',
				    allowToastClose: false,
				    showHideTransition: 'fade',
				    position: 'bottom-center',
				    textAlign: 'center',
				    loader: false,
				    stack: false
				});
			}
		});
	});
});