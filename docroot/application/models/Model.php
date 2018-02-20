<?php 
class Model extends CI_Model {
	public function getLogin($email) {
		$sql 	= "SELECT * FROM tbl_users WHERE email = ? AND is_active = ?";
		$data 	= array($email, 1);
		$query 	= $this->db->query($sql, $data);
		return $query;
	}

	public function getCheckFbExist($fbId, $email) {
		$sql 	= "SELECT email from tbl_users WHERE email = ? LIMIT 1";
		$data 	= array($email);
		return $this->db->query($sql, $data)->num_rows();
	}

	public function getRegisterFbUser($fbId, $fbUsername, $fbToken, $fbemail) {
		$sql 	= "INSERT INTO tbl_users(`name`, `role`, `created_at`, `accessLog`, `fbID`, `fbAccessToken`, `email`) VALUES (?,?,?,?,?,?,?)";
		$data 	= array($fbUsername, 'corporate', today(), today(), $fbId, $fbToken, $fbemail);
		return $this->db->query($sql, $data);
		$insertId = $this->db->insert_id();
		$this->db->query("INSERT INTO tbl_profile(`userid`)VALUES($insertId)");
	}

	public function getUserRecord($fbId, $email) {
		$sql 	= "SELECT * FROM tbl_users WHERE email = ? LIMIT 1";
		$data 	= array($email);
		return $this->db->query($sql, $data);
	}

	public function getCheckGmailExist($email) {
		$sql 	= "SELECT email from tbl_users WHERE email = ? LIMIT 1";
		$data 	= array($email);
		return $this->db->query($sql, $data);
	}

	public function getUserGoogleRecord($email) {
		$sql 	= "SELECT * FROM tbl_users WHERE email = ? LIMIT 1";
		$data 	= array($email);
		return $this->db->query($sql, $data);
	}

	public function getRegisterGmailAccount($email, $name) {
		$sql 	= "INSERT INTO tbl_users(`name`, `role`, `created_at`, `accessLog`, `email`) VALUES(?,?,?,?,?)";
		$data 	= array($name, 'corporate', today(), today(), $email);
		$this->db->query($sql, $data);
		return $this->db->insert_id();
	}

	public function getCheckEmailExist($email) {
		$sql 	= "SELECT email, password, name from tbl_users WHERE email = ? and is_active = ? LIMIT 1";
		$data 	= array($email, 1);
		return $this->db->query($sql, $data);
	}

	public function getRegister($name, $email, $password, $checkPriv) {
		$sql 	= "INSERT INTO tbl_users(`name`,`email`,`password`, `role`)VALUES(?,?,?,?)";
		$data 	= array($name, $email, $password, $checkPriv);
		$this->db->query($sql, $data);
		return $this->db->insert_id();
	}

	public function getInsertProfile($userId) {
		$sql 	= "INSERT INTO tbl_profile(`userid`)VALUES(?)";
		$data 	= array($userId);
		return $this->db->query($sql, $data);
	}

	public function getCreateUser($name, $email, $pass, $addedById, $checkPriv) {
		$sql 	= "INSERT INTO tbl_users(`name`, `email`,`password`, `role`, `addedbyID`)VALUES(?,?,?,?,?)";
		$data 	= array($name, $email, $pass, $checkPriv, $addedById);
		$this->db->query($sql, $data);
		return $this->db->insert_id();
	}

	public function getOfferCount($userId) {
		$sql 	= "SELECT offerAcceptedID, a_offerID FROM tbl_offer_accepted WHERE a_userID = ?";
		$data 	= array($userId);
		$offerAccepted = $this->db->query($sql, $data);

		$sql1 = "SELECT offerID from tbl_offers WHERE DATE_FORMAT(offerDateAdded, '%Y/%m/%d') = CURDATE() AND offerCount != 0 AND offerStatus = 3 AND offerAddedByID != $userId ";

		if($offerAccepted) {
			if($offerAccepted->num_rows() > 0) {
				foreach($offerAccepted->result() as $row) {
					$acceptOfferId = $row->a_offerID;
					$sql1 .= " AND offerID != $acceptOfferId ";
				}
			}
		}

		$sql1 .= " ORDER BY offerDateAdded DESC";
		return $this->db->query($sql1);
	}

	public function getCreateTodo($userId, $todoTitle, $todoBody, $todoDate) {
		$sql 	= "INSERT INTO tbl_todo(`todo_userid`,`todo_title`,`todo_content`,`todo_date`)VALUES(?,?,?,?)";
		$data 	= array($userId, $todoTitle, $todoBody, $todoDate);
		return $this->db->query($sql, $data);
	}

	public function getViewTodo($todoId) {
		$sql = "SELECT todo_id, todo_userid, todo_title, todo_content, todo_dateAdded, DATE_FORMAT(todo_date, '%m/%d/%Y') AS todoDate  
				FROM tbl_todo WHERE todo_id = ? 
				AND todo_visible = ?";
		$data = array($todoId, 1);
		return $this->db->query($sql, $data);
	}

	public function getDeleteTodo($todoId) {
		$sql 	= "UPDATE tbl_todo SET todo_visible = ? WHERE todo_id = ?";
		$data 	= array(0, $todoId);
		return $this->db->query($sql, $data);
	}

	public function getOfferRowCount($offerTypeID) {
		$sql 	= "SELECT COUNT(offerID) AS offerRowCount FROM tbl_offers WHERE offerStatus = ?";
		$data 	= array($offerTypeID);
		return $this->db->query($sql, $data);
	}

	// public function getOfferCreatorUsingOfferId($offerId) {
	// 	$sql = "SELECT offerAddedByID FROM tbl_offers WHERE offerID = ? LIMIT 1";
	// 	$data = array($offerId);
	// 	return $this->db->query($sql, $data)->row()->offerAddedByID;
	// }

	// public function getnegotiateOfferLabel($userId, $offerId) {
	// 	$sql = "SELECT counterOfferAccepted, fromID FROM tbl_message WHERE fromID = ? AND message_offerID = ?";
	// 	$data = array($userId, $offerId);
	// 	return $this->db->query($sql, $data);
	// }

	public function getViewOffer($userId, $offerType, $recordPerPage, $start, $searchInput, $offerActive) {
		$sql = "SELECT offerID, offerAddedByID, offerName, offerAmount, lpad(offerID,4,'0') AS id, 
				DATE_FORMAT(offerDateAdded, '%m/%d/%Y') AS dateAdded,
				(SELECT or_id FROM tbl_offer_read WHERE or_userid = $userId AND or_offerid = offerID LIMIT 1) AS isRead,
				(SELECT negotiate_msg_token FROM tbl_message WHERE fromID IN(offerAddedByID, $userId) AND toID IN(offerAddedByID, $userId) AND message_offerID = offerID LIMIT 1) AS msgToken,
				(SELECT COUNT(counterOfferAccepted) FROM tbl_message WHERE negotiate_msg_token = msgToken AND counterOfferAccepted = 1) AS isAccepted,
				(SELECT COUNT(fromID) FROM tbl_message WHERE fromID = $userId AND message_offerID = offerID) AS isNegotiated,
				(SELECT (photo) FROM tbl_profile WHERE userid = offerAddedByID) AS creatorPhoto,
				(SELECT (name) FROM tbl_users WHERE id = offerAddedByID) AS creatorName,
				(SELECT (alias) FROM tbl_profile WHERE userid = offerAddedByID) AS creatorAlias,
				(SELECT COUNT(offerAcceptedID) FROM tbl_offer_accepted WHERE offer_creator_id = $userId AND creator_accepted = 1 AND is_paid = 0 AND a_offerID = offerID) AS unpaidCount
				FROM tbl_offers";

			if($offerType == 4) { // draft offer
				$sql .= " WHERE offerStatus = 1 AND offerAddedByID = $userId ";
			}else if($offerType == 5) { // Archive
				$sql .= " WHERE offerStatus = 5 ";
			}else { // current offer
				$sql .= " WHERE offerStatus = 3 ";
			}

		$sql .=	"AND offerType != 'Private' ";

		if($offerType == 3) {
			$sql .= " AND offerCount != 0 ";
		}

		if($offerType == 2) {
			if($this->getOfferAccepted($userId)->num_rows()) {
				foreach($this->getOfferAccepted($userId)->result() as $row) {
					$acceptedOfferId = $row->a_offerID;
					$sql .= "AND offerID = $acceptedOfferId ";
				}
			}else {
				$sql .= "AND offerID = 0 ";
			}
		}

		if($searchInput != '') {
			//$searchInput = clean($searchInput);
			$sql .= " AND offerName LIKE '%$searchInput%' ";
		}

		$sql .= " AND isDelete = 0 ORDER BY offerDateAdded DESC 
				LIMIT ?, ?";
		$data = array($start, (int)$recordPerPage);
		return $this->db->query($sql, $data);
	}

	public function getOfferAccepted($userid) {
		$sql = "SELECT * FROM tbl_offer_accepted WHERE a_userID = ?";
		$data = array($userid);
		return $this->db->query($sql, $data);
	}

	public function getViewPendingNegotiation($userId) {
		$acceptedOffers = $this->getAllAcceptedOffer($userId);
		$sql = "SELECT m.negotiate_msg_token, m.messageID, o.offerAmount, o.offerName, m.negotiate_msg_token, 
				(SELECT messageID FROM tbl_message WHERE is_read = 0 AND negotiate_msg_token = m.negotiate_msg_token ORDER BY messageID DESC LIMIT 1) AS unreadId,
				(SELECT toID FROM tbl_message WHERE is_read = 0 AND negotiate_msg_token = m.negotiate_msg_token) AS unreadUserId
				FROM tbl_message m  
				INNER JOIN tbl_offers o
				ON m.message_offerID = o.offerID 
				WHERE m.isDelete = 0 
				AND m.tempNegotiate = 0 ";

				if($acceptedOffers->num_rows() > 0) {
					foreach($acceptedOffers->result() as $row) {
						$acceptedOfferId = $row->message_offerID;
						$sql .= " AND o.offerID != $acceptedOfferId ";
					}
				}

		// $sql .= "GROUP BY m.negotiate_msg_token  
		// 		ORDER BY m.messageID DESC";
				$sql .= " AND (m.toID = ? OR m.fromID = ?)";
				$sql .= "ORDER BY m.messageID DESC";
		$data = array($userId, $userId);
		return $this->db->query($sql, $data);
	}

