var Application = function() {
	var self = this;
	
	// MANAGER
	var router = new Router();
	
	// DAL
	var pokeapi = new PokeApi();
	
	// VIEW
	
	this.onDeviceReady = function() {
		console.log('deviceready-event fired.');
		self.bindJQueryMobileEvents();
	}
	this.bindJQueryMobileEvents = function() {
		$(document).on('pageinit', function() {
			console.log('pageinit-event fired');
		});
		$(document).on('swipeleft', router.onSwipeLeftHandler(self.onSwipeLeft));
		$(document).on('pagecontainerbeforeload', router.onPCBeforeLoadHandler(self.onPCBeforeLoad));
		$(document).on('pagecontainershow', router.onPCShowHandler(self.onPCShow));
	}
	this.onSwipeLeft = {
		view: {
			pokedetails: function() {
				console.log('swipeleft pokedetails.');
			}
		}
	};
	this.onPCBeforeLoad = {
		index: function() {
			console.log('beforeload index');
		},
		view: {
			pokedetails: function() {
				console.log('beforeload pokedetails.');
			}
		}
	};
	this.onPCShow = {
		index: function() {
			console.log('showing index');
		},
		view: {
			pokedetails: function() {
				console.log('showing pokedetails.');
			}
		}
	};
	
	// on `new Application();`
	self.initialize();
	document.addEventListener('deviceready', self.onDeviceReady, false);
}