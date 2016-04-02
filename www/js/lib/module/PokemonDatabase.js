var PokemonDatabase = function(config) {
	var self = this;
	this.config = config || {
		name: 'PokemonDatabase',
		version: '1.0',
		description: 'Caught pokemon storage',
		size: 2 * 1024 * 1024
	};
	this.db = openDatabase(self.config.name, self.config.version, self.config.description, self.config.size);
	this.execute = self.db.transaction;
}