	// public function getCheckUnreadPendingNegotiation($userId, $messageToken) {
	// 	$sql = "SELECT messageID, negotiate_msg_token FROM tbl_message WHERE negotiate_msg_token = ? AND toID = ? AND is_read = 0 AND tempNegotiate = 0 LIMIT 1";
	// 	$data = array($messageToken, $userId);
	// 	return $this->db->query($sql, $data);
	// }

	public function getAllAcceptedOffer($userId) {
		$sql = "SELECT message_offerID FROM tbl_message WHERE (fromID = ? OR toID = ?) AND counterOfferAccepted = 1";
		$data = array($userId, $userId);
		return $this->db->query($sql, $data);
	}

	public function getUnreadNegotiation($userId) {
		$getAllAcceptedOfferToken = $this->getAllAcceptedOfferToken($userId);
		$sql = "SELECT o.offerID
				FROM tbl_message m
				INNER JOIN tbl_offers o
				ON m.message_offerID = o.offerID
				WHERE m.toID = ? 
				AND m.isDelete = 0
				AND m.is_read = 0
				AND m.tempNegotiate = 0 ";
		if($getAllAcceptedOfferToken->num_rows() > 0) {
			foreach($getAllAcceptedOfferToken->result() as $row) {
				$acceptedMsgToken = $row->accepted_msg_token;
				$sql .= " AND negotiate_msg_token != '$acceptedMsgToken'";
			}
		}

		$sql .= " GROUP BY m.messageID";
		$data = array($userId);
		return $this->db->query($sql, $data);
	}

	public function getUnreadPrivateOffer($userId) {
		$getAllAcceptedOfferToken = $this->getAllAcceptedOfferToken($userId);
		$sql = "SELECT COUNT(o.offerID) as unreadCount
				FROM tbl_message m
				INNER JOIN tbl_offers o
				ON m.message_offerID = o.offerID
				WHERE m.toID = ? 
				AND m.isDelete = 0
				AND m.is_read = 0
				AND o.offerStatus = 2
				AND m.tempNegotiate";
		if($getAllAcceptedOfferToken->num_rows() > 0) {
			foreach($getAllAcceptedOfferToken->result() as $row) {
				$acceptedMsgToken = $row->accepted_msg_token;
				$sql .= " AND negotiate_msg_token != '$acceptedMsgToken'";
			}
		}
		$data = array($userId);
		return $this->db->query($sql, $data);
	}

	public function getAllAcceptedOfferToken($userId) {
		$sql = "SELECT accepted_msg_token FROM tbl_offer_accepted WHERE offer_creator_id = ? OR offer_negotiator_id = ?";
		$data = array($userId, $userId);
		return $this->db->query($sql, $data);
	}

	public function getUnreadAcceptedOffer($userId) {
		$sql = "SELECT COUNT(offerAcceptedID) as count FROM tbl_offer_accepted WHERE offer_creator_id = $userId AND is_read_creator = 0";
		$creatorUnreadCount = $this->db->query($sql)->row()->count;

		$sql = "SELECT COUNT(offerAcceptedID) as count FROM tbl_offer_accepted WHERE offer_negotiator_id = $userId AND is_read_negotiator = 0";
		$negotiatorUnreadCount = $this->db->query($sql)->row()->count;
		$totalUnread = $creatorUnreadCount + $negotiatorUnreadCount;
		return $totalUnread;
	}

	public function getViewPrivateOffer($userId) {
		$sql = "SELECT m.negotiate_msg_token, m.messageID, o.offerAmount, o.offerName, m.is_read
				FROM tbl_offers o 
				LEFT JOIN tbl_message m 
				ON m.message_offerID = o.offerID 
				WHERE m.toID = ?
				AND o.offerStatus = 2
				AND m.tempNegotiate = 1";
		// $sql = "SELECT m.negotiate_msg_token, m.messageID, offerAmount, offerName,
		// 		(SELECT messageID FROM tbl_message WHERE message_offerID = offerID) AS message_offerID
		// 		(SELECT negotiate_msg_token FROM tbl_message WHERE message_offerID = offerID) AS message_offerID
		// 		FROM tbl_offers o
		// 		WHERE m.toID = ? AND o.offerStatus = 2
		// 		GROUP BY m.negotiate_msg_token
		// 		ORDER BY o.offerDateAdded DESC";

		// $sql = "SELECT offerAmount, offerName,
		// 		(SELECT messageID FROM tbl_message WHERE message_offerID = offerID LIMIT 1) AS message_offerID,
		// 		(SELECT negotiate_msg_token FROM tbl_message WHERE message_offerID = offerID LIMIT 1) AS negotiate_msg_token
		// 		FROM tbl_offers WHERE toID = ? AND offerStatus = 2 ORDER BY offerDateAdded DESC";
		$data = array($userId);
		return $this->db->query($sql, $data);
	}

	// public function getCheckUnreadPrivateOffer($userId, $messageToken) {
	// 	$sql = "SELECT m.messageID, m.negotiate_msg_token
	// 			FROM tbl_message m 
	// 			LEFT JOIN tbl_offers o 
	// 			ON o.offerID = m.message_offerID 
	// 			WHERE m.negotiate_msg_token = ? 
	// 			AND m.toID = ? 
	// 			AND m.is_read = 0 
	// 			AND o.offerStatus = 2 LIMIT 1";
	// 	$data = array($messageToken, $userId);
	// 	return $this->db->query($sql, $data);
	// }

	public function getViewAcceptedOffer($userId) {
		$sql = "SELECT o.offerID, o.offerAddedByID, o.offerName, o.offerAmount, oa.is_read_creator, 
				oa.offer_creator_id, oa.offer_negotiator_id, oa.is_read_negotiator, oa.accepted_message_id,
				oa.accepted_msg_token, oa.accepted_for_todo_creator, oa.accepted_for_todo_negotiator, oa.acceptedOfferAmount
				-- (SELECT offereeAccepted FROM tbl_todo WHERE offerAcceptedId = oa.offerAcceptedID LIMIT 1) as isTaskDone
				FROM tbl_offers o
				INNER JOIN tbl_offer_accepted oa
				ON o.offerID = oa.a_offerID 
				WHERE (oa.offer_creator_id = ? 
				OR oa.offer_negotiator_id = ?)
				AND is_paid = 0
				GROUP BY oa.accepted_msg_token
				ORDER BY oa.acceptedDate DESC";
		$data = array($userId, $userId);
		return $this->db->query($sql, $data);
	}

	public function getViewAllTodo($userId) {
		$sql = "SELECT 
					m.messageID, 
					o.offerName, 
					o.offerAmount, 
					t.isread, 
					-- p.photo, 
					t.todo_id, 
					t.todo_userid, 
					-- u.name, 
					t.offereeAccepted, 
					t.offererAccepted, 
					oa.acceptedOfferAmount, 
					t.todoLinkId,
				(SELECT name FROM tbl_users WHERE id = o.offerAddedByID LIMIT 1) AS name,
				(SELECT photo FROM tbl_profile WHERE userid = o.offerAddedByID LIMIT 1) AS photo,
				DATE_FORMAT(todo_dateAdded, '%m/%d/%Y') AS dateAdded
				FROM tbl_todo t
				INNER JOIN tbl_offer_accepted oa
				ON oa.offerAcceptedID = t.offerAcceptedId
				INNER JOIN tbl_offers o 
				ON o.offerID = oa.a_offerID
				-- -- INNER JOIN tbl_users u 
				-- -- ON u.id = o.offerAddedByID
				-- -- INNER JOIN tbl_profile p 
				-- -- ON p.userid = u.id
				INNER JOIN tbl_message m 
				ON m.negotiate_msg_token = oa.accepted_msg_token
				WHERE t.todo_visible = 1
				AND t.isTodoCompleted = 0
				AND t.todo_userid = ?
				-- AND t.offererAccepted != 1
				AND oa.accepted_for_todo_creator = 1
				AND oa.accepted_for_todo_negotiator = 1
				AND oa.is_paid = 0
				GROUP BY t.todo_id
				ORDER BY t.todo_date DESC";
		$data = array($userId);
		return $this->db->query($sql, $data);
	}

	public function getCompleteTodo($userId, $todoId) {
		$sql = "UPDATE tbl_todo SET offereeAccepted = ?, offereeAcceptedDate = ? WHERE todo_id = ?";
		$data = array(1, today(), $todoId);
		$this->db->query($sql, $data);
	}

	public function getRemoveCompleteTodo($userId, $todoId) {
		$sql = "UPDATE tbl_todo SET offereeAccepted = ?, offereeAcceptedDate = ? WHERE todo_id = ?";
		$data = array(0, '', $todoId);
		$this->db->query($sql, $data);
	}

