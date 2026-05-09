precision highp float;

attribute vec3 position;
attribute vec3 normal;
attribute vec4 world0;
attribute vec4 world1;
attribute vec4 world2;
attribute vec4 world3;

uniform mat4 worldViewProjection;
uniform mat4 view;
uniform float time;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vWave;
varying vec3 vLocalPos;
varying float fFogDistance;

float wave(vec2 p) {
    // ---------------------------------
    // LARGE SCALE DOMAIN WARP
    // bends coordinate space itself
    // ---------------------------------
    vec2 warp = vec2(
        sin(p.y * 0.05 + time * 0.2),
        cos(p.x * 0.04 - time * 0.15)
    ) * 6.0;
    p += warp;
    // ---------------------------------
    // MULTI-LAYER WAVE FIELD
    // different frequencies
    // ---------------------------------
    float h = 0.0;
    // primary ocean motion
    h += sin(p.x * 0.15 + time) * cos(p.y * 0.15 + time * 0.7);
    // large slow wave
    h += sin((p.x + p.y) * 0.04 + time * 0.3);
    // directional sweep
    h += cos(p.x * 0.08 - time * 0.5);
    // radial field breakup
    h += sin(length(p) * 0.12 - time * 0.4);
    // normalize layers
    h *= 1.25;
    return h;
}

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
    mat4 finalWorld = mat4(world0, world1, world2, world3);

    vec4 center = finalWorld * vec4(0.0, 0.0, 0.0, 1.0);
    float rx = hash(center.xz) - 0.5;
    float rz = hash(center.zx) - 0.5;
    vec2 offset = vec2(rx, rz) * 4.0;
    float h = wave(center.xz + offset);
    center.y += h;

    vWave = h;
    vLocalPos = position;

    vec4 finalPos = center + (finalWorld * vec4(position, 0.0));
    vWorldPos = finalPos.xyz;
    vNormal = mat3(finalWorld) * normal;

    fFogDistance = (view * finalPos).z;

    gl_Position = worldViewProjection * finalPos;
}