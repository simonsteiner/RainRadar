/**
 * @fileoverview Converts radar data from the Swiss meteorological format to GeoJSON.
 * This module handles the transformation of proprietary radar data coordinates
 * to standard geographic coordinates (WGS84) and creates valid GeoJSON polygons.
 */
import { decodeCoordinates } from "./decode";
import type { RadarData, GeoJSONFeature, GeoJSONFeatureCollection } from "../_types/geojson";

/**
 * Creates a GeoJSON feature from coordinates and color
 */
function createFeature(
  coordinates: [number, number][],
  color: string
): GeoJSONFeature | null {
  if (coordinates.length < 3) return null;

  const validCoordinates = coordinates.filter(
    ([x, y]) => x != null && y != null && !isNaN(x) && !isNaN(y)
  );

  if (validCoordinates.length < 3) return null;

  return {
    type: "Feature",
    properties: { color: `#${color}` },
    geometry: {
      type: "Polygon",
      coordinates: [[...validCoordinates]],
    },
  };
}

/**
 * Converts radar data into GeoJSON format.
 */
export function radar2geojson(radarData: RadarData): GeoJSONFeatureCollection {
  if (!radarData?.coords || !Array.isArray(radarData?.areas)) {
    throw new Error("Invalid radar data format");
  }

  const features = radarData.areas.flatMap((area) =>
    area.shapes.flatMap((shape) =>
      shape
        .map((segment) => {
          const coords = decodeCoordinates(segment, radarData.coords);
          return createFeature(coords, area.color);
        })
        .filter((feature): feature is GeoJSONFeature => feature !== null)
    )
  );

  return {
    type: "FeatureCollection",
    features,
  };
}
