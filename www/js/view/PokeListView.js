var PokeListView = function(containerSelector, storage) {
	var self = this;
	var helper = {
		createPokemonNode: function(pokemon) {
			return $('<li>').append($('<a>', {
				href: self.config.viewUrl,
				title: "dotaa"
			}).html(pokemon.name || "Nameless pokemon :c")).on('click', function(evt) {
				self.storage.pokedexClick = pokemon.url;
			});
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
		for(var pokemon of pokemons) {
			addSinglePokemon(container, pokemon);
		}
	};
	this.containerSelector = containerSelector;
	this.storage = storage;
	this.config = {
		viewUrl: "./views/pokedetails.html"
	};
	this.setError = function(errorMessage) {
		var container = $(self.containerSelector);
		container.empty();
		container.append(helper.createErrorNode({ message: errorMessage }));
		container.listview('refresh');
	};
	this.setPokemon = function(pokeList) {
		var container = $(self.containerSelector);
		container.empty();
		addMultiplePokemon(container, pokeList);
		container.listview('refresh');
	};
	this.appendPokemon = function(pokeData) {
		console.error('no implementerino');
		return false;
		// if (Array.isArray(pokeData)) {
		// 	// array of pokemon
		// }
		// else {
		// 	// single pokemon
		// }
	};
};