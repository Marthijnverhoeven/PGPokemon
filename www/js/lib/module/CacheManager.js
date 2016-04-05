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
	var caches = [];
	var initCallbacks = [];
	// --- Cache
	var calculateRandomLocation = function (long, lat, acc, radius) {
		var random = Math.random();
        if(Math.random() >= 0.5) {
        	random++;
        }
		acc = acc + radius;
		var factor = (acc < 100) ? 0.01 : 0.1;
		var modifier = factor * random;
		return {
			lat: lat + modifier,
			long: long + modifier
		} 
	}
	// http://stackoverflow.com/questions/31192451/generate-random-geo-coordinates-within-specific-radius-from-seed-point
	var calculateRandomLocationSO = function (long, lat, acc, radius) {
		var y0 = lat;
		var x0 = long;
		var rd = radius / 111300; //about 111300 meters in one degree

		var u = Math.random();
		var v = Math.random();

		// ???	
		var w = rd * Math.sqrt(u);
		var t = 2 * Math.PI * v;
		var x = w * Math.cos(t);
		var y = w * Math.sin(t);

		var newlat = y + y0;
		var newlon = x + x0;

		return {
			'lat': newlat.toFixed(5),
			'long': newlon.toFixed(5)
		};
	}
	var randomId = function(pokeCount) {
		return Math.floor(Math.random() * pokeCount) + 1 
	}
	var initialized = function() {
		for(callback of initCallbacks) {
			callback(self.getCaches());
		}
	}
	var appendCaches = function(pos, pokeCount) {
		for(var i = 0; i < self.cacheCount(); i++) {
			caches.push({
				coords: calculateRandomLocationSO(pos.coords.longitude, pos.coords.latitude, pos.coords.accuracy, self.cacheRadius()),
				pokeId: randomId(pokeCount)
			});
		}
	}
	this.initialize = function(pos, pokeCount) {
		appendCaches(pos, pokeCount);
		initialized();
	}
	// Returns all currently calculated caches.
	this.getCaches = function() {
		return caches;
	};
	// Completely resets caches, including: location, count and radius based on settings or RNG.
	this.resetCaches = function(pos, pokeCount) {
		caches = [];
		appendCaches(pos, pokeCount);
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
	// fires after initialization
	this.onInitialization = function(callback) {
		initCallbacks.push(callback);
	}
}