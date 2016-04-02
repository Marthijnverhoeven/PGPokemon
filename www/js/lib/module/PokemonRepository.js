// -- Table: POKEMON
// [id: INTEGER PRIMARY KEY]
// [name: VARCHAR]
// [url: VARCHAR]

var PokemonRepository = function(db) {
	var self = this;
	var dbTransact = function(transact) {
		self.database.execute(function(tx) {
			self.db.transaction(function(tx) {
				tx.executeSql(`CREATE TABLE IF NOT EXISTS POKEMON (id INTEGER PRIMARY KEY, name VARCHAR, url VARCHAR)`, function(){}, function(err) {
					console.error('An error occured when checking if the table exists.');
					console.error(err);
				});
				transact(tx);	
			});
		});
	}
	this.database = db;
	this.config = config;
	this.createSingle = function(pokemon, onSuccess, onError) {
		dbTransact(function(tx) {
			tx.executeSql(`INSERT INTO POKEMON (name, url) VALUES (?, ?)`, [pokemon.name, pokemon.url], onSuccess, onError);
		});
	}
	this.readAll = function(onSuccess, onError) {
		dbTransact(function(tx) {
			tx.executeSql(`SELECT * FROM POKEMON`, [], onSuccess, onError);
		});
	}
	this.deleteById = function(id, onSuccess, onError) {
		dbTransact(function(tx) {
			tx.executeSql(`DELETE FROM POKEMON WHERE id = ?`, [id], onSuccess, onError);
		});
	}
}