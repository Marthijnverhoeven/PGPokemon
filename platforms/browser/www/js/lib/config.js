var config = {
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
		nearbyPokemon: '#nearby-pokemon-container'
	},
	geolocation: {
		maximumAge: 3000, // Maximum age (in ms) of the retrieved location.
		timeout: 5000, // Maximum time (in ms) after which ANY callback is supposed to be called, will call onError when timeout is reached.
		enableHighAccuracy: true // Specifies to the device that the best accuraty possible should be used (rather than just a generic nearby location).
	},
	plugins: {
		geolocation: (function(){ 
			if(navigator.geolocation){
				return navigator.geolocation;
			}
			throw new Error('OMG NO GEOLOCATION!');
		})()
	},
	storage: localStorage
};