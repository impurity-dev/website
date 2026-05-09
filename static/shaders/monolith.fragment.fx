precision highp float;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vEnergy;
varying vec3 vLocalPos;
varying float fFogDistance;

uniform float time;
uniform vec3 vFogInfos;
uniform vec3 vFogColor;

// ----------------------------------
// hash
// ----------------------------------

float hash(vec2 p) {
    return fract(
        sin(dot(p, vec2(127.1, 311.7)))
        * 43758.5453
    );
}

// ----------------------------------
// softened edge mask
// ----------------------------------

float edgeMask(vec3 lp, float width) {

    float e = 0.5 - width;

    float ex =
        smoothstep(
            e - 0.02,
            e + 0.02,
            abs(lp.x)
        );

    float ey =
        smoothstep(
            e - 0.02,
            e + 0.02,
            abs(lp.y)
        );

    float ez =
        smoothstep(
            e - 0.02,
            e + 0.02,
            abs(lp.z)
        );

    return clamp(
        ex + ey + ez - 1.0,
        0.0,
        1.0
    );
}

void main() {

    vec3 n = normalize(vNormal);

    // ----------------------------------
    // cube panel edges
    // ----------------------------------

    float edge =
        edgeMask(vLocalPos, 0.06);

    // ----------------------------------
    // instance identity
    // ----------------------------------

    float id =
        hash(floor(vWorldPos.xz * 0.5));

    float pulse =
        sin(time * 2.0 + id * 6.28318)
        * 0.5 + 0.5;

    // ----------------------------------
    // energy factor
    // from monolith attractor field
    // ----------------------------------

    float energy =
        clamp(vEnergy, 0.0, 1.0);

    // ----------------------------------
    // dark metal base
    // ----------------------------------

    float topness =
        max(0.0, n.y);

    vec3 metalBase =
        mix(
            vec3(0.08, 0.10, 0.12),
            vec3(0.14, 0.17, 0.20),
            topness
        );

    // subtle tint variation
    vec3 tint =
        mix(
            vec3(0.05, 0.10, 0.18),
            vec3(0.10, 0.06, 0.14),
            id
        );

    metalBase += tint * 0.08;

    // ----------------------------------
    // lighting
    // ----------------------------------

    vec3 sunDir =
        normalize(vec3(0.5, 1.0, 0.3));

    float diff =
        max(dot(n, sunDir), 0.0)
        * 0.5 + 0.15;

    // ----------------------------------
    // metallic specular
    // ----------------------------------

    vec3 viewDir =
        normalize(vec3(0.3, 1.0, 0.6));

    vec3 halfVec =
        normalize(sunDir + viewDir);

    float spec =
        pow(
            max(dot(n, halfVec), 0.0),
            120.0
        );

    float rimSpec =
        pow(
            max(dot(n, halfVec), 0.0),
            12.0
        ) * 0.08;

    vec3 specColor =
        vec3(0.7, 0.85, 1.0)
        * (spec * 0.9 + rimSpec)
        * topness;

    // ----------------------------------
    // subtle top-face sheen
    // ----------------------------------

    float sheen =
        pow(
            max(dot(n, vec3(0.0,1.0,0.0)), 0.0),
            6.0
        ) * 0.12;

    vec3 waterTint =
        vec3(0.10, 0.35, 0.60)
        * sheen
        * (0.4 + energy * 0.6);

    // ----------------------------------
    // monolith edge glow
    // ----------------------------------

    vec3 glowDeep =
        vec3(0.03, 0.20, 0.60);

    vec3 glowMid =
        vec3(0.00, 0.70, 0.65);

    vec3 glowHot =
        vec3(0.90, 0.60, 0.10);

    vec3 glowColor =
        mix(glowDeep, glowMid, energy);

    glowColor =
        mix(
            glowColor,
            glowHot,
            smoothstep(0.7, 1.0, energy)
        );

    float glowIntensity =
        (0.6 + pulse * 0.4)
        * (0.3 + energy * 1.2);

    vec3 edgeGlow =
        glowColor
        * edge
        * glowIntensity
        * 2.8;

    // ----------------------------------
    // compose
    // ----------------------------------

    vec3 col =
        metalBase * diff;

    col += edgeGlow;
    col += specColor;
    col += waterTint;

    // soft tonemap
    col = col / (col + 0.6);

    // gamma lift
    col = pow(col, vec3(0.9));

    // ----------------------------------
    // BabylonJS fog
    // ----------------------------------

    float fogDensity =
        vFogInfos.y;

    float fogFactor =
        clamp(
            exp2(
                -fogDensity
                * fogDensity
                * fFogDistance
                * fFogDistance
                * 1.4426
            ),
            0.0,
            1.0
        );

    col =
        mix(
            vFogColor,
            col,
            fogFactor
        );

    gl_FragColor =
        vec4(col, 1.0);
}