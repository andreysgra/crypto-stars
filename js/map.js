import {createPopup} from './popup.js';

const MAP_ZOOM = 8;

const MAP_TILE_LAYER_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const MAP_TILE_LAYER_ATTRIBUTION = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';

const mapCenter = {
  lat: 59.92749,
  lng: 30.31127
};

const IconUrl = {
  Default: './img/pin.svg',
  Verified: './img/pin-verified.svg'
};

const map = L.map('map-canvas');
const markerGroup = L.layerGroup();

const iconConfig = {
  iconUrl: '',
  iconSize: [36, 46],
  iconAnchor: [18, 46]
};

const defaultIcon = L.icon({...iconConfig, iconUrl: IconUrl.Default});
const verifiedIcon = L.icon({...iconConfig, iconUrl: IconUrl.Verified});

const createMarker = (contractor, icon) => L.marker(contractor.coords, {icon})
  .addTo(markerGroup)
  .bindPopup(createPopup(contractor));

export const initMap = () => {
  L.tileLayer(MAP_TILE_LAYER_URL, {attribution: MAP_TILE_LAYER_ATTRIBUTION}).addTo(map);

  map.setView(mapCenter, MAP_ZOOM);

  markerGroup.addTo(map);
};

export const addMarkers = (contractors) => {
  markerGroup.clearLayers();

  contractors.forEach((contractor) => {
    const icon = contractor.isVerifed ? verifiedIcon : defaultIcon;

    createMarker(contractor, icon);
  });
};
