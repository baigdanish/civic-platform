"use client";

import { useMemo, useState } from "react";
import L, { type LatLngExpression } from "leaflet";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

type LocationPickerMapProps = {
  onLocationChange: (lat: number, lng: number) => void;
};

type SelectedLocation = {
  lat: number;
  lng: number;
};

const DEFAULT_LOCATION: SelectedLocation = {
  lat: 20.5937,
  lng: 78.9629,
};

function LocationMarker({
  position,
  markerIcon,
  onSelect,
}: {
  position: SelectedLocation;
  markerIcon: L.DivIcon;
  onSelect: (location: SelectedLocation) => void;
}) {
  useMapEvents({
    click: (event) => {
      onSelect({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      });
    },
  });

  return (
    <Marker
      icon={markerIcon}
      position={[position.lat, position.lng] as LatLngExpression}
    />
  );
}

export default function LocationPickerMap({
  onLocationChange,
}: LocationPickerMapProps) {
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation>(DEFAULT_LOCATION);

  const markerIcon = useMemo(
    () =>
      L.divIcon({
        className: "civic-location-marker",
        html: "<span></span>",
        iconAnchor: [14, 14],
        iconSize: [28, 28],
      }),
    [],
  );

  function handleSelect(location: SelectedLocation) {
    setSelectedLocation(location);
    onLocationChange(location.lat, location.lng);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
      <MapContainer
        center={[selectedLocation.lat, selectedLocation.lng]}
        className="h-64 w-full"
        scrollWheelZoom
        zoom={5}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          markerIcon={markerIcon}
          onSelect={handleSelect}
          position={selectedLocation}
        />
      </MapContainer>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
        <span>Click the map to choose the complaint location.</span>
        <span className="font-medium text-slate-700">
          {selectedLocation.lat.toFixed(5)}, {selectedLocation.lng.toFixed(5)}
        </span>
      </div>
    </div>
  );
}
