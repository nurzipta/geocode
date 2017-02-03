var express = require('express')
var app = express()
var Request = require('request');

var urlGeoAPI = 'https://maps.googleapis.com/maps/api/geocode/json?'; 
var urlPlaceAPI = 'https://maps.googleapis.com/maps/api/place/textsearch/json?'; 
var urlAutocomplete = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?';
var apiKey = 'AIzaSyDFHqujkpYtjTbg_-Y8vd5rcJY41gYTBJU'; //tiket
// var apiKey = 'AIzaSyAfuCuuN5-c7nz34HDR-UdjpBwqPoyLVRk'; //private

const mapping_geo = (res) =>
{
	var poi = {};

	if(res.status = "OK" && res.results){
		var result = res.results;
		
		result.forEach((component) => {
			if(component.address_components) {
				var address = component.address_components;
				address.forEach((name) => {
					if(name.types.indexOf('country') !== -1) {
						poi.country_name = name.long_name;
						poi.country_code = name.short_name;
					}

					// provincy
					if(name.types.indexOf('administrative_area_level_1') !== -1) {
						poi.administrative_area_level_1 = name.long_name;
					}

					// city/kabupaten
					if(name.types.indexOf('administrative_area_level_2') !== -1) {
						poi.administrative_area_level_2 = name.long_name;
					}

					// district
					if(name.types.indexOf('administrative_area_level_3') !== -1) {
						poi.administrative_area_level_3 = name.long_name;
					}
				});
			}

			if(component.formatted_address) {
				poi.address = component.formatted_address;
			}

			if(component.place_id)  {
				poi.place_id = component.place_id;				
			}

			if(component.types) {
				poi.types = component.types;
			}

			var geometry = component.geometry;
			if(geometry.bounds) {
				poi.bounds = geometry.bounds;
			}

			if(geometry.viewport) {
				poi.viewport = geometry.viewport;
			}

			// latlong
			if(geometry.location) {
				poi.latitude = geometry.location.lat;
				poi.longitude = geometry.location.lng;
			}
		});		
	}

	console.log(poi)
}

const mapping_place = (res) =>
{
	var poi = {};

	if(res.status == 'OK' && res.results)  {
		var results = res.results;
		results.forEach((result) => {
			if(result.formatted_address) {
				poi.adress = result.formatted_address;
			}

			if(result.geometry) {
				var geometry = result.geometry;

				if(geometry.viewport) {
					poi.viewport = geometry.viewport;
				}

				var location = geometry.location;
				poi.latitude = location.lat;
				poi.longitude = location.lng;
			}

			poi.name = result.name;
			poi.place_id = result.place_id;
			poi.types = result.types;
		});
	}

	console.log(poi);
}

const mapping_autocomplete = (res) => 
{
	var poi = [];

	if(res.status == "OK") {
		var predictions = res.predictions;

		predictions.forEach((prediction) => {
			var temp = {};

			if(prediction.place_id) {
				temp.place_id = prediction.place_id;
			}

			if(prediction.description) {
				temp.description = prediction.description;
			}

			if(prediction.types) {
				temp.types = prediction.types;
			}

			if(prediction.reference) {
				temp.reference = prediction.reference;
			}

			poi.push(temp);
		});
	}

	console.log(poi)
}

app.get('/place',  (req, res) => {
	var param = {
		key : apiKey,
		query: req.query.q
	}

	Request({
		    url: urlPlaceAPI,
		    qs: param,
		    method: 'GET',
		    headers: {}
		}, (error, response, body) => {
		    if(error) {
		        console.log(error);
		    } else {
			    body = JSON.parse(body);

			    mapping_place(body);

			    res.send(body);
		    }
		});
});

app.get('/autocomplete', (req, res) => {
	var param = {
		key : apiKey,
		input: req.query.q
	}

	var raw_data = '';

	Request({
		    url: urlAutocomplete,
		    qs: param,
		    method: 'GET',
		    headers: {}
		},  (error, response, body) => {
		    if(error) {
		        console.log(error);
		    }
		}).on('data', function(chunk){
			raw_data += chunk;
		}).on('end', function(){
			var data = '';
			try
			{
				data = JSON.parse(raw_data);
			}
			catch(e)
			{
				data = 'Unexpected end of JSON input';
				console.log('parse error', e);
			}

			mapping_autocomplete(data);

			res.send(data);
		});
});

app.get('/geo', (req, res) => {
	var param = {
		key : apiKey,
		address: req.query.q
	}

	Request({
		    url: urlGeoAPI,
		    qs: param,
		    method: 'GET',
		    headers: {}
		},  (error, response, body) => {
		    if(error) {
		        console.log(error);
		    } else {
			    body = JSON.parse(body);
			    mapping_geo(body)

			    res.send(body);
		    }
		});
});

app.listen(8080, () => {
  console.log('Geocode run on port 8080!')
})