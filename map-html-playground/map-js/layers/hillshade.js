/**
 * Adds a hillshade layer to the map for terrain visualization
 * @param {mapboxgl.Map} map - The Mapbox GL JS map instance
 * @returns {void}
 */
export function hillshadeLayer(map) {
  // Add hillshade raster source using MapTiler's hillshade tiles
  map.addSource("hillshade", {
    type: "raster",
    // WebP format tiles for better performance
    tiles: [
      "https://api.maptiler.com/tiles/hillshade/{z}/{x}/{y}.webp?key=k0SiRr6RGDFRdeBbNb3v",
    ],
    tileSize: 512,
    attribution:
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a>',
  });

  // Add the hillshade as a raster layer with reduced opacity
  map.addLayer({
    id: "hillshade-layer",
    type: "raster",
    source: "hillshade",
    paint: {
      // Set transparency to blend with underlying layers
      "raster-opacity": 0.3,
    },
  });
}