<?php 
	$base_url = "https://sellinghive.applite.com/"; 
	$conn = mysqli_connect("localhost","deploy","Ug4A18Br7281cE","SellingHive");

	if(isset($_GET['token'])) {
		$token = $_GET['token'];
		$acceptedOfferId = hex2bin($token);

		$query = mysqli_query($conn, "UPDATE tbl_offer_accepted SET is_paid = 1, historyDate = now() WHERE offerAcceptedID = '$acceptedOfferId'");
	}
?>

<!DOCTYPE html">
<html>
<head>
	<title>SellingHive</title>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
	<link rel="stylesheet" type="text/css" href="<?php echo $base_url.'assets/css/ionicons.min.css'; ?>">
	<link rel="stylesheet" type="text/css" href="<?php echo $base_url.'assets/css/jquery-3.0.0.min.js'; ?>">
	<link rel="stylesheet" type="text/css" href="<?php echo $base_url.'assets/css/bootstrap.min.css'; ?>">
	<link rel="stylesheet" type="text/css" href="<?php echo $base_url.'assets/css/pay.css'; ?>">
</head>

<body>
	<div class="preloader">
		<i class="ion-loading-c"></i>
	</div>
</body>

<script src="<?php echo $base_url.'assets/js/jquery-3.0.0.min.js'; ?>"></script>
<script src="<?php echo $base_url.'assets/js/bootstrap.js'; ?>"></script>

<script>
	$(function() {
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

		if(getParam('token')) {
			window.history.go(-5);
		}else {
			$(".preloader").show();
			window.history.go(-2);
		}
	});
</script>
</html>