	public function getCreatorCompleteTodo($userId, $todoId, $acceptedOfferId) {
		$sql = "UPDATE tbl_todo SET offererAccepted = ?, offererAcceptedDate = ? WHERE todo_id = ?";
		$data = array(1, today(), $todoId);
		$this->db->query($sql, $data);

		$todoInfo = $this->getTodoInfoById($todoId);

		$this->db->query("UPDATE tbl_offer_accepted SET creator_accepted = 1 WHERE offerAcceptedID = $acceptedOfferId");
		$this->db->query("UPDATE tbl_todo SET isTodoCompleted = 1 WHERE todo_id = $todoId");

		$sql = "INSERT INTO tbl_todo(`todo_userid`, `todo_title`, `todo_content`, `offerAcceptedId`, `todo_visible`, `todoLinkId`) VALUES(?, ?, ?, ?, ?, ?)";
		$data = array($userId, $todoInfo->todo_title, $todoInfo->todo_content, $todoInfo->offerAcceptedId, 1, $todoId);
		$this->db->query($sql, $data);
		return $this->db->insert_id();
		// [todo_id] => 1
		//     [todo_userid] => 4
		//     [todo_title] => 
		//     [todo_content] => 
		//     [todo_date] => 0000-00-00
		//     [todo_dateAdded] => 2017-12-23 17:54:47
		//     [todo_visible] => 1
		//     [offerAcceptedId] => 1
		//     [offereeAccepted] => 1
		//     [offereeAcceptedDate] => 2017-12-24 09:45:38
		//     [offererAccepted] => 1
		//     [offererAcceptedDate] => 2017-12-24 09:54:47
		//     [isread] => 0


	}

	public function getTodoInfoById($todoId) {
		$sql = "SELECT * FROM tbl_todo WHERE todo_id = ? LIMIT 1";
		$data = array($todoId);
		return $this->db->query($sql, $data)->row();
	}

	public function getRemoveCreatorCompleteTodo($userId, $todoId) {
		$this->db->query("UPDATE tbl_todo SET isTodoCompleted = 0 WHERE todo_id = $todoId");
		$sql = "UPDATE tbl_todo SET offererAccepted = ?, offererAcceptedDate = ? WHERE todo_id = ?";
		$data = array(0, '', $todoId);
		$this->db->query($sql, $data);

		$sql = "DELETE FROM tbl_todo WHERE todoLinkId = ?";
		$data = array($todoId);
		$this->db->query($sql, $data);
	}

	public function getUnreadTodo($userId) {
		$sql = "SELECT COUNT(todo_id) as unreadCount FROM tbl_todo WHERE todo_userid = ? AND isread = ? AND offererAccepted = ?";
		$data = array($userId, 0, 0);
		return $this->db->query($sql, $data)->row()->unreadCount;
	}

	public function getCheckIfDraftExist($userId) {
		$sql = "SELECT draft_continue, offerAddedByID, offerID
				FROM tbl_offers 
				WHERE draft_continue = 1 
				AND offerAddedByID = ?
				LIMIT 1";
		$data = array($userId);
		return $this->db->query($sql, $data);
	}

	public function getUpdateDraft($offerId, $randnum, $offerName, $offerAmount, $offerTerm, $offerType, $offerStart, $offerEnd, $offerNotes, $userId, $offerNo) {
		$sql = "UPDATE tbl_offers 
				SET offerName = ?, 
					offerAmount = ?, 
					offerTerm = ?, 
					offerType = ?, 
					startDate = ?, 
					endDate = ?, 
					offerNotes = ?, 
					offerCount = ?, 
					offerDateAdded = ?
					WHERE offerID = ?";
		$data = array($offerName, $offerAmount, $offerTerm, $offerType, $offerStart, $offerEnd, $offerNotes, $offerNo, today(), $offerId);
		return $this->db->query($sql, $data);
	}

	public function getInsertDraft($randnum, $offerName, $offerAmount, $offerTerm, $offerType, $offerStart, $offerEnd, $offerNotes, $userId, $offerNo) {
		$sql = "INSERT INTO tbl_offers(`offerNumber`,`offerName`,`offerAmount`,`offerTerm`,`offerType`,`startDate`,`endDate`,`offerNotes`, `offerStatus`, `offerAddedByID`,`offerCount`, `draft_continue`)VALUES('$randnum','$offerName','$offerAmount', '$offerTerm', '$offerType', '$offerStart', '$offerEnd', '$offerNotes', 1, $userId, $offerNo, 1)";
		return $this->db->query($sql);
	}

	public function getCreateOffer($randnum, $offerName, $offerAmount, $offerTerm, $offerType, $offerStart, $offerEnd, $offerNotes, $userId, $offerNo, $statusId, $unliCheck, $dateStartCheck, $dateEndCheck) {
		$this->deleteDraft($userId);
		$sql = "INSERT INTO tbl_offers(`offerNumber`,`offerName`,`offerAmount`,`offerTerm`,`offerType`,`startDate`,`endDate`,`offerNotes`, `offerStatus`, `offerAddedByID`,`offerCount`,`draft_continue`, `isDSindefinite`, `isDEindefinite`, `isOfferUnli`)VALUES('$randnum','$offerName','$offerAmount', '$offerTerm', '$offerType', '$offerStart', '$offerEnd', '$offerNotes', $statusId, $userId, $offerNo, 0, $dateStartCheck, $dateEndCheck, $unliCheck)";
		$query = $this->db->query($sql);
		return $this->db->insert_id();
	}

	public function getCreateOfferForEdit($randnum, $offerName, $offerAmount, $offerTerm, $offerType, $offerStart, $offerEnd, $offerNotes, $userId, $offerNo, $statusId, $editOfferId, $unliCheck, $dateStartCheck, $dateEndCheck) {
		// check if offerId has previous edit history
		$editOffer = $this->checkEditOfferHistory($editOfferId);

		if($editOffer->num_rows()) { // has previous edit history
			$editOfferOf = $editOffer->row()->editOfferOf;
		}else {
			$editOfferOf = $editOfferId;
		}
		// hide the old offer by setting isDelete = 1
		$this->getDeleteOffer($editOfferId);

		$sql = "INSERT INTO tbl_offers(`offerNumber`,`offerName`,`offerAmount`,`offerTerm`,`offerType`,`startDate`,`endDate`,`offerNotes`, `offerStatus`, `offerAddedByID`,`offerCount`,`draft_continue`, `editOfferOf`, `isDSindefinite`, `isDEindefinite`, `isOfferUnli`)VALUES('$randnum','$offerName','$offerAmount', '$offerTerm', '$offerType', '$offerStart', '$offerEnd', '$offerNotes', $statusId, $userId, $offerNo, 0, $editOfferOf, $dateStartCheck, $dateEndCheck, $unliCheck)";
		$query = $this->db->query($sql);
	}

	public function checkEditOfferHistory($editOfferId) {
		$sql = "SELECT editOfferOf FROM tbl_offers WHERE editOfferOf != 0 AND offerID = ?";
		$data = array($editOfferId);
		return $this->db->query($sql, $data);
	}

	public function deleteDraft($userId) {
		$sql = "DELETE FROM tbl_offers WHERE draft_continue = 1 AND offerAddedByID = ?";
		$data = array($userId);
		$this->db->query($sql, $data);
	}

	public function getHistoryId($offerId, $userId) {
		$sql = "SELECT history_user_id, offer_id, history_id 
				FROM tbl_history 
				WHERE offer_id = ? 
				AND history_user_id = ? LIMIT 1";
		$data = array($offerId, $userId);
		return $this->db->query($sql, $data);
	}

	public function getViewOfferDetails($offerId, $userId) {
		$offerHasNext = $this->db->query("SELECT offerID, offerStatus FROM tbl_offers WHERE offerID > $offerId AND offerStatus != 1 LIMIT 1");
		$offerHasPrev = $this->db->query("SELECT offerID, offerStatus FROM tbl_offers WHERE offerID < $offerId AND offerStatus != 1 LIMIT 1");

		$sql = "SELECT o.*, u.*, 
				(SELECT negotiate_msg_token FROM tbl_message WHERE fromID IN(o.offerAddedByID, $userId) AND toID IN(o.offerAddedByID, $userId) AND message_offerID = $offerId LIMIT 1) AS msgToken,
				(SELECT COUNT(counterOfferAccepted) FROM tbl_message WHERE negotiate_msg_token = msgToken AND counterOfferAccepted = 1) AS isAccepted,
				(SELECT (alias) FROM tbl_profile WHERE userid = o.offerAddedByID) AS creatorAlias, 
		";

		if($offerHasPrev->num_rows()) {
			$sql .= "(SELECT offerID FROM tbl_offers WHERE offerID < $offerId AND offerStatus != 1 ORDER BY offerID DESC LIMIT 1) AS prevId, ";
		}else {
			$sql .= "(SELECT offerID FROM tbl_offers WHERE offerStatus != 1 ORDER BY offerID DESC LIMIT 1) AS prevId, ";
		}

		if($offerHasNext->num_rows()) {
			$sql .= "(SELECT offerID FROM tbl_offers WHERE offerID > $offerId AND offerStatus != 1 ORDER BY offerID ASC LIMIT 1) AS nextId ";
		}else {
			$sql .= "(SELECT offerID FROM tbl_offers WHERE offerStatus != 1 ORDER BY offerID ASC LIMIT 1) AS nextId ";
		}
	
		$sql .= " FROM tbl_offers o LEFT JOIN tbl_users u ON u.id = o.offerAddedByID WHERE o.offerID = ? AND o.offerStatus != 1 LIMIT 1";
		$data = array($offerId);
		return $this->db->query($sql, $data);
	}

	public function getOfferMessage($offerCreatorId, $userId, $offerId, $offerAmount, $token) {
		$sql = "INSERT INTO tbl_message(`fromID`, `toID`, `message_offerID`, `messageDate`, `counterOfferAmount`, `negotiate_msg_token`, `tempNegotiate`)VALUES(?,?,?,?,?,?, ?)";
		$data = array($offerCreatorId, $userId, $offerId, today(), $offerAmount, $token, 1);
		return $this->db->query($sql, $data);
	}

