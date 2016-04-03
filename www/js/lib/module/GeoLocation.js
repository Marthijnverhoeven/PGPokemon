var GeoLocation = function(geolocation, config) {
	var self = this;
	var geolocation = geolocation;
	this.config = config
	this.getCurrentLocation = function(onSuccess, onError) {
		geolocation.getCurrentPosition(onSuccess, onError, self.config);
	};
	this.openCurrentLocationInMaps = function(onSuccess, onError) {
		
	};
}