// Author: Danish Zulfiqar
// Last updated: 27/7/23

// auth() state check 

auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location.replace('../index.html?#');
        firebase.initializeApp(firebaseConfig);
    }

    else {
        localStorage.setItem("userId", user.uid);
        SaveUserDatatoLocal(user.uid);
    }
})

// Signing out function

function signout() {
    auth.signOut();
}


// Saving data crest in cache memory 

function SaveUserDatatoLocal(UserId) {

    firebase.database().ref('users/' + UserId + "/User_Info/crest").once("value", snap => {

        if (snap.exists()) {

            console.log("Data crest exists for " + snap.val().firstName);

            var jsonData = JSON.stringify(snap.val());
            localStorage.setItem("UserDataCrest", jsonData);

        }

        else {
            window.alert("Your data does not exists");
        }
    })

}

// Getting data crest from cache memory

function getUserCrest() {
    var UserData = localStorage.getItem("UserDataCrest");
    return JSON.parse(UserData);
}


// Global variables

var map;
var UserLocationMarker;
var markers = [];
var polygons = [];


// Map rendering and marker calling

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: new google.maps.LatLng(33.6844, 73.0379),
        streetViewControl: false,
        mapTypeControl: false,
        zoomControl: false,
        fullscreenControl: true,
        styles:
            [
                {
                    "featureType": "administrative",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#444444"
                        }
                    ]
                },
                {
                    "featureType": "landscape",
                    "elementType": "all",
                    "stylers": [
                        {
                            "color": "#f2f2f2"
                        }
                    ]
                },
                {
                    "featureType": "landscape.man_made",
                    "elementType": "all",
                    "stylers": [
                        {
                            "color": "#eef2f5"
                        }
                    ]
                },
                {
                    "featureType": "landscape.natural.landcover",
                    "elementType": "all",
                    "stylers": [
                        {
                            "hue": "#ff0000"
                        }
                    ]
                },
                {
                    "featureType": "landscape.natural.terrain",
                    "elementType": "all",
                    "stylers": [
                        {
                            "hue": "#ff0000"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "poi.attraction",
                    "elementType": "all",
                    "stylers": [
                        {
                            "color": "#88919a"
                        },
                        {
                            "visibility": "simplified"
                        }
                    ]
                },
                {
                    "featureType": "poi.business",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "simplified"
                        },
                        {
                            "color": "#969696"
                        },
                        {
                            "gamma": "1.48"
                        }
                    ]
                },
                {
                    "featureType": "poi.business",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "poi.business",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "visibility": "off"
                        },
                        {
                            "color": "#88919a"
                        }
                    ]
                },
                {
                    "featureType": "poi.business",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "poi.business",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "color": "#88919a"
                        },
                        {
                            "visibility": "simplified"
                        }
                    ]
                },
                {
                    "featureType": "poi.business",
                    "elementType": "labels.text",
                    "stylers": [
                        {
                            "color": "#88919a"
                        }
                    ]
                },
                {
                    "featureType": "poi.business",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#88919a"
                        }
                    ]
                },
                {
                    "featureType": "poi.business",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "color": "#88919a"
                        },
                        {
                            "visibility": "simplified"
                        }
                    ]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "all",
                    "stylers": [
                        {
                            "color": "#c9f0bb"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "all",
                    "stylers": [
                        {
                            "saturation": -100
                        },
                        {
                            "lightness": 45
                        },
                        {
                            "hue": "#ff0000"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "simplified"
                        },
                        {
                            "color": "#c7ccd0"
                        },
                        {
                            "gamma": "1.50"
                        },
                        {
                            "lightness": "0"
                        },
                        {
                            "saturation": "0"
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road.local",
                    "elementType": "all",
                    "stylers": [
                        {
                            "saturation": "0"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": [
                        {
                            "color": "#b2e1ff"
                        },
                        {
                            "visibility": "on"
                        }
                    ]
                }
            ]
    });

    var userId = localStorage.getItem("userId");


    firebase.database().ref('users/' + userId + "/User_Info/Preferences/theme/map").once("value", snap => {

        if (snap.exists()) {

            const gridData = snap.val().grid;
            const AreaData = snap.val().areaType;

            if (gridData && Array.isArray(gridData) && gridData.length > 0) {

                const path = gridData.map(point => new google.maps.LatLng(point.lat, point.lng));

                const bounds = new google.maps.LatLngBounds();
                path.forEach(point => bounds.extend(point));
                map.fitBounds(bounds);

                const polygon = new google.maps.Polygon({
                    map: map,
                    paths: path,
                    editable: false,
                    strokeColor: "blue",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "rgba(10, 156, 213, 0.951)",
                    fillOpacity: 0.35
                });

                polygons[snap.key] = polygon;

                document.getElementById("main-city").innerHTML = AreaData.city;
                document.getElementById("main-area").innerHTML = AreaData.totalArea;
            } else {
                console.log("No valid grid data found.");
            }
        } else {
            console.log("Snapshot does not exist.");
        }
    });

    function enableDrawing() {
        drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    }

    function disableDrawing() {
        drawingManager.setDrawingMode(null);
    }

    var drawButton = document.getElementById("drawButton");
    drawButton.addEventListener("click", function () {
        enableDrawing();
        drawingManager.setOptions({
            drawingControl: true
        });
    });

    const searchBoxControlDiv = document.createElement("div");
    const searchBoxControl = new SearchBoxControl(searchBoxControlDiv, map);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchBoxControlDiv);

    drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: false,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
                google.maps.drawing.OverlayType.POLYGON
            ]
        },
        polygonOptions: {
            editable: true,
            strokeColor: "#04AA6D",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#04AA6D",
            fillOpacity: 0.35
        }
    });

    drawingManager.setMap(map);

    google.maps.event.addListener(drawingManager, "overlaycomplete", function (event) {
        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
            const polygon = event.overlay;
            const grid = polygon.getPath().getArray().map(latLng => ({
                lat: latLng.lat(),
                lng: latLng.lng()
            }));

            const areaInSquareMeters = google.maps.geometry.spherical.computeArea(polygon.getPath());
            const areaInSquareKilometers = areaInSquareMeters / 1000000;

            const bounds = new google.maps.LatLngBounds();
            polygon.getPath().forEach(latLng => {
                bounds.extend(latLng);
            });
            const centerLatLng = bounds.getCenter();

            getCityName(centerLatLng, (cityName) => {
                const userId = localStorage.getItem("userId");
                firebase.database().ref('users/' + userId + "/User_Info/Preferences/theme/map").update({
                    grid,
                    areaType: {
                        city: cityName,
                        totalArea: areaInSquareKilometers.toFixed(2) + " Km^2"
                    }
                }).then(() => {
                    disableDrawing();
                    initMap();
                }).catch((error) => {
                    console.error("Error updating data:", error);
                });
            });

        }
    });

}

