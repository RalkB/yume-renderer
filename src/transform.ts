'use strict';

import { config } from "./config.js";
import { Vertex } from "./forms.js";
import { multiplyMatrixVector } from "./matrices.js";

/**
 * Scales and normalizes vertices.
 * @param vertices An array of vertices.
 * @returns An array of scaled and normalized vertices.
 */
export function scaleAndNormalizeVertices (vertices: Vertex[]): Vertex[] {
    return vertices.map(({ x, y, z }) => ({
        x: ((x + 1) * 0.5) * config.canvas.width,
        y: ((-y + 1) * 0.5) * config.canvas.height,
        z: z
    }));
};

/**
 * Transforms vertices by multiplying them with the projection matrix and dividing by 'w'.
 * @param vertices An array of vertices.
 * @param matrix A 4x4 projection matrix.
 * @returns An array of transformed vertices.
 */
export function transformVertices(
    vertices: Vertex[],
    matrix: number[][]
): Vertex[] {
    return vertices.map((vertex) => {
        const [x, y, z, w] = multiplyMatrixVector(matrix, [
            vertex.x,
            vertex.y,
            vertex.z,
            1,
        ]);

        if (w !== 0) return { x: x / w, y: y / w, z: z / w };
        return { x: 0, y: 0, z: 0 };
    });
}