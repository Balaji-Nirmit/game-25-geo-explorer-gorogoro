import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLng } from '../lib/geo';

const actualIcon = new L.DivIcon({
  className: 'bg-transparent border-none',
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#22c55e" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.5));"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28]
});

const guessIcon = new L.DivIcon({
  className: 'bg-transparent border-none',
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#ef4444" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.5));"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28]
});

interface ResultMapProps {
  actual: LatLng;
  guess: LatLng;
}

function FitBounds({ actual, guess }: ResultMapProps) {
  const map = useMap();
  
  useEffect(() => {
    // Need a tiny delay for container size to resolve to avoid zoom errors
    const timeout = setTimeout(() => {
        const bounds = L.latLngBounds([actual.lat, actual.lng], [guess.lat, guess.lng]);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }, 100);
    return () => clearTimeout(timeout);
  }, [map, actual, guess]);

  return null;
}

export function ResultMap({ actual, guess }: ResultMapProps) {
  const path: [number, number][] = [
    [actual.lat, actual.lng],
    [guess.lat, guess.lng]
  ];

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden shadow-inner border border-white/10 z-0 bg-zinc-800">
      <MapContainer style={{ width: '100%', height: '100%' }} zoomControl={false} attributionControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
        <Marker position={[actual.lat, actual.lng]} icon={actualIcon} />
        <Marker position={[guess.lat, guess.lng]} icon={guessIcon} />
        <Polyline positions={path} pathOptions={{ color: '#3b82f6', weight: 4, dashArray: '5, 10' }} />
        <FitBounds actual={actual} guess={guess} />
      </MapContainer>
    </div>
  );
}
