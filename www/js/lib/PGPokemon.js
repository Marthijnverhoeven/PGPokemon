var MyApp = function(config) {
	console.log('app is running');
	// --- Initializion
	var self = this;
	this.config = config;
	var detailPromise = null;
	var listPromise = null;
	
	// MANAGER
	var router = new Router();
	var cacheManager = new CacheManager(self.config.cacheManager);
	var themeManager = new ThemeManager(self.config.themeManager);
	var geoLocation = new GeoLocation(self.config.plugins.geolocation, self.config.geolocation);
	
	// DAL
	// var pokeApi = new PokeApi(self.config.pokeApi, $.ajax);
	var pokeApi = new PokeApi(self.config.pokeApi, function(ajaxParams) {
		console.log('ajax call started');
		console.log(ajaxParams);
		return $.Deferred(function (defer){
			setTimeout(function() {
				if(ajaxParams.url.startsWith('http://pokeapi.co/api/v2/pokemon/')) {
					console.log('pokedetail');
					defer.resolve({ name: "bobbelsaur", sprites: { front_default: "http://img12.deviantart.net/571d/i/2013/157/9/5/bobbelur_by_isa_san-dy6g8h.jpg" } });
				}
				else if(ajaxParams.url.startsWith('http://pokeapi.co/api/v2/pokemon')) {
					console.log('pokelist');
					var data = { results: (function(){
						var arr = [];
						for(var i = 0; i < 20; i++) {
							arr.push({ name: "bobbelsaur", url: "http://pokeapi.co/api/v2/pokemon/1" });
						}
						return arr;
					}())};
					data.next = 'http://pokeapi.co/api/v2/pokemon?';
					data.count = 20;
					defer.resolve(data);
				}
				else {
					console.error(new Error('lmao what the fuck are you doing!'));
					defer.reject({ status: 500, statusText: "500 Internal Server Error" });
				}
			}, 1000)
		}).promise();
	});
	var pokemonDatabase = new PokemonDatabase(self.config.database);
	var pokemonRepository = new PokemonRepository(pokemonDatabase);
	
	// VIEW
	var pokeDetailView = new PokeDetailView(self.config.containerSelectors.pokedexdetailContainerSelector);
	var pokeListView = new PokeListView(self.config.containerSelectors.pokedexlistContainer, self.config.storage);
	var settingsView = new SettingsView(self.config.containerSelectors.settingCacheRadius, self.config.containerSelectors.settingCacheCount, self.config.storage);
	var nearbyPokemonView = new NearbyPokemonView(self.config.containerSelectors.nearbyPokemon);
		
	// --- Methods	
	this.onDeviceReady = function() {
		console.log('deviceready-event fired.');
		self.bindJQueryMobileEvents();
		
		// pokelist init
		themeManager.loadTheme();
		listPromise = pokeApi.pokemon.read({});
		if(listPromise) {
			$.mobile.loading("show", {
				text: "Loading...",
				textVisible: true,
				theme: "a",
				html: ""
			});
			listPromise.done(function(data) {
				pokeListView.setPokemon(data.results);
				listPromise = pokeApi.pokemon.readNext(data);
			}).fail(function(err) {
				pokeListView.setError(err);
				listPromise = null;
			}).always(function() {
				$.mobile.loading("hide");
			});
		}
		// nearby pokemon init
		var countPromise = pokeApi.pokemon.count();
		geoLocation.getCurrentLocation(function(pos) {
			console.log(pos);
			countPromise.done(function(count) {
				console.log(`asdasdasd`);
				console.log(count);
				cacheManager.initialize(pos, count);
			});
		}, function(err) {
			console.error(err);
		});
		cacheManager.onInitialization(function(caches) {
			console.log(caches);
			var cacheLength = Object.keys(caches).length; 
			var pokemon = [];
			for(var key in caches) {
				var tempPromise = pokeApi.pokemon.readById(caches[key].pokeId);
				tempPromise.done(function(data) {
					pokemon.push(data);
					if(pokemon.length === cacheLength) {
						nearbyPokemonView.setCaches(pokemon, caches, function(pokemon, cache) {
							console.log('VANGEN! BITCH');
							console.log(pokemon);
							console.log(cache);
						});
					}
				});
			}
		});
	}
	this.bindJQueryMobileEvents = function() {
		$(document).on('swipeleft', router.onSwipeLeftHandler(self.onSwipeLeft));
		$(document).on('scrollstop', router.onScrollStopHandler(self.onScrollStop));
		$(document).on('pagecontainerbeforeload', router.onPCBeforeLoadHandler(self.onPCBeforeLoad));
		$(document).on('pagecontainershow', router.onPCShowHandler(self.onPCShow));
	}
	this.onSwipeLeft = {
		"index": function() {
			console.log('swipeleft index');
			geoLocation.getCurrentLocation(function(pos) {
				console.log(pos);
			}, function(err) {
				alert(`${err.message} :c`);
			});
		},
		"pokedetails": function() {
			console.log('swipeleft pokedetails.');
		},
		"settings": function() {
			console.log('swipeleft settings.');
		}
	};
	this.onScrollStop = {
		"index": function() {
			console.log('stop scrolling');
			pokeListView.onScrollStopHandler(function() {
				if(listPromise) {
					$.mobile.loading("show", {
						text: "Loading...",
						textVisible: true,
						theme: "a",
						html: ""
					});
					listPromise.done(function(data) {
						pokeListView.appendPokemon(data.results)
						listPromise = pokeApi.pokemon.readNext(data);
					}).fail(function(err) {
						pokeListView.setError(err);
						listPromise = null;
					}).always(function() {
						$.mobile.loading("hide");
					});
				}
			});
		}
	}
	this.onPCBeforeLoad = {
		"index": function() {
			console.log('beforeload index');
		},
		"pokedetails": function() {
			console.log('beforeload pokedetails.');
			detailPromise = pokeApi.pokemon.readByUrl(self.config.storage.pokedexClick);
		},
		"pokelistview": function() {
			console.log('beforeload pokelist.');
		},
		"settings": function() {
			console.log('beforeload settings.');
		}
	};
	this.onPCShow = {
		"index": function() {
			console.log('showing index');
		},
		"pokedetails": function() {
			console.log('showing pokedetails.');
			if(detailPromise) {
				$.mobile.loading("show", {
					text: "Loading...",
					textVisible: true,
					theme: "a",
					html: ""
				});
				detailPromise.done(function(data){
					pokeDetailView.setPokemon(data);
				}).fail(function(err) {
					pokeDetailView.setError(err);
				}).always(function() {
					$.mobile.loading("hide");
					detailPromise = null;
				});
			}
		},
		"pokelistview": function() {
			console.log('showing pokelist.');
		},
		"settings": function() {
			console.log('showing settings.');
			settingsView.addThemeControls(themeManager.currentTheme(), themeManager.getThemes(), function(sender, evt) {
				console.log(sender.val());
				themeManager.currentTheme(sender.val());
			});
			settingsView.addCacheControls(function(sender, evt) {
				console.log(sender.val());
				cacheManager.cacheRadius(sender.val());
			}, function(sender, evt) {
				console.log(sender.val());
				cacheManager.cacheCount(sender.val());
			});
			settingsView.setCacheValues(cacheManager.cacheRadius(), cacheManager.cacheCount());
			settingsView.setRadioValues(themeManager.currentTheme());
		}
	};
}
