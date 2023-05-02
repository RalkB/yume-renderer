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

export function perspectiveProjectionMatrix(): number[][] {
    const aspectRatio = config.canvas.width / config.canvas.height;
    const fovRad = (config.fovDegrees / 2) * (Math.PI / 180);
    const fovScale = 1 / Math.tan(fovRad);
    const zFar = config.far;
    const zNear = config.near;

    return [
        [fovScale / aspectRatio, 0, 0, 0],
        [0, fovScale, 0, 0],
        [0, 0, zFar / (zFar - zNear), 1],
        [0, 0, -(zFar * zNear) / (zFar - zNear), 0],
    ];
}

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

/**
 * Generates a 4d rotation matrix in the y axis 
 * @param rotationAngle the angle that the object will rotate
 * @returns 
 */
export function rotationMatrixY(rotationAngle: number) : number[][]{
    return [
        [Math.cos(rotationAngle), 0, -Math.sin(rotationAngle), 0],
        [0, 1, 0, 0],
        [Math.sin(rotationAngle), 0, Math.cos(rotationAngle), 0],
        [0, 0, 0, 1]
    ];
}

export const translationMatrix = [
    [1, 0, 0, 0],
    [0, 1, 0, -0.3],
    [0, 0, 1, 15], // Aumente a distância do cubo em relação à câmera
    [0, 0, 0, 1],
];