/**
 * @author Cedric
 */

var consumer = {};
var oauthParams = {	name :"userinfo", 
					tokenSecret : "",
					accessToken : "",
					sessionHandle : "",
					accessExpiraiton : "",
					sessionExpiration : ""					
	
};

consumer.yahoo =
{ consumerKey   : "dj0yJmk9MWNNeHFyMVZneFdFJmQ9WVdrOVNqVm9hSGQ2TXpZbWNHbzlNVEU0TURVM09UYzJNZy0tJnM9Y29uc3VtZXJzZWNyZXQmeD0wYQ--"
, consumerSecret: "9e1bb2700b79696770c9c931b182bf12260eb4e6"
, serviceProvider:
  { signatureMethod     : "HMAC-SHA1"
  , requestTokenURL     : "https://api.login.yahoo.com/oauth/v2/get_request_token"
  , userAuthorizationURL: "https://api.login.yahoo.com/oauth/v2/request_auth"
  , accessTokenURL      : "https://api.login.yahoo.com/oauth/v2/get_token"
  }
};


function getRequestToken() {
	var form = {action : "",
				method : "" };
    form.action = consumer.yahoo.serviceProvider.requestTokenURL;
    form.method = "POST";
    var accessor = { consumerSecret: consumer.yahoo.consumerSecret
                   , tokenSecret   : consumer.yahoo.tokenSecret};
    var message = { action: form.action
                  , method: form.method
                  , parameters: [
                  					["oauth_version","1.0"],
                  					["oauth_consumer_key", consumer.yahoo.consumerKey],
                  					["oauth_callback","oob"]
                  				]    
                  };
                  
    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
    //alert(outline("message", message));
    var parameterMap = OAuth.getParameterMap(message.parameters);
                  
    var url = form.action+"?"+
  				"oauth_nonce="+OAuth.getParameter(parameterMap, "oauth_nonce")+
  				"&oauth_timestamp="+OAuth.getParameter(parameterMap, "oauth_timestamp")+
  				"&oauth_consumer_key="+ OAuth.getParameter(parameterMap, "oauth_consumer_key")+
  				"&oauth_signature_method="+consumer.yahoo.serviceProvider.signatureMethod+
                "&oauth_signature="+OAuth.percentEncode(OAuth.getParameter(parameterMap,'oauth_signature'))+
  				"&oauth_version="+ OAuth.getParameter(parameterMap, "oauth_version")+
  				"&oauth_callback="+ OAuth.percentEncode(OAuth.getParameter(parameterMap, "oauth_callback"));
                  

   var xhr = new XMLHttpRequest();
	xhr.open(form.method, url, true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onreadystatechange=function()
	  {
	  if (xhr.readyState==4 && xhr.status==200)
	    {
	    	var response = xhr.responseText;  //works like a glove
	    	var oauthArray = response.split("&")
			
			var oValue = new Array();
			var myMap = {};
			for(var i=0; i < oauthArray.length; i++)
			{
				var key = oauthArray[i].split("=");
				myMap[key[0]] = key[1];
			}
			myMap.name = 'userinfo';
			oauthParams.tokenSecret = myMap.oauth_token_secret;
			oauthParams.accessToken = myMap.oauth_token;
			window.open(OAuth.decodePercent(myMap.xoauth_request_auth_url),
							 "OauthAuthorizationPage", 
							 "resizable=yes,scrollbars=yes,status=yes");
	    }
	    
	  }
	xhr.send();
	var result = xhr.responseText;
    return true;
}

function getAccessToken()
{
	var verifier = $('#verifier_text').val();
	if (verifier != '')
	{
		var form = {action : "",
					method : "" };
	    form.action = consumer.yahoo.serviceProvider.accessTokenURL;
	    form.method = "POST";
	    var accessor = { consumerSecret: consumer.yahoo.consumerSecret
	                   , tokenSecret   : oauthParams.tokenSecret};
	    var message = { action: form.action
	                  , method: form.method
	                  , parameters: [
	                  					["oauth_version","1.0"],
                  					    ["oauth_consumer_key", consumer.yahoo.consumerKey],
	                  					["oauth_verifier",verifier],
	                  					["oauth_token",oauthParams.accessToken],
	                  					["oauth_signature_method","HMAC-SHA1"]  
	                  				]    
	                  };
	                  
	    OAuth.setTimestampAndNonce(message);
	    OAuth.SignatureMethod.sign(message, accessor);
	    //alert(outline("message", message));
	    var parameterMap = OAuth.getParameterMap(message.parameters);
	                  
	    var url = form.action+"?"+
	  				"oauth_nonce="+OAuth.getParameter(parameterMap, "oauth_nonce")+
	  				"&oauth_timestamp="+OAuth.getParameter(parameterMap, "oauth_timestamp")+
	  				"&oauth_consumer_key="+ OAuth.getParameter(parameterMap, "oauth_consumer_key")+
	  				"&oauth_signature_method="+consumer.yahoo.serviceProvider.signatureMethod+
	                "&oauth_signature="+OAuth.percentEncode(OAuth.getParameter(parameterMap,'oauth_signature'))+
	  				"&oauth_version="+ OAuth.getParameter(parameterMap, "oauth_version")+
	  				"&oauth_verifier="+ OAuth.getParameter(parameterMap, "oauth_verifier")+
	  				"&oauth_token="+ OAuth.getParameter(parameterMap, "oauth_token");
	                  
	
	   var xhr = new XMLHttpRequest();
		xhr.open(form.method, url, true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onreadystatechange=function()
		  {
		  if (xhr.readyState==4 && xhr.status==200)
		    {
		    	var response = xhr.responseText;  //works like a glove
		    	var oauthArray = response.split("&")
				
				var oValue = new Array();
				var myMap = {};
				for(var i=0; i < oauthArray.length; i++)
				{
					var key = oauthArray[i].split("=");
					myMap[key[0]] = key[1];
				}
				oauthParams.tokenSecret = myMap.oauth_token_secret;
			    oauthParams.accessToken = myMap.oauth_token;
				oauthParams.sessionHandle = myMap.oauth_session_handle;
 				oauthParams.accessExpiraiton = myMap.oauth_expires_in;
				oauthParams.sessionExpiration = myMap.oauth_authorization_expires_in;
				storeOrUpdateOauthParams();
		    }
		    
		  }
		xhr.send();
		var result = xhr.responseText;
	    
	}
    return true;
}

function renewAccessToken()
{
	var verifier = $('#verifier_text').val();
	if (verifier != '')
	{
		var form = {action : "",
					method : "" };
	    form.action = consumer.yahoo.serviceProvider.accessTokenURL;
	    form.method = "POST";
	    var accessor = { consumerSecret: consumer.yahoo.consumerSecret
	                   , tokenSecret   : oauthParams.tokenSecret};
	    var message = { action: form.action
	                  , method: form.method
	                  , parameters: [
	                  					["oauth_version","1.0"],
                  					    ["oauth_consumer_key", consumer.yahoo.consumerKey],
	                  					["oauth_session_handle",oauthParams.sessionHandle],
	                  					["oauth_token",oauthParams.oauth_token],
	                  					["oauth_signature_method","HMAC-SHA1"]  
	                  				]    
	                  };
	                  
	    OAuth.setTimestampAndNonce(message);
	    OAuth.SignatureMethod.sign(message, accessor);
	    //alert(outline("message", message));
	    var parameterMap = OAuth.getParameterMap(message.parameters);
	                  
	    var url = form.action+"?"+
	  				"oauth_nonce="+OAuth.getParameter(parameterMap, "oauth_nonce")+
	  				"&oauth_timestamp="+OAuth.getParameter(parameterMap, "oauth_timestamp")+
	  				"&oauth_consumer_key="+ OAuth.getParameter(parameterMap, "oauth_consumer_key")+
	  				"&oauth_signature_method="+consumer.yahoo.serviceProvider.signatureMethod+
	                "&oauth_signature="+OAuth.percentEncode(OAuth.getParameter(parameterMap,'oauth_signature'))+
	  				"&oauth_version="+ OAuth.getParameter(parameterMap, "oauth_version")+
	  				"&oauth_session_handle="+ OAuth.getParameter(parameterMap, "oauth_session_handle")+
	  				"&oauth_token="+ OAuth.getParameter(parameterMap, "oauth_token");
	                  
	
	   var xhr = new XMLHttpRequest();
		xhr.open(form.method, url, true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onreadystatechange=function()
		  {
		  if (xhr.readyState==4 && xhr.status==200)
		    {
		    	var response = xhr.responseText;  //works like a glove
		    	var oauthArray = response.split("&")
				
				var oValue = new Array();
				var myMap = {};
				for(var i=0; i < oauthArray.length; i++)
				{
					var key = oauthArray[i].split("=");
					myMap[key[0]] = key[1];
				}
				oauthParams.tokenSecret = myMap.oauth_token_secret;
			    oauthParams.accessToken = myMap.oauth_token;
				oauthParams.sessionHandle = myMap.oauth_session_handle;
 				oauthParams.accessExpiraiton = myMap.oauth_expires_in;
				oauthParams.sessionExpiration = myMap.oauth_authorization_expires_in;
				storeOrUpdateOauthParams();
		        
		    }
		    
		  }
		xhr.send();
		var result = xhr.responseText;
	    
	}
    return true;
}

function storeOrUpdateOauthParams()
{
	var transaction = db.transaction(["oauth"], "readwrite");
    var objectStore = transaction.objectStore("oauth");
	var request = objectStore.put(oauthParams);
	request.onsuccess = function(e)
	{
	    console.log('Added/updated oauth');
	};
	request.onerror = function(e)
	{
	    console.log('Error adding: '+e);
	}    
}

function main() 
{
 openDb(function(result){oauthParams=result});

}


document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#yahoo_request').addEventListener('click', getRequestToken);
  document.querySelector('#verify_request').addEventListener('click', getAccessToken);
  main();
});