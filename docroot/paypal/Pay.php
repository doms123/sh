<?php 
	$base_url = "https://sellinghive.applite.com/"; 
	$conn = mysqli_connect("localhost","deploy","Ug4A18Br7281cE","SellingHive");

	$offerId = $_POST['offerId'];
	$creatorId = $_POST['creatorId'];
	$paymentAmount = $_POST['paymentAmount'];
	$receiverEmail = $_POST['receiverEmail'];
	$offerAcceptedId = bin2hex($_POST['offerAcceptedId']);

	$returnUrl = $base_url."paypal/WebflowReturnPage.php?token=$offerAcceptedId";
	$cancelUrl =  $base_url."paypal/WebflowReturnPage.php";
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
	<div class="preloader">
		<i class="ion-loading-c"></i>
	</div>
	<div id="request_form" class="hidden">
		<form class="paymentForm" action="PayReceipt.php" method="post">
			<input type="text" name="receiverEmail[]" id="receiveremail_0" value="<?php echo $receiverEmail; ?>">
			<input type="text" name="receiverAmount[]" id="amount_0" value="<?php echo $paymentAmount; ?>" class="smallfield">
			<input type="text" name="returnUrl" value="<?php echo $returnUrl; ?>">
			<input type="text" name="cancelUrl" value="<?php echo $cancelUrl; ?>">
			<select name="senderEmail" id="senderEmail">
				<option></option>
			</select>
		</form>
	</div>

	<script src="<?php echo $base_url.'assets/js/jquery-3.0.0.min.js'; ?>"></script>

	<script>
		$(function() {
			$(".paymentForm").submit();
		});
	</script>
</body>
</html>
