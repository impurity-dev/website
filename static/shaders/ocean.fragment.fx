precision highp float;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vWave;
varying vec3 vLocalPos;
varying float fFogDistance;

uniform float time;
uniform vec3 vFogInfos;
uniform vec3 vFogColor;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float edgeMask(vec3 lp, float width) {
    float e = 0.5 - width;
    // smoothstep instead of step — feathers the edge over ~0.02 units
    float ex = smoothstep(e - 0.02, e + 0.02, abs(lp.x));
    float ey = smoothstep(e - 0.02, e + 0.02, abs(lp.y));
    float ez = smoothstep(e - 0.02, e + 0.02, abs(lp.z));
    return clamp(ex + ey + ez - 1.0, 0.0, 1.0);
}

void main() {
    vec3 n = normalize(vNormal);
    float edge = edgeMask(vLocalPos, 0.06);

    // ---- wave + instance identity ----
    float waveT = clamp((vWave + 1.0) * 0.5, 0.0, 1.0);
    float id = hash(floor(vWorldPos.xz * 0.5));
    float pulse = sin(time * 2.0 + id * 6.28318) * 0.5 + 0.5;

    // ---- base metal (face-aware) ----
    float topness = max(0.0, n.y);
    vec3 metalBase = mix(
        vec3(0.08, 0.10, 0.12),
        vec3(0.14, 0.17, 0.20),
        topness
    );
    vec3 tint = mix(vec3(0.05, 0.10, 0.18), vec3(0.10, 0.06, 0.14), id);
    metalBase += tint * 0.08;

    // ---- diffuse + specular ----
    vec3 sunDir = normalize(vec3(0.5, 1.0, 0.3));
    float diff = max(dot(n, sunDir), 0.0) * 0.5 + 0.15;
    vec3 viewDir = normalize(vec3(0.3, 1.0, 0.6));
    vec3 halfVec = normalize(sunDir + viewDir);
    float spec = pow(max(dot(n, halfVec), 0.0), 120.0);
    float rimSpec = pow(max(dot(n, halfVec), 0.0), 12.0) * 0.08;
    vec3 specColor = vec3(0.7, 0.85, 1.0) * (spec * 0.9 + rimSpec) * topness;

    // ---- water sheen on top ----
    float sheen = pow(max(dot(n, vec3(0.0, 1.0, 0.0)), 0.0), 6.0) * 0.12;
    vec3 waterTint = vec3(0.10, 0.35, 0.60) * sheen * (0.5 + waveT * 0.5);

    // ---- edge glow: blue -> teal -> amber ----
    vec3 glowDeep  = vec3(0.03, 0.20, 0.60);
    vec3 glowMid   = vec3(0.00, 0.70, 0.65);
    vec3 glowCrest = vec3(0.90, 0.60, 0.10);
    vec3 glowColor = mix(glowDeep, glowMid, waveT);
    glowColor = mix(glowColor, glowCrest, smoothstep(0.65, 1.0, waveT));
    float glowIntensity = (0.6 + pulse * 0.4) * (0.4 + waveT * 0.8);
    vec3 edgeGlow = glowColor * edge * glowIntensity * 2.5;

    // ---- compose ----
    vec3 col = metalBase * diff;
    col += edgeGlow;
    col += specColor;
    col += waterTint;

    col = col / (col + 0.6);
    col = pow(col, vec3(0.9));

    // ---- BabylonJS EXP2 fog ----
    float fogDensity = vFogInfos.y;
    float fogFactor = clamp(
        exp2(-fogDensity * fogDensity * fFogDistance * fFogDistance * 1.4426),
        0.0, 1.0
    );
    col = mix(vFogColor, col, fogFactor);

    gl_FragColor = vec4(col, 1.0);
}