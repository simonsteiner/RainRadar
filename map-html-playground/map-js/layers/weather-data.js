
export function setupWeatherData(map) {
  map.addSource("precipitation-rate", {
    type: "geojson",
    data: "radar_rzc.geojson"
  });

  map.addLayer({
    id: "precipitation-rate-layer",
    type: "fill",
    source: "precipitation-rate",
    paint: {
      "fill-color": ["get", "color"],
      "fill-opacity": 0.5
    }
  });

  map.addLayer({
    id: "precipitation-rate-outline",
    type: "line",
    source: "precipitation-rate",
    paint: {
      "line-color": ["get", "color"],
      "line-width": 1,
      "line-opacity": 0.8
    }
  });
}