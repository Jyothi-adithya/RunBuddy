import React from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = { width: '100%', height: '500px' };

const MapComponent = ({ center, markers, onMarkerClick, onMapClick, selectedPosition }) => {
  const [selected, setSelected] = React.useState(null);
  const mapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'runbuddy-google-maps-script',
    googleMapsApiKey: mapsApiKey || '',
  });

  if (!mapsApiKey) {
    return (
      <div className="h-[500px] w-full rounded-card border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Google Maps key is missing. Set REACT_APP_GOOGLE_MAPS_API_KEY in your frontend environment.
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="h-[500px] w-full rounded-card border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Google Maps failed to load. Verify API key, billing, and HTTP referrer restrictions in Google Cloud.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-[500px] w-full rounded-card border border-ink-200 bg-white p-4 text-sm text-ink-600">
        Loading map...
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={14}
      options={{ streetViewControl: false, mapTypeControl: false }}
      onClick={(event) => {
        if (!onMapClick || !event.latLng) {
          return;
        }
        onMapClick({
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        });
      }}
    >
      {markers.map((m) => (
        <Marker
          key={m.id}
          position={m.position}
          onClick={() => setSelected(m)}
        />
      ))}
      {selectedPosition && (
        <Marker
          position={selectedPosition}
          title="Selected meetup point"
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: '#f97316',
            fillOpacity: 1,
            strokeColor: '#9a3412',
            strokeWeight: 2,
            scale: 8
          }}
        />
      )}
      {selected && (
        <InfoWindow position={selected.position} onCloseClick={() => setSelected(null)}>
          <div className="text-sm">
            <h3 className="font-bold">{selected.title}</h3>
            <p>{selected.details}</p>
            {selected.isRequest && onMarkerClick && (
              <button className="mt-2 font-semibold text-coral-700 underline" onClick={() => onMarkerClick(selected)}>
                View details
              </button>
            )}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default MapComponent;