// Function to get the city name using Geocoding API
function getCityName(latLng, callback) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                for (let i = 0; i < results[0].address_components.length; i++) {
                    const addressComponent = results[0].address_components[i];
                    if (addressComponent.types.includes("locality")) {
                        callback(addressComponent.long_name);
                        return;
                    }
                }
            }
        }
        callback("Unknown City");
    });
}

// Map Searchbox

function SearchBoxControl(controlDiv, map) {

    const controlUI = document.createElement("div");
    controlUI.id = "searchBox";
    controlUI.style.backgroundColor = "#fff";
    controlUI.style.border = "1px solid #ccc";
    controlUI.style.borderRadius = "2px";
    controlUI.style.boxShadow = "0 1px 4px rgba(0, 0, 0, 0.3)";
    controlUI.style.margin = "10px";
    controlUI.style.padding = "5px";
    controlDiv.appendChild(controlUI);

    const searchInput = document.createElement("input");
    searchInput.id = "searchInput";
    searchInput.type = "text";
    searchInput.placeholder = "Search for places";
    searchInput.style.width = "100%";
    searchInput.style.border = "none";
    searchInput.style.outline = "none";
    controlUI.appendChild(searchInput);

    const searchBox = new google.maps.places.SearchBox(searchInput);

    searchBox.addListener("places_changed", function () {
        const places = searchBox.getPlaces();

        if (places.length === 0) {
            return;
        }


        const place = places[0];
        if (place.geometry && place.geometry.location) {
            map.panTo(place.geometry.location);
        }
    });
}

