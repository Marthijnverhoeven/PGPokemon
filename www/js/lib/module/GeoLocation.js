var GeoLocation = function(geolocation, config) {
	var self = this;
	var geolocation = geolocation;
	this.config = config
	this.getCurrentLocation = function(onSuccess, onError) {
		geolocation.getCurrentPosition(onSuccess, onError, self.config);
	};
	this.watchLocation = function(onSuccess, onError) {
		return geolocation.watchPosition(onSuccess, onError, self.config);
	}
	this.clearWatch = geolocation.clearWatch;
}