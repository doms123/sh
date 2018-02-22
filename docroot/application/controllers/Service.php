<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class Service extends CI_Controller {
	public function index() {
		$this->load->view('welcome_message');
	}

	public function login() {
		$email      = sanitize($this->input->post('email'));
		$password 	= sanitize($this->input->post('password'));

		if (!empty($email) && !empty($password)) {
			$getLogin = $this->model->getLogin($email);
			$userData = $getLogin->row();
			$isLogin  = $getLogin->num_rows();

			if($isLogin) {
				if(password_verify($password, $userData->password)) {
					if($userData->role == 'corporate') {
						$data = array(
							'status' => 'Success',
							'role' => 'Corporate',
							'key' => $userData->id,
							'userPriv' => $userData->userPriv
						);
					}else if($userData->role == 'sales') {
						$data = array(
							'status' => 'Success',
							'role' => 'Sales',
							'key' => $userData->id,
							'userPriv' => $userData->userPriv
						);
					}
				}else {
					$data = array(
						'status' => 'Error'
					);
				}
			}else {
				$data = array(
					'status' => 'Error'
				);
			}
		}else {
			$data = array(
				'status' => 'Error'
			);
		}

		generate_json($data);
	}

	public function checkFbExist() {
		$fbId 			= sanitize($this->input->post('fbid'));
		$email			= $this->input->post('email');
		$checkFbExist 	= $this->model->getCheckFbExist($fbId, $email);

		if($checkFbExist) {
			$data = array(
				'success' => 1
			);
		}else {
			$data = array(
				'success' => 0
			);
		}

		generate_json($data);
	}

	public function registerFbUser() {
		$fbId 		= $this->input->post('fbid');
		$fbUsername = $this->input->post('fbusername');
		$fbToken 	= $this->input->post('fbtoken');
		$fbemail   	= $this->input->post('fbemail');

		$regFbUser = $this->model->getRegisterFbUser($fbId, $fbUsername, $fbToken, $fbemail);

		$data = array(
			'success' => 1,
			'res' => $regFbUser
		);

		generate_json($data);
	}

	public function userRecord() {
		$fbId 			= sanitize($this->input->post('fbid'));
		$email			= sanitize($this->input->post('email'));
		$userData 		= $this->model->getUserRecord($fbId, $email)->row();
		$isLogin  		= $this->model->getUserRecord($fbId, $email)->num_rows();

		if($isLogin) {
			if($userData->role == 'corporate') {
				$data = array(
					'status' => 'Success',
					'role' => 'Corporate',
					'email' => $userData->email,
					'key' => $userData->id,
					'userPriv' => $userData->userPriv
				);
			}else if($userData->role == 'sales') {
				$data = array(
					'status' => 'Success',
					'role' => 'Sales',
					'email' => $userData->email,
					'key' => $userData->id,
					'userPriv' => $userData->userPriv
				);
			}
		}else {
			$data = array(
				'status' => 'Error'
			);
		}

		generate_json($data);
	}

	public function checkGmailExist() {
		$email 				= sanitize($this->input->post('g_email'));
		$getCheckGmailExist = $this->model->getCheckGmailExist($email);

		if($getCheckGmailExist) {
			if($getCheckGmailExist->num_rows()) {
				$data = array(
					'success' => 1
				);
			}else {
				$data = array(
					'success' => 0
				);
			}
		}
		
		generate_json($data);
	}

	public function userGoogleRecord() {
		$email			= sanitize($this->input->post('g_email'));
		// $email = 'dominicksanchez30@gmail.com';
		$userData 		= $this->model->getUserGoogleRecord($email)->row();
		$isLogin  		= $this->model->getUserGoogleRecord($email)->num_rows();

		if($isLogin) {
			if($userData->role == 'corporate') {
				$data = array(
					'status' => 'Success',
					'role' => 'Corporate',
					'key' => $userData->id,
					'userPriv' => $userData->userPriv
				);
			}else if($userData->role == 'sales') {
				$data = array(
					'status' => 'Success',
					'role' => 'Sales',
					'key' => $userData->id,
					'userPriv' => $userData->userPriv
				);
			}
		}else {
			$data = array(
				'status' => 'Error'
			);
		}

		generate_json($data);
	}

	public function registerGmailAccount() {
		$email 	= sanitize($this->input->post('g_email'));
		$name 	= sanitize($this->input->post('g_name'));

		$getRegisterGmailAccount = $this->model->getRegisterGmailAccount($email, $name);
		$getInsertProfile = $this->model->getInsertProfile($getRegisterGmailAccount);
		$data = array(
			'success' => 1
		);
		
		generate_json($data);
	}

	public function register() {
		$name 		= sanitize($this->input->post('name'));
		$email 		= sanitize($this->input->post('email'));
		$password 	= password_hash(sanitize($this->input->post('password')), PASSWORD_DEFAULT);
		$checkPriv  =  'corporate';
		if (!empty($name) && !empty($email) && !empty($password)) {
			$getCheckEmailExist = $this->model->getCheckEmailExist($email);
			//print_r($getCheckEmailExist);
			if($getCheckEmailExist) {
				if($getCheckEmailExist->num_rows() == 0) {
					$getRegister = $this->model->getRegister($name, $email, $password, $checkPriv);
					$getInsertProfile = $this->model->getInsertProfile($getRegister);

					// hash the email
					$options = [
					    'cost' => 12,
					];
					$emailHash = password_hash($email, PASSWORD_BCRYPT, $options);
			$subject = "Sellinghive email verification";
			$txt = "Thank you for joining Sellinghive.  You are one step away from our service - to activate your account, please click here: https://sellinghive.applite.com/offers/verify_register.php?email=".$emailHash."&pid=".md5($getRegister)."

Thank you,
Sellinghive Corporation
www.sellinghive.com";
			$headers = "From: SellingHive (AppLite) <sellinghive@applite.com>";

					if(mail($email, $subject, $txt, $headers)) {
					  $data = array('success' => 1);
					}else{
					  $data = array('success' => 3);
					}
		
				}else {
					$data = array('success' => 2); // email was already existed
				}
			}else {
				$data = array('success' => 0);
			}
		}else {
			$data = array('success' => 0);
		}

		generate_json($data);
	}

	public function forgotPassword() {
		$email = sanitize($this->input->post('email'));
		$message = '';

		$getCheckEmailExist = $this->model->getCheckEmailExist($email);
		if($getCheckEmailExist->num_rows()) {
			$name = $getCheckEmailExist->row()->name;
			if($getCheckEmailExist->num_rows() == 1) {
			    $encrypted  = encryptIt($email);
			    $to         = $email;
			    $subject    = 'Sellinghive';
			    $message 	.= "Dear ".$name.", \n\n";
			    $message    .= "You recently initiated a password reset for your SellingHive account. To complete the process click the link to reset your password \n\n";
			    $message    .= " ".base_url() . "service/resetPassword?&token=". $encrypted;
			    $message    .= "\n\n Sincerely, \n SellingHive";
			    $headers    = 'From: SellingHive (AppLite) <sellinghive@applite.com>' . "\r\n" .
			    'Reply-To: sellinghivecompany@gmail.com' . "\r\n" .
			    'X-Mailer: PHP/' . phpversion();
			    mail($to, $subject, $message, $headers);
				$data = array(
					'success' => 1,
					'message' => "Check your email $email to continue your request",
					'token' => 	base_url() . "service/resetPassword?&token=". $encrypted .""
				);
			}else {
				$data = array(
					'success' => 0,
					'message' => 'Email not found in our database'
				);
			}
		}else {
			$data = array(
				'success' => 0,
				'message' => 'Email not found in our database'
			);
		}

		generate_json($data);
	}

	public function createUser() {
		$name 		= sanitize($this->input->post('name'));
		$email 		= sanitize($this->input->post('email'));
		$pass 		= password_hash(sanitize($this->input->post('pass')), PASSWORD_DEFAULT);
		$addedById 	= sanitize($this->input->post('addedById'));
		$checkPriv 	= sanitize($this->input->post('checkPriv'));
		
		if (!empty($name) && !empty($email) && !empty($pass)) {
			$getCheckGmailExist = $this->model->getCheckGmailExist($email);

			if($getCheckGmailExist) {
				if($getCheckGmailExist->num_rows() == 0) {
					$getCreateUser = $this->model->getCreateUser($name, $email, $pass, $addedById, $checkPriv);
					$this->model->getInsertProfile($getCreateUser);

					$emailHash = password_hash($email, PASSWORD_BCRYPT);

			$subject = "Sellinghive email verification";
			$txt = "Thank you for joining Sellinghive.  You are one step away from our service - to activate your account, please click here: https://sellinghive.applite.com/offers/verify_register.php?email=".$emailHash."&pid=".md5($getCreateUser)."

Thank you,
Sellinghive Corporation
www.sellinghive.com";
			$headers = "From: SellingHive (AppLite) <sellinghive@applite.com>";

					mail($email, $subject, $txt, $headers);
					$data = array('success' => 1); //record saved
				}else {
					$data = array('success' => 2);
				}
			}else {
				$data = array('success' => 0);
			}
		}

		generate_json($data);
	}

	public function offerCount() {
		$userId 		= sanitize($this->input->post('userid'));
		$getOfferCount 	= $this->model->getOfferCount($userId);

		$data = array(
			'resultCount' => $getOfferCount->num_rows(),	
			'success' => 1
		);
		
		generate_json($data);
	}

	public function createTodo() {
		$userId 	= sanitize($this->input->post('userId'));
		$todoTitle 	= sanitize($this->input->post('todoTitle'));
		$todoBody 	= sanitize($this->input->post('todoBody'));
		$todoDate 	= sanitize($this->input->post('todoDate'));

		$this->model->getCreateTodo($userId, $todoTitle, $todoBody, $todoDate);

		$data = array(
			'success' => 1
		);

		generate_json($data);
	}

	public function viewTodo() {
		$todoId 		= sanitize($this->input->post('todoId'));
		$getViewTodo 	= $this->model->getViewTodo($todoId);
		$result 		= array();

		foreach($getViewTodo->result() as $row) {
			$result[] = $row->todo_id."#".
				    	$row->todo_userid."#".
				    	stripslashes($row->todo_title)."#".
				    	stripslashes($row->todo_content)."#".
				    	$row->todoDate."#".
				    	$row->todo_dateAdded;
		}

		$data = array(
			'result' => $result,	
			'success' => 1
		);
			
		generate_json($data);
	}

	public function deleteTodo() {
		$todoId = sanitize($this->input->post('todoId')); 
		$this->model->getDeleteTodo($todoId);

		$data = array(
			'success' => 1
		);
			
		generate_json($data);
	}

	public function offerRowCount() {
		$offerTypeID 		= sanitize($this->input->post('offerTypeID'));
		$getOfferRowCount 	= $this->model->getOfferRowCount($offerTypeID)->row()->offerRowCount;

		$data = array(
			'count' => $getOfferRowCount
		);

		generate_json($data);
	}

	public function viewOffer() {
		$userId 		= sanitize($this->input->post('userid'));
		$offerType 		= sanitize($this->input->post('counter')); // 3 = public | 2 = private | 1 = draft
		$recordPerPage 	= sanitize($this->input->post('recordPerPage'));
		$start 			= sanitize($this->input->post('start'));
		$searchInput 	= sanitize($this->input->post('searchInput'));
		$offerActive 	= sanitize($this->input->post('offerActive'));
		$result 		= array();
		$offerID_array 	= array();
		$start 			= $start > 1 ? $start - 1 : 0;
		$start 			= $start * $recordPerPage;

		$getViewOffer = $this->model->getViewOffer($userId, $offerType, $recordPerPage, $start, $searchInput, $offerActive);

		$data = array(
			'result' => $getViewOffer->result(),	
			'success' => 1,
		);

		generate_json($data);
	}

	public function viewPendingNegotiation() {
		$userId = sanitize($this->input->post('userid'));
		$getAllAcceptedOffer = $this->model->getAllAcceptedOffer($userId);
		$getViewPendingNegotiation = $this->model->getViewPendingNegotiation($userId);
		$getUnreadNegotiation = $this->model->getUnreadNegotiation($userId);
		$data = array(
			'result' => $getViewPendingNegotiation->result(),
			'success' => 1,
			'unreadCount' => $getUnreadNegotiation->num_rows()
		);

		generate_json($data);
	}

	public function viewPrivateOffer() {
		$userId = sanitize($this->input->post('userid'));
		$getViewPrivateOffer = $this->model->getViewPrivateOffer($userId);
		$getUnreadPrivateOffer = $this->model->getUnreadPrivateOffer($userId);
		$unreadCount = $getUnreadPrivateOffer->row()->unreadCount;

		$data = array(
			'result' => $getViewPrivateOffer->result(),	
			'success' => 1,
			'unreadCount' => $unreadCount
		);
		
		generate_json($data);
	}

	public function viewAcceptedOffer() {
		$userId 				= sanitize($this->input->post('userid'));
		$getViewAcceptedOffer 	= $this->model->getViewAcceptedOffer($userId);
		$unreadCount 			= $this->model->getUnreadAcceptedOffer($userId);
		
		$data = array(
			'result' => $getViewAcceptedOffer->result(),
			'unreadCount' => $unreadCount,
			'success' => 1
		);
		
		generate_json($data);
	}

	public function viewAllTodo() {
		$userId 			= sanitize($this->input->post('userid'));
		$getViewAllTodo 	= $this->model->getViewAllTodo($userId);
		$unreadCount 		= $this->model->getUnreadTodo($userId);
	
		$data = array(
			'result' => $getViewAllTodo->result(),	
			'unreadCount' => $unreadCount, 
			'success' => 1
		);
		
		generate_json($data);
	}

	public function completeTodo() {
		$userId = sanitize($this->input->post('userid'));
		$todoId = sanitize($this->input->post('todoId'));
		$this->model->getCompleteTodo($userId, $todoId);

		$data = array(
			'success' => 1
		);
		
		generate_json($data);
	}

	public function removeCompleteTodo() {
		$userId = sanitize($this->input->post('userid'));
		$todoId = sanitize($this->input->post('todoId'));
		$this->model->getRemoveCompleteTodo($userId, $todoId);

		$data = array(
			'success' => 1
		);
		
		generate_json($data);
	}

	public function creatorCompleteTodo() {
		$userId = sanitize($this->input->post('userid'));
		$todoId = sanitize($this->input->post('todoId'));
		$acceptedOfferId = sanitize($this->input->post('acceptedOfferId'));
		$lastTodoInsertId = $this->model->getCreatorCompleteTodo($userId, $todoId, $acceptedOfferId);

		$data = array(
			'success' => 1,
			'todoInsertId' => $lastTodoInsertId
		);
		
		generate_json($data);
	}

	public function creatorRemoveCompleteTodo() {
		$userId = sanitize($this->input->post('userid'));
		$todoId = sanitize($this->input->post('todoId'));
		$this->model->getRemoveCreatorCompleteTodo($userId, $todoId);

		$data = array(
			'success' => 1
		);
		
		generate_json($data);
	}

	public function offerSaveDraft() {
		$num 			= rand(1111111111,9999999999);
		$randnum 		= 'SH-'.$num;
		$offerName 		= sanitize($this->input->post('txtoffername'));
		$offerAmount 	= sanitize($this->input->post('txtofferamount'));
		$offerTerm 		= sanitize($this->input->post('txtofferterms'));
		$offerType 		= sanitize($this->input->post('txtoffertype'));
		$offerStart 	= date('Y-m-d', strtotime(str_replace('/', '-', sanitize($this->input->post('txtstart')))));
		$offerEnd 		= date('Y-m-d', strtotime(str_replace('/', '-', sanitize($this->input->post('txtends')))));
		$offerNotes 	= sanitize($this->input->post('txtnotes'));
		$userId 		= sanitize($this->input->post('userid'));
		$offerNo 		= sanitize($this->input->post('txtnoOfOffer'));

		if($offerNo == '') {
			$offerNo = 0;
		}

		$checkIfDraftExist = $this->model->getCheckIfDraftExist($userId);

		if($checkIfDraftExist) {
			if($checkIfDraftExist->num_rows()) { // update existing draft records
				$row 			= $checkIfDraftExist->row();
				$offerId 		= $row->offerID;
				$getUpdateDraft = $this->model->getUpdateDraft($offerId, $randnum, $offerName, $offerAmount, $offerTerm, $offerType, $offerStart, $offerEnd, $offerNotes, $userId, $offerNo);
				$data = array('success' => 3);
			}else { // insert new draft
				$getInsertDraft = $this->model->getInsertDraft($randnum, $offerName, $offerAmount, $offerTerm, $offerType, $offerStart, $offerEnd, $offerNotes, $userId, $offerNo);
				$data = array('success' => 2);
			}
		}

		generate_json($data);
	}

	public function createOffer() {
		$num 			= rand(1111111111,9999999999);
		$randnum 		= 'SH-'.$num;
		$offerName 		= sanitize($this->input->post('txtoffername'));
		$offerAmount 	= sanitize($this->input->post('txtofferamount'));
		$offerTerm 		= sanitize($this->input->post('txtofferterms'));
		$offerType 		= sanitize($this->input->post('txtoffertype'));
		$offerEnd 		= date('Y-m-d', strtotime(str_replace('/', '-', sanitize($this->input->post('txtends')))));
		$offerNotes 	= sanitize($this->input->post('txtnotes'));
		$userId 		= sanitize($this->input->post('userid'));
		$offerNo 		= sanitize($this->input->post('txtnoOfOffer'));
		$statusId 		= sanitize($this->input->post('statusID'));
		$unliCheck		= sanitize($this->input->post('unliCheck'));
		$dateStartCheck	= sanitize($this->input->post('dateStartCheck'));
		$dateEndCheck	= sanitize($this->input->post('dateEndCheck'));
		
		if($this->input->post('txtstart') != '') {
			$offerStart = date('Y-m-d', strtotime(str_replace('/', '-', sanitize($this->input->post('txtstart')))));
		}else {
			$offerStart = date('Y-m-d H:i:s');
		}

		if($offerNo == '') {
			$offerNo = -1;
		}

		$getCreateOffer = $this->model->getCreateOffer($randnum, $offerName, $offerAmount, $offerTerm, $offerType, $offerStart, $offerEnd, $offerNotes, $userId, $offerNo, $statusId, $unliCheck, $dateStartCheck, $dateEndCheck);
	
		$data = array('success' => 3);	// post public
		
		generate_json($data);
	}

	public function createOfferForEdit() {
		$editOfferId    = sanitize($this->input->post('offerId'));
		$num 			= rand(1111111111,9999999999);
		$randnum 		= 'SH-'.$num;
		$offerName 		= sanitize($this->input->post('txtoffername'));
		$offerAmount 	= sanitize($this->input->post('txtofferamount'));
		$offerTerm 		= sanitize($this->input->post('txtofferterms'));
		$offerType 		= sanitize($this->input->post('txtoffertype'));
		$offerEnd 		= date('Y-m-d', strtotime(str_replace('/', '-', sanitize($this->input->post('txtends')))));
		$offerNotes 	= sanitize($this->input->post('txtnotes'));
		$userId 		= sanitize($this->input->post('userid'));
		$offerNo 		= sanitize($this->input->post('txtnoOfOffer'));
		$statusId 		= sanitize($this->input->post('statusID'));
		$unliCheck		= sanitize($this->input->post('unliCheck'));
		$dateStartCheck	= sanitize($this->input->post('dateStartCheck'));
		$dateEndCheck	= sanitize($this->input->post('dateEndCheck'));

		if($this->input->post('txtstart') != '') {
			$offerStart = date('Y-m-d', strtotime(str_replace('/', '-', sanitize($this->input->post('txtstart')))));
		}else {
			$offerStart = date('Y-m-d H:i:s');
		}

		if($offerNo == '') {
			$offerNo = -1;
		}

		$offerEdit = $this->model->getCreateOfferForEdit($randnum, $offerName, $offerAmount, $offerTerm, $offerType, $offerStart, $offerEnd, $offerNotes, $userId, $offerNo, $statusId, $editOfferId, $unliCheck, $dateStartCheck, $dateEndCheck);
	
		$data = array('success' => 3);	// post save
		
		generate_json($data);
	}

	public function historyId() {
		$offerId = sanitize($this->input->post('offerId'));
		$userId = sanitize($this->input->post('userid'));

		$getHistoryId = $this->model->getHistoryId($offerId, $userId);

		$data = array(
			'historyId' => $getHistoryId->row()->history_id
		);

		generate_json($data);
	}

	public function viewOfferDetails() {
		$offerId 		= sanitize($this->input->post('offer_id'));
		$userId 		= sanitize($this->input->post('userID'));
		$token 			= randomStringGen(180);

		$getViewOfferDetails = $this->model->getViewOfferDetails($offerId, $userId);
		$offerCreatorId 	= $getViewOfferDetails->row()->offerAddedByID;
		$offerCreatorName 	= $getViewOfferDetails->row()->name;
		$offerCreatorAlias 	= $getViewOfferDetails->row()->creatorAlias;
		$offerAmount 		= $getViewOfferDetails->row()->offerAmount;
		$getMessageId       = 0;
		$getMessageCount    = 0;
		$offerCount   		=  $this->model->getCurrentOfferCount($userId);

		if($offerCreatorId != $userId) {
			$getMessageCount = $this->model->getMessageCount($offerCreatorId, $userId, $offerId);
			if($getMessageCount < 1) {
				$getOfferMessage = $this->model->getOfferMessage($offerCreatorId, $userId, $offerId, $offerAmount, $token);
			}
			$getMessageId 	 = $this->model->getMessageId($offerCreatorId, $userId, $offerId);
		}

		$data = array(
			'result' => $getViewOfferDetails->row(),
			'success' => 1,
			'creatorId' => $offerCreatorId,
			'creatorName' => stripslashes($offerCreatorName),
			'creatorAlias' => $offerCreatorAlias,
			'messageId' => $getMessageId,
			'messageCount' => $getMessageCount,
			'offerCount'	=> $offerCount
		);

		generate_json($data);
	}

	public function acceptOffer() {
		$userId 		= sanitize($this->input->post('userID'));
		$messageId 		= sanitize($this->input->post('messageID'));

		$getAcceptOffer = $this->model->getAcceptOffer($userId, $messageId);

		$data = array(
			'success' => 1
		);

		generate_json($data);
	}

	public function acceptOfferOnDetail() {
		$userId 		= sanitize($this->input->post('userId'));
		$offerId 		= sanitize($this->input->post('offerId'));
		$creatorId 		= sanitize($this->input->post('creatorId'));
		$messageId 		= $this->model->getMessageId($creatorId, $userId, $offerId);
		$getAcceptOffer = $this->model->getAcceptOffer($userId, $messageId);

		$data = array(
			'success' => 1
		);

		generate_json($data);
	}

	public function viewHistoryDetail() {
		$historyId 			= sanitize($this->input->post('historyID'));
		$getViewHistoryTbl 	= $this->model->getViewHistoryTbl($historyId);
		$offerCreatorId 	= $getViewHistoryTbl->row()->user1;
		$userId 	  		= $getViewHistoryTbl->row()->user2;
		$offerId 	  		= $getViewHistoryTbl->row()->offer_id;
		$getMessageId 		= $this->model->getMessageId($offerCreatorId, $userId, $offerId);

		$this->viewOfferConversationHistory($getMessageId);
	}

	public function viewMessageCounterDetail() {
		$messageId = sanitize($this->input->post('messageID'));
		$this->viewOfferConversationHistory($messageId);
	}

	public function viewOfferConversationHistory($messageId) {
		$getViewMessageCounterDetail = $this->model->getViewMessageCounterDetail($messageId);
		$data = array(
			'offerDetails' => $getViewMessageCounterDetail
		);

		generate_json($data);
	}

	public function sendCounterOffer() {
		$userId 				= sanitize($this->input->post('loginUserID'));
		$messageId 				= sanitize($this->input->post('messageID'));
		$offerAmount 			= sanitize($this->input->post('counterOfferAmount'));
		$messageObj    			= $this->model->viewMessageTbl($messageId);
		$offerId   				= $messageObj->message_offerID;
		$offerObj 				= $this->model->viewTblOfferByOfferId($offerId);
		$origOfferAmount 		= $offerObj->offerAmount;
		$offerCreatorId 		= $offerObj->offerAddedByID;
		$messageToken			= $messageObj->negotiate_msg_token;
		$messageFromId			= $messageObj->fromID;
		$messageToId			= $messageObj->toID;
		$offerMsgsObj			= $this->model->selectAllMessageUsingToken($messageToken);
		$messageCount 			= count($this->model->selectAllMessageUsingToken($messageToken));
		$creator_previous_offer = 0;
		$my_previous_offer 		= 0;
		$tempOfferAmount		= array();
		$valid 					= 1;

		if($userId == $offerCreatorId) { // you are the offer creator
			if ($messageCount % 2 == 0) {
				foreach ($offerMsgsObj as $message) {
					array_push($tempOfferAmount, $message->counterOfferAmount);
				}

				$negotiatorOfferAmmount = end($tempOfferAmount);
				array_pop($tempOfferAmount);
				$creatorOfferAmount = end($tempOfferAmount);

				if($messageFromId == $offerCreatorId) {
					$toCounterID = $messageToId;
				}else {
					$toCounterID = $messageFromId;
				}

				$status = 1;
				$this->model->insertOfferMessage($userId, $toCounterID, $offerId, $offerAmount, $messageToken);

				// if($offerAmount > $creatorOfferAmount && $offerAmount < $negotiatorOfferAmmount) {
					
				// }else {
				// 	$status = 3; // You cannot negotiate a counter-offer that is lower than the original offer, lower than your previous offer amounts, or higher than the other party's counter-offers.
				// }

				// With Cannot bid lower than original offer validation
				// if($offerAmount > $creatorOfferAmount && $offerAmount < $negotiatorOfferAmmount) {
				// 	if($messageFromId == $offerCreatorId) {
				// 		$toCounterID = $messageToId;
				// 	}else {
				// 		$toCounterID = $messageFromId;
				// 	}
				// 	$status = 1;
				// 	$this->model->insertOfferMessage($userId, $toCounterID, $offerId, $offerAmount, $messageToken);
				// }else {
				// 	$status = 3; // You cannot negotiate a counter-offer that is lower than the original offer, lower than your previous offer amounts, or higher than the other party's counter-offers.
				// }
			}else { // if odd number it means you already sent an counter offer
				$status = 0; // counter is inactive to prevent multiple counter offer
			}
		}else { 
			if ($messageCount % 2 == 0) { // if event number it means you already sent an counter offer
				$status = 0; // counter is inactive to prevent multiple counter offer
			}else { 
				if($messageCount == 1) { // if it's Original Offer
					$status = 1; // good to go - Insert query
					$this->model->insertOfferMessage($userId, $offerCreatorId, $offerId, $offerAmount, $messageToken);

					// With Cannot bid lower than original offer validation
					// if($offerAmount < $origOfferAmount) {
					// 	$status = 2; // error, offerAmount should be greater than Original offer 
					// }else {
					// 	$status = 1; // good to go - Insert query
					// 	$this->model->insertOfferMessage($userId, $offerCreatorId, $offerId, $offerAmount, $messageToken);
					// }
				}else { // get the last counter offer and offer amount should be Higher than original bid or creator previous bid, and lower than previous bids
					foreach ($offerMsgsObj as $message) {
						array_push($tempOfferAmount, $message->counterOfferAmount);
					}

					$creatorPrevOfferAmount = end($tempOfferAmount);
					array_pop($tempOfferAmount); // remove the last offerAmount to get the previous offerAmount
					$myPrevOfferAmount = end($tempOfferAmount);

					// With Cannot bid lower than original offer validation
					// if($offerAmount < $creatorPrevOfferAmount) {
					// 	$valid = 0;
					// 	$status = 6; // Error - Cannot bid for lower than original offer or creator previous offer
					// }

					if($offerAmount > $myPrevOfferAmount) {
						$valid = 0;
						$status = 5; // Error - Cannot bid for higher than any of their own previous bids
					}

					// With Cannot bid lower than original offer validation
					// if($offerAmount < $origOfferAmount) {
					// 	$valid = 0;
					// 	$status = 2; // Error - Cannot bid for lower than original offer or creator previous offer
					// }

					if($valid) { // if no error encounter
						$status = 1; 
						$this->model->insertOfferMessage($userId, $offerCreatorId, $offerId, $offerAmount, $messageToken);
					}
				}
			}
		}

		$data = array(
			'status' => $status
		);

		generate_json($data);
	}

	public function loadAllOfferName() {
		$userId 		= sanitize($this->input->post('userId'));
		$offerTypeId 	= sanitize($this->input->post('offerTypeId'));

		$getLoadAllOfferName = $this->model->getLoadAllOfferName($userId, $offerTypeId);

		$data = array(
			'result' => $getLoadAllOfferName->result()
		);

		generate_json($data);
	}

	public function viewDraftOffer() {
		$offerId = sanitize($this->input->post('data_offer_id'));

		$getViewDraftOffer = $this->model->getViewDraftOffer($offerId);

		$data = array(
			'result' => $getViewDraftOffer->row()
		);

		generate_json($data);
	}

	public function offerNotifCount() {
		$userId = sanitize($this->input->post('userId'));

		$getOfferNotifCount = $this->model->getOfferNotifCount($userId)->row()->notifCount;

		$data = array(
			'result' => $getOfferNotifCount
		);

		generate_json($data);
	}

	public function offerHasRead() {
		$offerId 	= sanitize($this->input->post('offerId'));
		$userId 	= sanitize($this->input->post('userId'));

		$this->model->getOfferHasRead($offerId, $userId);

		$data = array(
			'success' => 1
		);

		generate_json($data);
	}

	public function createPrivateOffer() {
		$num 			= rand(1111111111,9999999999);
		$randnum 		= 'SH-'.$num;
		$offerName 		= sanitize($this->input->post('txtoffername'));
		$offerAmount 	= sanitize($this->input->post('txtofferamount'));
		$offerTerm 		= sanitize($this->input->post('txtofferterms'));
		$offerType 		= sanitize($this->input->post('txtoffertype'));
		$offerEnd 		= date('Y-m-d', strtotime(str_replace('/', '-', sanitize($this->input->post('txtends')))));
		$offerNotes 	= sanitize($this->input->post('txtnotes'));
		$userId 		= sanitize($this->input->post('userid'));
		$offerNo 		= sanitize($this->input->post('txtnoOfOffer'));
		$statusId 		= sanitize($this->input->post('statusID'));
		$toIdArr		= $this->input->post('toArray');
		$unliCheck		= sanitize($this->input->post('unliCheck'));
		$dateStartCheck	= sanitize($this->input->post('dateStartCheck'));
		$dateEndCheck	= sanitize($this->input->post('dateEndCheck'));

		if($this->input->post('txtstart') != '') {
			$offerStart = date('Y-m-d', strtotime(str_replace('/', '-', sanitize($this->input->post('txtstart')))));
		}else {
			$offerStart = date('Y-m-d H:i:s');
		}

		if($offerNo == '') {
			$offerNo = -1;
		}
		
		$getCreateOfferId = $this->model->getCreateOffer($randnum, $offerName, $offerAmount, $offerTerm, $offerType, $offerStart, $offerEnd, $offerNotes, $userId, $offerNo, $statusId, $unliCheck, $dateStartCheck, $dateEndCheck);
		foreach ($toIdArr as $toId) {
			$token = randomStringGen(180);
			$this->model->getOfferMessage($userId, $toId, $getCreateOfferId, $offerAmount, $token);
		}
		$data = array(
			'success' => 2
		);

		generate_json($data);
	}

	public function checkUnreadPendingNegotiation() {
		$userId 		= sanitize($this->input->post('userId'));
		$messageToken 	= sanitize($this->input->post('messageToken'));

		$getCheckUnreadPendingNegotiation = $this->model->getCheckUnreadPendingNegotiation($userId, $messageToken);

		$data = array(
			'unreadNegotiation' => $getCheckUnreadPendingNegotiation->result()
		);

		generate_json($data);
	}

	public function updateOfferRead() {
		$messageId 	= sanitize($this->input->post('messageId'));
		$userId 	= sanitize($this->input->post('userId'));

		$getUpdateOfferRead = $this->model->getUpdateOfferRead($messageId, $userId);

		$data = array(
			'success' => 1
		);

		generate_json($data);
	}

	public function updateOfferAcceptedRead() {
		$messageId 	= sanitize($this->input->post('messageId'));
		$userId 	= sanitize($this->input->post('userId'));

		$updateOfferAcceptedRead = $this->model->updateOfferAcceptedRead($messageId, $userId);

		$data = array(
			'success' => 1
		);

		generate_json($data);
	}

	public function viewRelist() {
		$offerId = sanitize($this->input->post('offerId'));

		$getViewRelist = $this->model->getViewRelist($offerId);

		$data = array(
			'result' => $getViewRelist->row()
		);

		generate_json($data);
	}

	public function updeRelistOffer() {
		$relistStartDate 	= sanitize($this->input->post('relistStartDate'));
		$relistEndDate 		= sanitize($this->input->post('relistEndDate'));
		$offerId 			= sanitize($this->input->post('offerId'));


		if($relistStartDate == 'now') {
			$relistStartDate = date("Y-m-d");
		}

		if($relistEndDate == 'unli') {
			$relistEndDate = '1970-01-01';
		}

		$getUpdateRelistOffer = $this->model->getUpdateRelistOffer($relistStartDate, $relistEndDate, $offerId);

		$data = array(
			'success' => 1
		);

		generate_json($data);
	}

	public function viewProfile() {
		$profileId = sanitize($this->input->post('profileId'));
		$getViewProfile = $this->model->getViewProfile($profileId);

		$data = array(
			'result' => $getViewProfile->row()
		);

		generate_json($data);
	}

	public function viewMessage() {
		$userId 		= sanitize($this->input->post('userId'));
		$recordPerPage 	= sanitize($this->input->post('recordPerPage'));
		$start 			= sanitize($this->input->post('start'));
		$start 			= $start > 1 ? $start - 1 : 0;
		$start 			= $start * $recordPerPage;
		$searchInput	= sanitize($this->input->post('searchMessageInput'));
		$messageType 	= sanitize($this->input->post('messageType'));

		$getViewMessage = $this->model->getViewMessage($userId, $recordPerPage, $start, $searchInput, $messageType);

		$data = array(
			'result' => $getViewMessage->result(),
			'userId' => $userId
		);

		generate_json($data);
	}

	public function loadAllEmail() {
		$userId = sanitize($this->input->post('userId'));
		$getLoadAllEmail = $this->model->getLoadAllEmail($userId);

		$usersArr = array();
		
		foreach($getLoadAllEmail->result() as $row) {
			$userObj = new stdClass();
			$userObj->email = $row->email;
			$userObj->id = $row->id;
			$userObj->name = $row->name;
			$userObj->alias = $this->getAlias($row->id)->alias;
			array_push($usersArr, $userObj);
		}

		$data = array(
			'result' => $usersArr,
			'test' => $this->getAlias(192)
		);

		generate_json($data);
	}

	public function getAlias($id) {
		$sql = "SELECT alias FROM tbl_profile WHERE userid = ? LIMIT 1";
		$data = array($id);
		return $this->db->query($sql, $data)->row();
	}

	public function createMessage() {
		$userId 					= sanitize($this->input->post('userId'));
		$msgToId 					= sanitize($this->input->post('msgEmail'));
		$msgToId1					= sanitize($this->input->post('emailId'));
		$linkToReplyMessageId 		= sanitize($this->input->post('linkToReplyMessageId'));

		if($msgToId == null || $msgToId == '') {
			$msgToId = $msgToId1;
		}

		$msgSubject 				= sanitize($this->input->post('msgSubject'));
		$msgBody 					= sanitize($this->input->post('msgBody'));
		$isDraft 					= sanitize($this->input->post('is_draft'));
		$isContinueDraftId			= sanitize($this->input->post('isContinueDraftId'));
        $config['upload_path'] 		= './ci_upload/';
        $config['allowed_types'] 	= 'gif|jpg|png|doc|txt|pdf|xls|ppt|pptx|docx|word|jpeg';
        $config['max_size']     	= '10000'; // 10mb
        $config['encrypt_name'] 	= TRUE;
        $this->load->library('upload', $config);
        $this->upload->do_upload('userFile');

        if($isDraft == '') {
        	$isDraft = 0;
        }

        if($isDraft == 0) {
        	if(!empty($msgToId) && !empty($msgSubject) && !empty($msgBody)) {
		   		if($_FILES['userFile']['name'] != '') { // has file to upload
					if(!$this->upload->do_upload('userFile')) {
			            $data = array(
			            	'success' => 0,
			            	'error' => $this->upload->display_errors()
			            );
			       	}else {
			            $data = array(
			            	'success' => 1,
							'upload_data' => $this->upload->data(),
							'fileName' => $this->upload->data('file_name')
			            );

			            $file = $this->upload->data('file_name');
			            $getCreateMessage = $this->model->getCreateMessage($userId, $msgToId, $msgSubject, $msgBody, $file, $isDraft, $isContinueDraftId, $linkToReplyMessageId);
			       	}
			    }else {
					$file = '';
			       	$getCreateMessage = $this->model->getCreateMessage($userId, $msgToId, $msgSubject, $msgBody, $file, $isDraft, $isContinueDraftId, $linkToReplyMessageId);
			       	$data = array(
			       		'success' => 1
			       	);
			   	}
			}else {
				$data = array(
					'success' => 2, // all fields are required,
					'msgToId' => $msgToId,
					'msgSubject' => $msgSubject,
					'msgBody' => $msgBody
				);
			}
		}else {
			if($_FILES['userFile']['name'] != '') { // has file to upload
				if(!$this->upload->do_upload('userFile')) {
		            $data = array(
		            	'success' => 0,
		            	'error' => $this->upload->display_errors()
		            );
		       	}else {
		            $data = array(
		            	'success' => 3,
		            	'upload_data' => $this->upload->data()
		            );

		            $file = $this->upload->data('file_name');
		            $getCreateMessage = $this->model->getCreateMessage($userId, $msgToId, $msgSubject, $msgBody, $file, $isDraft, $isContinueDraftId, $linkToReplyMessageId);
		       	}
			}else {
				$file = '';
				$getCreateMessage = $this->model->getCreateMessage($userId, $msgToId, $msgSubject, $msgBody, $file, $isDraft, $isContinueDraftId, $linkToReplyMessageId);
				$data = array(
					'success' => 3
				);
			}
		}

		generate_json($data);
	}

	public function checkUnreadMessage() {
		$userId = sanitize($this->input->post('userId'));

		$getCheckUnreadMessage = $this->model->getCheckUnreadMessage($userId);

		$data = array(
			'unreadCount' => $getCheckUnreadMessage
		);

		generate_json($data);
	}

	public function loadAllMessageSubject() {
		$userId 		= sanitize($this->input->post('userId'));
		$messageType 	= sanitize($this->input->post('messageType'));

		$getAllMessageSubject = $this->model->getAllMessageSubject($userId, $messageType);

		$data = array(
			'result' => $getAllMessageSubject->result(),
			'id'	=> $userId
		);

		generate_json($data);
	}

	public function deleteMessage() {
		$deleteId = sanitize($this->input->post('deleteId'));

		$getDeleteMessage = $this->model->getDeleteMessage($deleteId);

		$data = array(
			'success' => 1
		);

		generate_json($data);
	}

	public function deleteMessages() {
		$deleteIds = $this->input->post('deleteIds');

		foreach($deleteIds as $deleteId) {
			$getDeleteMessage = $this->model->getDeleteMessage($deleteId);
		}

		$data = array(
			'success' => 1
		);

		generate_json($data);
	}
	
	public function viewMessageDetail() {
		$messageId = sanitize($this->input->post('messageId'));

		$getViewMessageDetail = $this->model->getViewMessageDetail($messageId);
		$toId = $getViewMessageDetail->row()->toID;


		$data = array(
			'result' => $getViewMessageDetail->row(),
			'toName' => $this->getNameByUserId($toId),
			'toAlias' => $this->getAliasByUserId($toId)
		);

		generate_json($data);
	}

	public function getAliasByUserId($userId) {
		$getAliasByUserId = $this->model->getAliasByUserId($userId);

		return $getAliasByUserId;
	}

	public function getNameByUserId($userId) {
		$getNameByUserId = $this->model->getNameByUserId($userId);
		return $getNameByUserId;
	}

	public function updateUnreadMessage() {
		$messageId = sanitize($this->input->post('messageId'));
		$getUpdateUnreadMessage = $this->model->getUpdateUnreadMessage($messageId);
		$data = array(
			'success' => 1
		);

		generate_json($data);
	}

	public function draftMessageContent() {
		$messageId = sanitize($this->input->post('messageId'));
		$getDraftMessageContent = $this->model->getDraftMessageContent($messageId);

		$data = array(
			'result' => $getDraftMessageContent->row()
		);

		generate_json($data);
	}

	public function draftRealTimeSaveUpdate() {
		$messageId  = sanitize($this->input->post('messageId'));
		$toId  		= sanitize($this->input->post('toId'));
		$subject  	= sanitize($this->input->post('subject'));
		$msgBody  	= sanitize($this->input->post('msgBody'));

		$getDraftRealTimeSaveUpdate = $this->model->getDraftRealTimeSaveUpdate($messageId, $toId, $subject, $msgBody);

		$data = array(
			'success' => 1
		);

		generate_json($data);
	}

	public function loadSalesPeople() {
		$userId = sanitize($this->input->post('userId'));

		$getLoadSalesPeople = $this->model->getLoadSalesPeople($userId);

		$data = array(
			'result' => $getLoadSalesPeople
		);

		generate_json($data);
	}

	public function salesPeopleRecord() {
		$userId 				= sanitize($this->input->post('userId'));
		$messageId 				= sanitize($this->input->post('messageId'));
		$salesPeopleColumnId 	= sanitize($this->input->post('salesPeopleColumnId'));


		$getSalesPeopleRecord = $this->model->getSalesPeopleRecord($userId, $messageId, $salesPeopleColumnId);

		$data = array(
			'result' => $getSalesPeopleRecord->result()
		);

		generate_json($data);
	}

	public function changePassword() {
		$email 					= sanitize($this->input->post('email'));
		$oldPass 				= sanitize($this->input->post('oldPass'));
		$confirmPass 			= sanitize($this->input->post('confirmPass'));
		$newPass 				= sanitize($this->input->post('newPass'));
		$newPassHash 			= password_hash($newPass, PASSWORD_DEFAULT);
		$getCheckEmailExist 	= $this->model->getCheckEmailExist($email);
		$currentPass 			= $getCheckEmailExist->row()->password;

		if(strlen($newPass) >= 5) {
			if($newPass == $confirmPass) {
				if (password_verify($oldPass, $currentPass)) { // if old password input is correct
				   	$getChangePassword = $this->model->getChangePassword($email, $newPassHash);
				   	$data = array(
				   		'success' => 1 // Success, password change
				   	);
				}else{
					$data = array(
						'success' => 4 // Old Password not Match
					);
				}
	    	}else {
	    		$data = array(
	    			'success' => 3 // Confirm Password  does not match
	    		);
	    	}
		}else {
			$data = array(
				'success' => 2 // Password is too short
			);
		}

		generate_json($data);
	}

	public function profilePhotoUpload() {
		$userId = sanitize($this->input->post('userId'));
        $config['upload_path'] = './ci_upload/';
        $config['allowed_types'] = 'gif|jpg|png|jpeg';
        $config['max_size'] = '0';
        $config['encrypt_name'] = TRUE;
        $isFailed = 0;
       	$uploadFileName = "";

       	$this->load->library('upload', $config);
       	if(!$this->upload->do_upload('profilePhoto')) {
       		$isFailed = 1; 
       		$uploadFileName = $this->upload->display_errors();
       	}else {
       		// 1st resize and crop
       		$upload_data = $this->upload->data();
       		$image_config["image_library"] = "gd2";
       		$image_config["source_image"] = $upload_data["full_path"];
       		$image_config['create_thumb'] = FALSE;
       		$image_config['maintain_ratio'] = TRUE;
       		$image_config['new_image'] = $upload_data["file_path"] . 'w131_'.$upload_data["file_name"];
       		$image_config['quality'] = "100%";
       		$image_config['width'] = 131;
       		$image_config['height'] = 131;
       		$dim = (intval($upload_data["image_width"]) / intval($upload_data["image_height"])) - ($image_config['width'] / $image_config['height']);
       		$image_config['master_dim'] = ($dim > 0)? "height" : "width";
       		 
       		$this->load->library('image_lib');
       		$this->image_lib->initialize($image_config);
       		 
       		if(!$this->image_lib->resize()){ //Resize image
       		    $isFailed = 1; 
       		}else{
       			$image_config['image_library'] = 'gd2';
       			$image_config['source_image'] = $upload_data["file_path"] . 'w131_'.$upload_data["file_name"];
       			$image_config['new_image'] = $upload_data["file_path"] . 'w131_'.$upload_data["file_name"];
       			$image_config['quality'] = "100%";
       			$image_config['maintain_ratio'] = FALSE;
       			$image_config['width'] = 131;
       			$image_config['height'] = 131;
       			$image_config['x_axis'] = '0';
       			$image_config['y_axis'] = '0';
       			 
       			$this->image_lib->initialize($image_config); 
       			 
       			if (!$this->image_lib->crop()){
       			    $isFailed = 1;
       			}else{
       			    $isFailed = 0;
       			}
       		}

       		$this->image_lib->clear();

       		// 2nd resize and crop
       		$upload_data = $this->upload->data();
       		$image_config["image_library"] = "gd2";
       		$image_config["source_image"] = $upload_data["full_path"];
       		$image_config['create_thumb'] = FALSE;
       		$image_config['maintain_ratio'] = TRUE;
       		$image_config['new_image'] = $upload_data["file_path"] . 'w45_'.$upload_data["file_name"];
       		$image_config['quality'] = "100%";
       		$image_config['width'] = 45;
       		$image_config['height'] = 45;
       		$dim = (intval($upload_data["image_width"]) / intval($upload_data["image_height"])) - ($image_config['width'] / $image_config['height']);
       		$image_config['master_dim'] = ($dim > 0)? "height" : "width";
       		 
       		$this->load->library('image_lib');
       		$this->image_lib->initialize($image_config);
       		 
       		if(!$this->image_lib->resize()){ //Resize image
       		    $isFailed = 1;
       		}else{
       			$image_config['image_library'] = 'gd2';
       			$image_config['source_image'] = $upload_data["file_path"] . 'w45_'.$upload_data["file_name"];
       			$image_config['new_image'] = $upload_data["file_path"] . 'w45_'.$upload_data["file_name"];
       			$image_config['quality'] = "100%";
       			$image_config['maintain_ratio'] = FALSE;
       			$image_config['width'] = 45;
       			$image_config['height'] = 45;
       			$image_config['x_axis'] = '0';
       			$image_config['y_axis'] = '0';
       			 
       			$this->image_lib->initialize($image_config); 
       			 
       			if (!$this->image_lib->crop()){
       			    $isFailed = 1;
       			}else{
       			    $isFailed = 0;
       			}
       		}   


       	}

       	if($isFailed == 0) { // No error on resize and crop
       		$photo = $this->upload->data('file_name');
       		$this->model->getUpdateProfilePhoto($photo, $userId);
       		$data = array(
       			'success' => 1
       		);
       	}else {
       		$data = array(
       			'success' => 0,
       			'filename' => $uploadFileName
       		);
       	}
        
		generate_json($data);
	}

	public function privProfilePhotoUpload() {
		$userId = sanitize($this->input->post('userId'));
        $config['upload_path'] = './ci_upload/';
        $config['allowed_types'] = 'gif|jpg|png|jpeg';
        $config['max_size'] = '0';
        $config['encrypt_name'] = TRUE;
        $isFailed = 0;
       	
       	$this->load->library('upload', $config);
       	if(!$this->upload->do_upload('privProfilePhoto')) {
       		$isFailed = 1; 
       	}else {
       		// 1st resize and crop
       		$upload_data = $this->upload->data();
       		$image_config["image_library"] = "gd2";
       		$image_config["source_image"] = $upload_data["full_path"];
       		$image_config['create_thumb'] = FALSE;
       		$image_config['maintain_ratio'] = TRUE;
       		$image_config['new_image'] = $upload_data["file_path"] . 'w131_'.$upload_data["file_name"];
       		$image_config['quality'] = "100%";
       		$image_config['width'] = 131;
       		$image_config['height'] = 131;
       		$dim = (intval($upload_data["image_width"]) / intval($upload_data["image_height"])) - ($image_config['width'] / $image_config['height']);
       		$image_config['master_dim'] = ($dim > 0)? "height" : "width";
       		 
       		$this->load->library('image_lib');
       		$this->image_lib->initialize($image_config);
       		 
       		if(!$this->image_lib->resize()){ //Resize image
       		    $isFailed = 1; 
       		}else{
       			$image_config['image_library'] = 'gd2';
       			$image_config['source_image'] = $upload_data["file_path"] . 'w131_'.$upload_data["file_name"];
       			$image_config['new_image'] = $upload_data["file_path"] . 'w131_'.$upload_data["file_name"];
       			$image_config['quality'] = "100%";
       			$image_config['maintain_ratio'] = FALSE;
       			$image_config['width'] = 131;
       			$image_config['height'] = 131;
       			$image_config['x_axis'] = '0';
       			$image_config['y_axis'] = '0';
       			 
       			$this->image_lib->initialize($image_config); 
       			 
       			if (!$this->image_lib->crop()){
       			    $isFailed = 1;
       			}else{
       			    $isFailed = 0;
       			}
       		}

       		$this->image_lib->clear();

       		// 2nd resize and crop
       		$upload_data = $this->upload->data();
       		$image_config["image_library"] = "gd2";
       		$image_config["source_image"] = $upload_data["full_path"];
       		$image_config['create_thumb'] = FALSE;
       		$image_config['maintain_ratio'] = TRUE;
       		$image_config['new_image'] = $upload_data["file_path"] . 'w45_'.$upload_data["file_name"];
       		$image_config['quality'] = "100%";
       		$image_config['width'] = 45;
       		$image_config['height'] = 45;
       		$dim = (intval($upload_data["image_width"]) / intval($upload_data["image_height"])) - ($image_config['width'] / $image_config['height']);
       		$image_config['master_dim'] = ($dim > 0)? "height" : "width";
       		 
       		$this->load->library('image_lib');
       		$this->image_lib->initialize($image_config);
       		 
       		if(!$this->image_lib->resize()){ //Resize image
       		    $isFailed = 1;
       		}else{
       			$image_config['image_library'] = 'gd2';
       			$image_config['source_image'] = $upload_data["file_path"] . 'w45_'.$upload_data["file_name"];
       			$image_config['new_image'] = $upload_data["file_path"] . 'w45_'.$upload_data["file_name"];
       			$image_config['quality'] = "100%";
       			$image_config['maintain_ratio'] = FALSE;
       			$image_config['width'] = 45;
       			$image_config['height'] = 45;
       			$image_config['x_axis'] = '0';
       			$image_config['y_axis'] = '0';
       			 
       			$this->image_lib->initialize($image_config); 
       			 
       			if (!$this->image_lib->crop()){
       			    $isFailed = 1;
       			}else{
       			    $isFailed = 0;
       			}
       		}    
       	}

       	if($isFailed == 0) { // No error on resize and crop
       		$photo = $this->upload->data('file_name');
       		$this->model->getUpdatePrivProfilePhoto($photo, $userId);
       		$data = array(
       			'success' => 1
       		);
       	}else {
       		$data = array(
       			'success' => 0
       		);
       	}
        
		generate_json($data);
	}

	public function viewProfileInfo() {
		$userId = sanitize($this->input->post('userId'));
		$getViewProfileInfo = $this->model->getViewProfileInfo($userId);

		$data = array(
			'result' => $getViewProfileInfo->row()
		); 

		generate_json($data);
	}

	public function updateProfile() {
		$corporateName 			= sanitize($this->input->post('corporateName'));
		$nickName 				= sanitize($this->input->post('nickName'));
		$emailAdd 				= sanitize($this->input->post('emailAdd'));
		$webUrl 				= sanitize($this->input->post('webUrl'));
		$primaryPhoneNumber 	= sanitize($this->input->post('primaryPhoneNumber'));
		$about 					= sanitize($this->input->post('about'));
		$userId 				= sanitize($this->input->post('userId'));
		$privCorporateName		= sanitize($this->input->post('privCorporateName'));
		$priveintaxid			= sanitize($this->input->post('priveintaxid'));
		$privPhoneNumber		= sanitize($this->input->post('privPhoneNumber'));
		$privAddress			= sanitize($this->input->post('privAddress'));
		

		$getUpdateProfile = $this->model->getUpdateProfile($corporateName, $nickName, $emailAdd, $webUrl, $primaryPhoneNumber, $about, $userId, $privCorporateName, $priveintaxid, $privPhoneNumber, $privAddress);

		$data = array(
			'success' => 1
		);

		generate_json($data);
	}

	public function loadUsers() {
		$userId = sanitize($this->input->post('userId'));

		$getLoadUsers = $this->model->getLoadUsers($userId);

		$data = array(
			'result' => $getLoadUsers->result()
		);

		generate_json($data);
	}

	public function loadContact() {
		$userId = sanitize($this->input->post('userId'));
		$getLoadContact = $this->model->getLoadContact($userId);

		$data = array(
			'isSync' => $getLoadContact
		);

		generate_json($data);
	}

	public function checkContact() {
		$userId = sanitize($this->input->post('userId'));
		$getCheckContact = $this->model->getCheckContact($userId);

		$data = array(
			'isSync' => $getCheckContact
		);

		generate_json($data);
	}

	public function loadTaxInfo() {
		$userId = sanitize($this->input->post('userId'));
		$getLoadTaxInfo = $this->model->getLoadTaxInfo($userId);

		$data = array(
			'result' => $getLoadTaxInfo->result()
		);

		generate_json($data);
	}

	public function saveTaxInfo() {
		$userId = sanitize($this->input->post('userId'));
		$corporateName = sanitize($this->input->post('corporateName'));
		$ein = sanitize($this->input->post('ein'));
		$address = sanitize($this->input->post('address'));
		$entity = sanitize($this->input->post('entity'));
		
		$getSaveTaxInfo = $this->model->getSaveTaxInfo($userId, $corporateName, $ein, $address, $entity);

		$data = array(
			'success' => 1
		);

		generate_json($data);
	}

	public function viewSalesPeople() {
		$userId = sanitize($this->input->post('userId'));
		$getViewSalesPeople = $this->model->getViewSalesPeople($userId);

		if(!is_array($getViewSalesPeople)) {
			$data = array(
				'success' => 0,
				'result' => $getViewSalesPeople
			);
		}else {
			$data = array(
				'success' => 1,
				'result' => $getViewSalesPeople
			);
		}

		generate_json($data);
	}

	public function addUser() {
		$userName 			= sanitize($this->input->post('userName'));
		$userEmail 			= sanitize($this->input->post('userEmail'));
		$userPassword 		= sanitize($this->input->post('userPassword'));
		$userPassConfirm 	= sanitize($this->input->post('userPassConfirm'));
		$userPriv 			= sanitize($this->input->post('userPriv'));
		$addedById 			= sanitize($this->input->post('addedById'));
		$isEmailExist 		= $this->model->getCheckEmailExist($userEmail);

		if($userName != '') {
			if(isValidEmail($userEmail)) {
				if(strlen($userPassword) >= 5) {
					if($userPassword == $userPassConfirm) {
						if($isEmailExist->num_rows() == 0) {
							$getAddUser = $this->model->getAddUser($userName, $userEmail, $userPassword, $userPriv, $addedById);
							$data = array(
								'success' => 1,
								'successMsg' => 'Email verification sent'
							);
						}else {
							$data = array(
								'success' => 0,
								'errorMsg' => 'Email is already registered'
							);
						}
					}else {
						$data = array(
							'success' => 0,
							'errorMsg' => 'Confirm password does not match'
						);
					}
				}else {
					$data = array(
						'success' => 0,
						'errorMsg' => 'Password is too short, minimum length is 5 characters'
					);
				}
			}else {
				$data = array(
					'success' => 0,
					'errorMsg' => 'Invalid email address'
				);
			}
		}else {
			$data = array(
				'success' => 0,
				'errorMsg' => 'Name field is required'
			);
		}

		generate_json($data);
	}
	
	public function editUserInfo() {
		$editUserId = sanitize($this->input->post('editUserId'));
		$getEditUserInfo = $this->model->getEditUserInfo($editUserId);

		$data = array(
			'result' => $getEditUserInfo->row()
		);

		generate_json($data);
	}

	public function saveEditUserInfo() {
		$userEditId = sanitize($this->input->post('userEditId'));
		$userPriv 	= sanitize($this->input->post('userPriv'));
		$getSaveEditUserInfo = $this->model->getSaveEditUserInfo($userEditId, $userPriv);

		$data = array(
			'success' => 1
		);

		generate_json($data);
	}

	public function deleteOffer() {
		$offerId = sanitize($this->input->post('offerId'));
		$getDeleteOffer = $this->model->getDeleteOffer($offerId);

		$data = array(
			'success' => 1
		);

		generate_json($data);
	}

	public function loadAcceptedTodo() {
		$messageId 	= sanitize($this->input->post('messageId'));
		$userId 	= sanitize($this->input->post('userId'));

		$getLoadAcceptedTodo = $this->model->getLoadAcceptedTodo($messageId, $userId);

		$data = array(
			'result' => $getLoadAcceptedTodo->row(),
			'success' => 1
		);

		generate_json($data);
	}

	public function todoIsRead() {
		$todoId = sanitize($this->input->post('todoId'));

		$getTodoIsRead = $this->model->getTodoIsRead($todoId);

		$data = array(
			'success' => 1
		);

		generate_json($data);
	}
	
	public function loadUserReview() {
		$revieweeId = sanitize($this->input->post('revieweeId'));

		$getLoadUserReview = $this->model->getLoadUserReview($revieweeId);

		$data = array(
			'success' => 1,
			'result' => $getLoadUserReview->result()
		);

		generate_json($data);
	}

	public function addUserReview() {
		$reviewTitle = sanitize($this->input->post('reviewTitle'));
		$reviewDetails = sanitize($this->input->post('reviewDetails'));
		$reviewStar = sanitize($this->input->post('reviewStar'));
		$revieweeId = sanitize($this->input->post('revieweeId'));
		$reviewerId = sanitize($this->input->post('reviewerId'));
		$offerId = sanitize($this->input->post('offerId'));
		
		$getAddUserReview = $this->model->getAddUserReview($reviewTitle, $reviewDetails, $reviewStar, $revieweeId, $reviewerId, $offerId);

		$data = array(
			'success' => 1
		);

		generate_json($data);
	}

	public function checkExistingReview() {
		$revieweeId = sanitize($this->input->post('revieweeId'));
		$offerId 	= sanitize($this->input->post('offerId'));
		$reviewerId = sanitize($this->input->post('reviewerId'));

		$getCheckExistingReview = $this->model->getCheckExistingReview($revieweeId, $offerId, $reviewerId);
		
		$data = array(
			'reviewExist' => $getCheckExistingReview->num_rows(),
			'row' => $getCheckExistingReview->row() 	
		);

		generate_json($data);
	}

	public function updateUserReview() {
		$reviewId = sanitize($this->input->post('reviewId'));
		$reviewTitle = sanitize($this->input->post('reviewTitle'));
		$reviewDetails = sanitize($this->input->post('reviewDetails'));
		$reviewStar = sanitize($this->input->post('reviewStar'));

		$getUpdateUserReview = $this->model->getUpdateUserReview($reviewId, $reviewTitle, $reviewDetails, $reviewStar);
		
		$data = array(
			'success' => 1
		);

		generate_json($data);
	}

	public function loadReviewDetails() {
		$revieweeId = sanitize($this->input->post('revieweeId'));
		$reviewerId = sanitize($this->input->post('reviewerId'));
		$offerId 	= sanitize($this->input->post('offerId'));

		$getLoadReviewDetails = $this->model->getLoadReviewDetails($revieweeId, $reviewerId, $offerId);

		$data = array(
			'success' => 1,
			'row' => $getLoadReviewDetails->row()
		);

		generate_json($data);
	}

		public function loadReviewDetails1() {
		$revieweeId = sanitize($this->input->post('revieweeId'));
		$reviewerId = sanitize($this->input->post('reviewerId'));
		$offerId 	= sanitize($this->input->post('offerId'));

		$getLoadReviewDetails1 = $this->model->getLoadReviewDetails1($revieweeId, $reviewerId, $offerId);

		$data = array(
			'success' => 1,
			'row' => $getLoadReviewDetails1->row()
		);

		generate_json($data);
	}

	public function resetPassword() {
		$this->load->view('reset-password');
	}

	public function resetPassConfirm() {
		$url 			= sanitize($this->input->post('url'));
		$newPass 		= sanitize($this->input->post('newPass'));
		$getEnc			= explode('token=', $url);
		$encEmail 		= $getEnc[1];
		$email 			= decryptIt($encEmail);
		$password		= password_hash($newPass, PASSWORD_DEFAULT);

		$this->model->getResetPassConfirm($email, $password);

		$data = array(
			'success' => 1
		);

		generate_json($data);
	}

	
	public function paymentRedirect() {
		$offerId = bin2hex(sanitize($this->input->post('offerId')));
		$creatorId = bin2hex(sanitize($this->input->post('creatorId')));

		$data = array(
			'offerId' => $offerId,	
			'creatorId' => $creatorId,
			'success' => 1,
		);
	
		generate_json($data);
	}

	public function loadHistory() {
		$userId 		= sanitize($this->input->post('userId'));
		$historyType 	= sanitize($this->input->post('historyType'));

		$getLoadHistory = $this->model->getLoadHistory($userId, $historyType);

		$data = array(
			'result' => $getLoadHistory->result(),
			'success' => 1
		);

		generate_json($data);
	}

	
	
	public function paymentTransact() {
		$userId = sanitize($this->input->post('userId'));

		$getPaymentTransact = $this->model->getPaymentTransact($userId);

		$data = array(
			'result' => $getPaymentTransact->result()
		);

		generate_json($data);
	}

	public function transactionDetail() {
		$trasactionId = sanitize($this->input->post('trasactionId'));

		$getTransactionDetail = $this->model->getTransactionDetail($trasactionId);

		$data = array(
			'result' => $getTransactionDetail->row()
		);

		generate_json($data);
	}

	public function allNotifCount() {
		$userId = sanitize($this->input->post('userid'));
		$acceptedOfferCount = $this->model->getUnreadAcceptedOffer($userId);
		$unreadNegotiationCount = $this->model->getUnreadNegotiation($userId)->num_rows();
		$getCheckUnreadMessage = $this->model->getCheckUnreadMessage($userId);
		$privateUnreadCount = $this->model->getUnreadPrivateOffer($userId)->row()->unreadCount;
		$todoCount = $this->model->getUnreadTodo($userId);
		$totalCount = $unreadNegotiationCount + (int)$privateUnreadCount + (int)$getCheckUnreadMessage;
		
		$data = array(
			'success' => 1,
			'unreadCount' => $totalCount,
			'pendingNego' => $unreadNegotiationCount,
			'unreadPrivateOffer' => (int)$privateUnreadCount,
			'unreadMessage' => (int)$getCheckUnreadMessage,
		);

		generate_json($data);

		// public function viewAcceptedOffer() {
		// 	$userId 				= sanitize($this->input->post('userid'));
		// 	$getViewAcceptedOffer 	= $this->model->getViewAcceptedOffer($userId);
		// 	$unreadCount 			= $this->model->getUnreadAcceptedOffer($userId);
			
		// 	$data = array(
		// 		'result' => $getViewAcceptedOffer->result(),
		// 		'unreadCount' => $unreadCount,
		// 		'success' => 1
		// 	);
			
		// 	generate_json($data);
		// }
	}

	public function defaultEmailForPaypal() {
		$userId = sanitize($this->input->post('userId'));
		$userEmail = sanitize($this->input->post('userEmail'));


		$isEnabled = $this->model->checkPaypalEmailEnabled($userId);

		if($isEnabled->num_rows() == 0) {
			$this->model->userEnabled($userId);
			$checkIfEmailUserExist = $this->model->checkIfEmailUserExist($userId);

			if($checkIfEmailUserExist->num_rows() == 0) {
				$this->model->saveEmail($userId, $userEmail);
			}
		}

		$getEmail = $this->model->checkIfEmailUserExist($userId);


		$data = array(
			'isEnabled' => $isEnabled->num_rows(),
			'email' => $getEmail->row()->email
		);

		generate_json($data);
	}


	public function editEmail() {
		$userId = sanitize($this->input->post('userId'));
		$userEmail = sanitize($this->input->post('userEmail'));

		$getEditEmail = $this->model->getEditEmail($userId, $userEmail);

		$data = array(
			'success' => 1
		);

		generate_json($data);
	}

	public function acceptedOfferForTodo() {
		$userId = sanitize($this->input->post('userId'));
		$offerAcceptedId = sanitize($this->input->post('offerAcceptedId'));
		$offerIsCreator = sanitize($this->input->post('offerIsCreator'));

		$getAcceptedOfferForTodo = $this->model->getAcceptedOfferForTodo($userId, $offerAcceptedId, $offerIsCreator);
		
		$data = array(
			'success' => 1
		);

		generate_json($data);
	}

	public function todoRead() {
		$userId = sanitize($this->input->post('userid'));
		$todoId = sanitize($this->input->post('todoId'));

		$getTodoRead = $this->model->getTodoRead($userId, $todoId);

		$data = array(
			'success' => 1
		);

		generate_json($data);
	}

	public function pendingPayment() {
		$userId = sanitize($this->input->post('userId'));

		$getPendingPayment = $this->model->getPendingPayment($userId);

		$data = array(
			'success' => 1,
			'result' => $getPendingPayment->result()
		);

		generate_json($data);
	}

	public function reviewStat() {
		$userId = sanitize($this->input->post('userId'));

		$getReviewStat = $this->model->getReviewStat($userId);

		$data = array(
			'success' => 1,
			'result' => $getReviewStat->row(),
			'userid' => $userId
		);

		generate_json($data);
	}
}

