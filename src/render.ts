'use strict';

import { config } from "./config.js";
import { Vertex, Triangle } from "./forms.js";

export function drawWireframe(ctx: CanvasRenderingContext2D, vertices: Vertex[], triangles: Triangle[], normals: Vertex[]) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, config.canvas.width, config.canvas.height);

    ctx.strokeStyle = "#ffffff";

    // Adicione um fator de escala para as normais, para torná-las mais visíveis
    const normalScale = 50;

    // Função auxiliar para desenhar uma seta
    function drawArrow(ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, headLength = 10, headAngle = Math.PI / 6) {
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);

        const angle = Math.atan2(toY - fromY, toX - fromX);
        ctx.lineTo(toX - headLength * Math.cos(angle - headAngle), toY - headLength * Math.sin(angle - headAngle));
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - headLength * Math.cos(angle + headAngle), toY - headLength * Math.sin(angle + headAngle));

        ctx.stroke();
    }

    for (let i = 0; i < triangles.length; i++) {
        const { v1, v2, v3 } = triangles[i];
        const p1 = vertices[v1];
        const p2 = vertices[v2];
        const p3 = vertices[v3];

        // Desenhar o triângulo
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();
        ctx.stroke();

        // Calcular o ponto central do triângulo
        const centerX = (p1.x + p2.x + p3.x) / 3;
        const centerY = (p1.y + p2.y + p3.y) / 3;
        // console.log(normals);
        if(normals.length) {
            // Obter a normal correspondente e escalar
            const normal = normals[i];
            const endX = centerX + normal.x * normalScale;
            const endY = centerY + normal.y * normalScale;
    
            // Desenhar a seta da normal
            ctx.strokeStyle = "#ff0000";
            drawArrow(ctx, centerX, centerY, endX, endY);
            ctx.strokeStyle = "#ffffff";
        }
    }
};