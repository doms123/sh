<?php
defined('BASEPATH') OR exit('No direct script access allowed');

function sanitize($in) {
	return addslashes(htmlspecialchars(strip_tags(trim($in))));
}

function generate_json($data){
	header("access-control-allow-origin: *");
	header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
	header('Content-type: application/json');
	echo json_encode($data);
}

function today(){
	date_default_timezone_set('Asia/Manila');
	return date("Y-m-d G:i:s");
}

function encryptIt($q) {
	$cryptKey  = 'qJB0rGtIn5UB1xG03efyCp';
	$qEncoded  = base64_encode( mcrypt_encrypt( MCRYPT_RIJNDAEL_256, md5( $cryptKey ), $q, MCRYPT_MODE_CBC, md5( md5( $cryptKey ) ) ) );
	return( $qEncoded );
}

function decryptIt($q) {
	$cryptKey  = 'qJB0rGtIn5UB1xG03efyCp';
	$qDecoded  = rtrim( mcrypt_decrypt( MCRYPT_RIJNDAEL_256, md5( $cryptKey ), base64_decode( $q ), MCRYPT_MODE_CBC, md5( md5( $cryptKey ) ) ), "\0");
	return( $qDecoded );
}

function clean($string) {
	 $string = str_replace('%', 'Ug4A18Br7281cE', $string); // Replaces all % with blank.
	 $string = str_replace('_', 'Ug4A18Br7281cE', $string); // Replaces all % with blank.
	 return $string;
	}

function randomStringGen($length) {
	$key = '';
    $keys = array_merge(range(0, 9), range('a', 'z'));

    for ($i = 0; $i < $length; $i++) {
        $key .= $keys[array_rand($keys)];
    }

    return $key;
}

function isValidEmail($email){ 
    if(filter_var($email, FILTER_VALIDATE_EMAIL) !== false) {
    	return 1;
    }else {
    	return 0;
    }
}