var PokeDetailView = function(containerSelector) {
	var self = this;
	var helper = {
		alpha: ["a", "b"],
		createLinkHTML: function(id) {
			return `<div class="ui-body ui-body-a ui-corner-all">` +
					`<a href="http://www.pokemon.com/us/pokedex/${id}" class="ui-btn ui-corner-all">Pokedex entry</a>` +
				`</div>`;
		},
		createTypeHTML: function(types) {
			var self = this;
			var typeHTML = '';
			for(var i = 0; i < types.length; i++) {
				typeHTML += `<div class="ui-block-${self.alpha[i]}"><div class="poke-type ${types[i].type}"></div></div>`;
			}
			return `<div class="ui-body ui-body-a ui-grid-a ui-corner-all">` + 
					typeHTML + 
				`</div>`; 
		},
		createPokemonNode: function(pokemon) {
			var self = this;
			var typeAppender = self.createTypeHTML(pokemon.types);
			var linkAppender = self.createLinkHTML(pokemon.id);
			console.log(typeAppender);
			var html = `<div class="ui-body ui-body-a">` +
					`<h2>${pokemon.name}</h2>` +
					`<div class="ui-body ui-body-a ui-corner-all">` +
						`<img class="poke-image" src="${pokemon.sprites.front_default}" />` +
					`</div>` +
					typeAppender +
					linkAppender +
				`</div>`;
			return $(html);
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