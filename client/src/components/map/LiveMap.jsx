import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { twMerge } from 'tailwind-merge';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2), 0 2px 4px -1px rgba(0,0,0,0.06); transition: transform 0.2s;"></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

const hospitalIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="bg-primary-red text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white text-lg ring-4 ring-red-500/20">🏥</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

export const LiveMap = ({ center = [5.9622, 10.1584], zoom = 12, markers = [], className }) => {
  return (
    <div className={twMerge("w-full h-full relative z-0 rounded-3xl overflow-hidden border border-gray-100 shadow-sm", className)}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        {/* Using a very clean modern base map */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Render Center as Hospital if specified */}
        <Marker position={center} icon={hospitalIcon}>
          <Popup className="premium-popup">
            <div className="font-bold text-gray-900 text-sm px-1">Hospital Location</div>
          </Popup>
        </Marker>

        {/* Render Search Radius */}
        <Circle 
          center={center} 
          radius={5000} 
          pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.08, weight: 2, dashArray: '4 4' }} 
        />

        {markers.map((marker, idx) => {
          let color = '#3B82F6'; // default blue
          if (marker.type === 'critical') color = '#ef4444'; // red-500
          if (marker.type === 'urgent') color = '#f59e0b'; // amber-500
          if (marker.type === 'success') color = '#22c55e'; // green-500
          if (marker.type === 'donor') color = '#6366f1'; // indigo-500
          
          return (
            <Marker 
              key={idx} 
              position={marker.position} 
              icon={createCustomIcon(color)}
            >
              {marker.popup && (
                <Popup className="premium-popup">
                  <div className="p-2 min-w-[120px]">
                    {marker.popup}
                  </div>
                </Popup>
              )}
            </Marker>
          );
        })}
      </MapContainer>
      
      {/* Global styles for Leaflet popups to match the premium theme */}
      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          border-radius: 16px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          border: 1px solid #f3f4f6;
          padding: 4px;
        }
        .leaflet-popup-tip {
          background: white;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default LiveMap;
