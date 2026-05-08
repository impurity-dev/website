precision highp float;

attribute vec3 position;
attribute vec3 normal;

attribute vec4 world0;
attribute vec4 world1;
attribute vec4 world2;
attribute vec4 world3;

uniform mat4 worldViewProjection;
uniform float time;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vWave;

float wave(vec2 p) {
    return
        sin(p.x * 0.15 + time) *
        cos(p.y * 0.15 + time * 0.7);
}

void main() {

    //
    // thin instance matrix
    //

    mat4 finalWorld = mat4(
        world0,
        world1,
        world2,
        world3
    );
    vec4 localPos = vec4(position, 1.0);
    vec4 worldPos = finalWorld * localPos;

    //
    // wave displacement
    //

    float h = wave(worldPos.xz);

    worldPos.y += h * 2.0;

    vWave = h;

    //
    // fake normals
    //

    float eps = 0.25;

    float hL = wave(worldPos.xz + vec2(-eps, 0.0));
    float hR = wave(worldPos.xz + vec2(eps, 0.0));

    float hD = wave(worldPos.xz + vec2(0.0, -eps));
    float hU = wave(worldPos.xz + vec2(0.0, eps));

    vec3 N = normalize(vec3(
        hL - hR,
        2.0,
        hD - hU
    ));

    vNormal = N;
    vWorldPos = worldPos.xyz;

    gl_Position =
        worldViewProjection * worldPos;
}