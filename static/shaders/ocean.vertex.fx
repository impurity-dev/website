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

    mat4 finalWorld = mat4(
        world0,
        world1,
        world2,
        world3
    );

    //
    // STEP 1: get INSTANCE CENTER (NOT vertex)
    //
    vec4 center = finalWorld * vec4(0.0, 0.0, 0.0, 1.0);

    float h = wave(center.xz);

    //
    // STEP 2: apply rigid vertical offset ONLY to instance center
    //
    center.y += h * 2.0;

    vWave = h;

    //
    // STEP 3: rebuild final position
    // cube geometry stays intact here
    //
    vec4 finalPos =
        center + (finalWorld * vec4(position, 0.0));

    vWorldPos = finalPos.xyz;
    vNormal = normal;

    gl_Position =
        worldViewProjection * finalPos;
}