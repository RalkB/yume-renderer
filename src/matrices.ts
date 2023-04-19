'use strict';

import { config } from "./config.js";

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

/**
 * Generates a 4d rotation matrix in the x axis 
 * @param rotationAngle the angle that the object will rotate
 * @returns 
 */
export function rotationMatrixX(rotationAngle: number) : number[][]{
    return [
        [1, 0, 0, 0],
        [0, Math.cos(rotationAngle), Math.sin(rotationAngle), 0],
        [0, -Math.sin(rotationAngle), Math.cos(rotationAngle), 0],
        [0, 0, 0, 1]
    ]
}