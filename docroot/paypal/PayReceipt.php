<?php
	use PayPal\Service\AdaptivePaymentsService;
	use PayPal\Types\AP\FundingConstraint;
	use PayPal\Types\AP\FundingTypeInfo;
	use PayPal\Types\AP\FundingTypeList;
	use PayPal\Types\AP\PayRequest;
	use PayPal\Types\AP\Receiver;
	use PayPal\Types\AP\ReceiverList;
	use PayPal\Types\AP\SenderIdentifier;
	use PayPal\Types\Common\PhoneNumberType;
	use PayPal\Types\Common\RequestEnvelope;


	require_once('PPBootStrap.php');
	require_once('Common/Constants.php');
	define("DEFAULT_SELECT", "- Select -");


	if(isset($_POST['receiverEmail'])) {
		$receiver = array();

		for($i=0; $i<count($_POST['receiverEmail']); $i++) {
			$receiver[$i] = new Receiver();
			$receiver[$i]->email = $_POST['receiverEmail'][$i];
			$receiver[$i]->amount = $_POST['receiverAmount'][$i];
		}

		$receiverList = new ReceiverList($receiver);
	}

	$payRequest = new PayRequest(new RequestEnvelope("en_US"), 'PAY', $_POST['cancelUrl'], 'USD', $receiverList, $_POST['returnUrl']);

	if($_POST['senderEmail'] != "") {
		$payRequest->senderEmail  = $_POST["senderEmail"];
	}

	$service = new AdaptivePaymentsService(Configuration::getAcctAndConfig());

	try {
		$response = $service->Pay($payRequest);
	} catch(Exception $ex) {
		require_once 'Common/Error.php';
		exit;
	}

	$ack = strtoupper($response->responseEnvelope->ack);

	if($ack != "SUCCESS") {
		$error_msg = $response->error[0]->message;
	}else {
		$token = $response->payKey;
		$payPalURL = PAYPAL_REDIRECT_URL . '_ap-payment&paykey=' . $token;
		header('location:'.$payPalURL);
	}

?>


