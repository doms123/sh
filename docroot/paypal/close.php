<?php 
	$base_url = "https://sellinghive.applite.com/"; 
	 // echo "<script>window.close();</script>";
?>
<!DOCTYPE html">
<html>
<head>
	<title>SellingHive</title>
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
	<link rel="stylesheet" type="text/css" href="<?php echo $base_url.'assets/css/ionicons.min.css'; ?>">
	<link rel="stylesheet" type="text/css" href="<?php echo $base_url.'assets/css/pay.css'; ?>">
</head>

<body>
	<button class="closeWindow">Close</button>
	<div class="preloader">
		<i class="ion-loading-c"></i>
	</div>

	<script src="<?php echo $base_url.'assets/js/jquery-3.0.0.min.js'; ?>"></script>

	<script>
		$(function() {
			$(".closeWindow").click(function() {
				//window.open('', '_self', ''); window.close();
				
			})
		});
	</script>
</body>
</html>
