"use client";

import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { MapPin } from "lucide-react";

const containerStyle = { width: "100%", height: "280px", borderRadius: "0.75rem" };

export function MapView({
  lat,
  lng,
  address,
  city,
}: {
  lat: number;
  lng: number;
  address?: string;
  city: string;
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="flex h-[280px] flex-col items-center justify-center gap-2 rounded-[var(--radius-photo)] border border-dashed border-line-strong bg-paper text-center">
        <MapPin className="size-6 text-ink-soft/40" />
        <p className="text-sm text-ink-soft/70">
          {address ? `${address}, ` : ""}
          {city}
        </p>
        <p className="text-xs text-ink-soft/40">Add a Google Maps API key to show an interactive map here</p>
      </div>
    );
  }

  return <MapViewWithKey apiKey={apiKey} lat={lat} lng={lng} />;
}

function MapViewWithKey({ apiKey, lat, lng }: { apiKey: string; lat: number; lng: number }) {
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: apiKey });

  if (!isLoaded) {
    return <div className="h-[280px] animate-pulse rounded-[var(--radius-photo)] bg-line" />;
  }

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={{ lat, lng }} zoom={13}>
      <MarkerF position={{ lat, lng }} />
    </GoogleMap>
  );
}
