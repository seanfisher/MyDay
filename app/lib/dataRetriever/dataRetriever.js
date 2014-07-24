function fetchDataFromUrl(url, onSuccess) {
	var client = Ti.Network.createHTTPClient({
		onload : function(e) {
			json = JSON.parse(this.responseText);
			Ti.API.debug(json);
			onSuccess(json);
		},
		onerror : function(e) {
			Ti.API.debug(e.error);
			alert("Could not retrieve any data =(");
		}
	});
	client.open("GET", url);
	client.send();
}

module.exports.fetchDataFromUrl = fetchDataFromUrl;
