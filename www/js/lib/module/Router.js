// --- Router
// Description:
// 	Contains global event handlers that provide a pseudo-framework when handling global events.
// Supported events:
// 	- swipeleft
// 	- pagecontainerbeforeload
// 	- pagecontainershow
var Router = function() {
	var self = this;
	var count = 0;
	var routeHelper = {
		getTargetPathname: function(ui) { // Gives access to target page after navigation
			var urlObject = $.mobile.path.parseUrl(ui.absUrl);
			return !!urlObject.filename
					? urlObject.filename
					: 'index.html';
		},
		getCurrentPathname: function(evt) { // gives access to current page
			var urlObject = $.mobile.path.parseUrl(evt.currentTarget.URL);
			return !!urlObject.filename
					? urlObject.filename
					: 'index.html';
		},
		getCurrentObjectPath: function(evt) {
			return routeHelper.getObjectPath(routeHelper.getCurrentPathname(evt));
		},
		getTargetObjectPath: function(ui) {
			return routeHelper.getObjectPath(routeHelper.getTargetPathname(ui));
		},
		getObjectPath: function(pathname) {
			return pathname.split('.')[0];
		}
	};
	this.onSwipeLeftHandler = function(callbacks) {
		console.log('swipeleft-handler added.');
		return function(evt) {
			console.log('swipeleft-event fired.');
			var objectPath = routeHelper.getCurrentObjectPath(evt);
			console.log(objectPath);
			if(callbacks[objectPath]) {
				callbacks[objectPath](evt)
			}
		}
	}
	this.onPCBeforeLoadHandler = function(callbacks) {
		console.log('pagecontainerbeforeload-handler added.');
		return function(evt, ui) {
			console.log('pagecontainerbeforeload-event fired.');
			var objectPath = routeHelper.getTargetObjectPath(ui);
			if(callbacks[objectPath]) {
				callbacks[objectPath](evt, ui)
			}
		};
	}
	this.onPCShowHandler = function(callbacks) {
		console.log('pagecontainershow-handler added.');
		return function(evt, ui) {
			console.log('pagecontainershow-event fired.');
			var objectPath = routeHelper.getCurrentObjectPath(evt);
			if(callbacks[objectPath]) {
				callbacks[objectPath](evt, ui)
			}
		};
	}
}