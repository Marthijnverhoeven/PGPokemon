/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
	initialize: function(){
		var self = this;
		document.addEventListener('deviceready', function(evt) {
			new MyApp(self.config).onDeviceReady();
		});
	},
	config: {
		database: {
			name: 'PokemonDatabase',
			version: '1.0',
			description: 'Storage for pokemon',
			size: 2 * 1024 * 1024
		},
		pokeApi: {
			baseUrl: "http://pokeapi.co/api/v2/",
			endpoints: { 
				pokemon: {
					read: "pokemon",
					readById: "pokemon/"
				}
			}
		},
		accelerometerManager: {
			frequency: 100,
			duration: 3000,
			shakeThreshold: 30
		},
		cacheManager: {
			themeStylesheetSelector: '#theme-stylesheet',
			themes: {
				BostonHenk: 'css/themes/BostonHenk.css',
				Creed: 'css/themes/Creed.css'
			},
			storage: localStorage,
			default: {
				cacheCount: 4,
				cacheRadius: 6 
			}
		},
		themeManager: {
			themeStylesheetSelector: '#theme-stylesheet',
			themes: {
				BostonHenk: 'css/themes/BostonHenk.css',
				Creed: 'css/themes/Creed.css'
			},
			storage: localStorage
		},
		containerSelectors: {
			pokedexlistContainer: '#pokedex-container',
			pokedexdetailContainerSelector: '#pokemon-container',
			settingCacheRadius: '#cache-setting-radius',
			settingCacheCount: '#cache-setting-count',
			themeSettings: '#theme-setting-container',
			caughtPokemon: '#my-pokemon-container',
			nearbyPokemon: '#nearby-pokemon-container',
			catchPokemon: '#catch-pokemon-container',
			cacheReset: '#cache-reset'
		},
		geolocation: {
			maximumAge: 3000, // Maximum age (in ms) of the retrieved location.
			timeout: 5000, // Maximum time (in ms) after which ANY callback is supposed to be called, will call onError when timeout is reached.
			enableHighAccuracy: true // Specifies to the device that the best accuraty possible should be used (rather than just a generic nearby location).
		},
		plugins: { },
		storage: localStorage
	}
}

