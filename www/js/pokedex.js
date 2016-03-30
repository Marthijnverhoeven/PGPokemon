var Pokedex = function(configuration, ajaxClient) {
	var self = this;
	var helper = {
		getAjaxParams: function(params) {
			return {
				type: "GET",
				url: `${params.url}`,
				dataType: "json",
				success: params.success,
				error: params.error
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
		},	
	};
	this.pokemon = {
		read: function(options, succes, error) {
			var params = {
				url: `${self.config.baseUrl}${self.config.endpoints.pokemon.read}${helper.parameterizeQueryOptions(options)}`,
				succes: succes,
				error: error
			};
			ajaxClient(helper.getAjaxParams(params));
		},
		readById: function(id, succes, error) {
			var params = {
				url: `${self.config.baseUrl}${self.config.endpoints.pokemon.readById}${id}`,
				succes: succes,
				error: error
			};
			ajaxClient(getAjaxParams(params));
		}
	}
};