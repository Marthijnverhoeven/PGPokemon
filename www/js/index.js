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
		
		// var fakeAjaxClient = function(input) {
		// 	console.log("ajax call executed.");
		// 	console.log(input);
		// }
		
		// var pokedex = new Pokedex(null, fakeAjaxClient);
		
		// pokedex.pokemon.read(null, function(data, status) {
		// 	console.log("pokedex.read.succes");
		// 	console.log(data);
		// 	console.log(status);
		// }, function(xhr) {
		// 	console.log("pokedex.read.error");
		// 	console.log(xhr);
		// });
		
		$.mobile.loading( "show", {
			text: "foo",
			textVisible: true,
			theme: "z",
			html: ""
		});
		
		$('#pokedex').on('click', 'li a', function(evt) {
			console.log('click fuck');
			console.log(evt);
			evt.preventDefault();
		});		
		
		$.ajax({
			type: "GET",
			url: 'http://127.0.0.1:8181/',
			dataType: "jsonp",
			jsonpCallback: "_testcb",
			crossDomain: true,
			success: function (data) {
				for(var key in data.results) {
					console.log(data.results[key].name);
					console.log(data.results[key].url);
				}
				$.mobile.loading("hide");
			},
			error: function (xhr) {
				console.log(xhr);
			}
		});
		
		$(document).on("pagecontainerbeforeload", function (evt, data){
			console.log(evt);
			console.log(data);
		});
    }
};
