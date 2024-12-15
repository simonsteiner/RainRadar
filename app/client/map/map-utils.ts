export function getZoomFromUrl(): number | undefined {
  const params = new URLSearchParams(window.location.search);
  const zoom = params.get("zoom");
  return zoom ? parseFloat(zoom) : undefined;
}

export function hasZoomParameter(): boolean {
  return new URLSearchParams(window.location.search).has("zoom");
}

export function isPointInPolygon(point: [number, number], polygon: number[][][]): boolean {
  const [x, y] = point;
  let inside = false;

  const coordinates = polygon[0]; // Use first ring of polygon
  for (let i = 0, j = coordinates.length - 1; i < coordinates.length; j = i++) {
    const [xi, yi] = coordinates[i];
    const [xj, yj] = coordinates[j];

    const intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
}