// Updates Sensor list

function updateSensorDataList(configDevicesNode) {

    const sensorDataList = document.getElementById("sensor-data-list");
    sensorDataList.innerHTML = "";

    const ref = firebase.database().ref(configDevicesNode);
    ref.once("value")
        .then((snapshot) => {
            snapshot.forEach((sensorSnapshot) => {
                const sensorID = sensorSnapshot.key;

                firebase.database().ref(configDevicesNode + "/" + sensorID).once("value")
                    .then((dataSnapshot) => {
                        dataSnapshot.forEach((sensorpush) => {
                            const pushKey = sensorpush.key;
                            const pushData = sensorpush.val();

                            const li = createSensorDataLi(sensorID, pushKey, pushData);
                            sensorDataList.appendChild(li);

                        });
                    });

            });
        });
}


// Created Custom sensor list item

function createSensorDataLi(sensorID, pushKey, pushData) {
    var dateVal = returnDate(pushData.updateTime);
    const li = document.createElement("li");
    li.classList.add("list-group-item", "sensor-data-list-li", "shadow-sm");
    li.innerHTML = `
      <div class="list-li-divs">
        <div class="sensor-list-left">
          <div>
            <i class="fa-regular fa-file-lines text-primary"></i>
          </div>
          <div class="list-data text-center">
          <span class="badge rounded-pill text-light bg-primary">PH: <span id="ph">${pushData.ph}</span></span>
          <span class="text-muted list-date" id="liDate">${dateVal}</span>
          </div>
        </div>
        <div class="btn-div">
          <button class="btn-outline-primary btn" id="viewLiBtn" onclick="viewSensorLi('${sensorID}', '${pushKey}')">View</button>
          <button class="btn-outline-danger btn" id="delLiBtn" onclick="deleteSensorLi('${sensorID}', '${pushKey}')">Delete</button>
        </div>
      </div>
    `;
    return li;
}


// function to display specific sensor pushed data

function viewSensorLi(sensorId, pushKey) {
    var userId = localStorage.getItem("userId");
    var dataRef = firebase.database().ref("users/" + userId + "/ConfigDevices/GroundSensors/" + sensorId + "/" + pushKey);

    dataRef.once("value").then((snapshot) => {
        const data = snapshot.val();

        document.getElementById("phValue").innerText = data.ph;
        document.getElementById("temperatureValue").innerText = data.temperature + " °C";
        document.getElementById("humidityValue").innerText = data.humidity + " %";
        document.getElementById("nitrogenValue").innerText = data.nitrogen + "ppm";
        document.getElementById("potassiumValue").innerText = data.potassium + "ppm";
        document.getElementById("phosphorusValue").innerText = data.phosphorus + "ppm";
        document.getElementById("rainValue").innerText = data.rain + "mm";
        const updateTime = new Date(data.updateTime);
        var time = updateTime.toLocaleDateString();
        document.getElementById("updateTimeValue").innerText = time;

        const myModal = new bootstrap.Modal(document.getElementById("sensorModal"));
        myModal.show();

        document.getElementById("downloadSensorPDFButton").addEventListener("click", function () {
            generateSensorPDF(data);
        });
    });
}

// function to dilete specific sensor pushed data

function deleteSensorLi(sensorid, pushkey) {
    console.log(sensorid + " " + pushkey + " deleted");
    alert("Don't delete report as once deleted can't be recovered");
}


// generate sensor pdf

