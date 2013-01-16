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

consumer.signForm =
function signForm(form, etc) {
    form.action = etc.URL.value;
    var accessor = { consumerSecret: consumer.yahoo.consumerSecret.value
                   , tokenSecret   : consumer.yahoo.tokenSecret.value};
    var message = { action: form.action
                  , method: form.method
                  , parameters: []
                  };
    for (var e = 0; e < form.elements.length; ++e) {
        var input = form.elements[e];
        if (input.name != null && input.name != "" && input.value != null
            && (!(input.type == "checkbox" || input.type == "radio") || input.checked))
        {
            message.parameters.push([input.name, input.value]);
        }
    }
    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
    //alert(outline("message", message));
    var parameterMap = OAuth.getParameterMap(message.parameters);
    for (var p in parameterMap) {
        if (p.substring(0, 6) == "oauth_"
         && form[p] != null && form[p].name != null && form[p].name != "")
        {
            form[p].value = parameterMap[p];
        }
    }
    return true;
};