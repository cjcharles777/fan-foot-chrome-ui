db = null;

function openDb() {
  var request = indexedDB.open("fantasyfootballdb");

  request.onsuccess = function(e) 
  {
     var v = "1.0";
   db = e.target.result;
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
    }
  };

  
};