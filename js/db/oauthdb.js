//(function () {
  var COMPAT_ENVS = [
    ['Firefox', ">= 16.0"],
    ['Google Chrome',
     ">= 24.0 (you may need to get Google Chrome Canary), NO Blob storage support"]
  ];
  var compat = $('#compat');
  compat.empty();
  compat.append('<ul id="compat-list"></ul>');
  COMPAT_ENVS.forEach(function(val, idx, array) {
    $('#compat-list').append('<li>' + val[0] + ': ' + val[1] + '</li>');
  });
 
  const DB_NAME = 'fantasyfootballdb';
  const DB_VERSION = 5; // Use a long long for this value (don't use a float)
  const DB_STORE_NAME_OAUTH = 'oauth';
 
  var db;
 
  // Used to keep track of which view is displayed to avoid to uselessly reload it
  var current_view_pub_key;
 
function openDb() {
	
    console.log("openDb ...");
    var req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onsuccess = function (evt) {
      // Better use "this" than "req" to get the result to avoid problems with
      // garbage collection.
      // db = req.result;
      db = this.result;
      console.log("openDb DONE");
    };
    req.onerror = function (evt) {
      console.error("openDb:", evt.target.errorCode);
    };
 
    req.onupgradeneeded = function (evt) {
      console.log("openDb.onupgradeneeded");
      console.log(" Does "+ DB_STORE_NAME_OAUTH + " exsist? :" +(typeof objectStore === "undefined"))
        var objectStore = evt.currentTarget.transaction.objectStore(DB_STORE_NAME_OAUTH);
        if(!(typeof objectStore === "undefined"))
        {
        	 evt.currentTarget.result.deleteObjectStore(DB_STORE_NAME_OAUTH);
        }
     
      var store = evt.currentTarget.result.createObjectStore(
        DB_STORE_NAME_OAUTH, { keyPath: 'name' });
        store.createIndex('oauth_token', 'oauth_token', { unique: true });
    };	
/**
  var request = indexedDB.open("fantasyfootballdb");

  request.onsuccess = function(e) 
  {
     var v = 1;
   db = this.result;
    // We can only create Object stores in a setVersion transaction;
      var setVrequest = db.setVersion(v);
	};
      // onsuccess is the only place we can create Object Stores
      //setVrequest.onfailure = html5rocks.indexedDB.onerror;
      request.onupgradeneeded = function(e) 
      {
      	console.log("openDb.onupgradeneeded");
        var store = db.createObjectStore("oauth",{keyPath: "timeStamp"});
          
        store.createIndex("oauth_token", "oauth_token", { unique: false });
        e.target.transaction.oncomplete = function() {
          html5rocks.indexedDB.getAllTodoItems();
        };
      };
    
**/  
}
//})(); // Immediately-Invoked Function Expression (IIFE)