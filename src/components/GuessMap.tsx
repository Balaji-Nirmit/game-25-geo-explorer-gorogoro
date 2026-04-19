import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLng } from '../lib/geo';
import { cn } from '../lib/utils';
import { Maximize2, Minimize2 } from 'lucide-react';
import { useEffect } from 'react';

const customIcon = new L.DivIcon({
  className: 'bg-transparent border-none',
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#ef4444" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.5));"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28]
});

function MapEvents({ onMapClick, disabled }: { onMapClick: (ll: LatLng) => void, disabled: boolean }) {
  useMapEvents({
    click(e) {
      if (!disabled) {
        onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    }
  });
  return null;
}

function MapResizer({ isFullScreen, isHovered }: { isFullScreen: boolean, isHovered: boolean }) {
  const map = useMap();
  
  useEffect(() => {
    // Invalidate size after transition finishes to ensure map fills container
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 500); 
    
    return () => clearTimeout(timer);
  }, [map, isFullScreen, isHovered]);

  return null;
}

interface GuessMapProps {
  onGuess: (location: LatLng) => void;
  disabled?: boolean;
}

export function GuessMap({ onGuess, disabled }: GuessMapProps) {
  const [markerPos, setMarkerPos] = useState<LatLng | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const submitGuess = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (markerPos) {
      onGuess(markerPos);
    }
  };

  return (
    <div 
      className={cn(
        "absolute z-[100] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col pointer-events-auto",
        isFullScreen 
          ? "inset-2 sm:inset-10" 
          : cn(
              "bottom-4 right-4 sm:bottom-6 sm:right-6",
              isHovered ? "w-[300px] h-[220px] sm:w-[360px] sm:h-[260px]" : "w-[200px] h-[140px] sm:w-[260px] sm:h-[160px]"
            )
      )}
      onMouseEnter={() => !isFullScreen && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn(
        "w-full h-full rounded-xl sm:rounded-2xl overflow-hidden border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative bg-zinc-900 group transition-all duration-500",
        isFullScreen ? "rounded-2xl sm:rounded-3xl border-white/30" : ""
      )}>
        
        <MapContainer 
          center={[20, 0]} 
          zoom={2} 
          minZoom={2}
          maxBounds={[[-90, -180], [90, 180]]}
          maxBoundsViscosity={1.0}
          style={{ width: '100%', height: '100%' }}
          zoomControl={false}
          className={cn("w-full h-full", !disabled && "cursor-crosshair")}
          attributionControl={false}
        >
          <TileLayer 
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" 
            noWrap={true}
            bounds={[[-90, -180], [90, 180]]}
          />
          <MapResizer isFullScreen={isFullScreen} isHovered={isHovered} />
          <MapEvents onMapClick={setMarkerPos} disabled={disabled || false} />
          {markerPos && <Marker position={[markerPos.lat, markerPos.lng]} icon={customIcon} />}
        </MapContainer>

        {/* Controls Overlay - Moved after MapContainer with ultra-high z-index */}
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-[5000] flex gap-1 sm:gap-2 pointer-events-auto">
          <button 
            title={isFullScreen ? "Minimize Map" : "Full Screen Map"}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsFullScreen(!isFullScreen);
            }}
            className="bg-black/90 p-2 sm:p-3 rounded-xl sm:rounded-2xl text-white hover:text-emerald-400 hover:bg-zinc-800 transition-all cursor-pointer backdrop-blur-xl border border-white/10 shadow-2xl active:scale-90"
          >
            {isFullScreen ? <Minimize2 className="w-5 h-5 sm:w-6 sm:h-6" /> : <Maximize2 className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>

        {/* Floating Guess Button in Full Mode */}
        {isFullScreen && markerPos && (
          <div className="absolute bottom-15 sm:bottom-10 left-1/2 -translate-x-1/2 z-[5000] pointer-events-auto w-[calc(100%-2rem)] sm:w-auto">
            <button
              onClick={submitGuess}
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-white font-black py-4 sm:py-5 px-8 sm:px-16 rounded-xl sm:rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.6)] transition-all hover:scale-105 active:scale-95 text-base sm:text-xl tracking-tight uppercase"
            >
              Lock In Guess
            </button>
          </div>
        )}

        {/* Action Button for Mini Mode */}
        {!isFullScreen && (isHovered || markerPos) && (
          <div className="absolute bottom-2 left-2 right-2 z-[5000] pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
            <button
              disabled={!markerPos || disabled}
              onClick={submitGuess}
              className={cn(
                "w-full font-black py-3 sm:py-4 rounded-lg sm:rounded-xl shadow-2xl transition-all active:scale-95 text-[10px] sm:text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2",
                markerPos 
                  ? "bg-emerald-500 text-white hover:bg-emerald-400" 
                  : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              )}
            >
              {markerPos ? "Submit Guess" : "Select Point"}
            </button>
          </div>
        )}

        {/* Hover Hint */}
        {!isHovered && !isFullScreen && !markerPos && (
          <div className="absolute inset-0 bg-black/40 pointer-events-none flex items-center justify-center transition-opacity duration-500">
            <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Locate Path</span>
          </div>
        )}
      </div>

    </div>
  );
}
