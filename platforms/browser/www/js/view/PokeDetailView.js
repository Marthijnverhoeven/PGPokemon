var PokeDetailView = function(containerSelector) {
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
	this.setError = function(errorMessage, cb) {
		var container = $(self.containerSelector);
		container.empty();
		container.append(helper.createErrorNode({ message: errorMessage }));
	};
	this.setPokemon = function(pokemon, cb) {
		var container = $(self.containerSelector);
		container.empty();
		var node = {}
		try {
			node = helper.createPokemonNode(pokemon);
		}
		catch (err){
			console.error(err);
			node = createErrorNode(new Error('pokemon could no be retrieved'));
		}
		container.append(node);
	};
}