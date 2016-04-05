var PokeListView = function(containerSelector, storage) {
	var self = this;
	var helper = {
		createPokemonNode: function(pokemon) {
			return $('<li>')
				.append($('<a>', { href: self.config.viewUrl })
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
		for(var pokemon of pokemons) {
			addSinglePokemon(container, pokemon);
		}
	};
	this.containerSelector = containerSelector;
	this.storage = storage;
	this.config = {
		viewUrl: "pokedetails.html"
	};
	this.setError = function(errorMessage) {
		var container = $(self.containerSelector);
		container.empty();
		container.append(helper.createErrorNode({ message: errorMessage }));
		container.filterable().filterable('refresh');
	};
	this.setPokemon = function(pokeList) {
		var container = $(self.containerSelector);
		container.empty();
		addMultiplePokemon(container, pokeList);
		container.filterable().filterable('refresh');
	};
	this.appendPokemon = function(pokeData) {
		var container = $(self.containerSelector);
		addMultiplePokemon(container, pokeData);
		container.filterable().filterable('refresh');
	};
	this.onScrollStopHandler = function(callback) { 
		var activePage = $.mobile.pageContainer.pagecontainer("getActivePage"),
			screenHeight = $.mobile.getScreenHeight(), // get device height
			contentHeight = $("#pokedex").outerHeight(), // get height of pokelist container
			scrolled = $(window).scrollTop(), // get current scroll value
			header = $(".ui-header", activePage).hasClass("ui-header-fixed") ? $(".ui-header", activePage).outerHeight() - 1 : $(".ui-header", activePage).outerHeight(),
			footer = $(".ui-footer", activePage).hasClass("ui-footer-fixed") ? $(".ui-footer", activePage).outerHeight() - 1 : $(".ui-footer", activePage).outerHeight(),
			scrollEnd = contentHeight - screenHeight + header + footer; // calculate maximum scroll value within pokelist container
		if (scrolled >= scrollEnd) { // true, when at the bottom of pokelist container
			callback();
		}
	}
};