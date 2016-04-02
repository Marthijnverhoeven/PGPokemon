var SettingsView = function(containerSelector, storage) {
	var self = this;
	this.containerSelector = containerSelector || '#settings-container';
	this.storage = storage;
	var addSlider = function(options) {
		$(`<label for='${options.name}'>Slider:</label>`)
			.appendTo(self.containerSelector);
		$(`<input type='number' name='${options.name}' data-type='range' data-highlight='true' min='${options.min}' max='${options.max}' step='${options.step}' value='${options.value}'>`)
			.on('slidestop', function(evt){ options.onSlideStop(evt, $(this).val()); })
	        .appendTo(self.containerSelector)
	        .slider()
        	.textinput();
	}
	
	this.initializeSettings = function() {
		addSlider({
			name: 'dota',
			min: 0,
			max: 12,
			step: 1,
			value: 6,
			onSlideStop: function(evt, value) {
				console.log('onSlideStop');
				console.log(evt);
				console.log(value);
			}
		});
	}
}