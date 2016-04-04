var MyApp = function(config) {
	console.log('app is running');
	// --- Initializion
	var self = this;
	this.config = config;
	var detailPromise = null;
	var listPromise = null;
	var currentPokemonDetail = null;
	var pokeCount = null;
	
	// MANAGER
	var router = new Router();
	var cacheManager = new CacheManager(self.config.cacheManager);
	var themeManager = new ThemeManager(self.config.themeManager);
	var geoLocation = new GeoLocation(self.config.plugins.geolocation, self.config.geolocation);
	
	// DAL
	var pokeApi = new PokeApi(self.config.pokeApi, $.ajax);
	// var pokeApi = new PokeApi(self.config.pokeApi, function(ajaxParams) {
	// 	console.log('ajax call started');
	// 	console.log(ajaxParams);
	// 	return $.Deferred(function (defer){
	// 		setTimeout(function() {
	// 			if(ajaxParams.url.startsWith('http://pokeapi.co/api/v2/pokemon/1')) {
	// 				console.log('pokedetail');
	// 				defer.resolve({ url: 'http://pokeapi.co/api/v2/pokemon/1', id: 1, name: "bobbelsaur", sprites: { front_default: "http://img12.deviantart.net/571d/i/2013/157/9/5/bobbelur_by_isa_san-dy6g8h.jpg" } });
	// 			}
	// 			else if(ajaxParams.url.startsWith('http://pokeapi.co/api/v2/pokemon/2')) {
	// 				console.log('pokedetail');
	// 				defer.resolve({ url: 'http://pokeapi.co/api/v2/pokemon/2', id: 2, name: "charredmander", sprites: { front_default: "http://www.savethesalamanders.com/uploads/4/9/2/7/4927660/5274618.jpg?499" } });
	// 			}
	// 			else if(ajaxParams.url.startsWith('http://pokeapi.co/api/v2/pokemon/3')) {
	// 				console.log('pokedetail');
	// 				defer.resolve({ url: 'http://pokeapi.co/api/v2/pokemon/3', id: 3, name: "warturtle", sprites: { front_default: "http://www.gannett-cdn.com/-mm-/59788d05a55862b70391a02d6ac8eb19fd05eb62/c=67-0-1128-796&r=x404&c=534x401/local/-/media/2015/06/26/AsburyPark/B9317849191Z.1_20150626070432_000_G1DB5V4P8.1-0.jpg" } });
	// 			}
	// 			else if(ajaxParams.url.startsWith('http://pokeapi.co/api/v2/pokemon')) {
	// 				console.log('pokelist');
	// 				var data = { results: (function(){
	// 					var arr = [];
	// 					arr.push({ name: "bobbelsaur", url: "http://pokeapi.co/api/v2/pokemon/1" });
	// 					arr.push({ name: "charredmander", url: "http://pokeapi.co/api/v2/pokemon/2" });
	// 					arr.push({ name: "warturtle", url: "http://pokeapi.co/api/v2/pokemon/3" });
	// 					return arr;
	// 				}())};
	// 				// data.next = 'http://pokeapi.co/api/v2/pokemon?';
	// 				data.count = 3;
	// 				defer.resolve(data);
	// 			}
	// 			else {
	// 				console.error(new Error('lmao what the fuck are you doing!'));
	// 				defer.reject({ status: 500, statusText: "500 Internal Server Error" });
	// 			}
	// 		}, 1000)
	// 	}).promise();
	// });
	var pokemonDatabase = new PokemonDatabase(self.config.database);
	var pokemonRepository = new PokemonRepository(pokemonDatabase);
	
	// VIEW
	var pokeDetailView = new PokeDetailView(self.config.containerSelectors.pokedexdetailContainerSelector);
	var pokeListView = new PokeListView(self.config.containerSelectors.pokedexlistContainer, self.config.storage);
	var settingsView = new SettingsView(self.config.containerSelectors.settingCacheRadius, self.config.containerSelectors.settingCacheCount, self.config.storage);
	var nearbyPokemonView = new NearbyPokemonView(self.config.containerSelectors.nearbyPokemon);
	var caughtPokemonView = new CaughtPokemonView(self.config.containerSelectors.caughtPokemon, self.config.storage);
		
	// --- Methods	
	this.onDeviceReady = function() {
		console.log('deviceready-event fired.');
		self.bindJQueryMobileEvents();
		
		console.time('logme');
		
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
				console.log(`pokecount`);
				console.log(count);
				pokeCount = count;
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
							// todo calculate percentage
							pokemonRepository.createSingle(pokemon).done(function() {
								caughtPokemonView.appendPokemon(pokemon);
							}).fail(function(err) {
								console.error(err);
								alert('ur pokemon is shit and cannot be cought');
							});
						});
					}
				});
			}
		});
		// display caught pokemon
		pokemonRepository.readAll().done(function(tx, results) {
			console.log(results);
			caughtPokemonView.setPokemon(results.rows);
		});
		// pokemonRepository.createSingle({ name: "pokoman", url: 'http://pokeapi.co/api/v2/pokemon/' }).done(function() {
		// 	console.log('I AM THE CREATOR');
		// }).fail(function(err) {
		// 	console.error(err);
		// });
		console.timeEnd('logme');
	}
	this.bindJQueryMobileEvents = function() {
		$(document).on('swipeleft', router.onSwipeHandler(self.onSwipeLeft));
		$(document).on('swiperight', router.onSwipeHandler(self.onSwipeRight));
		$(document).on('scrollstop', router.onScrollStopHandler(self.onScrollStop));
		$(document).on('pagecontainerbeforeload', router.onPCBeforeLoadHandler(self.onPCBeforeLoad));
		$(document).on('pagecontainershow', router.onPCShowHandler(self.onPCShow));
		window.onerror = function(err) {
			console.error(err);
			console.error(err.stack);
		};
	}
	this.onSwipeLeft = {
		"index": function() {
			console.log('swipeleft index');
		},
		"pokedetails": function() {
			console.log('swipeleft pokedetails.');
			if(currentPokemonDetail && currentPokemonDetail.id+1 <= pokeCount) {
				$.mobile.loading("show", {
					text: "Loading...",
					textVisible: true,
					theme: "a",
					html: ""
				});
				detailPromise = pokeApi.pokemon.readById((currentPokemonDetail.id+1));
				// detailPromise = $.Deferred(function(defer) {
				// 	defer.resolve({ url: 'http://pokeapi.co/api/v2/pokemon/', id: 5, name: "bobbelsaur", sprites: { front_default: "http://img12.deviantart.net/571d/i/2013/157/9/5/bobbelur_by_isa_san-dy6g8h.jpg" } });
				// 	defer.reject(new Error("404 not found", { details: "yolo not found" }));
				// });
				detailPromise.done(function() {
					$(":mobile-pagecontainer").pagecontainer('change', 'pokedetails.html', {
						allowSamePageTransition: true
					});
				}).fail(function() {
					detailPromise = null;
				}).always(function() {
					$.mobile.loading("hide");
				});
			}
		},
		"settings": function() {
			console.log('swipeleft settings.');
		}
	};
	this.onSwipeRight = {
		"index": function() {
			console.log('swiperight index');
		},
		"pokedetails": function() {
			console.log('swiperight pokedetails.');
			if(currentPokemonDetail && (currentPokemonDetail.id-1) > 0) {
				$.mobile.loading("show", {
					text: "Loading...",
					textVisible: true,
					theme: "a",
					html: ""
				});
				detailPromise = pokeApi.pokemon.readById((currentPokemonDetail.id-1));
				detailPromise.done(function() {
					$(":mobile-pagecontainer").pagecontainer('change', 'pokedetails.html', {
						allowSamePageTransition: true
					});
				}).fail(function() {
					detailPromise = null;
				}).always(function() {
					$.mobile.loading("hide");
				});
			}
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
			if(!detailPromise) {
				console.log('from index');
				detailPromise = pokeApi.pokemon.readByUrl(self.config.storage.pokedexClick);
			}
			else {
				console.log('from swipe');
			}
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
					currentPokemonDetail = data;
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
