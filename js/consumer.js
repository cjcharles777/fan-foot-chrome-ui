/**
 * @author Cedric
 */

var consumer = {};
consumer.yahoo =
{ consumerKey   : "dj0yJmk9WE00M1lHdW45b0x1JmQ9WVdrOWMzcFZRVVZFTXpnbWNHbzlOamN3TWpnd05qSS0mcz1jb25zdW1lcnNlY3JldCZ4PTBl"
, consumerSecret: "d528d7612e27de4f2a9fe1df6b31556b3ed97190"
, serviceProvider:
  { signatureMethod     : "HMAC-SHA1"
  , requestTokenURL     : "https://api.login.yahoo.com/oauth/v2/get_request_token"
  , userAuthorizationURL: "https://api.login.yahoo.com/oauth/v2/request_auth"
  , accessTokenURL      : "https://api.login.yahoo.com/oauth/v2/get_token"
  , echoURL             : "http://localhost/oauth-provider/echo"
  }
};


function signForm() {
	var form = {action : "",
				method : "" };
    form.action = consumer.yahoo.serviceProvider.requestTokenURL;
    form.method = "POST";
    var accessor = { consumerSecret: consumer.yahoo.consumerSecret
                   , tokenSecret   : consumer.yahoo.tokenSecret};
    var message = { action: form.action
                  , method: form.method
                  , parameters: []    
                  };
                  
    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
    //alert(outline("message", message));
    var parameterMap = OAuth.getParameterMap(message.parameters);
                  
    var url = "https://api.login.yahoo.com/oauth/v2/"+
  				"get_request_token?oauth_nonce="+OAuth.getParameter(parameterMap, "oauth_nonce")+
  				"&oauth_timestamp="+OAuth.getParameter(parameterMap, "oauth_timestamp")+
  				"&oauth_consumer_key="+ consumer.yahoo.consumerSecret+
  				"&oauth_signature_method="+consumer.yahoo.serviceProvider.signatureMethod+
                "&oauth_signature="+OAuth.percentEncode(OAuth.getParameter(parameterMap,'oauth_signature'))+
  				"&oauth_version=1.0";
                  

   var xhr = new XMLHttpRequest();
	xhr.open(form.method, url, true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.send();
	var result = xhr.responseText;
    //$.ajax("http://api.twitter.com/1/statuses/home_timeline.json?callback=?");
    return true;
}
function main() {
  // Initialization work goes here.
}
function clickHandler(e) {
  setTimeout(signForm, 1000);
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('button').addEventListener('click', clickHandler);
  main();
});