// sample or docs for: cordova-plugin-geolocation
// taken from: https://github.com/apache/cordova-plugin-geolocation

// example of a geolocation.onSuccess handler.
function onSuccess(pos) {
	console.log(
		'Latitude: '          + pos.coords.latitude          + '\n' +
		'Longitude: '         + pos.coords.longitude         + '\n' +
		'Altitude: '          + pos.coords.altitude          + '\n' +
		'Accuracy: '          + pos.coords.accuracy          + '\n' +
		'Altitude Accuracy: ' + pos.coords.altitudeAccuracy  + '\n' +
		'Heading: '           + pos.coords.heading           + '\n' +
		'Speed: '             + pos.coords.speed             + '\n' +
		'Timestamp: '         + pos.timestamp                + '\n');
}
// example of a geolocation.onError handler.
function onError(err) {
	alert(
		'code: '    + error.code    + '\n' +
		'message: ' + error.message + '\n');
}
// example of a geolocation.geolocationOptions handler.
var geoLocationOptions = {
	maximumAge: 3000, // Maximum age (in ms) of the retrieved location.
	timeout: 5000, // Maximum time (in ms) after which ANY callback is supposed to be called, will call onError when timeout is reached.
	enableHighAccuracy: true // Specifies to the device that the best accuraty possible should be used (rather than just a generic nearby location).
};

// navigator.geolocation
var geolocation = {};

// retrieves the current position and passes it to onSuccess.
geolocation.getCurrentPosition(onSuccess, onError, geoLocationOptions);

// adds a eventhandler to the pseudo-position-changed-event and passes the new location to onSuccess.
// returns a id used to identify the added handler.
var handlerId = geolocation.watchPosition(onSuccess, onError, geoLocationOptions);

// takes the handlerId and uses it to remove the specific handler from the pseudo-position-changed-event. 
geolocation.clearWatch(watchId);