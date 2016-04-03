NearbyPokemonView = function(nearbyPokemonCS) {
	var self = this;
	var createJQueryNode = function(pokemon, cache, callback) {
		var html = `<li>` +
			`<div class="ui-grid-solo">` +
				`<h1>${pokemon.name}</h1>` +
			`</div>` +
			`<div class="ui-grid-a">` +
				`<a href="geo:${cache.coords.lat},${cache.coords.long}" class="ui-block-a ui-btn ui-corner-all">Maps</a>` +
				`<button type="button" class="ui-block-b ui-btn ui-corner-all">Vangen</button>` +
			`</div>` +
		`</li>`;
		var jQueryNode = $(html);
		jQueryNode.find('button').on('click', function(evt) {
			callback(pokemon, cache);
		});
		return jQueryNode;
	}
	var appendCaches = function(container, pokemons, caches, callback) {
		for(var i =0; i < caches.length; i++) {
			var node = createJQueryNode(pokemons[i], caches[i], callback);
			container.append(node);
		}
	}
	this.nearbyPokemonCS = nearbyPokemonCS;
	this.setCaches = function(pokemons, caches, callback) {
		var container = $(self.nearbyPokemonCS);
		container.empty();
		appendCaches(container, pokemons, caches, callback);
		container.listview('refresh');
	}
}