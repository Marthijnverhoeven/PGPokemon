// --- Router
// Description:
// 	Contains global event handlers that provide a pseudo-framework when handling global events.
// Supported events:
// 	- swipeleft
// 	- pagecontainerbeforeload
// 	- pagecontainershow
var Router = function() {
	var self = this;
	var defaultPage = 'index.html';
	var routeHelper = {
		getTargetPathname: function(ui) { // Gives access to target page after navigation
			var urlObject = $.mobile.path.parseUrl(ui.absUrl);
			return !!urlObject.filename
					? urlObject.filename
					: defaultPage;
		},
		getCurrentPathname: function(evt) { // gives access to current page
			var urlObject = $.mobile.path.parseUrl(evt.currentTarget.URL);
			return !!urlObject.filename
					? urlObject.filename
					: defaultPage;
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
	this.onSwipeHandler = function(callbacks) {
		return function(evt) {
			var objectPath = routeHelper.getCurrentObjectPath(evt);
			if(callbacks[objectPath]) {
				callbacks[objectPath](evt)
			}
		}
	}
	this.onScrollStopHandler = function(callbacks) {
		return function(evt) {
			var objectPath = routeHelper.getCurrentObjectPath(evt);
			if(callbacks[objectPath]) {
				callbacks[objectPath](evt)
			}
		}
	}
	this.onPCBeforeLoadHandler = function(callbacks) {
		return function(evt, ui) {
			var objectPath = routeHelper.getTargetObjectPath(ui);
			if(callbacks[objectPath]) {
				callbacks[objectPath](evt, ui)
			}
		};
	}
	this.onPCShowHandler = function(callbacks) {
		return function(evt, ui) {
			var objectPath = routeHelper.getCurrentObjectPath(evt);
			if(callbacks[objectPath]) {
				callbacks[objectPath](evt, ui)
			}
		};
	}
}