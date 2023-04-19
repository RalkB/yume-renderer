'use strict';

import { config } from "./config.js";
import { Vertex, Triangle } from "./forms.js";


/**
 * Draw the wireframe of a 3D object
 * @param ctx - The 2D rendering context of the canvas.
 * @param vertices - The array of vertices of the 3D object.
 * @param triangles - The array of triangles of the 3D object.
 */
export function drawWireframe (ctx: CanvasRenderingContext2D, vertices: Vertex[], triangles: Triangle[]) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, config.canvas.width, config.canvas.height);

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