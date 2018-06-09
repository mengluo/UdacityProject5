// These are the real listings that will be shown to the user.
// Normally we'd have these in a database instead.
var initialListItems = [
	{
		name : 'Queen Mary, University of London',
		location : [
			{latitude : 51.5240671},
			{longitude : -0.0403745}
		],
		markerIndex : 0
	},
	{
		name : 'Whitechapel Gallery',
		location : [
			{latitude : 51.5160375},
			{longitude : -0.0700944}
		],
		markerIndex : 1
	},
	{
		name : 'London Buddhist Centre',
		location : [
			{latitude : 51.528017},
			{longitude : -0.051233}
		],
		markerIndex : 2
	},
	{
		name : 'Mile End Hospital',
		location : [
			{latitude : 51.524507},
			{longitude : -0.042648}
		],
		markerIndex : 3
	},
	{
		name : '30 St Mary Axe',
		location : [
			{latitude : 51.5144579},
			{longitude : -0.08025109999999999}
		],
		markerIndex : 4
	}
]

var ListItem = function(data) {
	this.name = ko.observable(data.name);
	this.location = ko.observableArray(data.location);
	this.markerIndex = data.markerIndex;
}

var viewModel = function() {
	var self = this;

	this.largeInfowindow;
	// Create a new blank dictionary for all the listing markers.
	this.markers;
	this.listItems = ko.observableArray([]);
	initialListItems.forEach(function(listItem) {
		self.listItems.push(new ListItem(listItem));
	});

	this.filterName = ko.observable('');

	this.filteredItems = ko.computed(function() {
		var filterName = self.filterName().toLowerCase();
		if(!filterName){
			return self.listItems();
		}
		else{
			return ko.utils.arrayFilter(self.listItems(), function(item){
				return stringStartsWith(item.name().toLowerCase(), filterName)
			})
		}
	}, this);

	this.selectedItem = ko.observable( this.filteredItems()[0] );

	this.setSelectedItem = function(clickedItem) {
		self.selectedItem(clickedItem);
		animateMarker(clickedItem.markerIndex);
		populateInfoWindow(clickedItem.markerIndex);
	};

	this.keyUp = function(d,e){
		if(self.filteredItems().length == self.listItems().length){
			enableAllMarkersVisibility();
		}
		else{
			updateMarkersVisibility(self.filteredItems());
		}
		return true;
	};

	// close existing open window when start typing in filter field
	this.keyPress = function(d,e){
		viewModel.largeInfowindow.close();
		return true;
	};
}

// This function makes only the item that appears in list display its marker in map
function updateMarkersVisibility(filteredItems) {
	var markers = viewModel.markers;
	for(var key in markers){
		markers[key].setVisible(false);
	}

	for(var index in filteredItems){
		markers[filteredItems[index].markerIndex].setVisible(true);
	}
}

// This function makes all markers visible when user is done with filtering
function enableAllMarkersVisibility(){
	var markers = viewModel.markers;
	for(var key in markers){
		markers[key].setVisible(true);
	}
}

// find any matching string starts with the specified substring
// code attribution from https://stackoverflow.com/questions/28042344/filter-using-knockoutjs
var stringStartsWith = function (string, startsWith) {
    string = string || "";
    if (startsWith.length > string.length)
        return false;
    return string.substring(0, startsWith.length) === startsWith;
};

ko.applyBindings(new viewModel());

// Note: some of the code below in initMap() and populateInfoWindow() is
// from Udacity Full-stack Deveoper Nanodegree Course
function initMap() {
	// Create a styles array to use with the map.
	var styles = [
	{
		featureType: 'water',
		stylers: [
			{ color: '#19a0d8' }
		]
    },
	{
		featureType: 'administrative',
		elementType: 'labels.text.stroke',
		stylers: [
			{ color: '#ffffff' },
			{ weight: 6 }
		]
	},
	{
		featureType: 'administrative',
		elementType: 'labels.text.fill',
		stylers: [
			{ color: '#e85113' }
		]
	},
	{
		featureType: 'road.highway',
		elementType: 'geometry.stroke',
		stylers: [
			{ color: '#efe9e4' },
			{ lightness: -40 }
		]
	},
	{
		featureType: 'transit.station',
		stylers: [
			{ weight: 9 },
			{ hue: '#e85113' }
		]
	},
	{
		featureType: 'road.highway',
		elementType: 'labels.icon',
		stylers: [
			{ visibility: 'off' }
		]
	},
	{
		featureType: 'water',
		elementType: 'labels.text.stroke',
		stylers: [
			{ lightness: 100 }
		]
	},
	{
		featureType: 'water',
		elementType: 'labels.text.fill',
		stylers: [
			{ lightness: -100 }
		]
	},
	{
		featureType: 'poi',
		elementType: 'geometry',
		stylers: [
			{ visibility: 'on' },
			{ color: '#f0e4d3' }
		]
	},
	{
		featureType: 'road.highway',
		elementType: 'geometry.fill',
		stylers: [
			{ color: '#efe9e4' },
			{ lightness: -25 }
		]
	}
	];

	// Constructor creates a new map
	var map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 51.5200000, lng: -0.057000},
		zoom: 10,
		styles: styles,
		mapTypeControl: true
	});

	viewModel.largeInfowindow = new google.maps.InfoWindow();
	viewModel.markers = {};
	// Style the markers a bit. This will be our listing marker icon.
	var defaultIcon = makeMarkerIcon('0091ff');

	// Create a "highlighted location" marker color for when the user
	// mouses over the marker.
	var highlightedIcon = makeMarkerIcon('FFFF24');

	// The following group uses the initialListItems to create an array of markers on initialize.
	for (var index in initialListItems) {
		// Get the position from the initialListItems.
		var position = {lat:  initialListItems[index].location[0].latitude, lng: initialListItems[index].location[1].longitude};
		var title = initialListItems[index].name;

		// Create a marker per location, and assign its id with each location's specified marker index.
		var marker = new google.maps.Marker({
			position: position,
			title: title,
			animation: google.maps.Animation.DROP,
			icon: defaultIcon,
			id: initialListItems[index].markerIndex
		});

		// Create an onclick event to open the large infowindow at each marker.
		marker.addListener('click', function() {
			animateMarker(this['id']);
			populateInfoWindow(this['id']);
		});

		// Two event listeners - one for mouseover, one for mouseout,
		// to change the colors back and forth.
		marker.addListener('mouseover', function() {
			this.setIcon(highlightedIcon);
		});
		marker.addListener('mouseout', function() {
			this.setIcon(defaultIcon);
		});

		// save markers based on its relevant marker index.
		viewModel.markers[initialListItems[index].markerIndex] = marker;
	}

	showListings(map, viewModel.markers);
}

