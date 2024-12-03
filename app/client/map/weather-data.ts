import { Map, GeoJSONSource } from "maplibre-gl";
import type { StyleSpecification } from "maplibre-gl";
import { GeoJSONFeatureCollection } from "../geojson/types";

interface LayerConfig {
  source: string;
  layers: {
    fill: string;
    outline: string;
  };
  paint: {
    fill: Extract<StyleSpecification['layers'][number], { type: 'fill' }>['paint'];
    outline: Extract<StyleSpecification['layers'][number], { type: 'line' }>['paint'];
  };
}

const TRANSITION_CONFIG = {
  duration: 300,
};

const PRECIPITATION_LAYERS: LayerConfig = {
  source: "precipitation-rate",
  layers: {
    fill: "precipitation-rate-layer",
    outline: "precipitation-rate-outline",
  },
  paint: {
    fill: {
      "fill-color": ["get", "color"],
      "fill-opacity": 0.5,
    },
    outline: {
      "line-color": ["get", "color"],
      "line-width": 1,
      "line-opacity": 0.8,
    },
  },
};

function createPrecipitationSource(map: Map) {
  map.addSource(PRECIPITATION_LAYERS.source, {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] },
  });

  if (!map.getSource(PRECIPITATION_LAYERS.source)) {
    throw new Error("Failed to create precipitation source");
  }
}

function addPrecipitationLayers(map: Map) {
  // Add fill layer
  map.addLayer({
    id: PRECIPITATION_LAYERS.layers.fill,
    type: "fill",
    source: PRECIPITATION_LAYERS.source,
    paint: PRECIPITATION_LAYERS.paint.fill,
  });

  // Add outline layer
  map.addLayer({
    id: PRECIPITATION_LAYERS.layers.outline,
    type: "line",
    source: PRECIPITATION_LAYERS.source,
    paint: PRECIPITATION_LAYERS.paint.outline,
  });

  // Add transitions
  ["fill-color", "fill-opacity"].forEach(prop => {
    map.setPaintProperty(PRECIPITATION_LAYERS.layers.fill, `${prop}-transition`, TRANSITION_CONFIG);
  });
  ["line-color", "line-opacity"].forEach(prop => {
    map.setPaintProperty(PRECIPITATION_LAYERS.layers.outline, `${prop}-transition`, TRANSITION_CONFIG);
  });
}

export function displayPrecipitationData(
  map: Map,
  geojson: GeoJSONFeatureCollection
) {
  if (!map) {
    throw new Error("Map object is undefined");
  }

  try {
    const source = map.getSource(PRECIPITATION_LAYERS.source) as GeoJSONSource;
    
    if (!source) {
      // Only create new layers if they don't exist
      createPrecipitationSource(map);
      addPrecipitationLayers(map);
      (map.getSource(PRECIPITATION_LAYERS.source) as GeoJSONSource).setData(geojson);
    } else {
      // Update existing source data
      source.setData(geojson);
    }
  } catch (error) {
    console.error("Error displaying precipitation data:", error);
    throw error;
  }
}
