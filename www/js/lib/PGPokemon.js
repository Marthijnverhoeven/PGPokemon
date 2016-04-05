var MyApp = function(config) {
	console.log('app is running');
	// --- Initializion
	var self = this;
	this.config = config;
	var detailPromise = null;
	var listPromise = null;
	var currentPokemonDetail = null;
	var pokeCount = null;
	var countPromise = null;
	var currentWatchId = null;
	var getNavGeoLocation = function() {
		return navigator.geolocation;
	}
	var getNavAccelerometer = function() {
		return navigator.accelerometer;
	}
	var displayLoader = function() {
		$.mobile.loading("show", {
			text: "Loading...",
			textVisible: true,
			theme: "a",
			html: ""
		});
	};
	var hideLoader = function() {
		$.mobile.loading("hide");
	};
	
	// MANAGER
	var router = new Router();
	var accelerometerManager = new AccelerometerManager(getNavAccelerometer(), self.config.accelerometerManager);
	var geoLocation = new GeoLocation(getNavGeoLocation(), self.config.geolocation);
	var cacheManager = new CacheManager(self.config.cacheManager);
	var themeManager = new ThemeManager(self.config.themeManager);
	
	// DAL
	var pokeApi = new PokeApi(self.config.pokeApi, $.ajax);
	// var pokeApi = new PokeApi(self.config.pokeApi, function(ajaxParams) {
	// 	return $.Deferred(function (defer){
	// 		setTimeout(function() {
	// 			if(ajaxParams.url.startsWith('http://pokeapi.co/api/v2/pokemon/1')) {
	// 				console.log('ajax to pokedetail');
	// 				defer.resolve({ types: [ { type: 'poison' }, { type:'ghost' } ], url: 'http://pokeapi.co/api/v2/pokemon/1', id: 1, name: "bobbelsaur", sprites: { front_default: "http://img12.deviantart.net/571d/i/2013/157/9/5/bobbelur_by_isa_san-dy6g8h.jpg" } });
	// 			}
	// 			else if(ajaxParams.url.startsWith('http://pokeapi.co/api/v2/pokemon/2')) {
	// 				console.log('ajax to pokedetail');
	// 				defer.resolve({ types: [ { type: 'dragon' }, { type:'fire' } ], url: 'http://pokeapi.co/api/v2/pokemon/2', id: 2, name: "charredmander", sprites: { front_default: "http://www.savethesalamanders.com/uploads/4/9/2/7/4927660/5274618.jpg?499" } });
	// 			}
	// 			else if(ajaxParams.url.startsWith('http://pokeapi.co/api/v2/pokemon/3')) {
	// 				console.log('ajax to pokedetail');
	// 				defer.resolve({ types: [ { type: 'bug' }, { type:'water' } ], url: 'http://pokeapi.co/api/v2/pokemon/3', id: 3, name: "warturtle", sprites: { front_default: "http://www.gannett-cdn.com/-mm-/59788d05a55862b70391a02d6ac8eb19fd05eb62/c=67-0-1128-796&r=x404&c=534x401/local/-/media/2015/06/26/AsburyPark/B9317849191Z.1_20150626070432_000_G1DB5V4P8.1-0.jpg" } });
	// 			}
	// 			else if(ajaxParams.url.startsWith('http://pokeapi.co/api/v2/pokemon')) {
	// 				console.log('ajax to pokelist');
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
	var catchPokemonView = new CatchPokemonView(self.config.containerSelectors.catchPokemon);
		
	// --- Methods	
	this.onDeviceReady = function() {
		console.log('deviceready-event fired.');
		self.bindJQueryMobileEvents();
		// pokelist init
		themeManager.loadTheme();
		listPromise = pokeApi.pokemon.read({});
		if(listPromise) {
			listPromise.done(function(data) {
				pokeListView.setPokemon(data.results);
				listPromise = pokeApi.pokemon.readNext(data);
			}).fail(function(err) {
				console.error(err);
				pokeListView.setError('Feature disabled, no information could be retrieved, please restart with internet services enabled. CODE: :98');
				listPromise = null;
			});
		}
		// pokecount init
		countPromise = pokeApi.pokemon.count();
		countPromise.done(function(count) {
			pokeCount = count;
		});
		// nearby pokemon init
		if(!getNavAccelerometer()) {
			// alert('No accelerometer available,\n' +
			// 	'This means that the nearby pokemon feature will be disabled.\n' +
			// 	'Please restart the app with a accelerometer-mounted device.');
			nearbyPokemonView.setError('Feature disabled, no accelerometer available, please restart with an accelerometer-mounted device. CODE: :112'); 
		}
		else if(!getNavGeoLocation()) {
			// alert('No location available,\n' +
			// 	'This means that the nearby pokemon feature will be disabled.\n' +
			// 	'Please restart the app with a gps-mounted device.');
			nearbyPokemonView.setError('Feature disabled, no accelerometer available, please restart with an gps-mounted device. CODE: :118');
		}
		else {
			
			geoLocation.getCurrentLocation(function(pos) {
				countPromise.done(function(count) {
					cacheManager.initialize(pos, count);
				}).fail(function(err) {
					console.error(err);
					nearbyPokemonView.setError('Feature disabled, no information could be retrieved, please restart with internet services enabled. CODE: :127');
				});
			}, function(err) {
				console.error(err);
				nearbyPokemonView.setError('Feature disabled, no location services available, please restart with location services enabled. CODE: :131');
			});
			cacheManager.onInitialization(function(caches) {
				var cacheLength = Object.keys(caches).length; 
				var pokemon = [];
				for(var key in caches) {
					var tempPromise = pokeApi.pokemon.readById(caches[key].pokeId);
					tempPromise.done(function(data) {
						pokemon.push(data);
						if(pokemon.length === cacheLength) {
							currentWatchId = geoLocation.watchLocation(function(pos) {
								nearbyPokemonView.setCaches(pos, pokemon, caches, function(pokemon, cache) {
									console.log('klik');
									self.config.storage.catchPokemonClick = JSON.stringify({
										name: pokemon.name,
										url: pokemon.url
									});
								});
							}, function(err) {
								console.error(err);
								nearbyPokemonView.setError('Feature disabled, no location services available, please restart with location services enabled. CODE: :151');
							});
						}
					}).fail(function(err) {
						console.error(err);
						console.log('Nearby pokemon could not be retrieved, ignoring cache...');
					});
				}
			});
		}
		// display caught pokemon
		pokemonRepository.readAll().done(function(tx, results) {
			caughtPokemonView.setPokemon(results.rows);
		}).fail(function(err) {
			console.error(err);
			caughtPokemonView.setError('Feature disabled, no information could be retrieved, please try again later. CODE: :166');
		});
	}
	this.bindJQueryMobileEvents = function() {
		$(document).on('swipeleft', router.onSwipeHandler(self.onSwipeLeft));
		$(document).on('swiperight', router.onSwipeHandler(self.onSwipeRight));
		$(document).on('scrollstop', router.onScrollStopHandler(self.onScrollStop));
		$(document).on('pagecontainerbeforeload', router.onPCBeforeLoadHandler(self.onPCBeforeLoad));
		$(document).on('pagecontainershow', router.onPCShowHandler(self.onPCShow));
		window.onerror = function(err) {
			console.error(err);
			alert(err);
		};
	}
	this.onSwipeLeft = {
		"pokedetails": function() {
			console.log('swipeleft pokedetails.');
			if(currentPokemonDetail && currentPokemonDetail.id+1 <= pokeCount) {
				displayLoader();
				detailPromise = pokeApi.pokemon.readById((currentPokemonDetail.id+1));
				detailPromise.done(function() {
					$(":mobile-pagecontainer").pagecontainer('change', 'pokedetails.html', {
						allowSamePageTransition: true,
						changeHash: false,
						transition: 'slide'
					});
				}).fail(function() {
					detailPromise = null;
				}).always(function() {
					hideLoader();
				});
			}
		}
	};
	this.onSwipeRight = {
		"pokedetails": function() {
			console.log('swiperight pokedetails.');
			if(currentPokemonDetail && (currentPokemonDetail.id-1) > 0) {
				displayLoader();
				detailPromise = pokeApi.pokemon.readById((currentPokemonDetail.id-1));
				detailPromise.done(function() {
					$(":mobile-pagecontainer").pagecontainer('change', 'pokedetails.html', {
						allowSamePageTransition: true,
						changeHash: false,
						transition: 'slide',
						reverse: true
					});
				}).fail(function() {
					detailPromise = null;
				}).always(function() {
					hideLoader();
				});
			}
		}
	};
	this.onScrollStop = {
		"index": function() {
			console.log('stop scrolling');
			pokeListView.onScrollStopHandler(function() {
				if(listPromise) {
					displayLoader();
					listPromise.done(function(data) {
						pokeListView.appendPokemon(data.results)
						listPromise = pokeApi.pokemon.readNext(data);
					}).fail(function(err) {
						pokeListView.setError(err);
						listPromise = null;
					}).always(function() {
						hideLoader();
					});
				}
			});
		}
	}
	this.onPCBeforeLoad = {
		"pokedetails": function() {
			console.log('beforeload pokedetails.');
			if(!detailPromise) {
				detailPromise = pokeApi.pokemon.readByUrl(self.config.storage.pokedexClick);
			}
		}
	};
	this.onPCShow = {
		"catch": function(){
			console.log('showing catch');
			if(!self.config.storage.catchPokemonClick) {
				return $(":mobile-pagecontainer").pagecontainer('change', 'index.html', {
					changeHash: false,
					transition: 'flow',
					reverse: true
				});
			}
			accelerometerManager.checkForShaking(function(shakeData) {
				var pokemon = JSON.parse(self.config.storage.catchPokemonClick);
				console.error(pokemon);
				catchPokemonView.displayStats(pokemon, shakeData);
				if(shakeData.success) {
					pokemonRepository.createSingle(pokemon).done(function() {
						caughtPokemonView.appendPokemon(pokemon);
					}).fail(function(err) {
						console.error(err);
					});
				}
			});
		},
		"pokedetails": function() {
			console.log('showing pokedetails.');
			if(detailPromise) {
				displayLoader();
				detailPromise.done(function(data){
					currentPokemonDetail = data;
					pokeDetailView.setPokemon(data);
				}).fail(function(err) {
					pokeDetailView.setError(err);
				}).always(function() {
					hideLoader();
					detailPromise = null;
				});
			}
		},
		"settings": function() {
			console.log('showing settings.');
			settingsView.addThemeControls(themeManager.currentTheme(), themeManager.getThemes(), function(sender, evt) {
				themeManager.currentTheme(sender.val());
			});
			settingsView.addCacheControls(function(sender, evt) {
				cacheManager.cacheRadius(sender.val());
			}, function(sender, evt) {
				cacheManager.cacheCount(sender.val());
			}, function(evt) {
				console.log('reset');
				geoLocation.getCurrentLocation(function(pos) {
					cacheManager.resetCaches(pos, count); // reset cache
					var caches = cacheManager.getCaches();
					var cacheLength = Object.keys(caches).length; 
					var pokemon = [];
					for(var key in caches) {
						pokeApi.pokemon.readById(caches[key].pokeId).done(function(data) {
							pokemon.push(data);
							if(pokemon.length === cacheLength) { // at last promise
								if(currentWatchId) { //  if watching
									geoLocation.clearWatch(currentWatchId); // clear it, to prevent handler being fired
								}
								currentWatchId = geoLocation.watchLocation(function(pos) { // rewatch with new handler
									nearbyPokemonView.setCaches(pos, pokemon, caches, function(pokemon, cache) { // set view
										console.log('klik');
										self.config.storage.catchPokemonClick = JSON.stringify({ // onclick store pokemon data
											name: pokemon.name,
											url: pokemon.url
										});
									});
								}, function(err) {
									console.error(err);
									nearbyPokemonView.setError('Feature disabled, ' +
										'no location services available, ' +
										'please restart with location services enabled. CODE: :310');
								});
							}
						});
					}
				}, function(err) {
					console.error(err);
					nearbyPokemonView.setError('Feature disabled, no location services available, please restart with location services enabled. CODE: :315');
				});
			});
			settingsView.setCacheValues(cacheManager.cacheRadius(), cacheManager.cacheCount());
			settingsView.setRadioValues(themeManager.currentTheme());
		}
	};
}