	public function getMessageId($offerCreatorId, $userId, $offerId) {
		$sql = "SELECT * FROM tbl_message WHERE fromID IN(?, ?) AND toID IN(?, ?) AND message_offerID = ? LIMIT 1";
		$data = array($userId, $offerCreatorId, $userId, $offerCreatorId, $offerId);
		$query = $this->db->query($sql, $data);
		return $query->row()->messageID;
	}

	public function getMessageCount($offerCreatorId, $userId, $offerId) {
		$sql = "SELECT * FROM tbl_message WHERE fromID IN(?, ?) AND toID IN(?, ?) AND message_offerID = ?";
		$data = array($userId, $offerCreatorId, $userId, $offerCreatorId, $offerId);
		$query = $this->db->query($sql, $data);
		return $query->num_rows();
	}

	public function getAcceptOffer($userId, $messageId) {
		$messageToken 		= $this->getMessageToken($messageId);
		$messageObj 		= $this->getFirstOfferMessageUsingToken($messageToken);
		$offerCreatorId 	= $messageObj->fromID;
		$offerNegotiatorId  = $messageObj->toID;
		$user1				= $messageObj->fromID;
		$user2				= $messageObj->toID;
		$offerId			= $messageObj->message_offerID;
		$messagesObj 		= $this->selectAllMessageUsingToken($messageToken);
		$messageObjCount	= count($messagesObj);
		$messageIds 		= array();

		foreach($messagesObj as $message) {
			array_push($messageIds, $message->messageID);
		}

		if($userId == $offerCreatorId) { // if you are the offer creator
			if ($messageObjCount % 2 == 0) { // if even numbers
				$acceptedMessageId = end($messageIds); 
			}else { // if odd numbers
				array_pop($messageIds);
				$acceptedMessageId = end($messageIds); 
			}
		}else { // if you are the offer potential
			if ($messageObjCount % 2 == 0) { // if even numbers
				array_pop($messageIds);
				$acceptedMessageId = end($messageIds); 
			}else { // if odd numbers
				$acceptedMessageId = end($messageIds);  
			}
		}

		$this->updateMessageOfferAccepted($acceptedMessageId);
		$messageId = $this->getAcceptedMessageIdUsingToken($messageToken);
		$getAcceptedOfferDetail = $this->getAcceptedOfferDetail($offerId);

		$acceptedOfferAmount = $this->getAcceptedOfferAmount($acceptedMessageId);
		$acceptedOfferName = $getAcceptedOfferDetail->offerName;
		$acceptedOfferTerm = $getAcceptedOfferDetail->offerTerm;
		$acceptedOfferNotes = $getAcceptedOfferDetail->offerNotes;

		$insertAcceptedId = $this->insertTblAccepted($offerId, $userId, $offerCreatorId, $messageToken, $offerNegotiatorId, $messageId, $acceptedOfferAmount, $acceptedOfferName, $acceptedOfferTerm, $acceptedOfferNotes);

		if($userId == $offerCreatorId) {
			$this->db->query("UPDATE tbl_offer_accepted SET accepted_for_todo_creator = 1 WHERE offerAcceptedID = $insertAcceptedId");
		}else {
			$this->db->query("UPDATE tbl_offer_accepted SET accepted_for_todo_negotiator = 1 WHERE offerAcceptedID = $insertAcceptedId");
		}
		$this->createOffersTodo($offerNegotiatorId, $insertAcceptedId);
		$this->insertTblHistory($userId, $offerId, $user1, $user2, $messageToken);
	}

	public function getAcceptedOfferAmount($acceptedMessageId) {
		$sql = "SELECT counterOfferAmount FROM tbl_message WHERE messageID = ? LIMIT 1";
		$data = array($acceptedMessageId);
		return $this->db->query($sql, $data)->row()->counterOfferAmount;
	}

	public function getAcceptedOfferDetail($offerId) {
		$sql = "SELECT offerName, offerTerm, offerNotes FROM tbl_offers WHERE offerID = ? LIMIT 1";
		$data = array($offerId);
		return $this->db->query($sql, $data)->row();
	}

	public function createOffersTodo($userId, $insertAcceptedId) {
		$sql = "INSERT INTO tbl_todo (`todo_userid`, `offerAcceptedId`, `todo_dateAdded`)values(?,?,?)";
		$data = array($userId, $insertAcceptedId, today());
		$this->db->query($sql, $data);
	}

	public function insertTblAccepted($offerId, $userId, $offerCreatorId, $messageToken, $offerNegotiatorId, $messageId, $acceptedOfferAmount, $acceptedOfferName, $acceptedOfferTerm, $acceptedOfferNotes) {
		$sql = "INSERT INTO tbl_offer_accepted(`a_offerID`,`a_userID`, `offer_creator_id`, `offer_negotiator_id`, `accepted_msg_token` ,`is_read_negotiator` ,`is_read_creator`, `accepted_message_id`, `acceptedOfferName`, `acceptedOfferTerm`, `acceptedoOfferNotes`, `acceptedOfferAmount`)VALUES(?,?,?,?,?,?,?,?,?,?,?,?)";
		$data = array($offerId, $userId, $offerCreatorId, $offerNegotiatorId, $messageToken, 0, 0, $messageId, $acceptedOfferName, $acceptedOfferTerm, $acceptedOfferNotes, $acceptedOfferAmount);
		$this->db->query($sql, $data);
		return $this->db->insert_id();
	}

	public function insertTblHistory($userId, $offerId, $user1, $user2, $messageToken) {
		$sql = "INSERT INTO tbl_history(`history_user_id`, `offer_id`, `history_date`, `user1`, `user2`, `offerToken`)VALUES(?,?,?,?,?,?)";
		$data = array($userId, $offerId, today(), $user1, $user2, $messageToken);
		$this->db->query($sql, $data);
	}

	public function updateMessageOfferAccepted($messageId) {
		$sql = "UPDATE tbl_message SET counterOfferAccepted = 1, counterOfferAcceptedDate = ? WHERE messageID = ?";
		$data = array(today(), $messageId);
		$this->db->query($sql, $data);
	}

	public function selectAllMessageUsingToken($messageToken) {
		$sql = "SELECT * FROM tbl_message WHERE negotiate_msg_token = ?";
		$data = array($messageToken);
		return $this->db->query($sql, $data)->result();
	}

	public function getFirstOfferMessageUsingToken($messageToken) {
		$sql = "SELECT * FROM tbl_message WHERE negotiate_msg_token = ? ORDER BY messageID ASC LIMIT 1";
		$data = array($messageToken);
		return $this->db->query($sql, $data)->row();
	}

	public function viewMessageTbl($messageId) {
		$sql = "SELECT * FROM tbl_message WHERE messageID = ? LIMIT 1";
		$data = array($messageId);
		return $this->db->query($sql, $data)->row();
	}

	public function getViewHistoryTbl($historyId) {
		$sql = "SELECT * FROM tbl_history WHERE history_id = ? LIMIT 1";
		$data = array($historyId);
		return $this->db->query($sql, $data);
	}

	public function getViewMessageCounterDetail($messageId) {
		$messageToken 			= $this->getMessageToken($messageId);
		$getOfferConversation 	= $this->getOfferConversation($messageToken);
		$offerCreatorName       = $getOfferConversation->row()->fromName;
		$offerCreatorAlias      = $getOfferConversation->row()->fromAlias;
		$offerCreatorId       	= $getOfferConversation->row()->fromID;
		$offerCreatorEmail      = $getOfferConversation->row()->toEmail;
		$offerNegotiatorId      = $getOfferConversation->row()->toID;
		$offerNegotiatorName    = $getOfferConversation->row()->toName;
		$offerNegotiatorAlias   = $getOfferConversation->row()->toAlias;
		$offerNegotiatorEmail   = $getOfferConversation->row()->fromEmail;
		$offerId    			= $getOfferConversation->row()->message_offerID;
		$offerName 				= $this->getOfferName($offerId);
		$offerAmount 			= $this->getOfferAmount($offerId);
		$offerTerm 				= $this->getOfferTerm($offerId);
		$checkIfOfferAccepted	= $this->checkIfOfferAccepted($messageToken);
		$data = array(
			'creatorName' 			=> $offerCreatorName,
			'creatorAlias'			=> $offerCreatorAlias,
			'negotiatorName'		=> $offerNegotiatorName,
			'negotiatorAlias'		=> $offerNegotiatorAlias,
			'offerName'				=> $offerName,
			'offerAmount'			=> $offerAmount,
			'offerConvo'			=> $getOfferConversation->result(),
			'convoCount'			=> $getOfferConversation->num_rows(),
			'isAccepted'			=> $checkIfOfferAccepted->num_rows(),
			'offerCreatorId'		=> $offerCreatorId,
			'offerNegotiatorId' 	=> $offerNegotiatorId,
			'offerTerm'				=> $offerTerm,
			'offerId'				=> $offerId,
			'offerCreatorEmail' 	=> $offerCreatorEmail,
			'offerNegotiatorEmail' 	=> $offerNegotiatorEmail
		);

		return $data;
	}

	public function getOfferAmount($offerId) {
		$sql = "SELECT offerAmount FROM tbl_offers WHERE offerID = ? LIMIT 1";
		$data = array($offerId);
		return $this->db->query($sql, $data)->row()->offerAmount;
	}

	public function getOfferTerm($offerId) {
		$sql = "SELECT offerTerm FROM tbl_offers WHERE offerID = ? LIMIT 1";
		$data = array($offerId);
		return $this->db->query($sql, $data)->row()->offerTerm;
	}

	public function checkIfOfferAccepted($messageToken) {
		$sql = "SELECT messageID FROM tbl_message WHERE counterOfferAccepted = 1 AND negotiate_msg_token = ?";
		$data = array($messageToken);
		return $this->db->query($sql, $data);
	}

