import { Map, GeoJSONSource } from "maplibre-gl";
import { locationMarker } from "./configs/locationMarker";

const ZOOM_LEVEL = 12;

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
    coordsDisplay.style.display = "block";
    coordsDisplay.innerHTML = formatCoordinates(longitude, latitude);
  }

  const source = map.getSource(locationMarker.source) as GeoJSONSource;
  if (source) {
    source.setData(createLocationGeoJSON(longitude, latitude));
  }

  map.flyTo({
    center: [longitude, latitude],
    zoom: ZOOM_LEVEL,
  });
}

function hideCoordinates(): void {
  const coordsDisplay = document.getElementById("myCoords");
  if (coordsDisplay) {
    coordsDisplay.style.display = "none";
  }
}

function setButtonState(button: HTMLButtonElement, loading: boolean, active: boolean = false): void {
  button.classList.toggle("loading", loading);
  button.classList.toggle("active", active);
  button.disabled = loading;
}

export function setupLocationButton(map: Map): void {
  const locateButton = document.querySelector('#locate-button button') as HTMLButtonElement;
  if (!locateButton) return;

  hideCoordinates(); // Hide coordinates initially

  locateButton.addEventListener("click", () => {
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
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location");
        setButtonState(locateButton, false, false);
        hideCoordinates(); // Hide coordinates on error
      }
    );
  });
}
