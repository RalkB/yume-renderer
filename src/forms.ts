'use strict';

export interface Vertex {
    x: number;
    y: number;
    z: number;
}

// use index of vertex for a better performance
export interface Triangle {
    v1: number;
    v2: number;
    v3: number;
}