	public function getMessageToken($messageId) {
		$sql = "SELECT negotiate_msg_token, messageID FROM tbl_message WHERE messageID = ? LIMIT 1";
		$data = array($messageId);
		return $this->db->query($sql, $data)->row()->negotiate_msg_token;
	}

	public function getOfferConversation($messageToken) {
		$sql = "SELECT *,
					(SELECT name FROM tbl_users WHERE id = fromID LIMIT 1) AS fromName,  
					(SELECT alias FROM tbl_profile WHERE userid = fromID LIMIT 1) AS fromAlias, 
					(SELECT name FROM tbl_users WHERE id = toID LIMIT 1) AS toName,
					(SELECT alias FROM tbl_profile WHERE userid = toID LIMIT 1) AS toAlias, 
					(SELECT email FROM tbl_email WHERE userID = toID LIMIT 1) AS toEmail,
					(SELECT email FROM tbl_email WHERE userID = fromID LIMIT 1) AS fromEmail,
					DATE_FORMAT(messageDate, '%b %e') AS messageDateFormatted,
					DATE_FORMAT(messageDate, '%m/%d/%Y') as mdate
				FROM tbl_message WHERE negotiate_msg_token = ?";
		$data = array($messageToken);
		return $this->db->query($sql, $data);
	}

	public function getOfferName($offerId) {
		$sql = "SELECT offerName FROM tbl_offers WHERE offerID = ? LIMIT 1"; 
		$data = array($offerId);
		return $this->db->query($sql, $data)->row()->offerName;
	}

	public function viewTblOfferByOfferId($offerId) {
		$sql = "SELECT * FROM tbl_offers WHERE offerID = ? LIMIT 1";
		$data = array($offerId);
		return $this->db->query($sql, $data)->row();
	}

	public function insertOfferMessage($userId, $offerCreatorID, $offerId, $offerAmount, $messageToken) {
		$sql = "INSERT INTO tbl_message(`fromID`,`toID`,`messageDate`,`message_offerID`,`counterOfferAmount`,`negotiate_msg_token`, `tempNegotiate`) VALUES (?,?,?,?,?,?,?)";
		$data = array($userId, $offerCreatorID, today(), $offerId, $offerAmount, $messageToken, 0);
		return $this->db->query($sql, $data);
	}
	
	public function getCurrentOfferCount($userId) {
		$sql = "SELECT offerID FROM tbl_offers WHERE offerCount != 0 AND offerStatus = 3";
		return $this->db->query($sql)->num_rows();	
	}

	public function getLoadAllOfferName($userId, $offerTypeId) {
		$sql = "SELECT offerName FROM tbl_offers ";
		// 3 = public | 2 = private | 1 = draft

		if($offerTypeId == 4) { // draft offer
				$sql .= " WHERE offerStatus = 1 AND offerAddedByID = $userId ";
			}else if($offerTypeId == 5) { // Archive
				$sql .= " WHERE offerStatus = 5 ";
			}else { // current offer
				$sql .= " WHERE offerStatus = 3 ";
			}

		$sql .=	"AND offerType != 'Private' ";

		if($offerTypeId == 3) {
			$sql .= " AND offerCount != 0 ";
		}

		if($offerTypeId == 2) {
			if($this->getOfferAccepted($userId)->num_rows()) {
				foreach($this->getOfferAccepted($userId)->result() as $row) {
					$acceptedOfferId = $row->a_offerID;
					$sql .= "AND offerID = $acceptedOfferId ";
				}
			}else {
				$sql .= "AND offerID = 0 ";
			}
		}

		return $this->db->query($sql);
	}

	public function getViewDraftOffer($offerId) {
		$sql = "SELECT * FROM tbl_offers WHERE offerID = ? LIMIT 1";
		$data = array($offerId);
		return $this->db->query($sql, $data);
	}

	public function getOfferNotifCount($userId) {
		$allOfferReadId = $this->getOfferReadTbl($userId);
		$sql = "SELECT COUNT(offerID) AS notifCount FROM tbl_offers WHERE offerStatus = 3 AND offerAddedByID != ? ";

		if($allOfferReadId->num_rows() > 0) {
			foreach ($allOfferReadId->result() as $row) {
				$offerId = $row->or_offerid;
				$sql .= " AND offerID != $offerId ";
			}
		}
		$data = array($userId);

		return $this->db->query($sql, $data);
	}

	public function getOfferReadTbl($userId) {
		$sql = "SELECT or_offerid FROM tbl_offer_read WHERE or_userid = ?";
		$data = array($userId);
		return $this->db->query($sql, $data);
	}

	public function getOfferHasRead($offerId, $userId) {
		$isOfferReadChecker = $this->isOfferReadChecker($userId, $offerId);

		if($isOfferReadChecker == 0) { // Not yet read
			$sql = "INSERT INTO tbl_offer_read(`or_userid`, `or_offerid`)VALUES(?, ?)";
			$data = array($userId, $offerId);
			$this->db->query($sql, $data);
		}
		
	}

	public function isOfferReadChecker($userId, $offerId) {
		$sql = "SELECT or_id FROM tbl_offer_read WHERE or_userid = ? AND or_offerid = ? LIMIT 1";
		$data = array($userId, $offerId);
		return $this->db->query($sql, $data)->num_rows();
	}

	public function getEmailExistByUserId($userId) {
		$sql = "SELECT id FROM tbl_users WHERE id = ? LIMIT 1";
		$data = array($userId);
		return $this->db->query($sql, $data)->num_rows();
	}

	public function getCheckUnreadPendingNegotiation($userId, $messageToken) {
		$sql = "SELECT messageID, negotiate_msg_token FROM tbl_message WHERE negotiate_msg_token = ? AND toID = ? AND is_read = 0 AND tempNegotiate = 0 LIMIT 1";
		$data = array($messageToken, $userId);
		return $this->db->query($sql, $data);
	}

	public function getCheckUnreadPrivateOffer($userId, $messageToken) {
		$sql = "SELECT m.messageID, m.negotiate_msg_token
				FROM tbl_message m 
				LEFT JOIN tbl_offers o 
				ON o.offerID = m.message_offerID 
				WHERE m.negotiate_msg_token = ? 
				AND m.toID = ? 
				AND m.is_read = 0 
				AND o.offerStatus = 2 LIMIT 1";
		$data = array($messageToken, $userId);
		return $this->db->query($sql, $data);
	}

	public function checkFirstReadOffer($userId, $messageToken) {
		$sql = "SELECT m.messageID 
				FROM tbl_message m 
				LEFT JOIN tbl_offers o 
				ON o.offerID = m.message_offerID
				WHERE m.negotiate_msg_token = ? 
				AND m.toID = ? 
				AND m.is_read = 1
				AND o.offerStatus = 2";
		$data = array($messageToken, $userId);
		return $this->db->query($sql, $data)->num_rows();
	}

	public function getUpdateOfferRead($messageId, $userId) {
		$messageToken = $this->getMessageToken($messageId);
		$sql = "UPDATE tbl_message SET is_read = 1 WHERE toID = ? AND negotiate_msg_token = ?";
		$data = array($userId, $messageToken);
		$this->db->query($sql, $data);
	}

	public function updateOfferAcceptedRead($messageId, $userId) {
		$messageToken = $this->getMessageToken($messageId);
		$creatorId 	  = $this->getOfferCreatorAcceptedUsingToken($messageToken);

		if($userId == $creatorId) { // you are offer creator
			$sql = "UPDATE tbl_offer_accepted SET is_read_creator = 1 WHERE accepted_msg_token = ?";
		}else {
			$sql = "UPDATE tbl_offer_accepted SET is_read_negotiator = 1 WHERE accepted_msg_token = ?";
		}
		
		$data = array($messageToken);
		$this->db->query($sql, $data);
	}

	public function getOfferCreatorAcceptedUsingToken($messageToken) {
		$sql = "SELECT offer_creator_id FROM tbl_offer_accepted WHERE accepted_msg_token = ? LIMIT 1";
		$data = array($messageToken);
		return $this->db->query($sql, $data)->row()->offer_creator_id;
	}

	public function getAcceptedMessageIdUsingToken($messageToken) {
		$sql = "SELECT messageID FROM tbl_message WHERE negotiate_msg_token = ? AND counterOfferAccepted = ? LIMIT 1";
		$data = array($messageToken, 1);
		return $this->db->query($sql, $data)->row()->messageID;
	}

	public function getViewRelist($offerId) {
		$sql = "SELECT offerID,
				DATE_FORMAT(startDate,'%m/%d/%Y') AS startDate1,  
				DATE_FORMAT(endDate,'%m/%d/%Y') AS endDate1 
				FROM tbl_offers where offerID = ? LIMIT 1";
		$data = array($offerId);
		return $this->db->query($sql, $data);
	}

	public function getUpdateRelistOffer($relistStartDate, $relistEndDate, $offerId) {
		$sql = "UPDATE tbl_offers SET startDate = ?, endDate = ?, offerDateAdded = ? WHERE offerID = ?";
		$data = array($relistStartDate, $relistEndDate, today(), $offerId);
		$this->db->query($sql, $data);
	}

	public function getViewProfile($profileId) {
		$sql = "SELECT p.photo, p.reviewcount, p.about, u.name, u.id , u.email, p.alias
				FROM tbl_users u 
				LEFT JOIN tbl_profile p 
				ON p.userid = u.id 
				AND u.id = ? LIMIT 1";
		$data = array($profileId);
		return $this->db->query($sql, $data);
	}

