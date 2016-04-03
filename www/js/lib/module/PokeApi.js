var PokeApi = function(configuration, ajaxClient) {
	var self = this;
	var helper = {
		getAjaxParams: function(params) {
			return {
				type: "GET",
				url: `${params.url}`,
				dataType: "json"
			};
		},
		parameterizeQueryOptions: function(queryOptions) {
			queryOptions = queryOptions || {
				offset: 0,
				limit: 20
			};
			return `?${$.param(queryOptions)}`;
		}
	};
	this.config = configuration || {
		baseUrl: "http://pokeapi.co/api/v2/",
		endpoints: { 
			pokemon: {
				read: "pokemon",
				readById: "pokemon/"
			}
		}	
	};
	this.ajaxClient = ajaxClient;
	this.pokemon = {
		// Returns a promise to retrieve all pokemon.
		read: function(options) {
			var params = {
				url: `${self.config.baseUrl}${self.config.endpoints.pokemon.read}${helper.parameterizeQueryOptions(options)}`,
			};
			return self.ajaxClient(helper.getAjaxParams(params));
		},
		readNext: function(options) {
			if(!options.next) {
				return null;
			}
			var params = {
				url: `${options.next}`,
			};
			return self.ajaxClient(helper.getAjaxParams(params));
		},
		// Returns a promise to retrieve a pokemon by id.
		readById: function(id) {
			var params = {
				url: `${self.config.baseUrl}${self.config.endpoints.pokemon.readById}${id}`
			};
			return self.ajaxClient(helper.getAjaxParams(params));
		},
		// Returns a promise to retrieve a pokemon by url.
		readByUrl: function(url) {
			var params = {
				url: url
			}
			return self.ajaxClient(helper.getAjaxParams(params));
		}
	}
};