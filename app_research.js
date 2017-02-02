var express = require('express')
var app = express()
var Request = require('request');

var urlGeoAPI = 'https://maps.googleapis.com/maps/api/geocode/json?'; 
var urlPlaceAPI = 'https://maps.googleapis.com/maps/api/place/textsearch/json?'; 
var urlAutocomplete = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?';
var apiKey = 'AIzaSyDFHqujkpYtjTbg_-Y8vd5rcJY41gYTBJU'; //tiket
// var apiKey = 'AIzaSyAfuCuuN5-c7nz34HDR-UdjpBwqPoyLVRk'; //private

app.get('/place', function(req, res){
	var param = {
		key : apiKey,
		query: req.query.q
	}

	Request({
		    url: urlPlaceAPI,
		    qs: param,
		    method: 'GET',
		    headers: {}
		}, function(error, response, body){
		    if(error) {
		        console.log(error);
		    } else {
			    body = JSON.parse(body);

			    res.send(body);
		    }
		});
});

app.get('/autocomplete', function(req, res){
	var param = {
		key : apiKey,
		input: req.query.q
	}

	Request({
		    url: urlAutocomplete,
		    qs: param,
		    method: 'GET',
		    headers: {}
		}, function(error, response, body){
		    if(error) {
		        console.log(error);
		    } else {
			    body = JSON.parse(body);

			    res.send(body);
		    }
		});
});

app.get('/autocomplete/latlong', function(req, res){
	var param = {
		key : apiKey,
		location: '-6, 107'
	}

	Request({
		    url: urlAutocomplete,
		    qs: param,
		    method: 'GET',
		    headers: {}
		}, function(error, response, body){
		    if(error) {
		        console.log(error);
		    } else {
			    body = JSON.parse(body);

			    res.send(body);
		    }
		});
});

app.get('/geo', function(req, res){
	var param = {
		key : apiKey,
		address: req.query.q
	}

	Request({
		    url: urlGeoAPI,
		    qs: param,
		    method: 'GET',
		    headers: {}
		}, function(error, response, body){
		    if(error) {
		        console.log(error);
		    } else {
			    body = JSON.parse(body);

			    res.send(body);
		    }
		});
});

app.get('/latlong', function(req, res){
	var param = {
		key : apiKey,
		latlng : req.query.lat + ',' + req.query.long
	}

	Request({
		    url: urlGeoAPI,
		    qs: param,
		    method: 'GET',
		    headers: {}
		}, function(error, response, body){
		    if(error) {
		        console.log(error);
		    } else {
			    body = JSON.parse(body);

			    res.send(body);
		    }
		});
});

app.listen(8080, function () {
  console.log('Geocode run on port 8080!')
})