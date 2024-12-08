import { Map, GeoJSONSource } from "maplibre-gl";
import { locationMarker } from "./configs/locationMarker";
import { hasZoomParameter, getZoomFromUrl } from "./map-utils";

const ZOOM_LEVEL = 10;

function formatCoordinates(longitude: number, latitude: number): string {
  return `my location<br>${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`;
}

function createLocationGeoJSON(longitude: number, latitude: number) {
  return {
    type: "FeatureCollection" as const,
    features: [
      {
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates: [longitude, latitude],
        },
        properties: {},
      },
    ],
  };
}

function updateLocation(map: Map, longitude: number, latitude: number): void {
  const coordsDisplay = document.getElementById("myCoords");
  if (coordsDisplay) {
    coordsDisplay.classList.remove("hidden");
    coordsDisplay.innerHTML = formatCoordinates(longitude, latitude);
  }

  const source = map.getSource(locationMarker.source) as GeoJSONSource;
  if (source) {
    source.setData(createLocationGeoJSON(longitude, latitude));
  }

  const flyToOptions: { center: [number, number]; zoom?: number } = {
    center: [longitude, latitude],
  };

  if (hasZoomParameter()) {
    flyToOptions.zoom = getZoomFromUrl();
  } else {
    flyToOptions.zoom = ZOOM_LEVEL;
  }

  map.flyTo(flyToOptions);
}

function hideCoordinates(): void {
  const coordsDisplay = document.getElementById("myCoords");
  if (coordsDisplay) {
    coordsDisplay.classList.add("hidden");
  }
}

function setButtonState(button: HTMLButtonElement, loading: boolean, active: boolean = false): void {
  button.classList.toggle("loading", loading);
  button.classList.toggle("active", active);
  button.disabled = loading;
}

export function getCurrentPosition(map: Map, onSuccess?: () => void): void {
  const locateButton = document.querySelector("#locateButton button") as HTMLButtonElement;
  if (!locateButton) return;

  setButtonState(locateButton, true);

  if (!("geolocation" in navigator)) {
    alert("Geolocation is not supported by your browser");
    setButtonState(locateButton, false);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { longitude, latitude } = position.coords;
      updateLocation(map, longitude, latitude);
      setButtonState(locateButton, false, true);
      onSuccess?.();
    },
    (error) => {
      console.error("Error getting location:", error);
      alert("Unable to retrieve your location");
      setButtonState(locateButton, false, false);
      hideCoordinates();
    }
  );
}

export function setupLocationButton(map: Map): void {
  const locateButton = document.querySelector("#locateButton button") as HTMLButtonElement;
  if (!locateButton) return;

  hideCoordinates();

  locateButton.addEventListener("click", () => getCurrentPosition(map));
}
