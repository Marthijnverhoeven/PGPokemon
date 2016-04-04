// -- Table: POKEMON
// [id: INTEGER PRIMARY KEY]
// [name: VARCHAR]
// [url: VARCHAR]

var PokemonRepository = function(db) {
	var self = this;
	var dbTransact = function(transact) {
		console.log(self.database);
		self.database.db.transaction(function(tx) {
			tx.executeSql(`CREATE TABLE IF NOT EXISTS POKEMON (id INTEGER PRIMARY KEY, name VARCHAR, url VARCHAR)`, [], function(){}, function(err) {
				console.error('An error occured when checking if the table exists.');
				console.error(err);
			});
			transact(tx);	
		});
	}
	var deferResolve = function(defer) {
		return function(tx, results) {
			defer.resolve(tx, results);
		}
	}
	var deferReject = function(defer) {
		return function(err) {
			defer.reject(err);
		}
	}
	this.database = db;
	this.createSingle = function(pokemon) {
		return $.Deferred(function(defer) {
			dbTransact(function(tx) {
				tx.executeSql(`INSERT INTO POKEMON (name, url) VALUES (?, ?)`, [pokemon.name, pokemon.url], deferResolve(defer), deferReject(defer));
			});
		});
	}
	this.readAll = function() {
		return $.Deferred(function(defer) {
			dbTransact(function(tx) {
				tx.executeSql(`SELECT * FROM POKEMON`, [], deferResolve(defer), deferReject(defer));
			});
		});
	}
	this.deleteById = function(id) {
		return $.Deferred(function(defer) {
			dbTransact(function(tx) {
				tx.executeSql(`DELETE FROM POKEMON WHERE id = ?`, [id], deferResolve(defer), deferReject(defer));
			});
		});
	}
}