var NodeGeocoder = require('node-geocoder');

var q = process.argv[2] || 'Bali';

var options = {
  provider: 'google',

  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'AIzaSyAfuCuuN5-c7nz34HDR-UdjpBwqPoyLVRk', // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
};

var geocoder = NodeGeocoder(options);

// // Using callback
// geocoder.geocode('29 champs elysée paris', function(err, res) {
//   console.log(res);
// });

// Or using Promise
// geocoder.geocode(q)
//   .then(function(res) {
//     console.log(res);
//   })
//   .catch(function(err) {
//     console.log(err);
//   });

// Or using Promise 
geocoder.reverse({lat:-6.9, lon:107.6})
  .then(function(res) {
    console.log(res);
  })
  .catch(function(err) {
    console.log(err);
  });