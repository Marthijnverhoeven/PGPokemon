var GeoLocation = function(geolocation, config) {
	var self = this;
	var geolocation = geolocation;
	this.config = config
	this.getCurrentLocation = function(onSuccess, onError) {
		// geolocation.getCurrentPosition(onSuccess, onError, self.config);
		onSuccess({
			coords: {
				accuracy:63,
				altitude:null,
				altitudeAccuracy:null,
				heading:null,
				latitude:51.8178159,
				longitude:5.7871494,
				speed:null
			},
			timestamp:1459717566818
		});
	};
	this.openCurrentLocationInMaps = function(onSuccess, onError) {
		
	};
}