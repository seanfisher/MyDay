var args = arguments[0] || {};
var dataRetriever = require('dataRetriever/dataRetriever');
var OAuth = require("jsOAuth").OAuth;
Ti.Geolocation.purpose = "We need your location to display the weather and suggest a breakfast location";
Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_HIGH;
var lat;
var lng;
var breakfastLat;
var breakfastLng;
var breakfastName;

function setWeatherDataByCoordinates() {
	var latitude = lat;
	var longitude = lng;
	var url = "http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&mode=json&units=imperial";
	dataRetriever.fetchDataFromUrl(url, function(weatherData) {
		if (weatherData) {
			$.cityName.text = weatherData.name;
			$.currentWeather.text = weatherData.main.temp + " °F";
			setWeatherIcon(weatherData.weather[0].main);
		}
	});
}

function setWeatherIcon(weather) {
	Ti.API.info(weather);
	switch(weather) {
		case 'Rain':
			$.weatherIcon.image = '/weatherIcons/rain_light.png';
			break;
		case 'Clouds':
			$.weatherIcon.image = '/weatherIcons/clouds_light.png';
			break;
		case 'Sunny':
			$.weatherIcon.image = '/weatherIcons/sunny_light.png';
			break;
		default:
			$.weatherIcon.image = '/weatherIcons/snowy_light.png';
			break;
	}
}

function getUserCoordinates() {
	Titanium.Geolocation.getCurrentPosition(updateLocation);
	Titanium.Geolocation.addEventListener('location', updateLocation);
}

function updateLocation(e) {
	if (!e.success || e.error) {
		Ti.API.info("Couldn't get location: " + JSON.stringify(e));
		return;
	}
	Ti.Geolocation.removeEventListener('location', updateLocation);
	Ti.API.info(JSON.stringify(e));
	lat = e.coords.latitude;
	lng = e.coords.longitude;
	setWeatherDataByCoordinates();
	getListOfPlacesFromYelp(lat, lng);
}

function setQuoteOfTheDay() {
	var url = "http://iheartquotes.com/api/v1/random?format=json&source=wisdom";
	dataRetriever.fetchDataFromUrl(url, function(quoteData) {
		if (quoteData) {
			$.quoteText.text = quoteData.quote;
		}
	});
}

function openCurrentLocationInMaps() {
	if (OS_ANDROID) {
		openLocationInMapsAndroid(lat, lng);
	} else if (OS_IOS) {
		openLocationInMapsiOS(lat, lng);
	}
}

function openBreakfastLocationInMaps() {
	if (OS_ANDROID) {
		openLocationInMapsAndroid(breakfastLat, breakfastLng, breakfastName);
	} else if (OS_IOS) {
		openLocationInMapsiOS(breakfastLat, breakfastLng, breakfastName);
	}
}

function openLocationInMapsAndroid(latitude, longitude, name) {
	if (name) {
		name = Ti.Network.encodeURIComponent(name);
		Ti.Platform.openURL('http://maps.google.com/maps?q=' + name + '&sll=' + latitude + ',' + longitude);
	} else {
		Ti.Platform.openURL('http://maps.google.com/maps?ll=' + latitude + ',' + longitude);
	}
}

function openLocationInMapsiOS(latitude, longitude, name) {
	// Simulator: open safari. Real device: open maps app
	if (name) {
		name = Ti.Network.encodeURIComponent(name);
		Ti.Platform.openURL('http://maps.apple.com/?q=' + name + '&sll=' + latitude + ',' + longitude);
	} else {
		Ti.Platform.openURL('http://maps.apple.com/?ll=' + latitude + ',' + longitude);
	}
}

function getListOfPlacesFromYelp(latitude, longitude) {
	function success(data) {
		Ti.API.info("success");
		randomlyPickAPlaceForBreakfast(data);
	}

	function failure(data) {
		Ti.API.info("failed");
		alert("Yelp failed! Noooooooo");
	}

	var oauth = OAuth({
		consumerKey : "---CONSUMER-KEY-HERE---",
		consumerSecret : "---CONSUMER-SECRET-KEY-HERE---",
		accessTokenKey : "---ACCESS-TOKEN-KEY-HERE---",
		accessTokenSecret : "---ACCESS-TOKEN-SECRET-KEY-HERE---"
	});

	oauth.get(("http://api.yelp.com/v2/search?term=breakfast&ll=" + latitude + "," + longitude + "&radius_filter=4000"), success, failure);
}

function randomlyPickAPlaceForBreakfast(listOfAllPlaces) {
	var allText = JSON.parse(listOfAllPlaces.text);
	var businesses = allText.businesses;
	var businesses_length = businesses.length;
	var random_number = Math.floor((Math.random() * businesses_length));
	var name = businesses[random_number].name;
	var address = businesses[random_number].location.address[0];
	$.locationName.text = name;
	var state = businesses[random_number].location.state_code;
	var city = businesses[random_number].location.city;
	var zip = businesses[random_number].location.postal_code;
	var combinedAddress = address + ", " + city + ", " + state + " " + zip;
	breakfastName = name;
	Ti.Geolocation.forwardGeocoder(combinedAddress, function(location) {
		breakfastLat = location.latitude;
		breakfastLng = location.longitude;
	});
}

function init() {

	// Go to "iOS Simulator -> Debug -> Location -> Custom Location" and enter
	// lat = 29.76429
	// lon = -95.38370
	getUserCoordinates();

	setQuoteOfTheDay();

	$.myDay.open();
}

init();
