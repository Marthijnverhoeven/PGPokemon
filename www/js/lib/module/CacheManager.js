var CacheManager = function(config) {
	var self = this;
	this.config = config || {
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
	};
	var cache = [];
	// --- Cache
	var calculateRandomLocation = function (long, lat, acc, radius) {
		var random = Math.random();
        if(Math.random() >= 0.5) {
        	random++;
        }
		acc = acc + radius;
		var factor = (acc < 100) ? 0.1 : 1;
		var modifier = factor * random;
		return {
			lat: lat + modifier,
			long: long + modifier
		} 
	}
	var randomId = function(pokeCount) {
		return Math.floor(Math.random() * pokeCount) + 1 
	}
	this.initialize = function(pos, pokeCount) {
		for(var i = 0; i < self.cacheCount(); i++) {
			cache.push({
				coords: calculateRandomLocation(pos.coords.longitude, pos.coords.latitude, pos.coords.accuracy, self.cacheRadius()),
				pokeId: randomId(pokeCount)
			});
		}
	}
	// Returns all currently calculated caches.
	this.getCaches = function() {
		return cache;
	};
	// Completely resets caches, including: location, count and radius based on settings or RNG.
	this.resetCaches = function(pos, pokeCount) {
		cache = [];
		self.initialize(pos, pokeCount);
	};
	// --- CacheSettings
	// Returns stored settings by key or default as defined in config.
	var getCacheSettingOrDefault = function(settingKey) {
		return !!self.config.storage[settingKey]
			? self.config.storage[settingKey] // stored cache count
			: self.config.default[settingKey] // default cache count 
	}
	// Getter and setter for cacheRadius.
	this.cacheRadius = function(key) {
		if(key) { // setter
			self.config.storage.cacheRadius = key;
		}
		else { // getter
			return getCacheSettingOrDefault('cacheRadius');
		}
	}
	// Getter and setter for cacheRadius.
	this.cacheCount = function(key) {
		if(key) { // setter
			self.config.storage.cacheCount = key;
		}
		else { // getter
			return getCacheSettingOrDefault('cacheCount');
		}
	}
}