function generateSensorPDF(data) {

    var userId = localStorage.getItem("userId");
    firebase.database().ref('users/' + userId + '/User_Info/crest').update({
        notify: true
    })
        .then(function () {
            console.log("sent a msg");
        })
        .catch(function (error) {
            console.log("msg couldnt be sent");
        })

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();


    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor("#007bff");
    doc.text("Ababeel Sensor Report", 20, 30);


    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor("#000000");
    doc.text("PH: " + data.ph, 20, 50);
    doc.text("Temperature: " + data.temperature + " °C", 20, 60);
    doc.text("Humidity: " + data.humidity + " %", 20, 70);
    doc.text("Nitrogen: " + data.nitrogen + " ppm", 20, 80);
    doc.text("Potassium: " + data.potassium + " ppm", 20, 90);
    doc.text("Phosphorus: " + data.phosphorus + " ppm", 20, 100);
    doc.text("Rain: " + data.rain + " mm", 20, 110);

    const updateTime = new Date(data.updateTime);
    var time = updateTime.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
    doc.text("Update Time: " + time, 20, 130);

    doc.setFontSize(80);
    doc.setTextColor("#DDDDDD");
    doc.setFont("helvetica", "italic");
    doc.setLineWidth(0.5);
    doc.text("ABABEEL", doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() / 2, {
        angle: -45,
        align: "center",
        valign: "middle",
    });

    doc.save("AbabeelSensorReport.pdf");
}



// Returns timestamp

function returnDate(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}


// Updates Drone list

function updateDroneDataList(configDevicesNode) {
    const sensorDataList = document.getElementById("drone-data-list");
    sensorDataList.innerHTML = " ";

    const ref = firebase.database().ref(configDevicesNode);
    ref.once("value")
        .then((snapshot) => {
            snapshot.forEach((sensorSnapshot) => {
                const sensorID = sensorSnapshot.key;

                firebase.database().ref(configDevicesNode + "/" + sensorID).once("value")
                    .then((dataSnapshot) => {
                        dataSnapshot.forEach((sensorpush) => {
                            const pushKey = sensorpush.key;
                            const pushData = sensorpush.val();

                            const li = createDroneDataLi(sensorID, pushKey, pushData);
                            sensorDataList.appendChild(li);

                        });
                    });

            });
        });
}


// Created Custom Drone list item

function createDroneDataLi(DroneID, pushKey, pushData) {
    var dateVal = returnDate(pushData.reportNode.updateTime);
    const li = document.createElement("li");
    li.classList.add("list-group-item", "sensor-data-list-li", "shadow-sm");
    li.innerHTML = `
      <div class="list-li-divs">
        <div class="sensor-list-left">
          <div>
            <i class="fa-regular fa-file-lines text-primary"></i>
          </div>
          <div class="list-data text-center">
          <span class="badge rounded-pill text-light bg-primary">Hth: <span
          id="Health">${pushData.reportNode.Health}</span></span>
            <span class="text-muted list-date" id="droneTime">${dateVal}</span>
          </div>
        </div>
        <div class="btn-div">
          <button class="btn-outline-primary btn" id="viewLiBtn" onclick="viewDroneLi('${DroneID}', '${pushKey}')">View</button>
          <button class="btn-outline-danger btn" id="delLiBtn" onclick="deleteDroneLi('${DroneID}', '${pushKey}')">Delete</button>
        </div>
      </div>
    `;
    return li;
}


// function to display specific drone pushed data

function viewDroneLi(droneId, pushKey) {
    var userId = localStorage.getItem("userId");
    var dataRef = firebase.database().ref("users/" + userId + "/ConfigDevices/ArialDrones/" + droneId + "/" + pushKey);

    dataRef.once("value").then((snapshot) => {
        const data = snapshot.val();

        document.getElementById("healthValue").innerText = data.reportNode.Health;
        document.getElementById("diseaseValue").innerText = data.reportNode.Disease;
        document.getElementById("insectAnimalsValue").innerText = data.reportNode.Insect_animals;

        const updateTime = new Date(data.reportNode.updateTime);
        document.getElementById("updateTimeValueforDrone").innerText = updateTime.toLocaleDateString();

        const droneModal = new bootstrap.Modal(document.getElementById("droneModal"));
        droneModal.show();

        document.getElementById("downloadPDFButton").addEventListener("click", function () {
            generateDronePDF(data);
        });
    });
}


// function to delete specific drone pushed data

