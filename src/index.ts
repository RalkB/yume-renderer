'use strict';

import { config } from "./config.js";
import { Triangle, Vertex } from "./forms.js";
import {
    multiplyMatrixVector,
    perspectiveProjectionMatrix, rotationMatrixX,
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
        { v1: 0, v2: 1, v3: 2 }, { v1: 0, v2: 2, v3: 3 }, // Face frontal
        { v1: 4, v2: 5, v3: 6 }, { v1: 4, v2: 6, v3: 7 }, // Face traseira
        { v1: 0, v2: 1, v3: 5 }, { v1: 0, v2: 5, v3: 4 }, // Face inferior
        { v1: 2, v2: 3, v3: 7 }, { v1: 2, v2: 7, v3: 6 }, // Face superior
        { v1: 0, v2: 3, v3: 7 }, { v1: 0, v2: 7, v3: 4 }, // Face esquerda
        { v1: 1, v2: 2, v3: 6 }, { v1: 1, v2: 6, v3: 5 }  // Face direita
    ];


    let lastTime = performance.now();

    function animate(ctx: CanvasRenderingContext2D) {
        const currentTime = performance.now();
        const deltaTime = (currentTime - lastTime) / 1000; // Calculate time elapsed in seconds
        lastTime = currentTime;
    
        const angle = 5 * deltaTime;
        const rotationX = rotationMatrixX(angle);
        vertices = vertices.map((vertex) => {
            const [x, y, z, w] = multiplyMatrixVector(rotationX, [
                vertex.x,
                vertex.y,
                vertex.z,
                1,
            ]);
            return {x, y, z};
        })
        // console.log(rotationX);
        // Transform and project the rotated vertices
        const transformedVertices = transformVertices(vertices, perspectiveProjectionMatrix());
        const scaledVertices = scaleAndNormalizeVertices(transformedVertices);
    
        // Draw the rotated cube
        drawWireframe(ctx, scaledVertices, triangles);
    
        requestAnimationFrame(() => animate(ctx));
    }

    animate(ctx);
});