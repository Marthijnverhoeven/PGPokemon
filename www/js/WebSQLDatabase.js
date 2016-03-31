var Database = function(config) {
	var self = this;
	this.config = config || {
		name: 'pokemon',
		version: '1.0',
		description: 'Caught pokemon storage',
		size: 2 * 1024 * 1024
	};
	this.db = openDatabase(self.config.name, self.config.version, self.config.description, self.config.size);
	this.execute = self.db.transaction;
}

var PokemonRepository = function(database) {
	var self = this;
	this.database = database;
	this.create = function(pokemon) {
		self.database.transaction(function(tx) {
			tx.executeSql('CREATE TABLE IF NOT EXISTS POKEMON (id INTEGER PRIMARY KEY, pokemonId INTEGER, name VARCHAR)');
			tx.executeSql(`INSERT INTO foo (pokemonId, name) VALUES (${pokemon.id}, ${pokemon.name})`);
		});
	}
}