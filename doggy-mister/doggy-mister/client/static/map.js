async function loadMap() {
    const apiKey = "AIzaSyAyk6v-3Lqx7qfcxUNpH6Cwflik_ktbwSo";
    const loader = new google.maps.plugins.loader.Loader({ apiKey });
    const googleLoader = await loader.load();
    const geocoder = new google.maps.Geocoder();

    const user = JSON.parse(sessionStorage.getItem("LOGGED_IN_USER"));
    geocoder.geocode({ address: user.address }, function (results, status) {
        if (status === "OK") {
            const mapOptions = {
                center: {
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng(),
                },
                zoom: 12,
            };

            const mapElement = document.getElementById("map");
            const { maps } = googleLoader;
            const map = new maps.Map(mapElement, mapOptions);
            
            var infowindow = new google.maps.InfoWindow({
                content: 'המיקום הנוכחי שלך',
            });
            var marker = new google.maps.Marker({
                map,
                animation: maps.Animation.DROP,
                position: results[0].geometry.location,
                title: "",
            });
            google.maps.event.addListener(marker, "click", function () {
                infowindow.open(map, marker);
            });
            
            if (sessionStorage.getItem('MATCHES')) {
                const matches = JSON.parse(sessionStorage.getItem("MATCHES"));
                const sortedMatches = matches.sort((a, b) => a.distance - b.distance);
                
                for (const match of sortedMatches) {
                    geocoder.geocode({ address: match.address }, function (results, status) {
                        if (status === "OK") {
                            var data = `<p><strong>${match.fullname}</strong></p><span>${results[0].formatted_address}</span>`;
                            var infowindow = new google.maps.InfoWindow({
                                content: data,
                            });
                            var marker = new google.maps.Marker({
                                map,
                                animation: maps.Animation.DROP,
                                position: results[0].geometry.location,
                                icon: {
                                    url: "/static/images/pin.png",
                                },
                                title: "",
                            });
                            google.maps.event.addListener(marker, "click", function () {
                                infowindow.open(map, marker);
                            });

                            document.getElementById(
                                "doggy-misters-tbody"
                            ).innerHTML += `
                                <tr>
                                    <td>${match.fullname}</td>
                                    <td>${match.email}</td>
                                    <td>${match.birthdate}</td>
                                    <td>${match.gender}</td>
                                    <td>
                                        <strong>${match.address}</strong><br>
                                        <span style="font-size: 12px;">${match.distance}km from your location!</span>
                                    </td>
                                    <td>${match.comments}</td>
                                </tr>
                            `;
                        }
                        else {
                            console.log("Geocode was not successful for the following reason: " + status);
                        }
                    });
                }
            }
            else {
                alert('Please enter search parameters please');
            }
        }
        else {
          console.log("Geocode was not successful for the following reason: " + status);  
        }
    });
}

window.loadMap = loadMap;