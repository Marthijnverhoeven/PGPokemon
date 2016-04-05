var AccelerometerManager = function(accelerometer, config) {
	var self = this;
	this.accelerometer = accelerometer;
	this.config = config;
	var watchFor = function(duration, acceleratorSigma) {
		var acceleratorAppender = [];
		var id = self.accelerometer.watchAcceleration(function(acceleration) {
			acceleratorAppender.push(acceleration);
		}, function(err) {
			throw new Error('The accelerator failed', err);
		}, { frequency: self.config.frequency });
		setTimeout(function() {
			accelerometer.clearWatch(id);
			acceleratorSigma(acceleratorAppender);
		}, duration);
	};
	var calcSpeed = function(acceleration) {
		return acceleration.x + acceleration.y + acceleration.z;
	}
	var shakeAlgorithm = function(threshold, values) {
		var maxSpeed = 0,
			results = 0;
		var previousSpeed = calcSpeed(values[0]); 
		for(acceleration of values) {
			currentSpeed = calcSpeed(acceleration);
			var speed = Math.abs(currentSpeed - previousSpeed);
			previousSpeed = currentSpeed;
			if(speed > maxSpeed) {
				maxSpeed = speed;
			}
			if(speed > threshold) {
				results++;
			}
		}
		return {
			threshold: threshold,
			thresholdMet: results,
			percentage: Math.round(results/values.length*100),
			success: results >= Math.floor(values.length / 2),
			data: values,
			maxSpeed: maxSpeed
		};
	};
	this.checkForShaking = function(afterDuration) {
		watchFor(self.config.duration, function(accelerationValues) {
			console.log('data');
			console.log(accelerationValues);
			var shakeData = shakeAlgorithm(self.config.shakeThreshold, accelerationValues);
			afterDuration(shakeData);
		}, function(err) {
			console.error(err);
		});
	};
}