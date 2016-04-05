var CaughtPokemonView = function(caughtPokemonCS, storage) {
	var self = this;
	this.caughtPokemonCS = caughtPokemonCS;
	this.viewUrl = "pokedetails.html";
	this.storage = storage;
	var helper = {
		createPokemonNode: function(pokemon) {
			return $('<li>')
				.append($(`<a data-transition="slidedown" href="${self.viewUrl}">`)
					.html(pokemon.name || "Nameless pokemon :c")
					.on('click', function(evt) { 
						self.storage.pokedexClick = pokemon.url;
					}));
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
		if(!keys.length) {
			self.setError('No pokemon caught yet');
		}
	};
	this.setError = function(message) {
		var html = '<li>' +
				`<p class="my-wrap">${message}</p>` +
			'</li>';
		var container = $(self.caughtPokemonCS);
		container.empty();
		container.append($(html));
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
		container.find('.my-wrap').parent().remove();
		addSinglePokemon(container, pokemon);
		container.filterable().filterable('refresh');
	};
}