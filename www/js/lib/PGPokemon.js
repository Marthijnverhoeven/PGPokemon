var Application = function(config) {
	console.log('app is running');
	// --- Initializion
	var self = this;
	this.config = config;
	var promise = {};
	
	// MANAGER
	var router = new Router();
	var cacheManager = new CacheManager(self.config.cacheManager);
	var themeManager = new ThemeManager(self.config.themeManager);
	var geoLocation = new GeoLocation(self.config.plugins.geolocation);
	
	// DAL
	var pokeApi = new PokeApi(self.config.pokeApi, function(ajaxParams) {
		console.log('ajax call started');
		return $.Deferred(function (defer){
			setTimeout(function() {
				if(ajaxParams.url.startsWith('http://pokeapi.co/api/v2/pokemon?')) {
					console.log('pokelist');
					defer.resolve({ results: [{ name: "bobbelsaur", url: "http://pokeapi.co/api/v2/pokemon/1" }] });
				}
				else if(ajaxParams.url.startsWith('http://pokeapi.co/api/v2/pokemon/')) {
					console.log('pokedetail');
					defer.resolve({ name: "bobbelsaur", sprites: { front_default: "http://img12.deviantart.net/571d/i/2013/157/9/5/bobbelur_by_isa_san-dy6g8h.jpg" } });
				}
				else {
					console.error(new Error('lmao what the fuck are you doing!'));
					defer.reject({ status: 500, statusText: "500 Internal Server Error" });
				}
			}, 2000)
		}).promise();
	});
	var pokemonDatabase = new PokemonDatabase(self.config.database);
	var pokemonRepository = new PokemonRepository(pokemonDatabase);
	
	// VIEW
	var pokeDetailView = new PokeDetailView(self.config.containerSelectors.pokedexdetailContainerSelector);
	var pokeListView = new PokeListView(self.config.containerSelectors.pokedexlistContainer, self.config.storage);
	var settingsView = new SettingsView(self.config.containerSelectors.settingsContainerSelector, self.config.storage);
	
	// --- Methods
	this.onDeviceReady = function() {
		console.log('deviceready-event fired.');
		self.bindJQueryMobileEvents();
		
		promise = pokeApi.pokemon.read({});
		$.mobile.loading("show", {
			text: "Loading...",
			textVisible: true,
			theme: "a",
			html: ""
		});
		promise.done(function(data) {
			pokeListView.setPokemon(data.results)
			$.mobile.loading("hide");
			promise = {};
		});
	}
	this.bindJQueryMobileEvents = function() {
		$(document).on('swipeleft', router.onSwipeLeftHandler(self.onSwipeLeft));
		$(document).on('pagecontainerbeforeload', router.onPCBeforeLoadHandler(self.onPCBeforeLoad));
		$(document).on('pagecontainershow', router.onPCShowHandler(self.onPCShow));
	}
	this.onSwipeLeft = {
		"/index": function() {
			console.log('swipeleft index');
		},
		"/views/pokedetails": function() {
			console.log('swipeleft pokedetails.');
		},
		"/views/settings": function() {
			console.log('swipeleft settings.');
		}
	};
	this.onPCBeforeLoad = {
		"/index": function() {
			console.log('beforeload index');
		},
		"/views/pokedetails": function() {
			console.log('beforeload pokedetails.');
			promise = pokeApi.pokemon.readByUrl(self.config.storage.pokedexClick);
		},
		"/views/pokelistview": function() {
			console.log('beforeload pokelist.');
		},
		"/views/settings": function() {
			console.log('beforeload settings.');
		}
	};
	this.onPCShow = {
		"/index": function() {
			console.log('showing index');
		},
		"/views/pokedetails": function() {
			console.log('showing pokedetails.');
			$.mobile.loading("show", {
				text: "Loading...",
				textVisible: true,
				theme: "a",
				html: ""
			});
			promise.done(function(data){
				pokeDetailView.setPokemon(data);
				$.mobile.loading("hide");
				promise = {};
			});
		},
		"/views/pokelistview": function() {
			console.log('showing pokelist.');
		},
		"/views/settings": function() {
			console.log('showing settings.');
		}
	};
}
