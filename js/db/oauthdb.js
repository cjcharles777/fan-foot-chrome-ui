db = null;

function openDb() {
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
    


  
};