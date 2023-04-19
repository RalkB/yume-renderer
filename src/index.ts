'use strict';

import { config } from "./config.js";
import { Triangle, Vertex } from "./forms.js";
import {
  perspectiveProjectionMatrix,
  scaleAndNormalizeVertices,
  transformVertices,
} from "./matrices.js";

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

    const vertices: Vertex[] = [
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

    const projectionMatrix = perspectiveProjectionMatrix();
    const transformedVertices = transformVertices(vertices, projectionMatrix);
    const scaledVertices = scaleAndNormalizeVertices(transformedVertices);

    const drawWireframe = (ctx: CanvasRenderingContext2D, vertices: Vertex[], triangles: Triangle[]) => {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "#ffffff";
      
        // Desenha as linhas de contorno
        for (const { v1, v2, v3 } of triangles) {
            const p1 = vertices[v1];
            const p2 = vertices[v2];
            const p3 = vertices[v3];
    
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.closePath();
            ctx.stroke();
        }
    };

    drawWireframe(ctx, scaledVertices, triangles);
});