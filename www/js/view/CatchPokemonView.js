var CatchPokemonView = function(catchPokemonCS) {
	var self = this;
	var createStatsContainer = function(pokemon, shakeData) {
		var html = `` +
			`<div class="ui-body ui-body-a ui-corner-all">` +
				`<h1><b>You ${shakeData.success ? 'won' : 'lost'}!</b></h1>` +
				`<div class="ui-corner-all ui-body">` +
					`<div class="ui-bar-a ui-corner-top">` +
						`<h2>Stats</h2>` +
					`</div>` +
					`<div class="ui-grid-a ui-body-a">` +
						`<strong class="ui-block-a">percentage</strong>` +
						`<p class="ui-block-b">${shakeData.percentage}%</p>` +
					`</div>` +
					`<div class="ui-grid-a ui-body-a ui-corner-bot">` +
						`<strong class="ui-block-a">Maximum speed</strong>` +
						`<p class="ui-block-b">${shakeData.maxSpeed}</p>` +
					`</div>` +
				`</div>` +
				`<div class="ui-corner-all ui-body">` +
					`<div class="ui-bar-a"><h2>Result</h2></div>` +
					`<div class="ui-body-a"><h3>The ${pokemon.name} ${shakeData.success ? 'was caught' : 'got away' }.</h3></div>` +
				`</div>` +
				`<a class="ui-btn ui-btn-inline ui-corner-all ui-btn-icon-left ui-icon-back" href="index.html" data-direction="reverse" data-rel="back" data-transition="slide">Back</a>` +
			`</div>`;
		return $(html);
	}
	this.catchPokemonCS = catchPokemonCS;
	this.displayStats = function(pokemon, shakeData) {
		var container = $(self.catchPokemonCS);
		container.empty();
		var statsContainer = createStatsContainer(pokemon, shakeData);
		container.append(statsContainer);
	}
}