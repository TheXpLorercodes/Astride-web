'use client';
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const siteIcon = new L.divIcon({
  html: `
    <div style="
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #facc15;
      border: 3px solid #111827;
      box-shadow: 0 0 12px rgba(250, 204, 21, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
      color: #111827;
    ">
      O
    </div>
  `,
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

export default function LaunchSiteMap({ latitude, longitude, label }) {
  if (latitude == null || longitude == null) return null;

  const lat = Number.parseFloat(latitude);
  const lng = Number.parseFloat(longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  return (
    <MapContainer center={[lat, lng]} zoom={6} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <Marker position={[lat, lng]} icon={siteIcon}>
        <Popup>
          <strong>Launch Site</strong>
          <br />
          {label || 'Launch pad'}
        </Popup>
      </Marker>
    </MapContainer>
  );
}
