var PokeListView = function(container, storage) {
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
	var addSinglePokemon = function(pokemon) {
		var node = helper.createPokemonNode(pokemon);
		self.container.append(node);
	};
	var addMultiplePokemon = function(pokemons) {
		for(var pokemon of pokemons) {
			addSinglePokemon(pokemon);
		}
	};
	this.container = container;
	this.storage = storage;
	this.config = {
		viewUrl: "./views/pokedetails.html"
	};
	this.setError = function(errorMessage) {
		self.container.empty();
		self.container.append(helper.createErrorNode({ message: errorMessage }));
		self.container.listview('refresh');
	};
	this.setPokemon = function(pokeList) {
		console.log('pokelistview.setpokemon');
		self.container.empty();
		addMultiplePokemon(pokeList);
		self.container.listview('refresh');
	};
	this.appendPokemon = function(pokeData) {
		if (Array.isArray(pokeData)) {
			// array of pokemon
		}
		else {
			// single pokemon
		}
	};
};