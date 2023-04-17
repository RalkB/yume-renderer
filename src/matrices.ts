'use strict';

import { config } from "./config.js";
import { Vertex } from "./forms.js";

export function multiplyMatrixVector (
    matrix: number[][],
    vector: [number, number, number, number]
): [number, number, number, number] {
    let result: [number, number, number, number] = [0, 0, 0, 0];
  
    for (let i = 0; i < 4; ++i) {
        for (let j = 0; j < 3; ++j) {
            result[i] += matrix[i][j] * vector[j];
        }
        result[i] += matrix[i][3];
    }
  
    return result;
};

export function scaleAndNormalizeVertices (vertices: Vertex[]): Vertex[] {
    return vertices.map(({ x, y, z }) => ({
        x: ((x + 1) * 0.5) * config.canvas.width,
        y: ((-y + 1) * 0.5) * config.canvas.height,
        z: z
    }));
};

export function transformVertices(
    vertices: Vertex[],
    projectionMatrix: number[][]
): Vertex[] {
    return vertices.map((vertex) => {
        const [x, y, z, w] = multiplyMatrixVector(projectionMatrix, [
            vertex.x - 1,
            vertex.y - 1,
            vertex.z - 1 + 5,
            1,
        ]);

        if (w !== 0) return { x: x / w, y: y / w, z: z / w };
        return { x: 0, y: 0, z: 0 };
    });
}

export function perspectiveProjectionMatrix (): number[][] {
    const fovRadians = config.fovDegrees * (Math.PI / 180);
    const f = 1 / Math.tan(fovRadians / 2);
    const rangeInv = 1 / (config.near - config.far);
    const aspectRatio = config.canvas.width / config.canvas.height;

    return [
        [f / aspectRatio, 0, 0, 0],
        [0, f, 0, 0],
        [0, 0, (config.near + config.far) * rangeInv, config.near * config.far * rangeInv * 2],
        [0, 0, -1, 0]
    ];
};
