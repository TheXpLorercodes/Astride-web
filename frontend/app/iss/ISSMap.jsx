'use client';
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Component to handle smooth map panning without unmounting
function MapController({ position }) {
  const map = useMap();
  React.useEffect(() => {
    map.panTo(position, { animate: true, duration: 1.5 });
  }, [map, position]);
  return null;
}

// Colorful delivery app style icon using divIcon
const issIcon = new L.divIcon({
  html: `
    <div style="
      background: linear-gradient(135deg, #ec4899, #8b5cf6, #06b6d4);
      border-radius: 50%;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 20px rgba(236, 72, 153, 0.8), inset 0 0 10px rgba(255,255,255,0.5);
      border: 3px solid rgba(255,255,255,0.9);
    ">
      <span style="font-size: 24px; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.5));">🛰️</span>
    </div>
  `,
  className: '',
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

export default function ISSMap({ issData, path }) {
  if (!issData) return null;
  
  return (
    <MapContainer center={[issData.latitude, issData.longitude]} zoom={3} style={{ height: '100%', width: '100%' }}>
      <MapController position={[issData.latitude, issData.longitude]} />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <Marker position={[issData.latitude, issData.longitude]} icon={issIcon}>
        <Popup>
          <strong>ISS Current Location</strong><br/>
          Alt: {issData.altitude.toFixed(2)} km
        </Popup>
      </Marker>
      {path.length > 1 && (
        <Polyline positions={path} color="#ec4899" weight={2} opacity={0.6} />
      )}
    </MapContainer>
  );
}
