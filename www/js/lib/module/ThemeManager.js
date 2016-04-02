var ThemeManager = function(config) {
	var self = this;
	this.config = config || {
		themeStylesheetSelector: '#theme-stylesheet',
		themes: {
			BostonHenk: '/css/themes/BostonHenk.css',
			Creed: '/css/themes/Creed.css'
		},
		storage: localStorage
	};
	// --- Themes
	// Stores key to storage-object
	var setCurrentTheme = function(key) {
		if(!self.config.themes[key]) {
			console.error('Theme could not be set, because it does not exist.');
			return false;
		}
		return (self.config.storage.currentTheme = key);
	};
	// Returns key for current theme.
	var getCurrentThemeOrDefault = function() {
		return !!self.config.storage.currentTheme
			? self.config.storage.currentTheme // current theme
			: Object.keys(self.config.themes)[0] // default (arbitrary) theme
	}
	//  Returns all theme keys 
	this.getThemes = function() {
		return Object.keys(self.config.themes);
	};
	// Loads the given theme, or the set theme in storage, or an arbitrary theme in config.
	this.loadTheme = function(key) {
		if(!key) {
			key = getCurrentThemeOrDefault();
		}
		$(self.config.themeStylesheetSelector).attr({href : self.config.themes[key]});
		return true;
	};
	// Getter and setter for currentTheme (includes loading after setter).
	this.currentTheme = function(key) {
		if(key) { // parameter exists -> setter
			if(setCurrentTheme(key)) {
				return self.loadTheme();
			}
			return false;
		}
		else { // parameter does not exist -> getter
			return getCurrentThemeOrDefault();
		}
	};
}