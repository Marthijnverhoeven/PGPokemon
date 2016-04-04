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
	var cache = {};
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
		// Returns a promise to return pokemon count
		count: function() {
			return $.Deferred(function(defer) {
				if(cache['pokeCount']) {
					return defer.resolve(cache['pokeCount']);
				}
				
				console.log(`${self.config.baseUrl}${self.config.endpoints.pokemon.read}`);
				self.ajaxClient(helper.getAjaxParams({
					url: `${self.config.baseUrl}${self.config.endpoints.pokemon.read}`
				})).done(function(data) {
					console.log(data);
					defer.resolve(data.count);
					cache['pokeCount'] = data.count;
				}).fail(function(err) {
					defer.reject(err);
				});
			}).promise();
			
		},
		// Returns a promise to retrieve all pokemon.
		read: function(options) {
			return self.ajaxClient(helper.getAjaxParams({
				url: `${self.config.baseUrl}${self.config.endpoints.pokemon.read}${helper.parameterizeQueryOptions(options)}`,
			}));
		},
		// Returns a promise to retrieve the next list of pokemon.
		readNext: function(options) {
			if(!options.next) {
				return null;
			}
			return self.ajaxClient(helper.getAjaxParams({
				url: `${options.next}`,
			}));
		},
		// Returns a promise to retrieve a pokemon by id.
		readById: function(id) {
			if(cache[id]) {
				return $.Deferred(function(defer) {
					defer.resolve(cache[id]);
				}).promise();	
			}
			var url = `${self.config.baseUrl}${self.config.endpoints.pokemon.readById}${id}`;
			return self.ajaxClient(helper.getAjaxParams({ url: url })).done(function(data) { 
				data.url = url;
				cache[data.url] = data;
				cache[data.id] = data;
			});
		},
		// Returns a promise to retrieve a pokemon by url.
		readByUrl: function(url) {
			if(cache[url]) {
				return $.Deferred(function(defer) {
					defer.resolve(cache[url]);
				}).promise();
			}
			return self.ajaxClient(helper.getAjaxParams({ url: url })).done(function(data) {
				data.url = url; 
				cache[data.url] = data;
				cache[data.id] = data;
			});
		}
	}
};