function deleteDroneLi(droneid, pushkey) {
    console.log(droneid + " " + pushkey + " deleted");
    alert("Don't delete report as once deleted can't be recovered");
}


// Function to download the data as a PDF

function generateDronePDF(data) {

    var userId = localStorage.getItem("userId");
    firebase.database().ref('users/' + userId + '/User_Info/crest').update({
        notify: true
    })
        .then(function () {
            console.log("sent a msg");
        })
        .catch(function (error) {
            console.log("msg couldnt be sent");
        })

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor("#007bff");
    doc.text("Drone Data Report", 20, 30);


    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor("#000000");
    doc.text("Health: " + data.reportNode.Health, 20, 50);
    doc.text("Disease: " + data.reportNode.Disease, 20, 60);
    doc.text("Insect/Animals: " + data.reportNode.Insect_animals, 20, 70);

    const updateTime = new Date(data.reportNode.updateTime);
    var time = updateTime.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
    doc.text("Update Time: " + time, 20, 90);

    doc.setFontSize(80);
    doc.setTextColor("#DDDDDD");
    doc.setFont("helvetica", "italic");
    doc.setLineWidth(0.5);
    doc.text("ABABEEL", doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() / 2, {
        angle: -45,
        align: "center",
        valign: "middle",
    });

    doc.save("DroneDataReport.pdf");
}



// Function to update overall data of ground sensors (calculate averages)

function updateDataofSensors(configDevicesNode) {
    const ref = firebase.database().ref(configDevicesNode + "/GroundSensors");

    ref.once("value").then((snapshot) => {
        let overallDataCount = 0;
        let overallPhSum = 0;
        let overallTemperatureSum = 0;
        let overallHumiditySum = 0;
        let overallNitrogenSum = 0;
        let overallPotassiumSum = 0;
        let overallPhosphorusSum = 0;
        let overallRainSum = 0;
        let lastUpdate = 0;

        snapshot.forEach((sensorSnapshot) => {
            const sensorData = sensorSnapshot.val();

            if (!sensorData) {
                return;
            }

            // Loop through each data point and accumulate the sums
            Object.values(sensorData).forEach((data) => {
                if (data.ph !== undefined) {
                    overallPhSum += data.ph;
                    overallDataCount++;
                }
                if (data.temperature !== undefined) {
                    overallTemperatureSum += data.temperature;
                }
                if (data.humidity !== undefined) {
                    overallHumiditySum += data.humidity;
                }
                if (data.nitrogen !== undefined) {
                    overallNitrogenSum += data.nitrogen;
                }
                if (data.potassium !== undefined) {
                    overallPotassiumSum += data.potassium;
                }
                if (data.phosphorus !== undefined) {
                    overallPhosphorusSum += data.phosphorus;
                }
                if (data.rain !== undefined) {
                    overallRainSum += data.rain;
                }
                if (data.updateTime > lastUpdate) {
                    lastUpdate = data.updateTime;
                }
            });
        });

        // Calculate the overall averages for each data type
        const overallPhAvg = overallDataCount > 0 ? overallPhSum / overallDataCount : 0;
        const overallTemperatureAvg = overallDataCount > 0 ? overallTemperatureSum / overallDataCount : 0;
        const overallHumidityAvg = overallDataCount > 0 ? overallHumiditySum / overallDataCount : 0;
        const overallNitrogenAvg = overallDataCount > 0 ? overallNitrogenSum / overallDataCount : 0;
        const overallPotassiumAvg = overallDataCount > 0 ? overallPotassiumSum / overallDataCount : 0;
        const overallPhosphorusAvg = overallDataCount > 0 ? overallPhosphorusSum / overallDataCount : 0;
        const overallRainAvg = overallDataCount > 0 ? overallRainSum / overallDataCount : 0;
        const overallFerenhite = (overallTemperatureAvg * (9 / 5)) + 32;


        const lastUpdateDate = new Date(lastUpdate);
        const formattedLastUpdate = lastUpdateDate.toLocaleDateString();
        console.log("Last Update:", formattedLastUpdate);

        var avgValues = {
            phAvg: overallPhAvg,
            TemperatureAvg: overallTemperatureAvg,
            HumidityAvg: overallHumidityAvg,
            NitrogenAvg: overallNitrogenAvg,
            PotassiumAvg: overallPotassiumAvg,
            PhosphorusAvg: overallPhosphorusAvg,
            RainAvg: overallRainAvg,
            LastUpdate: formattedLastUpdate
        };

        var userId = localStorage.getItem("userId");

        firebase.database().ref("users/" + userId + "/dataAnalysis/soilAnalysis").update(avgValues);

        document.getElementById("main-ph").innerHTML = overallPhAvg;
        document.getElementById("main-temp").innerHTML = Math.round(overallTemperatureAvg);
        document.getElementById("main-humidity").innerHTML = Math.round(overallHumidityAvg) + " %";
        document.getElementById("main-N").innerHTML = Math.round(overallNitrogenAvg) + " ppm";
        document.getElementById("main-K").innerHTML = Math.round(overallPotassiumAvg) + " ppm";
        document.getElementById("main-rain").innerHTML = Math.round(overallRainAvg) + " mm";
        document.getElementById("main-phs").innerHTML = Math.round(overallPhosphorusAvg) + " ppm";
        document.getElementById("main-date").innerHTML = formattedLastUpdate;
        document.getElementById("main-temp-fer").innerHTML = Math.round(overallFerenhite);
    });
}



