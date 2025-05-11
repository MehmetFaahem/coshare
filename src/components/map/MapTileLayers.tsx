import React from "react";
import { TileLayer, LayersControl } from "react-leaflet";

const MapTileLayers: React.FC = () => {
  return (
    <LayersControl position="topright">
    
      <LayersControl.BaseLayer checked name="Google Streets">
        <TileLayer
          url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          attribution="&copy; Google Maps"
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          maxZoom={20}
        />
      </LayersControl.BaseLayer>
      
      <LayersControl.BaseLayer name="Google Hybrid">
        <TileLayer
          url="https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
          attribution="&copy; Google Maps"
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          maxZoom={20}
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="Google Terrain">
        <TileLayer
          url="https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
          attribution="&copy; Google Maps"
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          maxZoom={20}
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="OpenStreetMap">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </LayersControl.BaseLayer>
    </LayersControl>
  );
};

export default MapTileLayers;