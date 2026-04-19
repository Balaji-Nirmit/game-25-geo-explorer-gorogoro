import React, { useState } from 'react';
import { PhotoLocation } from '../lib/geo';
import { Focus } from 'lucide-react';

interface StreetViewFreeProps {
  location: PhotoLocation | null;
}

export function StreetViewFree({ location }: StreetViewFreeProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  if (!location) {
    return (
      <div className="w-full h-full relative bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden mt-4 shadow-xl flex items-center justify-center">
        <span className="text-zinc-500 font-medium">Entering the Explorer View...</span>
      </div>
    );
  }

  // Use the legacy Google Maps embed format which provides full Street View 
  // in an iframe without requiring the user to provide an API key. 
  // It handles its own internal token allocation and bypasses CORS/CSP limits.
  const streetViewUrl = `https://maps.google.com/maps?layer=c&cbll=${location.lat},${location.lng}&cbp=12,0,,0,0&source=embed&output=svembed`;

  return (
    <div className="w-full h-full relative bg-zinc-950 overflow-hidden pointer-events-auto">
      
      {!iframeLoaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-900 gap-4">
          <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <span className="text-zinc-500 text-sm font-medium animate-pulse">Establishing Satellite Connection...</span>
        </div>
      )}

      <iframe
        className="absolute w-full border-none z-0"
        style={{ 
          top: '-45px', 
          height: 'calc(100% + 45px)',
          left: 0,
          right: 0
        }}
        src={streetViewUrl}
        allow="fullscreen"
        onLoad={() => setIframeLoaded(true)}
        title="Free Street View"
      />

      {/* Security/Anti-Cheat Mask - Covers the top area where location names usually appear */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-24 bg-gradient-to-bl from-black to-transparent z-10 pointer-events-none" />

      {/* Interaction Overlay Hint - Moved to bottom and hidden on very small screens */}
      <div className="absolute bottom-4 left-4 z-20 hidden md:flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-2xl text-emerald-400 font-bold text-[10px] uppercase tracking-widest pointer-events-none shadow-2xl border border-white/5">
        <Focus className="w-4 h-4" />
        <span>360° Global Panorama</span>
      </div>
    </div>
  );
}
