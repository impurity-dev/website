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
varying vec3 vLocalPos;   // NEW — for panel/seam mapping

float wave(vec2 p) {
    return
        sin(p.x * 0.15 + time) *
        cos(p.y * 0.15 + time * 0.7);
}

float hash(vec2 p) {
    return fract(
        sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123
    );
}

void main() {
    mat4 finalWorld = mat4(world0, world1, world2, world3);

    vec4 center = finalWorld * vec4(0.0, 0.0, 0.0, 1.0);
    float rx = hash(center.xz) - 0.5;
    float rz = hash(center.zx) - 0.5;
    vec2 offset = vec2(rx, rz) * 4.0;
    float h = wave(center.xz + offset);
    center.y += h * 2.0;

    vWave = h;
    vLocalPos = position;   // raw cube geometry [-0.5..0.5]

    vec4 finalPos = center + (finalWorld * vec4(position, 0.0));
    vWorldPos = finalPos.xyz;
    vNormal = mat3(finalWorld) * normal;

    gl_Position = worldViewProjection * finalPos;
}