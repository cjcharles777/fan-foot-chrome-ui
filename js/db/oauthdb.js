html5rocks.indexedDB.db = null;

html5rocks.indexedDB.open = function() {
  var request = indexedDB.open("fantasyfootballdb");

  request.onsuccess = function(e) 
  {
     var v = "1.0";
    html5rocks.indexedDB.db = e.target.result;
    var db = html5rocks.indexedDB.db;
    // We can only create Object stores in a setVersion transaction;
    if (v!= db.version) {
      var setVrequest = db.setVersion(v);

      // onsuccess is the only place we can create Object Stores
      setVrequest.onfailure = html5rocks.indexedDB.onerror;
      setVrequest.onupgradeneeded = function(e) {
        var store = db.createObjectStore("oauth",
          {keyPath: "timeStamp"});
          
        store.createIndex("oauth_token", "oauth_token", { unique: false });
        e.target.transaction.oncomplete = function() {
          html5rocks.indexedDB.getAllTodoItems();
        };
      };
    } else {
      request.transaction.oncomplete = function() {
        html5rocks.indexedDB.getAllTodoItems();
      };
    }
  };

  request.onfailure = html5rocks.indexedDB.onerror;
};