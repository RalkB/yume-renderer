'use strict';

import { config } from "./config.js";
import { Triangle, Vertex } from "./forms.js";
import {
    multiplyMatrixVector,
    perspectiveProjectionMatrix, rotationMatrixX, rotationMatrixY, translationMatrix,
} from "./matrices.js";
import { drawWireframe } from "./render.js";
import { scaleAndNormalizeVertices, transformVertices } from "./transform.js";

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.createElement("canvas");
    canvas.width = config.canvas.width;
    canvas.height = config.canvas.height;
    document.body.appendChild(canvas);
  
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        console.error("error trying to get canvas context");
        return;
    }

    let vertices: Vertex[] = [
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 0, z: 0 },
        { x: 1, y: 1, z: 0 },
        { x: 0, y: 1, z: 0 },
        { x: 0, y: 0, z: 1 },
        { x: 1, y: 0, z: 1 },
        { x: 1, y: 1, z: 1 },
        { x: 0, y: 1, z: 1 },  
    ];

    const triangles: Triangle[] = [
        { v1: 0, v2: 2, v3: 1 }, { v1: 0, v2: 3, v3: 2 },
        { v1: 4, v2: 5, v3: 6 }, { v1: 4, v2: 6, v3: 7 },
        { v1: 0, v2: 1, v3: 5 }, { v1: 0, v2: 5, v3: 4 },
        { v1: 2, v2: 3, v3: 7 }, { v1: 2, v2: 7, v3: 6 },
        { v1: 0, v2: 7, v3: 3 }, { v1: 0, v2: 4, v3: 7 },
        { v1: 1, v2: 2, v3: 6 }, { v1: 1, v2: 6, v3: 5 }
    ];

    let lastTime = performance.now();

    function animate(ctx: CanvasRenderingContext2D) {
        const currentTime = performance.now();
        const deltaTime = (currentTime - lastTime) / 1000; // Calculate time elapsed in seconds
        lastTime = currentTime;

        // rotate cube
        const angle = 1 * deltaTime;
        const rotationX = rotationMatrixX(angle);
        const rotationY = rotationMatrixY(angle); 
        vertices = vertices.map((vertex) => {
            let [x, y, z, w] = multiplyMatrixVector(rotationX, [
                vertex.x,
                vertex.y,
                vertex.z,
                1,
            ]);
            return {x, y, z};
        })
        vertices = vertices.map((vertex) => {
            let [x, y, z, w] = multiplyMatrixVector(rotationY, [
                vertex.x,
                vertex.y,
                vertex.z,
                1,
            ]);
            return {x, y, z};
        })
        // translate
        const translatedVertices = transformVertices(vertices, translationMatrix);

        const culledTriangles = [];
        const normals = [];
        for (let i = 0; i < triangles.length; i++) {
            const { v1, v2, v3 } = triangles[i];
            const p1 = translatedVertices[v1];
            const p2 = translatedVertices[v2];
            const p3 = translatedVertices[v3];

            const normal = calculateNormal(p1, p2, p3);

            if (normal.z > 0) {
                culledTriangles.push(triangles[i]);
                normals.push(normal);
            }
        }
        // Transform and project the rotated vertices
        const transformedVertices = transformVertices(translatedVertices, perspectiveProjectionMatrix());
        const scaledVertices = scaleAndNormalizeVertices(transformedVertices);
    
        // Draw the rotated cube
        drawWireframe(ctx, scaledVertices, culledTriangles, normals);
    
        requestAnimationFrame(() => animate(ctx));
    }

    animate(ctx);
});

function calculateNormal(a: Vertex, b: Vertex, c: Vertex): Vertex {
    const line1: Vertex = {
        x: b.x - a.x,
        y: b.y - a.y,
        z: b.z - a.z,
    };

    const line2: Vertex = {
        x: c.x - a.x,
        y: c.y - a.y,
        z: c.z - a.z,
    };

    const normal: Vertex = {
        x: line1.y * line2.z - line1.z * line2.y,
        y: line1.z * line2.x - line1.x * line2.z,
        z: line1.x * line2.y - line1.y * line2.x,
    };

    const length = Math.sqrt(normal.x ** 2 + normal.y ** 2 + normal.z ** 2);
    normal.x /= length;
    normal.y /= length;
    normal.z /= length;
    normal.x *= -1;
    return normal;
}