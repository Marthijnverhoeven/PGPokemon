function onReadyTransaction( ){
	console.log( 'Transaction completed' )
}
function onSuccessExecuteSql( tx, results ){
	console.log( 'Execute SQL completed' )
}
function onError( err ){
	console.error( err )
}
function displayResults( tx, results ){
	
	if(results.rows.length == 0) {
		alert("No records found");
		return false;
	}
	
	var row = "";
	for(var i=0; i<results.rows.length; i++) {
		row += results.rows.item(i).rules + "<br/>";
	}
	document.body.innerHTML = row
}

var db = window.openDatabase("myDatabase", "1.0", "My WebSQL test database", 5*1024*1024);
if(!db) {
	// Test your DB was created
	alert('Your DB was not created this time');
	return false
}

// https://gist.github.com/andyj/1599544

db.transaction(
	function(tx){
		// Execute the SQL via a usually anonymous function 
		// tx.executeSql( SQL string, arrary of arguments, success callback function, failure callback function)
		// To keep it simple I've added to functions below called onSuccessExecuteSql() and onFailureExecuteSql()
		// to be used in the callbacks
		tx.executeSql(
			"CREATE TABLE IF NOT EXISTS fightclub (id INTEGER PRIMARY KEY AUTOINCREMENT, rules TEXT)",
			[],
			onSuccessExecuteSql,
			onError
		)
	},
	onError,
	onReadyTransaction
)