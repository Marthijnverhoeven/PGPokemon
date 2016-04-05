var GeoLocation = function(geolocation, config) {
	var self = this;
	var geolocation = geolocation;
	this.config = config
	this.getCurrentLocation = function(onSuccess, onError) {
		geolocation.getCurrentPosition(onSuccess, onError, self.config);
		// onSuccess({
		// 	coords: {
		// 		accuracy:63,
		// 		altitude:null,
		// 		altitudeAccuracy:null,
		// 		heading:null,
		// 		latitude:50,
		// 		longitude:50,
		// 		speed:null
		// 	},
		// 	timestamp:1459717566818
		// });
	};
	this.watchLocation = function(onSuccess, onError) {
		return geolocation.watchPosition(onSuccess, onError, self.config);
		// var fakeLocator = function(pos) {
		// 	setTimeout(function() {
		// 		onSuccess(pos);
		// 		pos.coords.longitude += 0.01;
		// 		pos.coords.latitude += 0.01;
		// 		pos.timestamp += 1;
		// 		fakeLocator(pos);
		// 	}, 20000);
		// }
		// fakeLocator({
		// 	coords: {
		// 		accuracy: 63,
		// 		altitude: null,
		// 		altitudeAccuracy: null,
		// 		heading: null,
		// 		latitude: 50,
		// 		longitude: 50,
		// 		speed: null
		// 	},
		// 	timestamp: 1459717566818
		// });
		// return '7uibkjwohu';
	}
}