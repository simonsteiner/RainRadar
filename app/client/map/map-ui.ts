
import { MapMouseEvent } from "maplibre-gl";

export class MapUI {
    updateCoordinates(e: MapMouseEvent): void {
        const { lon, lat } = this.formatCoordinates(e);
        const coordsElement = document.getElementById("coordinates");
        if (coordsElement) {
            coordsElement.innerHTML = `Lon: ${lon} Lat: ${lat}`;
        }
    }

    async copyCoordinates(e: MapMouseEvent): Promise<void> {
        const { lon, lat } = this.formatCoordinates(e);
        const coordinates = `${lon}, ${lat}`;
        try {
            await navigator.clipboard.writeText(coordinates);
            this.flashCoordinatesCopied();
            console.info(`Copied coordinates: ${coordinates}`);
        } catch (err) {
            console.error("Failed to copy coordinates:", err);
        }
    }

    updateZoom(zoom: number): void {
        const zoomElement = document.getElementById("zoomlevel");
        if (zoomElement) {
            zoomElement.innerHTML = `Zoom: ${zoom.toFixed(2)}`;
        }
    }

    private formatCoordinates(e: MapMouseEvent) {
        return {
            lon: e.lngLat.lng.toFixed(6),
            lat: e.lngLat.lat.toFixed(6)
        };
    }

    private flashCoordinatesCopied(): void {
        const coordsElement = document.getElementById("coordinates");
        if (coordsElement) {
            coordsElement.style.background = "rgba(150, 255, 150, 0.8)";
            setTimeout(() => {
                coordsElement.style.background = "rgba(255, 255, 255, 0.8)";
            }, 200);
        }
    }
}