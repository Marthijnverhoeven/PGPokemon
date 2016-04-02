var CacheManager = function() {
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
	// --- Cache
	// Returns all currently calculated caches.
	this.getCaches = function() { };
	// Completely resets caches, including: location, count and radius based on settings or RNG.
	this.resetCaches = function() { };
	// Keeps current cache locations, but recalculates count and radius based on settings.
	this.recalculateCaches = function() { };
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