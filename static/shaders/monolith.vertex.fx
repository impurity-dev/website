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
varying float vEnergy;

// ----------------------------------
// hash
// ----------------------------------

float hash(vec2 p) {
    return fract(
        sin(dot(p, vec2(127.1, 311.7)))
        * 43758.5453123
    );
}

// ----------------------------------
// monolith field
// distance to giant vertical pillar
// ----------------------------------

float monolithField(vec3 p) {

    vec2 q = abs(p.xz);

    float body =
        max(q.x - 8.0, q.y - 8.0);

    return max(body, abs(p.y) - 40.0);
}

void main() {

    mat4 finalWorld = mat4(
        world0,
        world1,
        world2,
        world3
    );

    // ----------------------------------
    // original cube center
    // ----------------------------------

    vec3 center =
        (finalWorld * vec4(0.0,0.0,0.0,1.0)).xyz;

    // ----------------------------------
    // random identity
    // ----------------------------------

    float id =
        hash(floor(center.xz));

    // ----------------------------------
    // drifting swarm motion
    // ----------------------------------

    vec3 drift;

    drift.x =
        sin(time * 0.7 + id * 10.0 + center.z * 0.05);

    drift.y =
        cos(time * 0.5 + id * 7.0);

    drift.z =
        cos(time * 0.9 + id * 11.0 + center.x * 0.05);

    drift *= 4.0;

    // ----------------------------------
    // moving field position
    // ----------------------------------

    vec3 p = center + drift;

    // ----------------------------------
    // monolith attraction
    // ----------------------------------

    float d = monolithField(p);

    // inside/near monolith field
    float attract =
        smoothstep(20.0, -5.0, d);

    // ----------------------------------
    // attract cubes toward center axis
    // ----------------------------------

    vec3 target = vec3(
        floor(center.x / 4.0) * 4.0,
        center.y,
        floor(center.z / 4.0) * 4.0
    );

    vec3 finalCenter =
        mix(
            p,
            target,
            attract
        );

    // ----------------------------------
    // vertical pulse
    // ----------------------------------

    finalCenter.y +=
        sin(time * 2.0 + id * 20.0)
        * attract
        * 2.0;

    // ----------------------------------
    // rebuild voxel
    // ----------------------------------

    vec4 finalPos =
        vec4(finalCenter, 1.0)
        +
        (finalWorld * vec4(position, 0.0));

    vWorldPos = finalPos.xyz;
    vNormal = normal;

    vEnergy = attract;

    gl_Position =
        worldViewProjection * finalPos;
}