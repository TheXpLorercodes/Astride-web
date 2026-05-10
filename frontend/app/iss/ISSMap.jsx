'use client';
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function MapController({ position }) {
  const map = useMap();

  React.useEffect(() => {
    map.flyTo(position, map.getZoom(), { animate: true, duration: 1.5 });
  }, [map, position]);

  return null;
}

const issIcon = new L.divIcon({
  html: `
    <div style="
      width: 52px;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 0 14px rgba(34, 211, 238, 0.45)) drop-shadow(0 0 8px rgba(236, 72, 153, 0.2));
    ">
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <radialGradient id="iss-badge" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(26 18) rotate(90) scale(28)">
            <stop stop-color="#102033" />
            <stop offset="1" stop-color="#050816" />
          </radialGradient>
          <linearGradient id="iss-body" x1="18" y1="14" x2="36" y2="38" gradientUnits="userSpaceOnUse">
            <stop stop-color="#F8FAFC" />
            <stop offset="0.5" stop-color="#A5F3FC" />
            <stop offset="1" stop-color="#38BDF8" />
          </linearGradient>
          <linearGradient id="iss-panel" x1="7" y1="16" x2="45" y2="36" gradientUnits="userSpaceOnUse">
            <stop stop-color="#0EA5E9" />
            <stop offset="1" stop-color="#1D4ED8" />
          </linearGradient>
          <linearGradient id="iss-accent" x1="22" y1="12" x2="30" y2="40" gradientUnits="userSpaceOnUse">
            <stop stop-color="#F472B6" />
            <stop offset="1" stop-color="#22D3EE" />
          </linearGradient>
        </defs>
        <circle cx="26" cy="26" r="23" fill="url(#iss-badge)" stroke="rgba(255,255,255,0.18)" />
        <circle cx="26" cy="26" r="17" stroke="rgba(34,211,238,0.22)" stroke-dasharray="5 6" />
        <path d="M10 31C13.5 27.5 18.5 25 26 25C33.5 25 38.5 27.5 42 31" stroke="rgba(34,211,238,0.35)" stroke-width="1.2" stroke-linecap="round" />
        <path d="M16.5 22.5L11 17M35.5 22.5L41 17" stroke="rgba(255,255,255,0.15)" stroke-width="1.2" stroke-linecap="round" />
        <rect x="14" y="20" width="9" height="12" rx="2.5" fill="url(#iss-panel)" stroke="rgba(255,255,255,0.22)" />
        <rect x="29" y="20" width="9" height="12" rx="2.5" fill="url(#iss-panel)" stroke="rgba(255,255,255,0.22)" />
        <rect x="22.5" y="18.5" width="7" height="15" rx="2.2" fill="url(#iss-body)" stroke="rgba(255,255,255,0.28)" />
        <circle cx="26" cy="26" r="2.3" fill="#0F172A" stroke="url(#iss-accent)" stroke-width="1.2" />
        <path d="M25.7 18.4L22.8 15.4" stroke="url(#iss-accent)" stroke-width="1.2" stroke-linecap="round" />
        <path d="M26.3 18.4L29.2 15.4" stroke="url(#iss-accent)" stroke-width="1.2" stroke-linecap="round" />
        <path d="M27.5 31.8L31 35.3" stroke="url(#iss-accent)" stroke-width="1.2" stroke-linecap="round" />
      </svg>
    </div>
  `,
  className: '',
  iconSize: [52, 52],
  iconAnchor: [26, 26],
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
          <strong>ISS Current Location</strong><br />
          Alt: {issData.altitude.toFixed(2)} km
        </Popup>
      </Marker>
      {path.length > 1 && <Polyline positions={path} color="#ec4899" weight={2} opacity={0.6} />}
    </MapContainer>
  );
}
