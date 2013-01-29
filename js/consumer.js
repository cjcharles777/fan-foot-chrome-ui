/**
 * @author Cedric
 */

var consumer = {};
consumer.yahoo =
{ consumerKey   : "dj0yJmk9MWNNeHFyMVZneFdFJmQ9WVdrOVNqVm9hSGQ2TXpZbWNHbzlNVEU0TURVM09UYzJNZy0tJnM9Y29uc3VtZXJzZWNyZXQmeD0wYQ--"
, consumerSecret: "9e1bb2700b79696770c9c931b182bf12260eb4e6"
, serviceProvider:
  { signatureMethod     : "HMAC-SHA1"
  , requestTokenURL     : "https://api.login.yahoo.com/oauth/v2/get_request_token"
  , userAuthorizationURL: "https://api.login.yahoo.com/oauth/v2/request_auth"
  , accessTokenURL      : "https://api.login.yahoo.com/oauth/v2/get_token"
  , echoURL             : "http://localhost/oauth-provider/echo"
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
                  
    var url = "https://api.login.yahoo.com/oauth/v2/"+
  				"get_request_token?oauth_nonce="+OAuth.getParameter(parameterMap, "oauth_nonce")+
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
			var transaction = db.transaction(["oauth"], "readwrite");
			var objectStore = transaction.objectStore("oauth");
			 var request = objectStore.add(myMap);
			window.open(OAuth.decodePercent(myMap.xoauth_request_auth_url),
							 "OauthAuthorizationPage", 
							 "resizable=yes,scrollbars=yes,status=yes");
	    }
	    
	  }
	xhr.send();
	var result = xhr.responseText;
    //$.ajax("http://api.twitter.com/1/statuses/home_timeline.json?callback=?");
    return true;
}
function getAccessToken()
{
	
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
                  
    var url = "https://api.login.yahoo.com/oauth/v2/"+
  				"get_request_token?oauth_nonce="+OAuth.getParameter(parameterMap, "oauth_nonce")+
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
			window.open(    OAuth.decodePercent(myMap.xoauth_request_auth_url),
							 "OauthAuthorizationPage", 
							 "resizable=yes,scrollbars=yes,status=yes");
	    }
	    
	  }
	xhr.send();
	var result = xhr.responseText;
    //$.ajax("http://api.twitter.com/1/statuses/home_timeline.json?callback=?");
    return true;
}
function main() 
{
 openDb();
}
function clickHandler(e) {
 getRequestToken();
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('button').addEventListener('click', clickHandler);
  main();
});