import { cities } from "./cities.js";

async function loadMap() {
    const apiKey = "AIzaSyAyk6v-3Lqx7qfcxUNpH6Cwflik_ktbwSo";
    const loader = new google.maps.plugins.loader.Loader({ apiKey });
    const googleLoader = await loader.load();
    const mapOptions = {
        center: {
            lat: 32.087371715198124,
            lng: 34.88346341137375,
        },
        zoom: 8,
    };
    const mapElement = document.getElementById("map");
    const { maps } = googleLoader;
    const map = new maps.Map(mapElement, mapOptions);
    for (const city of cities) {
        const marker = new maps.Marker({
            position: city.coordinates,
            map,
            animation: maps.Animation.DROP,
        });
    }
}

window.loadMap = loadMap;