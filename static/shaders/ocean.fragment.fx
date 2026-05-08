precision highp float;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vWave;
varying vec3 vLocalPos;

uniform float time;

// ---- Helpers ----

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// Seam detection — returns 1.0 at panel edges, 0.0 inside panels
float seamMask(vec3 lp, float width) {
    vec3 a = abs(lp);
    float maxA = max(a.x, max(a.y, a.z));
    // edges of each face
    float e = 0.5 - width;
    float ex = step(e, a.x);
    float ey = step(e, a.y);
    float ez = step(e, a.z);
    // on a face, two axes are near their max — seam is where both edge flags fire
    return clamp(ex + ey + ez - 1.0, 0.0, 1.0);
}

// Panel subdivision lines inside a face
float panelLines(vec3 lp, vec3 n) {
    vec2 uv;
    vec3 an = abs(n);
    if (an.y > an.x && an.y > an.z) uv = lp.xz;
    else if (an.x > an.z)            uv = lp.yz;
    else                             uv = lp.xy;

    uv = uv * 3.0;   // 3x3 sub-panels per face
    vec2 g = abs(fract(uv) - 0.5);
    float lines = max(g.x, g.y);
    return smoothstep(0.47, 0.50, lines);
}

// Hex-ish cell pattern for surface texture
float hexNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float n = 0.0;
    for (int x = -1; x <= 1; x++)
    for (int y = -1; y <= 1; y++) {
        vec2 nb = vec2(float(x), float(y));
        vec2 g = vec2(hash(i + nb), hash(i + nb + 0.7));
        float d = length(f - nb - g);
        n = min(n + d * 0.3, 1.0);
    }
    return clamp(n, 0.0, 1.0);
}

void main() {

    vec3 n = normalize(vNormal);
    vec3 lp = vLocalPos;   // [-0.5 .. 0.5]

    // ---- 1. Base metal color per face ----
    float topness = max(0.0, n.y);
    float sideness = 1.0 - topness;

    // Dark gunmetal base, slightly brighter on top
    vec3 metalBase = mix(
        vec3(0.08, 0.10, 0.12),   // side — very dark iron
        vec3(0.14, 0.17, 0.20),   // top — slightly lighter
        topness
    );

    // ---- 2. Per-instance ID tint (subtle hue shift) ----
    float id = hash(floor(vWorldPos.xz * 0.5));
    vec3 tint = mix(vec3(0.05, 0.10, 0.18), vec3(0.10, 0.06, 0.14), id);
    metalBase += tint * 0.08;

    // ---- 3. Surface micro-texture ----
    float tex = hexNoise(vWorldPos.xz * 4.0 + vWorldPos.y * 2.0);
    metalBase += vec3(tex * 0.015);

    // ---- 4. Panel seams — deep groove ----
    float seam = seamMask(lp, 0.04);
    float panel = panelLines(lp, n);

    float grooveDepth = seam * 0.7 + panel * 0.25;
    metalBase *= (1.0 - grooveDepth * 0.65);

    // ---- 5. Energy glow in seams ----
    // Color shifts with wave height: deep blue -> teal -> amber at crest
    float waveT = clamp((vWave + 1.0) * 0.5, 0.0, 1.0);
    vec3 seamColorDeep  = vec3(0.03, 0.20, 0.60);
    vec3 seamColorMid   = vec3(0.00, 0.70, 0.65);
    vec3 seamColorCrest = vec3(0.90, 0.60, 0.10);
    vec3 seamColor = mix(seamColorDeep, seamColorMid, waveT);
    seamColor = mix(seamColor, seamColorCrest, smoothstep(0.65, 1.0, waveT));

    // Pulse — each instance pulses at a slightly different phase
    float pulse = sin(time * 2.0 + id * 6.28) * 0.5 + 0.5;
    float glowIntensity = (0.6 + pulse * 0.4) * (0.4 + waveT * 0.8);

    vec3 seamGlow = seamColor * grooveDepth * glowIntensity * 2.5;

    // ---- 6. Diffuse lighting ----
    vec3 sunDir = normalize(vec3(0.5, 1.0, 0.3));
    float diff = max(dot(n, sunDir), 0.0) * 0.5 + 0.15;  // half-lambert + ambient

    // ---- 7. Specular — sharp metallic highlight ----
    vec3 viewDir = normalize(vec3(0.3, 1.0, 0.6));
    vec3 halfVec = normalize(sunDir + viewDir);
    float spec    = pow(max(dot(n, halfVec), 0.0), 120.0);  // very tight = metal
    float rimSpec = pow(max(dot(n, halfVec), 0.0), 12.0) * 0.08;  // wide soft rim
    vec3 specColor = vec3(0.7, 0.85, 1.0) * (spec * 0.9 + rimSpec) * topness;

    // ---- 8. Top-face water sheen ----
    float sheen = pow(max(dot(n, vec3(0.0, 1.0, 0.0)), 0.0), 6.0) * 0.12;
    float waveWet = 0.5 + waveT * 0.5;
    vec3 waterTint = vec3(0.10, 0.35, 0.60) * sheen * waveWet;

    // ---- 9. Edge ambient occlusion ----
    float ao = 1.0 - seam * 0.4;

    // ---- 10. Depth fog ----
    float dist  = length(vWorldPos.xz) * 0.007;
    float fog   = clamp(dist * dist, 0.0, 1.0);
    vec3 fogCol = vec3(0.30, 0.45, 0.62);

    // ---- Compose ----
    vec3 col  = metalBase * diff * ao;
    col      += seamGlow;
    col      += specColor;
    col      += waterTint;
    col       = mix(col, fogCol, fog);

    // Slight tone-map to keep HDR values from blowing out
    col = col / (col + 0.6);
    col = pow(col, vec3(0.9));  // gamma lift

    gl_FragColor = vec4(col, 1.0);
}