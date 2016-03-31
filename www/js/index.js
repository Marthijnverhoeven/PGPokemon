/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		console.log('We started the war!');
		
		var controller = new Controller();
		
		controller.populatePokeList();
		
		$(document).on("pagecontainershow", function (evt){
			console.log("pagecontainershow");
			if(evt.currentTarget.URL.endsWith("/views/pokedetails.html")) {
				$.mobile.loading("show", {
					text: "Loading...",
					textVisible: true,
					theme: "a",
					html: ""
				});
			}
		});
		
		$(document).on("pagecontainerbeforeload", function (evt, data){
			console.log('pagecontainerbeforeload');
			if(data.dataUrl.endsWith("/views/pokedetails.html")) {
				console.log(`accessing pokedetails`);
				controller.populatePokeDetail();
			}
			else if(data.dataUrl.endsWith("/index.html")) {
				console.log(`accessing pokelist`);
			}
			else {
				console.error('accessing wtf?');
				console.error(data.dataUrl);
			}
		});
    }
};

var localAjaxClient = function(input) {
	if(input.url.startsWith('http://pokeapi.co/api/v2/pokemon?')) {
		$.ajax({
			type: "GET",
			url: 'http://127.0.0.1:8181/',
			dataType: "jsonp",
			jsonpCallback: "_testcb",
			crossDomain: true,
			success: input.success,
			error: input.error
		});
	}
	else if(input.url.startsWith('http://pokeapi.co/api/v2/pokemon/')) {
		$.ajax({
			type: "GET",
			url: 'http://127.0.0.1:8181/detail',
			dataType: "jsonp",
			jsonpCallback: "_testcb",
			crossDomain: true,
			success: input.success,
			error: input.error
		});
	}
	else {
		console.error(new Error('lmao what the fuck are you doing!'));
		input.error({ status: 500, statusText: "500 Internal Server Error" });
	}
}

var logAjaxClient = function(input) {
	console.log('ajax call started');
	$.ajax(input);
}

var fakeAjaxClient = function(input) {
	console.log('ajax call started');
	setTimeout(function() {
		if(input.url.startsWith('http://pokeapi.co/api/v2/pokemon?')) {
			console.log('pokelist');
			input.success({ results: [{ name: "bobbelsaur", url: "http://pokeapi.co/api/v2/pokemon/1" }] });
		}
		else if(input.url.startsWith('http://pokeapi.co/api/v2/pokemon/')) {
			console.log('pokedetail');
			input.success({ name: "bobbelsaur", sprites: { front_default: "http://img12.deviantart.net/571d/i/2013/157/9/5/bobbelur_by_isa_san-dy6g8h.jpg" } });
		}
		else {
			console.error(new Error('lmao what the fuck are you doing!'));
			input.error({ status: 500, statusText: "500 Internal Server Error" });
		}
	}, 0);
}

var muhStorage = {};
var pokedexlistContainer = $('#pokedex-container');
var pokedexdetailContainerSelector = '#pokemon-container';

var Controller = function() {
	var self = this;
	this.pokedex = new Pokedex(null, fakeAjaxClient);
	this.pokeListView = new PokeListView(pokedexlistContainer, muhStorage);
	this.pokeDetailView = new PokeDetailView(pokedexdetailContainerSelector, muhStorage);
	
	this.populatePokeList = function() {
		self.pokedex.pokemon.read(null, function(data) {
			console.log('pokelist API success');
			self.pokeListView.setPokemon(data.results)
			$.mobile.loading("hide");
		}, function(xhr) {
			console.log('pokelist API failed');
			self.pokeListView.setError(xhr.statusText)
			console.error(xhr);
			$.mobile.loading("hide");
		});
	}
	this.populatePokeDetail = function() {
		self.pokedex.pokemon.readByUrl(muhStorage.pokedexClick, function(data) {
			console.log('pokedetail API success');
			self.pokeDetailView.setPokemon(data);
			$.mobile.loading("hide");
		}, function(xhr) {
			console.log('pokedetail API failed');
			self.pokeDetailView.setError(xhr.statusText);
			console.error(xhr);
			$.mobile.loading("hide");
		})
	}
}