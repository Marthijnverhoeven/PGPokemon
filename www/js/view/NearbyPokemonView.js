var NearbyPokemonView = function(nearbyPokemonCS) {
	var self = this;
	var viewUrl = 'catch.html';
	var createJQueryNode = function(pokemon, cache, callback) {
		var html = `<li>` +
			`<div class="ui-grid-solo">` +
				`<h1>${pokemon.name}</h1>` +
			`</div>` +
			`<div class="ui-grid-a">` +
				`<a href="geo:${cache.coords.lat},${cache.coords.long}?q=${cache.coords.lat},${cache.coords.long}" class="ui-block-a ui-btn ui-corner-all">Maps</a>` +
				`<button type="button" class="ui-block-b ui-btn ui-corner-all">Vangen</button>` +
			`</div>` +
		`</li>`;
		var jQueryNode = $(html);
		var button = jQueryNode.find('button')
		button.on('click', function(evt) {
			callback(pokemon, cache);
			$(":mobile-pagecontainer").pagecontainer('change', viewUrl);
		});
		if(!cache.catchable) {
			button.attr('disabled', 'disabled');
		}
		return jQueryNode;
	}
	var createInitialNode = function(pos) {
		return $(`<a href="geo:${pos.coords.latitude},${pos.coords.longitude}?q=${pos.coords.latitude},${pos.coords.longitude}" class="ui-btn ui-corner-all">Mijn locatie</a>`);
	}
	var appendCaches = function(container, pokemons, caches, callback) {
		for(var i =0; i < caches.length; i++) {
			var node = createJQueryNode(pokemons[i], caches[i], callback);
			container.append(node);
		}
	}
	var getSorted = function(a, b) {
		return a > b
			? { max: a, min: b }
			: { max: b, min: a };
	}
	var calcCacheDistance = function(pos, cache) {
		cache.catchable = true;
		var distance = 1; // = ??? meter
		var sortedLong = getSorted(pos.coords.longitude, cache.coords.long);
		var sortedLat = getSorted(pos.coords.latitude, cache.coords.lat); 
		if(sortedLat.max - sortedLat.min > distance || sortedLong.max - sortedLong.min > distance) {
			cache.catchable = false;
		}
	}
	this.nearbyPokemonCS = nearbyPokemonCS;
	this.setCaches = function(pos, pokemons, caches, callback) {
		for(var cache of caches) {
			calcCacheDistance(pos, cache);
		}
		var container = $(self.nearbyPokemonCS);
		var initialNode = createInitialNode(pos);
		container.empty();
		container.append(initialNode);
		appendCaches(container, pokemons, caches, callback);
		container.listview('refresh');
	}
	this.setError = function(message) {
		var html = '<li>' +
				`<p class="my-wrap">${message}</p>` +
			'</li>';
		var container = $(self.nearbyPokemonCS);
		container.empty();
		container.append($(html));
		container.listview('refresh');
	}
}