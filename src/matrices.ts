'use strict';

import { config } from "./config.js";
import { Vertex } from "./forms.js";

/**
 * Multiplies a 4x4 matrix with a 4D vector.
 * @param matrix A 4x4 matrix.
 * @param vector A 4D vector.
 * @returns The result of multiplying the matrix by the vector.
 */
export function multiplyMatrixVector (
    matrix: number[][], // 4x4 matrix
    vector: [number, number, number, number] // x, y, z, w
): [number, number, number, number] {
    return [
        matrix[0][0] * vector[0] + matrix[0][1] * vector[1] + matrix[0][2] * vector[2] + matrix[0][3],
        matrix[1][0] * vector[0] + matrix[1][1] * vector[1] + matrix[1][2] * vector[2] + matrix[1][3],
        matrix[2][0] * vector[0] + matrix[2][1] * vector[1] + matrix[2][2] * vector[2] + matrix[2][3],
        matrix[3][0] * vector[0] + matrix[3][1] * vector[1] + matrix[3][2] * vector[2] + matrix[3][3],
    ];
};

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
 * @param projectionMatrix A 4x4 projection matrix.
 * @returns An array of transformed vertices.
 */
export function transformVertices(
    vertices: Vertex[],
    projectionMatrix: number[][]
): Vertex[] {
    return vertices.map((vertex) => {
        const [x, y, z, w] = multiplyMatrixVector(projectionMatrix, [
            vertex.x,
            vertex.y,
            vertex.z + 5,
            1,
        ]);

        if (w !== 0) return { x: x / w, y: y / w, z: z / w };
        return { x: 0, y: 0, z: 0 };
    });
}

/**
 * Generates a perspective projection matrix based on the configuration.
 * @returns A 4x4 perspective projection matrix.
 */
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
