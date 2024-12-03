
import { GeoPoint } from './types';

export const CoordinateConverter = {
    CHtoWGS(x: number, y: number): number[] {
        return [this.CHtoWGSlng(x, y), this.CHtoWGSlat(x, y)];
    },

    CHtoWGSlat(x: number, y: number): number {
        const coords = this.LV03_95toCH(x, y);
        const normalizedX = (coords.x - 600000) / 1000000;
        const normalizedY = (coords.y - 200000) / 1000000;

        const lat = 16.9023892 
            + (3.238272 * normalizedY)
            - (0.270978 * Math.pow(normalizedX, 2))
            - (0.002528 * Math.pow(normalizedY, 2))
            - (0.0447 * Math.pow(normalizedX, 2) * normalizedY)
            - (0.014 * Math.pow(normalizedY, 3));

        return (lat * 100) / 36;
    },

    CHtoWGSlng(x: number, y: number): number {
        const coords = this.LV03_95toCH(x, y);
        const normalizedX = (coords.x - 600000) / 1000000;
        const normalizedY = (coords.y - 200000) / 1000000;

        const lng = 2.6779094
            + (4.728982 * normalizedX)
            + (0.791484 * normalizedX * normalizedY)
            + (0.1306 * normalizedX * Math.pow(normalizedY, 2))
            - (0.0436 * Math.pow(normalizedX, 3));

        return (lng * 100) / 36;
    },

    LV03_95toCH(x: number, y: number): GeoPoint {
        return {
            x: x >= 2000000 ? x - 2000000 : x,
            y: y >= 1000000 ? y - 1000000 : y
        };
    }
};