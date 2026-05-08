precision highp float;

attribute vec3 position;
attribute vec3 normal;

uniform mat4 worldViewProjection;

uniform float time;
uniform float waveStrength;
uniform float waveScale;

varying vec3 vPosition;
varying vec3 vNormal;
varying float vHeight;

//
// cheap wave function (works great for voxel grids)
//
float wave(vec3 p) {
    return sin(p.x * waveScale + time) * 
           cos(p.z * waveScale + time * 0.8);
}

void main() {

    vec3 pos = position;

    // wave displacement (Y axis)
    float h = wave(pos);
    pos.y += h * waveStrength;

    vHeight = pos.y;

    vPosition = pos;

    // fake normal via small offsets (voxel-safe)
    float eps = 0.1;

    float hL = wave(pos + vec3(-eps,0,0));
    float hR = wave(pos + vec3(eps,0,0));
    float hD = wave(pos + vec3(0,0,-eps));
    float hU = wave(pos + vec3(0,0,eps));

    vec3 n = normalize(vec3(
        hL - hR,
        2.0,
        hD - hU
    ));

    vNormal = n;

    gl_Position = worldViewProjection * vec4(pos, 1.0);
}