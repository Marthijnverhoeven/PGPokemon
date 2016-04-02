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
			BostonHenk: '/css/themes/BostonHenk.css',
			Creed: '/css/themes/Creed.css'
		},
		storage: localStorage,
		default: {
			cacheCount: 4,
			cacheRadius: 6 
		}
	},
	settingsManager: {
		themeStylesheetSelector: '#theme-stylesheet',
		themes: {
			BostonHenk: '/css/themes/BostonHenk.css',
			Creed: '/css/themes/Creed.css'
		},
		storage: localStorage
	}
};