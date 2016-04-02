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
		getTargetPathArray: function(ui) { // Gives access to target page after navigation
			var urlObject = $.mobile.path.parseUrl(ui.absUrl);
			return !!urlObject.pathname
					? urlObject.pathname.split('/')
					: ['index.html'];
		},
		getCurrentPathArray: function(evt) { // gives access to current page
			var urlObject = $.mobile.path.parseUrl(evt.currentTarget.URL);
			return !!urlObject.pathname
					? urlObject.pathname.split('/')
					: ['index.html'];
		},
		openNextLevel: function(obj, pathArray, index) {
			if(index >= pathArray.length) {
				throw new Error('Routing failed, index is larger than pathArray.');
			}
			if(pathArray[index] === '') {
				index++;
			}
			if(index == (pathArray.length-1)) {
				// index is last item in pathArray, thus file
				var path = pathArray[index].split('.')[0];
				var pageCallback = obj[path];
				console.log('pageCallback in openNextLevel');
				console.log(pageCallback);
				return pageCallback;
			}
			else {
				// index is not the last item in pathArray, thus directory
				count++;
				if(count > 10){
					throw new Error('fuck recursion v2');
				}
				routeHelper.openNextLevel(obj[pathArray[index]], pathArray, index+1);
			}
		}
	};
	this.onSwipeLeftHandler = function(callbacks) {
		console.log('swipeleft-handler added.');
		return function(evt) {
			console.log('swipeleft-event fired.');
			var pageCallback = routeHelper.openNextLevel(callbacks, routeHelper.getCurrentPathArray(evt), 0);
			if(pageCallback) {
				pageCallback(evt)
			}
		}
	}
	this.onPCBeforeLoadHandler = function(callbacks) {
		console.log('pagecontainerbeforeload-handler added.');
		return function(evt, ui) {
			console.log('pagecontainerbeforeload-event fired.');
			var pageCallback = routeHelper.openNextLevel(callbacks, routeHelper.getTargetPathArray(ui), 0);
			console.log('pageCallback');
			console.log(pageCallback);
			if(pageCallback) {
				pageCallback(evt)
			}
		};
	}
	this.onPCShowHandler = function(callbacks) {
		console.log('pagecontainershow-handler added.');
		return function(evt, ui) {
			console.log('pagecontainershow-event fired.');
			var pageCallback = routeHelper.openNextLevel(callbacks, routeHelper.getCurrentPathArray(evt), 0);
			console.log('pageCallback');
			console.log(pageCallback);
			if(pageCallback) {
				pageCallback(evt)
			}
		};
	}
}