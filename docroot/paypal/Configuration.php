<?php 
class Configuration
{
	// For a full list of configuration parameters refer in wiki page (https://github.com/paypal/sdk-core-php/wiki/Configuring-the-SDK)
	public static function getConfig()
	{
		$config = array(
				// values: 'sandbox' for testing
				//		   'live' for production
                //         'tls' for testing if your server supports TLSv1.2
				"mode" => "sandbox"

                // TLSv1.2 Check: Comment the above line, and switch the mode to tls as shown below
                // "mode" => "tls"
	
				// These values are defaulted in SDK. If you want to override default values, uncomment it and add your value.
				// "http.ConnectionTimeOut" => "5000",
				// "http.Retry" => "2",
			);
		return $config;
	}
	
	// Creates a configuration array containing credentials and other required configuration parameters.
	public static function getAcctAndConfig()
	{
		$config = array(
				//Signature Credential
				// "acct1.UserName" => "sellinghive-businesss_api1.gmail.com",
				// "acct1.Password" => "6HJWE6EB8RRAZXUR",
				// "acct1.Signature" => "AhEqPBa2LPCE3sKdenmfssNtAsh0A6u0uByEzlujTGhPoJWdziRtzHN1",
				// "acct1.AppId" => "APP-80W284485P519543T"


				"acct1.UserName" => "sellpass1234_api1.gmail.com",
				"acct1.Password" => "N7BJUTBW45FA2JNX",
				"acct1.Signature" => "AfAkavmC3xOd-bBA3ryNkIOB-nAFAKa6dcmIVUoxaj6d2yT-mgxVyUoM",
				"acct1.AppId" => "APP-80W284485P519543T"

				
				// Sample Certificate Credential
				// "acct1.UserName" => "certuser_biz_api1.paypal.com",
				// "acct1.Password" => "D6JNKKULHN3G5B8A",
				// Certificate path relative to config folder or absolute path in file system
				// "acct1.CertPath" => "cert_key.pem",
				// "acct1.AppId" => "APP-80W284485P519543T"
				);
		
		return array_merge($config, self::getConfig());;
	}

}