	public function getViewMessage($userId, $recordPerPage, $start, $searchInput, $messageType) {
		$sql = "SELECT m.toID, u.name, p.photo, m.messageID, m.subject, m.message, m.is_read, m.linkToReplyMessageId, DATE_FORMAT(m.messageDate, '%m/%d/%Y') AS dateFormatted 
				FROM tbl_message m 
				LEFT JOIN tbl_users u 
				ON u.id = m.fromID 
				LEFT JOIN tbl_profile p 
				ON p.userid = u.id ";
		
		if($messageType == 3 || $messageType == 2) {
			$sql .= "WHERE m.fromID = ? ";
		}else {
			$sql .= "WHERE m.toID = ? ";
		}

		$sql .= "AND m.isDelete = 0 
				AND m.message_offerID = 0 ";

		if($messageType == 1 || $messageType == 3) {
			$sql .= " AND isDraft = 0 ";
		}else if($messageType == 2) {
			$sql .= " AND isDraft = 1 ";
		}
		
		if($searchInput != '') {
			//$searchInput = clean($searchInput);
			$sql .= " AND m.subject LIKE '%$searchInput%' ";
		}

		$sql .= "ORDER BY messageDate DESC 
				LIMIT ?, ?";

		$data = array($userId, $start, (int)$recordPerPage);
		return $this->db->query($sql, $data);
	}

	public function getLoadAllEmail($userId) {
		$email = $this->getEmailUsingUserId($userId);
		$sql = "SELECT email, id, name
				FROM tbl_users WHERE id != ? AND email != ? GROUP BY email";
		$data = array($userId, $email);
		return $this->db->query($sql, $data);
	}

	public function getEmailUsingUserId($userId) {
		$sql = "SELECT email FROM tbl_users WHERE id = ? LIMIT 1";
		$data = array($userId);
		return $this->db->query($sql, $data)->row()->email;
	}

	public function getCreateMessage($userId, $msgToId, $msgSubject, $msgBody, $file, $isDraft, $isContinueDraftId, $linkToReplyMessageId) {
		$customAlphabet = '0123456789ABCDEF';

		function random_string($length) {
		    $key = '';
		    $keys = array_merge(range(0, 9), range('a', 'z'));

		    for ($i = 0; $i < $length; $i++) {
		        $key .= $keys[array_rand($keys)];
		    }

		    return $key;
		}

		if($isContinueDraftId != 0) {
			$sql = "DELETE FROM tbl_message WHERE messageID = ?";
			$data = array($isContinueDraftId);
			$this->db->query($sql, $data);
		}
		if($file != '') {
			$sql = "INSERT INTO tbl_message(`subject`,`message`,`file`, `isDraft`,`fromID`, `toID`, `messageDate`, `message_offerID`, `counterOfferAmount`, `counterOfferAccepted`, `historyToken`, `linkToReplyMessageId`)VALUES(?,?,?,?,?,?,?,?,?,?,?,?)";
			$data = array($msgSubject, $msgBody, $file, $isDraft, $userId, $msgToId, today(), 0, 0, 0, random_string(50), $linkToReplyMessageId);
		}else {
			$sql = "INSERT INTO tbl_message(`subject`,`message`, `isDraft`,`fromID`, `toID`, `messageDate`, `message_offerID`, `counterOfferAmount`, `counterOfferAccepted`, `historyToken`, `linkToReplyMessageId`)VALUES(?,?,?,?,?,?,?,?,?,?,?)";
			$data = array($msgSubject, $msgBody, $isDraft, $userId, $msgToId, today(), 0, 0, 0, random_string(50), $linkToReplyMessageId);
		}

		$this->db->query($sql, $data);
	}

	public function getCheckUnreadMessage($userId) {
		$sql = "SELECT COUNT(messageID) AS unreadCount
				FROM tbl_message
				WHERE toID = ? 
				AND is_read = 0 
				AND isDelete = 0 
				AND message_offerID = 0
				AND isDraft = 0";
		$data = array($userId);

		return $this->db->query($sql, $data)->row()->unreadCount;
	}

	public function getAllMessageSubject($userId, $messageType) {
		$sql = "SELECT subject FROM tbl_message";

		if($messageType == 3 || $messageType == 2) {
			$sql .= " WHERE fromID = ? ";
		}else {
			$sql .= " WHERE toID = ? ";
		}

		if($messageType == 1 || $messageType == 3) {
			$sql .= " AND isDraft = 0 ";
		}else {
			$sql .= " AND isDraft = 1 ";
		}

		$sql .= "AND isDelete = 0 AND message_offerID = 0 GROUP BY subject";
		$data = array($userId);
		return $this->db->query($sql, $data);
	}

	public function getDeleteMessage($deleteId) {
		$sql = "UPDATE tbl_message SET isDelete = 1 WHERE messageID = ?";
		$data = array($deleteId);
		$this->db->query($sql, $data);
	}

	public function getViewMessageDetail($messageId) {
		$sql = "SELECT m.file, m.toID, m.fromID, u.email, p.photo, m.messageID, m.subject, m.message, u.name, p.alias, m.historyToken, m.linkToReplyMessageId, DATE_FORMAT(m.messageDate, '%Y/%m/%d') AS dateFormatted 
				FROM tbl_message m 
				INNER JOIN tbl_users u 
				ON u.id = m.fromID
				INNER JOIN tbl_profile p 
				ON p.userid = u.id
				WHERE m.messageID = ? LIMIT 1";
		$data = array($messageId);
		return $this->db->query($sql, $data);
	}

	public function getUpdateUnreadMessage($messageId) {
		$sql = "UPDATE tbl_message SET is_read = 1 WHERE messageID = ?";
		$data = array($messageId);
		$this->db->query($sql, $data);
	}

	public function getNameByUserId($userId) {
		$sql = "SELECT name FROM tbl_users WHERE id = ? LIMIT 1";
		$data = array($userId);
		return $this->db->query($sql, $data)->row()->name;
	}

	public function getAliasByUserId($userId) {
		$sql = "SELECT alias FROM tbl_profile WHERE userid = ? LIMIT 1";
		$data = array($userId);
		return $this->db->query($sql, $data)->row()->alias;
	}

	public function getDraftMessageContent($messageId) {
		$sql = "SELECT subject, message, file FROM tbl_message WHERE messageID = $messageId LIMIT 1";
		$data = array($messageId);

		return $this->db->query($sql, $data);
	}

	public function getDraftRealTimeSaveUpdate($messageId, $toId, $subject, $msgBody) {
		$sql = "UPDATE tbl_message SET toID = ?, subject = ?, message = ? WHERE messageID = ?";
		$data = array($toId, $subject, $msgBody, $messageId);
		$this->db->query($sql, $data);
	}

	public function getLoadSalesPeople($userId) {
		$sql = "SELECT m.fromID, m.toID, m.messageID FROM tbl_message m 
				LEFT JOIN tbl_offers o 
				ON o.offerID = m.messageID 
				WHERE  m.counterOfferAccepted = 1 
				AND (m.fromID = ? OR m.toID = ?) GROUP BY m.fromID, m.toID";
		$data = array($userId, $userId);

		$usersArr = $this->db->query($sql, $data);
		$usersIdArr = array();
		foreach($usersArr->result() as $row) {
			if($row->fromID != $userId) {
				if(!in_array($row->fromID, $usersIdArr)) {
					array_push($usersIdArr, $row->messageID.'#from');
				}
			}

			if($row->toID != $userId) {
				if(!in_array($row->toID, $usersIdArr)) {
					array_push($usersIdArr, $row->messageID.'#to');
				}
			}
		}

		return $this->getSalesPeopleInfo($usersIdArr);
	}

	public function getSalesPeopleInfo($usersIdArr) {
		$userInfoArr = array();
		for($x = 0; $x < count($usersIdArr); $x++) {
			$explodeArr = explode("#",$usersIdArr[$x]);
			array_push($userInfoArr, $explodeArr);
		}

		return $userInfoArr;
	}

	public function getSalesPeopleRecord($userId, $messageId, $salesPeopleColumnId) {
		$sql = "SELECT u.id, p.photo, u.name, o.offerName, p.reviewcount, DATE_FORMAT(m.counterOfferAcceptedDate, '%m/%d/%Y') AS dateFormatted
				FROM tbl_message m 
				LEFT JOIN tbl_offers o
				ON o.offerID = m.message_offerID
				LEFT JOIN tbl_users u ";
		if($salesPeopleColumnId == 'to') {
			$sql .= " ON u.id = m.toID ";
		}else {
			$sql .= " ON u.id = m.fromID ";
		}
		$sql .= " LEFT JOIN tbl_profile p ON p.userid = u.id WHERE m.messageID = ? LIMIT 1";
		$data = array($messageId);
		return $this->db->query($sql, $data);
	}

	public function getChangePassword($email, $newPassHash) {
		$sql = "UPDATE tbl_users SET password = ? WHERE email = ?";
		$data = array($newPassHash, $email);
		$this->db->query($sql, $data);
	}

	public function getUpdateProfilePhoto($photo, $userId) {
		$sql = "UPDATE tbl_profile SET photo = ?, logo = ? WHERE userid = ?";
		$data = array($photo, $photo, $userId);
		$this->db->query($sql, $data);
	}

	public function getUpdatePrivProfilePhoto($photo, $userId) {
		$sql = "UPDATE tbl_profile SET privPhoto = ? WHERE userid = ?";
		$data = array($photo, $userId);
		$this->db->query($sql, $data);
	}

	public function getViewProfileInfo($userId) {
		$sql = "SELECT p.*, u.name FROM tbl_profile p LEFT JOIN tbl_users u ON u.id = p.userid WHERE userid = ? LIMIT 1";
		$data = array($userId);
		return $this->db->query($sql, $data);
	}

