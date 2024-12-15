import { locationMarker } from "./configs/locationMarker";
import { hasZoomParameter, getZoomFromUrl, isPointInPolygon } from "./map-utils";
import { radarDomain } from "./configs/radar-domain";
import type { Map, SourceSpecification, GeoJSONSource } from "maplibre-gl";
import { showMessageOverlay } from "../utils/message-overlay";

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

interface ButtonState {
  loading: boolean;
  active: boolean;
  error: boolean;
}

function setButtonState(
  button: HTMLButtonElement,
  state: Partial<ButtonState>
): void {
  const defaultState: ButtonState = {
    loading: false,
    active: false,
    error: false
  };

  const finalState = { ...defaultState, ...state };

  // Update button classes
  button.classList.toggle("loading", finalState.loading);
  button.classList.toggle("active", finalState.active);
  button.classList.toggle("error", finalState.error);

  // Disable button when loading
  button.disabled = finalState.loading;
}

export function getCurrentPosition(map: Map, onSuccess?: () => void): void {
  const locateButton = document.querySelector("#locateButton button") as HTMLButtonElement;
  if (!locateButton) return;

  setButtonState(locateButton, { loading: true });

  if (!("geolocation" in navigator)) {
    console.log("Geolocation is not supported by your browser");
    showMessageOverlay("Geolocation is not supported by your browser");
    setButtonState(locateButton, { loading: false, error: true });
    hideCoordinates();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      try {
        const { longitude, latitude } = position.coords;
        const sourceConfig = radarDomain.sourceConfig as SourceSpecification & { data: { geometry: { coordinates: number[][] } } };
        const coordinates = sourceConfig?.data?.geometry?.coordinates as number[][][];
        if (!coordinates) {
          console.log("Radar domain configuration is not available");
          setButtonState(locateButton, { loading: false });
          hideCoordinates();
          return;
        }

        if (!isPointInPolygon([longitude, latitude], coordinates)) {
          console.log("Your location is outside the radar coverage area");
          showMessageOverlay("Your location is outside the radar coverage area");
          setButtonState(locateButton, { loading: false, error: true });
          hideCoordinates();
          return;
        }

        updateLocation(map, longitude, latitude);
        setButtonState(locateButton, { loading: false, active: true });
        onSuccess?.();
      } catch (error) {
        console.error("An error occurred while processing your location:", error);
        setButtonState(locateButton, { loading: false });
        hideCoordinates();
      }
    },
    (error) => {
      console.error("Unable to retrieve your location:", error);
      setButtonState(locateButton, { loading: false });
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