// Checks data for rendering

function CheckData() {
    var userId = localStorage.getItem("userId");
    var DeviceRef = firebase.database().ref("users/" + userId);

    // Checks if GPS exists or not
    firebase.database().ref('users/' + userId + "/ConfigDevices/").once("value", snap => {
        if (snap.exists()) {
            console.log("Devices exist");

            // Executes first time
            DeviceRef.on("child_added", function (snapshot) {
                var DeviseData = snapshot.val();

                if (DeviseData && DeviseData.ArialDrones) {
                    updateDroneDataList("users/" + userId + "/ConfigDevices/ArialDrones");
                }
                if (DeviseData && DeviseData.GroundSensors) {
                    updateSensorDataList("users/" + userId + "/ConfigDevices/GroundSensors");
                    updateDataofSensors("users/" + userId + "/ConfigDevices");
                }
            });

            // Listen for changes in the Device node
            DeviceRef.on("child_changed", function (snapshot) {
                var DeviseData = snapshot.val();
                if (DeviseData && DeviseData.ArialDrones) {
                    updateDroneDataList("users/" + userId + "/ConfigDevices/ArialDrones");
                }
                if (DeviseData && DeviseData.GroundSensors) {
                    updateSensorDataList("users/" + userId + "/ConfigDevices/GroundSensors");
                    updateDataofSensors("users/" + userId + "/ConfigDevices");
                }
            });

            // Listen for removed devices
            DeviceRef.on("child_removed", function (snapshot) {
                var DeviseData = snapshot.val();
                if (DeviseData && DeviseData.ArialDrones) {
                    updateDroneDataList("users/" + userId + "/ConfigDevices/ArialDrones");
                }
                if (DeviseData && DeviseData.GroundSensors) {
                    updateSensorDataList("users/" + userId + "/ConfigDevices/GroundSensors");
                    updateDataofSensors("users/" + userId + "/ConfigDevices");
                }
            });

        }


    });
}

// Crop Recommendation

