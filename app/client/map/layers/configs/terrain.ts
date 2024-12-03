
import { LayerConfig } from '../types';

export const hillshade: LayerConfig = {
  id: "hillshade",
  label: "Hillshade",
  source: "hillshade",
  layers: [
    {
      id: "hillshade-layer",
      type: "raster",
      source: "hillshade",
      paint: {
        "raster-opacity": 0.3,
      },
    },
  ],
  sourceConfig: {
    type: "raster",
    tiles: [
      "https://api.maptiler.com/tiles/hillshade/{z}/{x}/{y}.webp?key=k0SiRr6RGDFRdeBbNb3v",
    ],
    tileSize: 512,
  },
};