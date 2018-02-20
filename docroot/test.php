
<?php

	$conn = mysqli_connect("localhost","deploy","Ug4A18Br7281cE","SellingHive");


	// $sql = "CREATE TABLE tbl_review (
	// r_id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	// r_userid INT(11) NOT NULL,
	// r_offerid var(200) NOT NULL,
	// r_title var(200) NOT NULL,
	// r_desc var(200) NOT NULL,
	// r_star INT(11) NOT NULL,
	// r_date TIMESTAMP
	// )";

	// mysqli_query($conn, $sql);


// 	mysqli_query($conn, "CREATE TABLE tbl_faq (
// id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
// question VARCHAR(200) NOT NULL,
// answer VARCHAR(200) NOT NULL,
// dateAdded TIMESTAMP
// )");

	// mysqli_query($conn, "UPDATE tbl_users set paypalEmailEnable = 0 WHERE id != 0");
	// mysqli_query($conn, "UPDATE tbl_users SET paypalEmailEnable = 0 WHERE id = 95");

	// mysqli_query($conn, "TRUNCATE TABLE  tbl_email");


	// mysqli_query($conn, "TRUNCATE TABLE tbl_offer_accepted");
	// mysqli_query($conn, "TRUNCATE TABLE tbl_offer_tag");
	// mysqli_query($conn, "TRUNCATE TABLE tbl_private_offer");
	// mysqli_query($conn, "TRUNCATE TABLE tbl_message");
	// mysqli_query($conn, "TRUNCATE TABLE tbl_history");
	// mysqli_query($conn, "TRUNCATE TABLE tbl_todo");
	// mysqli_query($conn, "TRUNCATE TABLE tbl_offer_read");
	// mysqli_query($conn, "TRUNCATE TABLE tbl_message");
	// mysqli_query($conn, "TRUNCATE TABLE tbl_offers");

	// mysqli_query($conn, "UPDATE tbl_offer_accepted SET accepted_for_todo_negotiator = 1 WHERE offerAcceptedID = 1");


	// mysqli_query($conn, "DELETE FROM tbl_users WHERE id = 165");
	
	//mysqli_query($conn, "UPDATE tbl_profile SET photo = ''");
	// mysqli_query($conn, "DELETE FROM tbl_users WHERE id = 163");
	// mysqli_query($conn, "DELETE FROM tbl_profile WHERE userid = 163");
	//mysqli_query($conn, "INSERT INTO tbl_profile(`userid`)VALUES(55)");
	// mysqli_query($conn, "ALTER TABLE tbl_offer_accepted ADD is_read_negotiator INT(10)");
	// mysqli_query($conn, "ALTER TABLE tbl_offer_accepted ADD is_read_creator INT(10)");
	//mysqli_query($conn, "INSERT INTO tbl_offer_read(`or_offerid`, `or_userid`)VALUES(29, 4)");
	// mysqli_query($conn, "ALTER TABLE tbl_offer_accepted CHANGE offer_created_id offer_creator_id INT(10)");
	// corporate name 
	// eintaxid
	// phone number
	// address

	// mysqli_query($conn, "Delete from tbl_faq");
	// mysqli_query($conn, "ALTER TABLE tbl_profile ADD priveintaxid VARCHAR(200)");
	// mysqli_query($conn, "ALTER TABLE tbl_profile ADD privphoneNumber VARCHAR(200)");
	// mysqli_query($conn, "ALTER TABLE tbl_profile ADD privAddress VARCHAR(200)");
	// mysqli_query($conn, "ALTER TABLE tbl_review ADD r_offerid INT(200)");
	// mysqli_query($conn, "ALTER TABLE tbl_review ADD r_title VARCHAR(200)");

	// $show = mysqli_query($conn, "show columns from tbl_review");

	// while($row = mysqli_fetch_assoc($show)) {
	// 	echo "<pre>";
	// 	print_r($row);
	// 	echo "</pre>";
	// }

	//mysqli_query($conn, "UPDATE tbl_profile SET photo = '' WHERE userid = 85");
	// $customAlphabet = '0123456789ABCDEF';

	// function random_string($length) {
	//     $key = '';
	//     $keys = array_merge(range(0, 9), range('a', 'z'));

	//     for ($i = 0; $i < $length; $i++) {
	//         $key .= $keys[array_rand($keys)];
	//     }

	//     return $key;
	// }

	// echo random_string(50);

	// mysqli_query($conn, "ALTER TABLE tbl_offer_accepted DROP COLUMN acceptedOfferName, DROP COLUMN acceptedOfferAmount, DROP COLUMN acceptedOfferTerm, DROP COLUMN acceptedoOfferNotes");
	// mysqli_query($conn, "ALTER TABLE tbl_offer_accepted ADD COLUMN acceptedOfferName VARCHAR (200)");
	// mysqli_query($conn, "ALTER TABLE tbl_offer_accepted ADD COLUMN acceptedOfferAmount INT (11)");
	// mysqli_query($conn, "ALTER TABLE tbl_offer_accepted ADD COLUMN acceptedOfferTerm LONGTEXT");
	// mysqli_query($conn, "ALTER TABLE tbl_offer_accepted ADD COLUMN acceptedoOfferNotes LONGTEXT");
	// mysqli_query($conn, "ALTER TABLE tbl_todo ADD COLUMN offereeAccepted INT DEFAULT 0");
	// mysqli_query($conn, "ALTER TABLE tbl_todo ADD COLUMN offereeAcceptedDate Datetime");
	// mysqli_query($conn, "ALTER TABLE tbl_todo ADD COLUMN offererAccepted INT DEFAULT 0");
	// mysqli_query($conn, "ALTER TABLE tbl_message ADD COLUMN historyToken LONGTEXT");
	// mysqli_query($conn, "ALTER TABLE tbl_message ADD COLUMN linkToReplyMessageId INT DEFAULT 0");
	// echo '<h3>Table FAQ</h3>';
	// $query = mysqli_query($conn, "SELECT * FROM tbl_faq");

	// while($row = mysqli_fetch_assoc($query)) {
	// 	echo "<pre>";
	// 	print_r($row);
	// 	echo "</pre>";
	// }

	//mysqli_query($conn, "UPDATE tbl_email set email = 'dominicksanchez30@gmail.com' WHERE userID = 4");

	// echo '<h3>Table Email</h3>';
	// $query = mysqli_query($conn, "SELECT * FROM tbl_email");
	// while($row = mysqli_fetch_assoc($query)) {
	// 	echo "<pre>";
	// 	print_r($row);
	// 	echo "</pre>";
	// }
	// mysqli_query($conn, "UPDATE tbl_profile set alias = 'Jimmy Joe Bob' WHERE userid = 33");
	
	// echo '<h3>Table email</h3>';
	// $query = mysqli_query($conn, "SELECT * FROM tbl_email");
	// while($row = mysqli_fetch_assoc($query)) {
	// 	echo "<pre>";
	// 	print_r($row);
	// 	echo "</pre>";
	// }

	echo '<br>';


	// $query = mysqli_query($conn, "SHOW TABLE STATUS FROM SellingHive");

	// while($row = mysqli_fetch_assoc($query)) {
	// 	echo "<pre>";
	// 	print_r($row);
	// 	echo "</pre>";
	// }

	echo '<hr>';
	echo '<h3>Table Review</h3>';
	$query = mysqli_query($conn, "SELECT * FROM tbl_review");
	while($row = mysqli_fetch_assoc($query)) {
		echo "<pre>";
		print_r($row);
		echo "</pre>";
	}

	

	echo '<hr>';
	echo '<h3>Table Users</h3>';
	$query = mysqli_query($conn, "SELECT * FROM tbl_users");
	while($row = mysqli_fetch_assoc($query)) {
		echo "<pre>";
		print_r($row);
		echo "</pre>";
	}

	// mysqli_query($conn, "DELETE FROM tbl_users WHERE id >= 203");

	// // mysqli_query($conn, "UPDATE tbl_todo SET isread = 0 WHERE todo_id = 1");

	// echo '<hr>';

	// //mysqli_query($conn, "ALTER TABLE tbl_offer_accepted DROP COLUMN accepted_for_todo");
	// mysqli_query($conn, "ALTER TABLE tbl_offer_accepted ADD COLUMN accepted_for_todo_creator INT DEFAULT 0");
	// mysqli_query($conn, "ALTER TABLE tbl_offer_accepted ADD COLUMN accepted_for_todo_negotiator INT DEFAULT 0");

	// echo '<h3>Table Offer</h3>';
	// $query = mysqli_query($conn, "SELECT * FROM tbl_offers ORDER BY offerID DESC LIMIT 1");
	// while($row = mysqli_fetch_assoc($query)) {
	// 	echo "<pre>";
	// 	print_r($row);
	// 	echo "</pre>";
	// }


	// echo '<hr>';

	
	// echo '<h3>Table Todo</h3>';
	// $query = mysqli_query($conn, "SELECT * FROM tbl_todo ORDER BY todo_id DESC LIMIT 2");
	// while($row = mysqli_fetch_assoc($query)) {
	// 	echo "<pre>";
	// 	print_r($row);
	// 	echo "</pre>";
	// }


	// echo '<hr>';



	// echo '<h3>Table Message</h3>';
	// $query = mysqli_query($conn, "SELECT * FROM tbl_message ORDER BY messageID  DESC LIMIT 3");
	// while($row = mysqli_fetch_assoc($query)) {
	// 	echo "<pre>";
	// 	print_r($row);
	// 	echo "</pre>";
	// }



	// echo '<hr>';

	// echo '<h3>Table Offer Accepted</h3>';
	// $query = mysqli_query($conn, "SELECT * FROM tbl_offer_accepted ORDER BY offerAcceptedID DESC LIMIT 2");
	// while($row = mysqli_fetch_assoc($query)) {
	// 	echo "<pre>";
	// 	print_r($row);
	// 	echo "</pre>";
	// }
	// echo '<hr>';

	// echo '<h3>Table History</h3>';
	// $query = mysqli_query($conn, "SELECT * FROM tbl_history");
	// while($row = mysqli_fetch_assoc($query)) {
	// 	echo "<pre>";
	// 	print_r($row);
	// 	echo "</pre>";
	// }
	// echo '<hr>';

	// echo '<h3>tbl_offer_read</h3>';
	// $query = mysqli_query($conn, "SELECT * FROM tbl_offer_read");

	// while($row = mysqli_fetch_assoc($query)) {
	// 	echo "<pre>";
	// 	print_r($row);
	// 	echo "</pre>";
	// }
	// echo '<hr>';

	// echo '<h3>tbl_offer_tag</h3>';
	// $query = mysqli_query($conn, "SELECT * FROM tbl_offer_tag");

	// while($row = mysqli_fetch_assoc($query)) {
	// 	echo "<pre>";
	// 	print_r($row);
	// 	echo "</pre>";
	// }
	// echo '<hr>';


	// echo '<h3>tbl_users</h3>';
	// $query = mysqli_query($conn, "select * from tbl_users");

	// while($row = mysqli_fetch_assoc($query)) {
	// 	echo "<pre>";
	// 	print_r($row);
	// 	echo "</pre>";
	// }
	// echo '<hr>';

	// echo '<h3>Table Profile</h3>';
	// $query = mysqli_query($conn, "SELECT * FROM tbl_profile");
	// while($row = mysqli_fetch_assoc($query)) {
	// 	echo "<pre>";
	// 	print_r($row);
	// 	echo "</pre>";
	// }

	// mysqli_query($conn, "ALTER TABLE tbl_profile MODIFY about LONGTEXT");


	