	public function getUpdateProfile($corporateName, $nickName, $emailAdd, $webUrl, $primaryPhoneNumber, $about, $userId, $privCorporateName, $priveintaxid, $privPhoneNumber, $privAddress) {
		$sql = "UPDATE tbl_profile
			 	SET companyname = ?, 
			 	alias = ?, 
			 	url = ?, 
			 	phonenumber = ?, 
			 	about = ?, 
			 	contact_email = ?,
			 	privCorporateName = ?,
			 	priveintaxid = ?,
			 	privphoneNumber = ?, 
			 	privAddress = ?
			 	WHERE userid = ?";

		$data = array($corporateName, $nickName, $webUrl, $primaryPhoneNumber, $about, $emailAdd,$privCorporateName, $priveintaxid, $privPhoneNumber, $privAddress, $userId);
		$this->db->query($sql, $data);

		$sql1 = "UPDATE tbl_users SET name = ? WHERE id = ?";
		$data1 = array($corporateName, $userId);
		$this->db->query($sql1, $data1);
	}

	public function getLoadUsers($userId) {
		$sql = "SELECT addedbyID, name, email, password, role, id, is_active, userPriv, DATE_FORMAT(created_at, '%m/%d/%Y') AS createdDate FROM tbl_users WHERE addedbyID = ? ORDER BY id DESC";
		$data = array($userId);
		return $this->db->query($sql, $data);
	}

	public function getLoadContact($userId) {
		$sql = "SELECT COUNT(id) AS contactSync FROM tbl_users WHERE id = ? AND contact_sync = 1 LIMIT 1";
		$data = array($userId);
		return $this->db->query($sql, $data)->row()->contactSync;
	}

	public function getCheckContact($userId) {
		$sql = "SELECT COUNT(id) AS contactSync FROM tbl_users WHERE id = ? AND contact_sync = 1 LIMIT 1";
		$data = array($userId);
		$contactSync = $this->db->query($sql, $data)->row()->contactSync;

		if($contactSync) {
			return 1;
		}else {
			return 2;
		}
	}

	public function getLoadTaxInfo($userId) {
		$sql = "SELECT companyname, eintaxid, address1, entity, id
				FROM tbl_profile
				WHERE userid = ?";
		$data = array($userId);
		return $this->db->query($sql, $data);
	}

	public function getSaveTaxInfo($userId, $corporateName, $ein, $address, $entity) {
		$sql = "UPDATE tbl_profile SET companyname = ?, eintaxid = ?, address1 = ?, entity = ? WHERE userid = ?";
		$data = array($corporateName, $ein, $address, $entity, $userId);
		$this->db->query($sql, $data);
	}

	public function getViewSalesPeople($userId) {
		$msgTokenArr = $this->getMsgTokenArr($userId);
			if($msgTokenArr->num_rows() > 0) {
				$sql = "SELECT toID, fromID FROM tbl_message WHERE counterOfferAccepted = 1 AND negotiate_msg_token IN (";
					$counter = 1;
					$numRows = $msgTokenArr->num_rows();
					foreach($msgTokenArr->result() as $token) {
						if($counter != $numRows) {
							$sql .= "'".$token->negotiate_msg_token." ',";
						}else {
							$sql .= "'".$token->negotiate_msg_token."'";
						}

						$counter++;
					}
				$sql .= ")";
				$data = array($userId);
				$users = $this->db->query($sql, $data);
				$userArr = array();
				foreach ($users->result() as $user) {
					if($user->toID != $userId) {
						if(!in_array($user->toID, $userArr)) {
							array_push($userArr, $user->toID);
						}
					}

					if($user->fromID != $userId) {
						if(!in_array($user->fromID, $userArr)) {
							array_push($userArr, $user->fromID);
						}
					}
				}

				return $this->getSalesPeople($userArr, $userId);

			}else {
				return 0;
			}
			//return $sql;
	}

	public function getSalesPeople($userArr, $userId) {
		$sql = "SELECT u.id, u.total_stars, u.name, p.photo, p.alias
				FROM tbl_users u 
				INNER JOIN tbl_profile p 
				ON p.userid = u.id";
				if(count($userArr) > 0) {
					$sql .= " WHERE u.id IN ( ";
						$counter = 1;
						foreach ($userArr as $user) {
							if($counter != count($userArr)) {
								$sql .= $user.',';
							}else {
								$sql .= $user;
							}
							$counter++;
						}
					$sql .= " )";
				}else {
					$sql .= " WHERE u.id = 0"; // no sales people
				}
		$acceptedOffers = array();

		$salesPeopleObj = $this->db->query($sql)->result();

		foreach($salesPeopleObj as $salesPeople) {
			$sql = "SELECT offerID, offerName, offerAmount FROM tbl_message m INNER JOIN tbl_offers o ON o.offerID = m.message_offerID WHERE m.toID IN($salesPeople->id, $userId) AND m.fromID IN($salesPeople->id, $userId) AND m.counterOfferAccepted = 1";
			$result = $this->db->query($sql)->result();
			array_push($acceptedOffers, $result);
		}

		$arrCounter = 0;
		foreach ($acceptedOffers as $value) {
			$salesPeopleObj[$arrCounter]->offerAcceptedIds = $value;
			$arrCounter++;
		}

		return $salesPeopleObj;
	}

	public function getMsgTokenArr($userId) {
		$sql = "SELECT negotiate_msg_token FROM tbl_message WHERE fromID = ? AND tempNegotiate = 1";
		$data = array($userId);
		return $this->db->query($sql, $data);
	}

	public function getAddUser($userName, $userEmail, $userPassword, $userPriv, $addedById) {
		$userPassword = password_hash($userPassword, PASSWORD_DEFAULT);
		$userEmailHash = password_hash($userEmail, PASSWORD_BCRYPT);
		$sql = "INSERT INTO tbl_users(`name`, `email`,`password`, `role`, `addedbyID`, `userPriv`, `created_at`)VALUES(?,?,?,?,?,?,?)";
		$data = array($userName, $userEmail, $userPassword, 'sales', $addedById, $userPriv, today());
		$this->db->query($sql, $data);
		$lastId = $this->db->insert_id();
		$this->getInsertProfile($lastId);

			$subject = "Sellinghive email verification";
			$txt = "Thank you for joining Sellinghive.  You are one step away from our service - to activate your account, please click here: https://sellinghive.applite.com/offers/verify_register.php?email=".$userEmailHash."&pid=".md5($lastId)."

Thank you,
Sellinghive Corporation
www.sellinghive.com";
			$headers = "From: SellingHive (AppLite) <sellinghive@applite.com>";

		mail($userEmail,$subject,$txt,$headers);
	}

	public function getEditUserInfo($editUserId) {
		$sql = "SELECT addedbyID, name, email, password, role, id, is_active, userPriv, DATE_FORMAT(created_at, '%m/%d/%Y') AS createdDate FROM tbl_users WHERE id = ? ORDER BY id DESC";
		$data = array($editUserId);
		return $this->db->query($sql, $data);
	}

	public function getSaveEditUserInfo($userEditId, $userPriv) {
		$sql = "UPDATE tbl_users SET userPriv = ? WHERE id = ?";
		$data = array($userPriv, $userEditId);
		$this->db->query($sql, $data);
	}

	/* Angular Web Service */
	public function getNgUsers() {
		$sql = "SELECT id, name, email FROM tbl_users ORDER BY id DESC";
		return $this->db->query($sql);
	}

	public function getNgAddUser($name, $email) {
		$sql = "INSERT INTO tbl_users (`name`, `email`) VALUES (?,?)";
		$data = array($name, $email);
		$this->db->query($sql, $data);
	}

	public function getDeleteUser($userId) {
		$sql = "DELETE FROM tbl_users WHERE id = ?";
		$data = array($userId);
		$this->db->query($sql, $data);
	}

	public function getNgEditUser($name, $email, $id) {
		$sql = "UPDATE tbl_users SET name = ?, email = ? WHERE id = ?";
		$data = array($name, $email, $id);
		$this->db->query($sql, $data);
	}

	public function getAddFaqQuestion($question, $answer, $hide) {
		$sql = "INSERT INTO tbl_faq(`question`,`answer`,`hide`)VALUES(?,?,?)";
		$data = array($question, $answer, $hide);
		$this->db->query($sql, $data);
	}

	public function getLoadFaqQuestion() {
		$sql = "SELECT * FROM tbl_faq ORDER BY id DESC";
		return $this->db->query($sql);
	}

	public function getRemoveFaqQuestion($id) {
		$sql = "DELETE FROM tbl_faq WHERE id = ?";
		$data = array($id);
		$this->db->query($sql, $data);
	}

	public function getDeleteOffer($offerId) {
		$sql = "UPDATE tbl_offers SET isDelete = 1 WHERE offerID = ?";
		$data = array($offerId);
		$this->db->query($sql, $data);
	}

	public function getLoadAcceptedTodo($messageId, $userId) {
		$sql = "SELECT t.*, o.offerAddedByID, oa.accepted_for_todo_creator, oa.accepted_for_todo_negotiator, oa.acceptedOfferAmount,
				DATE_FORMAT(t.offereeAcceptedDate, '%m/%d/%Y, %h:%i %p') AS tododate1,
				DATE_FORMAT(t.offererAcceptedDate, '%m/%d/%Y, %h:%i %p') AS tododate2,
				(SELECT name FROM tbl_users WHERE id = o.offerAddedByID LIMIT 1) AS creatorName,
				(SELECT alias FROM tbl_profile WHERE userid = o.offerAddedByID LIMIT 1) AS creatorAlias,
				(SELECT email FROM tbl_users WHERE id = o.offerAddedByID LIMIT 1) AS creatorEmail,
				(SELECT name FROM tbl_users WHERE id = t.todo_userid LIMIT 1) AS negotiatorName,
				(SELECT alias FROM tbl_profile WHERE userid = t.todo_userid LIMIT 1) AS negotiatorAlias,
				(SELECT email FROM tbl_users WHERE id = t.todo_userid LIMIT 1) AS negotiatorEmail,
				oa.is_paid
				FROM tbl_message m 
				LEFT JOIN tbl_offer_accepted oa 
				ON oa.accepted_msg_token = m.negotiate_msg_token
				LEFT JOIN tbl_todo t 
				ON t.offerAcceptedId = oa.offerAcceptedID
				LEFT JOIN tbl_offers o 
				ON o.offerID = oa.a_offerID
				WHERE messageID = ?";
		$data = array($messageId);
		return $this->db->query($sql, $data);
	}