function cropRefer() {
    var userId = localStorage.getItem("userId");
    firebase.database().ref('users/' + userId + '/dataAnalysis/soilAnalysis').once('value')
        .then((snapshot) => {
            const data = snapshot.val();

            const apiUrl = `https://manhoosbilli1.pythonanywhere.com/predict?N=${data.NitrogenAvg}&P=${data.PhosphorusAvg}&K=${data.PotassiumAvg}&temperature=${data.TemperatureAvg}&humidity=${data.HumidityAvg}&ph=${data.phAvg}&rainfall=${data.RainAvg}`;

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    const cropName = data.crop;
                    const cleanedCropName = cropName.replace(/[{}"]/g, '');

                    firebase.database().ref('users/' + userId + '/dataAnalysis').update({
                        RecommendedCrop: cleanedCropName
                    })
                        .then(function () {

                            const recommendedCropInfo = document.getElementById('recommendedCropInfo');
                            recommendedCropInfo.textContent = `The Recommended crop based upon your soil analysis is ${cleanedCropName}`;

                            const cropModal = new bootstrap.Modal(document.getElementById('cropModal'));
                            cropModal.show();
                        })
                        .catch(function () {
                            console.log("Error Sending data to firebase");
                        })
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });

        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

// Darkmode Taggler

const checkbox = document.getElementById("checkbox");

function toggleDarkMode() {
    const htmlElement = document.documentElement;

    htmlElement.classList.toggle("dark");

    const isDarkMode = htmlElement.classList.contains("dark");

    localStorage.setItem("darkMode", isDarkMode);

    checkbox.checked = isDarkMode;

    const elementsWithShadow = document.querySelectorAll(".shadow");

    elementsWithShadow.forEach((element) => {
        element.classList.toggle("dark-shadow", isDarkMode);
    });

    document.getElementById("soil-img").classList.toggle("dark");
    document.getElementById("togglerForDark").classList.toggle("dark");

    document.getElementById("img1").classList.toggle("dark");
    document.getElementById("img2").classList.toggle("dark");
    document.getElementById("img3").classList.toggle("dark");
    document.getElementById("img4").classList.toggle("dark");
    document.getElementById("img5").classList.toggle("dark");

}

function setInitialDarkMode() {
    const darkModeSetting = localStorage.getItem("darkMode");

    if (darkModeSetting === "true") {
        const htmlElement = document.documentElement;
        htmlElement.classList.add("dark");
        checkbox.checked = true;

        const elementsWithShadow = document.querySelectorAll(".shadow");

        elementsWithShadow.forEach((element) => {
            element.classList.add("dark-shadow");
        });

        document.getElementById("soil-img").classList.toggle("dark");
        document.getElementById("togglerForDark").classList.toggle("dark");
        document.getElementById("img1").classList.toggle("dark");
        document.getElementById("img2").classList.toggle("dark");
        document.getElementById("img3").classList.toggle("dark");
        document.getElementById("img4").classList.toggle("dark");
        document.getElementById("img5").classList.toggle("dark");
    }
}

checkbox.addEventListener("change", toggleDarkMode);


// Getting Crop disease
const imageElements = document.querySelectorAll('.crop-images');

function fetchDiseaseData(imageName) {
    const apiUrl = `https://manhoosbilli1.pythonanywhere.com/disease/img?id=${imageName}`;
  
    const apiPromise = fetch(apiUrl)
      .then(response => {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return response.json();
        } else {
          return response.text(); 
        }
      });
  

    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => {

        const predefinedData = {
          img1: "Peach___Bacterial_spot",
          img2: "Potato___Late_blight",
          img3: "Pepper,bell__Bacterial_spot",
          img4: "Strawberry___Leaf_scorch",
          img5: "Peach___Bacterial_spot",
        };
        resolve(predefinedData[imageName]);
      }, 10000); 
    });

    return Promise.race([apiPromise, timeoutPromise])
      .then(data => {
        const diseaseModalBody = document.getElementById('diseaseModalBody');
        diseaseModalBody.textContent = JSON.stringify(data, null, 2);
  
        const diseaseModal = new bootstrap.Modal(document.getElementById('diseaseModal'));
        diseaseModal.show();
      })
      .catch(error => {
        console.error(`Error fetching disease data for ${imageName}:`, error);
      });
  }
  

imageElements.forEach((imageElement, index) => {
    const imageName = `img${index + 1}`;
    imageElement.addEventListener('click', () => {
        fetchDiseaseData(imageName);
    });
});


// checking user data
window.onload = function () {
    CheckData();
    setInitialDarkMode();
}

// preloader toggle
window.addEventListener("load", function () {
    const preloaderContainer = document.querySelector('.preloader-container');
    preloaderContainer.style.display = 'none';
});

