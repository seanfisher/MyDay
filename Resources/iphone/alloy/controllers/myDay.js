function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
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
        switch (weather) {
          case "Rain":
            $.weatherIcon.image = "/weatherIcons/rain_light.png";
            break;

          case "Clouds":
            $.weatherIcon.image = "/weatherIcons/clouds_light.png";
            break;

          case "Sunny":
            $.weatherIcon.image = "/weatherIcons/sunny_light.png";
            break;

          default:
            $.weatherIcon.image = "/weatherIcons/snowy_light.png";
        }
    }
    function getUserCoordinates() {
        Titanium.Geolocation.getCurrentPosition(updateLocation);
        Titanium.Geolocation.addEventListener("location", updateLocation);
    }
    function updateLocation(e) {
        if (!e.success || e.error) {
            Ti.API.info("Couldn't get location: " + JSON.stringify(e));
            return;
        }
        Ti.Geolocation.removeEventListener("location", updateLocation);
        Ti.API.info(JSON.stringify(e));
        lat = e.coords.latitude;
        lng = e.coords.longitude;
        setWeatherDataByCoordinates();
        getListOfPlacesFromYelp(lat, lng);
    }
    function setQuoteOfTheDay() {
        var url = "http://iheartquotes.com/api/v1/random?format=json&source=wisdom";
        dataRetriever.fetchDataFromUrl(url, function(quoteData) {
            quoteData && ($.quoteText.text = quoteData.quote);
        });
    }
    function openBreakfastLocationInMaps() {
        openLocationInMapsiOS(breakfastLat, breakfastLng, breakfastName);
    }
    function openLocationInMapsiOS(latitude, longitude, name) {
        if (name) {
            name = Ti.Network.encodeURIComponent(name);
            Ti.Platform.openURL("http://maps.apple.com/?q=" + name + "&sll=" + latitude + "," + longitude);
        } else Ti.Platform.openURL("http://maps.apple.com/?ll=" + latitude + "," + longitude);
    }
    function getListOfPlacesFromYelp(latitude, longitude) {
        function success(data) {
            Ti.API.info("success");
            randomlyPickAPlaceForBreakfast(data);
        }
        function failure() {
            Ti.API.info("failed");
            alert("Yelp failed! Noooooooo");
        }
        var oauth = OAuth({
            consumerKey: "---CONSUMER-KEY-HERE---",
            consumerSecret: "---CONSUMER-SECRET-KEY-HERE---",
            accessTokenKey: "---ACCESS-TOKEN-KEY-HERE---",
            accessTokenSecret: "---ACCESS-TOKEN-SECRET-KEY-HERE---"
        });
        oauth.get("http://api.yelp.com/v2/search?term=breakfast&ll=" + latitude + "," + longitude + "&radius_filter=4000", success, failure);
    }
    function randomlyPickAPlaceForBreakfast(listOfAllPlaces) {
        var allText = JSON.parse(listOfAllPlaces.text);
        var businesses = allText.businesses;
        var businesses_length = businesses.length;
        var random_number = Math.floor(Math.random() * businesses_length);
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
        getUserCoordinates();
        setQuoteOfTheDay();
        $.myDay.open();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "myDay";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.myDay = Ti.UI.createWindow({
        navBarHidden: true,
        backgroundGradient: {
            type: "linear",
            startPoint: {
                x: "50%",
                y: "0%"
            },
            endPoint: {
                x: "50%",
                y: "100%"
            },
            colors: [ {
                color: "#00A8C6",
                offset: 0
            }, {
                color: "#40C0CB",
                offset: 1
            } ]
        },
        id: "myDay"
    });
    $.__views.myDay && $.addTopLevelView($.__views.myDay);
    $.__views.mainView = Ti.UI.createView({
        top: "8%",
        layout: "vertical",
        id: "mainView"
    });
    $.__views.myDay.add($.__views.mainView);
    $.__views.mainScrollView = Ti.UI.createScrollView({
        scrollType: "vertical",
        layout: "vertical",
        id: "mainScrollView"
    });
    $.__views.mainView.add($.__views.mainScrollView);
    $.__views.__alloyId2 = Ti.UI.createView({
        height: "10%",
        width: "90%",
        id: "__alloyId2"
    });
    $.__views.mainScrollView.add($.__views.__alloyId2);
    $.__views.__alloyId3 = Ti.UI.createLabel({
        color: "#FFF",
        font: {
            fontFamily: "Helvetica neue",
            fontSize: 30,
            fontWeight: "normal"
        },
        width: "100%",
        left: "3%",
        textAlign: "left",
        text: "Current weather",
        id: "__alloyId3"
    });
    $.__views.__alloyId2.add($.__views.__alloyId3);
    $.__views.__alloyId4 = Ti.UI.createView({
        width: "100%",
        height: 1,
        backgroundColor: "white",
        bottom: 0,
        id: "__alloyId4"
    });
    $.__views.__alloyId2.add($.__views.__alloyId4);
    $.__views.__alloyId5 = Ti.UI.createView({
        height: Ti.UI.SIZE,
        width: "80%",
        top: "10dip",
        id: "__alloyId5"
    });
    $.__views.mainScrollView.add($.__views.__alloyId5);
    $.__views.weatherIcon = Ti.UI.createImageView({
        left: 5,
        right: 5,
        top: 15,
        width: 64,
        color: "white",
        id: "weatherIcon",
        image: "/weatherIcons/snowy_light.png"
    });
    $.__views.__alloyId5.add($.__views.weatherIcon);
    $.__views.cityName = Ti.UI.createLabel({
        color: "#FFF",
        font: {
            fontFamily: "Helvetica Neue",
            fontSize: 24,
            fontWeight: "bold"
        },
        top: 4,
        bottom: 4,
        height: "auto",
        right: 0,
        width: "70%",
        textAlign: "center",
        text: "Houston",
        id: "cityName"
    });
    $.__views.__alloyId5.add($.__views.cityName);
    $.__views.currentWeather = Ti.UI.createLabel({
        color: "#FFF",
        font: {
            fontFamily: "Helvetica Neue",
            fontSize: 20,
            fontWeight: "bold"
        },
        top: 50,
        right: 0,
        bottom: 4,
        height: 50,
        width: "70%",
        textAlign: "center",
        text: "85 °F",
        id: "currentWeather"
    });
    $.__views.__alloyId5.add($.__views.currentWeather);
    $.__views.__alloyId6 = Ti.UI.createView({
        height: "10%",
        width: "90%",
        top: "7%",
        id: "__alloyId6"
    });
    $.__views.mainScrollView.add($.__views.__alloyId6);
    $.__views.__alloyId7 = Ti.UI.createLabel({
        color: "#FFF",
        font: {
            fontFamily: "Helvetica neue",
            fontSize: 30,
            fontWeight: "normal"
        },
        width: "100%",
        left: "3%",
        textAlign: "left",
        text: "Quote of the day",
        id: "__alloyId7"
    });
    $.__views.__alloyId6.add($.__views.__alloyId7);
    $.__views.__alloyId8 = Ti.UI.createView({
        width: "100%",
        height: 1,
        backgroundColor: "white",
        bottom: 0,
        id: "__alloyId8"
    });
    $.__views.__alloyId6.add($.__views.__alloyId8);
    $.__views.__alloyId9 = Ti.UI.createView({
        height: Ti.UI.SIZE,
        width: "80%",
        top: "10dip",
        id: "__alloyId9"
    });
    $.__views.mainScrollView.add($.__views.__alloyId9);
    $.__views.quoteText = Ti.UI.createLabel({
        color: "#FFF",
        font: {
            fontFamily: "Arial-ItalicMT",
            fontSize: 16,
            fontWeight: "italic"
        },
        textAlign: "center",
        width: "100%",
        height: Ti.UI.SIZE,
        text: "“Quality is much better than quantity. One home run is much better than two doubles.”",
        id: "quoteText"
    });
    $.__views.__alloyId9.add($.__views.quoteText);
    $.__views.__alloyId10 = Ti.UI.createView({
        height: "10%",
        width: "90%",
        top: "7%",
        id: "__alloyId10"
    });
    $.__views.mainScrollView.add($.__views.__alloyId10);
    $.__views.__alloyId11 = Ti.UI.createLabel({
        color: "#FFF",
        font: {
            fontFamily: "Helvetica neue",
            fontSize: 30,
            fontWeight: "normal"
        },
        width: "100%",
        left: "3%",
        textAlign: "left",
        text: "Breakfast place",
        id: "__alloyId11"
    });
    $.__views.__alloyId10.add($.__views.__alloyId11);
    $.__views.__alloyId12 = Ti.UI.createView({
        width: "100%",
        height: 1,
        backgroundColor: "white",
        bottom: 0,
        id: "__alloyId12"
    });
    $.__views.__alloyId10.add($.__views.__alloyId12);
    $.__views.__alloyId13 = Ti.UI.createView({
        height: Ti.UI.SIZE,
        width: "80%",
        top: "10dip",
        id: "__alloyId13"
    });
    $.__views.mainScrollView.add($.__views.__alloyId13);
    openBreakfastLocationInMaps ? $.__views.__alloyId13.addEventListener("click", openBreakfastLocationInMaps) : __defers["$.__views.__alloyId13!click!openBreakfastLocationInMaps"] = true;
    $.__views.mapIcon = Ti.UI.createImageView({
        left: 0,
        width: 24,
        id: "mapIcon",
        image: "/map_light.png"
    });
    $.__views.__alloyId13.add($.__views.mapIcon);
    $.__views.locationName = Ti.UI.createLabel({
        color: "#FFF",
        font: {
            fontFamily: "Helvetica Neue",
            fontSize: 20,
            fontWeight: "bold"
        },
        textAlign: "center",
        width: "80%",
        right: 0,
        id: "locationName"
    });
    $.__views.__alloyId13.add($.__views.locationName);
    $.__views.__alloyId14 = Ti.UI.createView({
        height: "60dip",
        width: "100%",
        backgroundColor: "transparent",
        id: "__alloyId14"
    });
    $.__views.mainScrollView.add($.__views.__alloyId14);
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    var dataRetriever = require("dataRetriever/dataRetriever");
    var OAuth = require("jsOAuth").OAuth;
    Ti.Geolocation.purpose = "We need your location to display the weather and suggest a breakfast location";
    Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_HIGH;
    var lat;
    var lng;
    var breakfastLat;
    var breakfastLng;
    var breakfastName;
    init();
    __defers["$.__views.__alloyId13!click!openBreakfastLocationInMaps"] && $.__views.__alloyId13.addEventListener("click", openBreakfastLocationInMaps);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;