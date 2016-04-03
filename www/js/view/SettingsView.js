var SettingsView = function(cacheRadiusCS, cacheCountCS, storage) {
	var self = this;
	this.cacheRadiusCS = cacheRadiusCS
	this.cacheCountCS = cacheCountCS;
	this.storage = storage;
	var linkRadioButton = function(id, callback) {
		var input = $(`#${id}`);
		input.on('click', function(evt) {
			callback(input, evt);
		});
	}
	this.addThemeControls = function(currentTheme, themes, callback) {
		for(var theme of themes) {
			linkRadioButton(theme, callback);
		}
	}
	var linkSlider = function(id, callback) {
		var input = $(`${id}`);
		input.on('slidestop', function(evt) {
			callback(input, evt);
		});
	}
	this.addCacheControls = function(radiusCallback, countCallback) {
		linkSlider(self.cacheRadiusCS, radiusCallback);
		linkSlider(self.cacheCountCS, countCallback);
	}
}