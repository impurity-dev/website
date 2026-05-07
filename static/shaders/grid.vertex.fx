// ground.vertex.fx

precision highp float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 worldViewProjection;
uniform float time;

varying vec2 vCellUV;
varying float vHeight;

//
// Hash function (pseudo-random per cell)
//
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {

    // ===== GRID SIZE (controls cube size) =====
    float gridSize = 2.0;

    // snap UV into "cells"
    vec2 cell = floor(uv * 50.0);

    // local UV inside cell
    vCellUV = fract(uv * 50.0);

    // ===== GLOBAL TRAVELING WAVE =====
    float wave =
        sin((cell.x + time * 1.5) * 0.6) +
        cos((cell.y + time * 1.2) * 0.6);

    // ===== RANDOM PER-CELL OFFSET =====
    float rand = hash(cell);

    // combine wave + randomness
    float height = wave * 0.8 + rand * 0.6;

    // sharpen into more "blocky steps"
    height = floor(height * 4.0) / 4.0;

    vHeight = height;

    // ===== APPLY HEIGHT ONLY PER CELL =====
    vec3 p = position;

    // keep blocks disjoint but aligned
    p.y += height * 1.2;

    // optional: slight separation pulse (feels mechanical)
    p.y += step(0.5, rand) * sin(time + rand * 10.0) * 0.1;

    gl_Position = worldViewProjection * vec4(p, 1.0);
}