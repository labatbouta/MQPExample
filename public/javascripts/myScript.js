/**
 * Created by lisabatbouta on 2/11/15.
 */
var map;
var markers = [];
var dis;
var hashMap = {};
var MarkersInChoice = [];
var startIndex = 1;

function calculateRadius() {
    bounds = map.getBounds();

    center = bounds.getCenter();
    ne = bounds.getNorthEast();

    // r = radius of the earth in statute miles
    var r = 3963.0;

    // Convert lat or lng from decimal degrees into radians (divide by 57.2958)
    var lat1 = center.lat() / 57.2958;
    var lon1 = center.lng() / 57.2958;
    var lat2 = ne.lat() / 57.2958;
    var lon2 = ne.lng() / 57.2958;

    // distance = circle radius from center to Northeast corner of bounds
    dis = r * 750 * Math.acos(Math.sin(lat1) * Math.sin(lat2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1));

}

function clearResults() {
    var results = document.getElementById('resultsTable');
    while (results.childNodes[0]) {
        results.removeChild(results.childNodes[0]);
    }
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        deleteMarkers();
        clearResults();
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
            addResult(results[i], i);

        }
    }
}


function addResult(result, i) {
    var results = document.getElementById('resultsTable');

    var tr = document.createElement('tr');


    var selectTd = document.createElement('td');
    selectTd.setAttribute("id", i + "markerMove");
    var nameTd = document.createElement('td');
    nameTd.setAttribute("id", i + "marker");

    selectTd.onclick= function () {
        var key = markers[i].getTitle();
        if (key in hashMap) {

        }
        else {
            MarkersInChoice.push(markers[i].getTitle());
            hashMap[markers[i].getTitle()] = i;
            createTable(markers[i].getTitle(), startIndex);
            startIndex += 1;

        }
    };
    nameTd.onclick= function () {
        google.maps.event.trigger(markers[i], 'click');

    };


    var imgX = document.createElement('img');
    imgX.src = "images/Down_Arrow_Icon.png";
    imgX.style.height = '50px';
    imgX.style.width = '50px';

    var name = document.createTextNode(result.name);
    nameTd.appendChild(name);
    selectTd.appendChild(imgX);
    tr.appendChild(selectTd);
    tr.appendChild(nameTd);
    results.appendChild(tr);
}

function createTable (result, i){
    var choices = document.getElementById('choiceTable');
    var tr = document.createElement('tr');
    tr.setAttribute("id", i + "markerNameXX");

    var imgXX = document.createElement('img');
    imgXX.src = "images/X.png";
    imgXX.style.height = '50px';
    imgXX.style.width = '50px';

    var selectTd = document.createElement('td');
    var nameTd = document.createElement('td');
   tr.onclick = function () {
        var key = markers[i].getTitle();
        if (key in hashMap) {
            delete key;
            $(this).remove();
            startIndex-=1;

        }
        else {
            $(this).remove();
            startIndex-=1;
        }
    };


    var name = document.createTextNode(result);
    nameTd.appendChild(name);
    selectTd.appendChild(imgXX);
    tr.appendChild(selectTd);
    tr.appendChild(nameTd);
    choices.appendChild(tr);
}


function createMarker(place) {
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        title: place.name
    });
    if (!markers.indexOf(marker) > -1) {
        markers.push(marker);
    }

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(place.name + "<br/>" + place.vicinity);
        infowindow.open(map, this);
    });
}

// Sets the map on all markers in the array.
function setAllMap(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function deleteMarkers() {
    setAllMap(null);
    markers = [];
}




function initialize() {


    var mapOptions = {
        zoom: 7,
        center: new google.maps.LatLng(42.2667, -71.8000),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControlOptions: {
            position: google.maps.ControlPosition.TOP_LEFT
        }
    };
    map = new google.maps.Map(document.getElementById('anotherbackground'),
        mapOptions);

    // Create the search box and link it to the UI element.
    var input = /** @type {HTMLInputElement} */(
        document.getElementById('pac-input'));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var searchBox = new google.maps.places.SearchBox(
        /** @type {HTMLInputElement} */(input));

    // [START region_getplaces]
    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    google.maps.event.addListener(searchBox, 'places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }
        if(markers.length>0){

            for (var i = 0, marker; marker = markers[i]; i++) {
                marker.setMap(null);
            }
        }




        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, place; place = places[i]; i++) {

            bounds.extend(place.geometry.location);
        }

        map.fitBounds(bounds);

        if (map.getZoom() > 16) map.setZoom(16);
        calculateRadius();
        var request = {
            location: map.getCenter(),
            radius: dis,
            types: ['lodging']
        };
        service.nearbySearch(request, callback);

    });
    // [END region_getplaces]

    // Bias the SearchBox results towards places that are within the bounds of the
    // current map's viewport.
    google.maps.event.addListener(map, 'bounds_changed', function () {
        var bounds = map.getBounds();
        searchBox.setBounds(bounds);

    });


    service = new google.maps.places.PlacesService(map);
    infowindow = new google.maps.InfoWindow();


}


$(document).ready(
    google.maps.event.addDomListener(window, 'load', initialize)

);


$(function () {
    if(markers.length > 0){
        for (var i = 0; i < markers.length; i++) {
            var markerx = $("#" + i + "markerMove");
            $(markerx).click(function(){
                    var key = markers[i].getTitle();
                    if (key in hashMap) {

                    }
                    else {
                        MarkersInChoice.push(markers[i].getTitle());
                        hashMap[markers[i].getTitle()] = i;
                        createTable(markers[i].getTitle(), startIndex);
                        startIndex += 1;


                    }

                });
        }


        /* end of last marker method*/
    }



});
