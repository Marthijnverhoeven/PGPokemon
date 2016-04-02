// --- Router
// Description:
// 	Contains global event handlers that provide a pseudo-framework when handling global events.
// Supported events:
// 	- swipeleft
// 	- pagecontainerbeforeload
// 	- pagecontainershow
var Router = function() {
	var routeHelper = {
		getTargetPathArray: function(evt) {
			var urlObject = $.mobile.path.parseUrl(evt.currentTarget.URL);
			return !!urlObject.pathname
					? urlObject.pathname.split('/')
					: ['index.html'];
		},
		getCurrentPathArray: function(evt) {
			$.mobile.path.parseUrl("http://jblas:password@mycompany.com:8080/mail/dota/mota/inbox.html?msg=1234&type=unread#msg-content");
		},
		openNextLevel: function(obj, pathArray, index) {
			if(index >= pathArray.length) {
				throw new Error('Routing failed, index is larger than pathArray.');
			}
			if(index == (pathArray.length-1)) {
				// index is last item in pathArray, thus file
				return obj[pathArray[index]];
			}
			else {
				// index is not the last item in pathArray, thus directory
				self.openNextLevel(obj, pathArray, index++);
			}
		}
	};
	this.onSwipeLeftHandler = function(callbacks) {
		console.log('swipeleft-event fired.');
		return function(evt) {
			var pageCallback = routeHelper.openNextLevel(callbacks, routeHelper.getTargetPathArray(evt), 0);
			pageCallback(evt);
		}
	}
	this.onPCBeforeLoadHandler = function() {
		console.log('pagecontainerbeforeload-event fired.');
		return function(evt, ui) {
			var pageCallback = routeHelper.openNextLevel(callbacks, routeHelper.getTargetPathArray(evt), 0);
			pageCallback(evt);
		};
	}
	this.onPCShowHandler = function() {
		console.log('pagecontainershow-event fired.');
		return function(evt, ui) {
			var pageCallback = routeHelper.openNextLevel(callbacks, routeHelper.getCurrentPathArray(ui), 0);
			pageCallback(evt);
		};
	}
}