// This function will loop through the markers dict and display them all.
function showListings(map, markers) {
	var bounds = new google.maps.LatLngBounds();
	// Extend the boundaries of the map for each marker and display the marker
	for (var key in markers) {
		markers[key].setMap(map);
		bounds.extend(markers[key].position);
	}
	map.fitBounds(bounds);
}

// This function makes the marker bounce for 1 second when the marker is clicked.
function animateMarker(markerIndex) {
	var marker = viewModel.markers[markerIndex];
	marker.setAnimation(google.maps.Animation.BOUNCE);
	setTimeout(function() {marker.setAnimation(null)}, 1000);
}

// This function populates the infowindow when the marker is clicked. Only one infowindow
// is allowed to be open at the marker that is clicked. And it is populate based on that
// marker's position.
function populateInfoWindow(markerIndex) {
	var marker = viewModel.markers[markerIndex];
	var infowindow = viewModel.largeInfowindow;

	// Check to make sure the infowindow is not already opened on this marker.
	if (infowindow.marker != marker) {
		// Clear the infowindow content to give the streetview time to load.
		var content = '';
		infowindow.setContent(content);
		infowindow.marker = marker;
		// Make sure the marker property is cleared if the infowindow is closed.
		infowindow.addListener('closeclick', function() {
		infowindow.marker = null;
		});

		content = '<h3>' + marker.title + '</h3>'+'<div id="pano"></div><div class="wikipedia-container"><h3 id="wikipedia-header">Relevant Wikipedia Links</h3><ul id="wikipedia-links"></ul></div>';
		var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+marker.title+'&format=json&callback=wikicallback';
		var wikiRequestTimeout = setTimeout(function(){
			$('#wikipedia-links').text("Failed to get wikipedia resources.");
		}, 2000);
		$.ajax({
			url: wikiUrl,
			dataType: "jsonp",
			success: function(response){
				var articleList = response[1];

				for(var i=0; i<articleList.length; i++){
					articleStr = articleList[i];
					var url = 'http://en.wikipedia.org/wiki/'+articleStr;
					$('#wikipedia-links').append('<li><a href="'+url+'">'+articleStr+'</a></li>');
				}

				clearTimeout(wikiRequestTimeout);
			}
		});

		var streetViewService = new google.maps.StreetViewService();
		var radius = 50;
		// In case the status is OK, which means the pano was found, compute the
		// position of the streetview image, then calculate the heading, then get a
		// panorama from that and set the options

	function getStreetView(data, status) {
		if (status == google.maps.StreetViewStatus.OK) {
			var nearStreetViewLocation = data.location.latLng;
			var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);
			infowindow.setContent(content);
			var panoramaOptions = {
				position: nearStreetViewLocation,
				pov: {
					heading: heading,
					pitch: 30
				}
			};
			var panorama = new google.maps.StreetViewPanorama(
			document.getElementById('pano'), panoramaOptions);
		}
		else {
			content = '<div>No Street View Found</div>' + content;
			infowindow.setContent(content);
		}
	}
		// Use streetview service to get the closest streetview image within
		// 50 meters of the markers position
		streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);

		// Open the infowindow on the correct marker.
		infowindow.open(map, marker);
	}
}

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
	var markerImage = new google.maps.MarkerImage(
		'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+  markerColor + '|40|_|%E2%80%A2',
		new google.maps.Size(21, 34),
		new google.maps.Point(0, 0),
		new google.maps.Point(10, 34),
		new google.maps.Size(21,34));
	return markerImage;
}