	public function getTodoIsRead($todoId) {
		$sql = "UPDATE tbl_todo SET isread = 1 WHERE todo_id = ?";
		$data = array($todoId);
		$this->db->query($sql, $data);
	}

	public function getLoadUserReview($revieweeId) {
		$sql = "SELECT fromid, toid, reviewtext, reviewStar, created_at, r_title, r_offerid,
				DATE_FORMAT(created_at, '%m/%d/%Y') AS reviewDate,
				(SELECT name FROM tbl_users WHERE id = toid) AS revieweeName,
				(SELECT photo FROM tbl_profile WHERE userid = fromid) AS reviewerPhoto
				from tbl_review WHERE toid = ? ORDER BY created_at DESC";
		$data = array($revieweeId);
		return $this->db->query($sql, $data);
	}

	public function getAddUserReview($reviewTitle, $reviewDetails, $reviewStar, $revieweeId, $reviewerId, $offerId) {
		$sql = "INSERT INTO tbl_review(`fromid`,`toid`,`reviewtext`,`reviewStar`,`created_at`,`r_offerid`,`r_title`)VALUES(?,?,?,?,?,?,?)";
		$data = array($reviewerId, $revieweeId, $reviewDetails, $reviewStar, today(), $offerId, $reviewTitle);
		$this->db->query($sql, $data);
	}

	public function getCheckExistingReview($revieweeId, $offerId, $reviewerId) {
		$sql = "SELECT * FROM tbl_review WHERE fromid = ? AND toid = ? AND r_offerid = ? LIMIT 1";
		$data = array($reviewerId, $revieweeId, $offerId);
		return $this->db->query($sql, $data);
	}

	public function getUpdateUserReview($reviewId, $reviewTitle, $reviewDetails, $reviewStar) {
		$sql = "UPDATE tbl_review SET reviewtext = ?, reviewStar = ?, r_title = ? WHERE review_id = ?";
		$data = array($reviewDetails, $reviewStar, $reviewTitle, $reviewId);
		$this->db->query($sql, $data);
	}

	public function getLoadReviewDetails($revieweeId, $reviewerId, $offerId) {
		$sql = "SELECT *,
		(SELECT name FROM tbl_users WHERE id = $revieweeId) AS name,
		(SELECT photo FROM tbl_profile WHERE userid = $revieweeId) AS photo
		FROM tbl_review WHERE toid = ? AND fromid = ? AND r_offerid = ? LIMIT 1";
		$data = array($revieweeId, $reviewerId, $offerId);
		return $this->db->query($sql, $data);
	}

	public function getLoadReviewDetails1($revieweeId, $reviewerId, $offerId) {
		$sql = "SELECT *,
		(SELECT offerName FROM tbl_offers WHERE offerID = r_offerid) as offerName,
		(SELECT name FROM tbl_users WHERE id = $reviewerId) AS name,
		(SELECT photo FROM tbl_profile WHERE userid = $reviewerId) AS photo
		FROM tbl_review WHERE toid = ? AND fromid = ? AND r_offerid = ? LIMIT 1";
		$data = array($revieweeId, $reviewerId, $offerId);
		return $this->db->query($sql, $data);
	}

	public function getResetPassConfirm($email, $password) {
		$sql = "UPDATE tbl_users SET password = ? WHERE email = ?";
		$data = array($password, $email);
		$this->db->query($sql, $data);
	}

	public function getLoadHistory($userId, $historyType) {
		$year = date('Y-m-d', strtotime('-1 year'));

		$sql = "SELECT o.offerName, DATE_FORMAT(historyDate, '%m/%d/%Y') AS historyDateFormatted, o.offerAmount, oa.accepted_message_id,
				oa.offer_creator_id, oa.offer_negotiator_id, oa.acceptedOfferAmount,
				(SELECT name from tbl_users WHERE id = oa.offer_creator_id) as creatorName,
				(SELECT photo FROM tbl_profile WHERE userid = oa.offer_creator_id) as creatorPhoto,
				(SELECT name from tbl_users WHERE id = oa.offer_negotiator_id) as negotiatorName,
				(SELECT photo FROM tbl_profile WHERE userid = oa.offer_negotiator_id) as negotiatorPhoto
				FROM tbl_offer_accepted oa INNER JOIN tbl_offers o ON o.offerID = oa.a_offerID
				AND oa.is_paid = 1";

		if($historyType == 1) {
			$sql .= " AND historyDate >= '$year'";
		}

		$sql .= " ORDER BY historyDate DESC";
		return $this->db->query($sql);
	}

	public function getPaymentTransact($userId) {
		$sql = "SELECT acceptedOfferName, acceptedOfferAmount, acceptedOfferTerm, offer_creator_id, offer_negotiator_id, offerAcceptedID,
				DATE_FORMAT(historyDate, '%Y/%m/%d') AS dateFormatted,
				(SELECT name FROM tbl_users WHERE id = offer_creator_id) AS creatorName,
				(SELECT name FROM tbl_users WHERE id = offer_negotiator_id) AS negotiatorName,
				(SELECT (photo) FROM tbl_profile WHERE userid = offer_creator_id) AS creatorPhoto,
				(SELECT (photo) FROM tbl_profile WHERE userid = offer_negotiator_id) AS negotiatorPhoto
				FROM tbl_offer_accepted WHERE is_paid = 1 AND (offer_creator_id = ? OR offer_negotiator_id = ?)";
		$data = array($userId, $userId);
		return $this->db->query($sql, $data);
	}

	public function getTransactionDetail($trasactionId) {
		$sql = "SELECT acceptedOfferName, acceptedOfferAmount, acceptedOfferTerm, offer_creator_id, offer_negotiator_id, offerAcceptedID, accepted_message_id,
				DATE_FORMAT(historyDate, '%Y/%m/%d') AS dateFormatted,
				(SELECT name FROM tbl_users WHERE id = offer_creator_id) AS creatorName,
				(SELECT name FROM tbl_users WHERE id = offer_negotiator_id) AS negotiatorName,
				(SELECT (photo) FROM tbl_profile WHERE userid = offer_creator_id) AS creatorPhoto,
				(SELECT (photo) FROM tbl_profile WHERE userid = offer_negotiator_id) AS negotiatorPhoto
				FROM tbl_offer_accepted WHERE offerAcceptedID = ? LIMIT 1";
		$data = array($trasactionId);
		return $this->db->query($sql, $data);
	}

	public function checkPaypalEmailEnabled($userId) {
		$sql = "SELECT email FROM tbl_users WHERE id = ? AND paypalEmailEnable = ?";
		$data = array($userId, 1);
		return $this->db->query($sql, $data);
	}

	public function saveEmail($userId, $userEmail) {
		$sql = "INSERT INTO tbl_email(`email`,`userID`,`visible`) VALUES (?, ?, ?)";
		$data = array($userEmail, $userId, 1);
		$this->db->query($sql, $data);
	}

	public function userEnabled($userId) {
		$sql = "UPDATE tbl_users set paypalEmailEnable = ? WHERE id = ?";
		$data = array(1, $userId);
		$this->db->query($sql, $data);
	}

	public function checkIfEmailUserExist($userId) {
		$sql = "SELECT email FROM tbl_email WHERE userID = ?";
		$data = array($userId);
		return $this->db->query($sql, $data);
	}

	public function getEditEmail($userId, $userEmail) {
		$sql = "UPDATE tbl_email SET email = ? WHERE userID = ?";
		$data = array($userEmail, $userId);
		$this->db->query($sql, $data);
	}

	public function getAcceptedOfferForTodo($userId, $offerAcceptedId, $offerIsCreator) {
		$sql = "UPDATE tbl_offer_accepted ";
			if($offerIsCreator == 1) {
				$sql .= "SET accepted_for_todo_creator = 1 ";
			}else {
				$sql .= "SET accepted_for_todo_negotiator = 1 ";
			}
		$sql .= " WHERE offerAcceptedID = ?";
		$data = array($offerAcceptedId);
		$this->db->query($sql, $data);
	}

	public function getTodoRead($userId, $todoId) {
		$sql = "UPDATE tbl_todo SET isread = 1 WHERE todo_id = ? AND todo_userid = ?";
		$data = array($todoId, $userId);
		$this->db->query($sql, $data);
	}

	public function getPendingPayment($userId) {
		$sql = "SELECT 
				oa.offer_negotiator_id,
				DATE_FORMAT(t.todo_dateAdded, '%m/%d/%Y') AS todoDate,
				oa.acceptedOfferName,
				oa.acceptedOfferAmount,
				oa.acceptedOfferTerm,
				oa.accepted_message_id,
				(SELECT photo FROM tbl_profile WHERE userid = oa.offer_negotiator_id LIMIT 1) as photo,
				(SELECT name FROM tbl_users WHERE id = oa.offer_negotiator_id) AS name,
				(SELECT alias FROM tbl_profile WHERE userid = oa.offer_negotiator_id) AS alias
				FROM tbl_todo t 
				INNER JOIN tbl_offer_accepted oa 
				ON oa.offerAcceptedID = t.offerAcceptedId 
				WHERE t.todo_userid = ? 
				AND t.todoLinkId != 0 AND oa.is_paid = ?";
		$data = array($userId, 0);
		return $this->db->query($sql, $data);
	}
}



