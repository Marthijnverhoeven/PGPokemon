var CaughtPokemonView = function(caughtPokemonCS, storage) {
	var self = this;
	this.caughtPokemonCS = caughtPokemonCS;
	this.viewUrl = "pokedetails.html";
	this.storage = storage;
	var helper = {
		createPokemonNode: function(pokemon) {
			return $('<li>')
				.append($('<a>', { href: self.viewUrl, title: "dotaa" })
					.html(pokemon.name || "Nameless pokemon :c")
					.on('click', function(evt) { 
						self.storage.pokedexClick = pokemon.url;
					}));
		},
		createErrorNode: function(error) {
			return $('<li>').html(error.message || "internal error");
		}
	};
	var addSinglePokemon = function(container, pokemon) {
		var node = helper.createPokemonNode(pokemon);
		container.append(node);
	};
	var addMultiplePokemon = function(container, pokemons) {
		var keys = Object.keys(pokemons);
		for(var key of keys) {			
			addSinglePokemon(container, pokemons[key]);
		}
	};
	this.setError = function(errorMessage) {
		var container = $(self.caughtPokemonCS);
		container.empty();
		container.append(helper.createErrorNode({ message: errorMessage }));
		container.filterable().filterable('refresh');
	};
	this.setPokemon = function(pokeList) {
		var container = $(self.caughtPokemonCS);
		container.empty();
		addMultiplePokemon(container, pokeList);
		container.filterable().filterable('refresh');
	};
	this.appendPokemon = function(pokemon) {
		var container = $(self.caughtPokemonCS);
		addSinglePokemon(container, pokemon);
		container.filterable().filterable('refresh');
	};
}