var PokeDetailView = function(containerSelector, storage) {
	var self = this;
	var helper = {
		createPokemonNode: function(pokemon) {
			return $('<div>', { class: "ui-content ui-content-a"})
				.append($('<h2>').html(pokemon.name))
				.append($('<img>', { 
					class: "poke-image",
					src: pokemon.sprites.front_default 
				}));
		},
		createErrorNode: function() {
			
		}
	};
	this.containerSelector = containerSelector;
	this.config = {
	};
	this.setError = function(errorMessage, cb) {
		$(self.containerSelector).empty();
		$(self.containerSelector).append(helper.createErrorNode({ message: errorMessage }));
		// $(self.containerSelector).trigger('create');
		if(cb) { cb(); }
	};
	this.setPokemon = function(pokemon, cb) {
		console.log('pokedetailview.setpokemon');
		console.log($(self.containerSelector));
		$(self.containerSelector).empty();
		var node = helper.createPokemonNode(pokemon);
		$(self.containerSelector).append(node);
		if(cb) { cb(); }
	};
}