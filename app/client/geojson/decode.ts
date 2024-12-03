import { ShapeInput, Bounds, GeoPoint } from './types';
import { CoordinateConverter } from './coordinateConverter';

export const decodeCoordinates = (input: ShapeInput, bounds: Bounds): [number, number][] => {
    let x = input.i;
    let y = input.j;
    const coordinates: [number, number][] = [];

    for (let idx = 0; idx < input.o.length; idx++) {
        const fraction = parseInt(input.o.charAt(idx)) / 10 + 0.05;
        const position = calculatePosition(x, y, fraction, bounds);
        const [longitude, latitude] = convertToWGS(position.x, position.y);
        
        coordinates.push([longitude, latitude] as [number, number]);

        if (2 * idx < input.d.length) {
            x += input.d.charCodeAt(2 * idx) - 77;
            y += input.d.charCodeAt(2 * idx + 1) - 77;
        }
    }
    return coordinates;
};

const calculatePosition = (x: number, y: number, fraction: number, bounds: Bounds): GeoPoint => {
    let xPosition: number, yPosition: number;
    
    if (x % 2 === 0) {
        xPosition = bounds.x_min + (bounds.x_max - bounds.x_min) * (x / 2) / bounds.x_count;
        yPosition = bounds.y_min + (bounds.y_max - bounds.y_min) * ((y - 1) / 2 + fraction) / bounds.y_count;
    } else {
        xPosition = bounds.x_min + (bounds.x_max - bounds.x_min) * ((x - 1) / 2 + fraction) / bounds.x_count;
        yPosition = bounds.y_min + (bounds.y_max - bounds.y_min) * (y / 2) / bounds.y_count;
    }
    
    return { x: xPosition, y: yPosition };
};

const convertToWGS = (x: number, y: number): number[] => {
    return CoordinateConverter.CHtoWGS(1000 * x, 1000 * y);
};