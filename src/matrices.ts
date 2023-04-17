'use strict';

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

export function scaleAndNormalizeVertices (
    vertices: Vertex[],
    width: number,
    height: number
): Vertex[] {
    return vertices.map(({ x, y, z }) => ({
        x: ((x + 1) * 0.5) * width,
        y: ((-y + 1) * 0.5) * height,
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

export function perspectiveProjectionMatrix (
    fovDegrees: number,
    aspectRatio: number,
    near: number,
    far: number
): number[][] {
    const fovRadians = fovDegrees * (Math.PI / 180);
    const f = 1 / Math.tan(fovRadians / 2);
    const rangeInv = 1 / (near - far);

    return [
        [f / aspectRatio, 0, 0, 0],
        [0, f, 0, 0],
        [0, 0, (near + far) * rangeInv, near * far * rangeInv * 2],
        [0, 0, -1, 0]
    ];
};
