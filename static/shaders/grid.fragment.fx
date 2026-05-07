precision highp float;

varying vec2 vUv;
varying float vHeight;
varying vec3 vPos;

uniform float time;
uniform vec3 cameraPosition;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453);
}

float noise(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);

    float a = hash(i);
    float b = hash(i + vec2(1.0,0.0));
    float c = hash(i + vec2(0.0,1.0));
    float d = hash(i + vec2(1.0,1.0));

    vec2 u = f*f*(3.0-2.0*f);

    return mix(a,b,u.x) +
           (c-a)*u.y*(1.0-u.x) +
           (d-b)*u.x*u.y;
}

void main() {
    vec2 uv = vUv;

    // -----------------------
    // 🔥 FLOW DISTORTION (THIS IS THE KEY)
    // -----------------------
    vec2 flowUv = uv;

    float n = noise(uv * 3.0 + time * 0.2);

    flowUv.x += n * 0.2;
    flowUv.y += noise(uv * 3.0 - time * 0.2) * 0.2;

    // stretch toward horizon (cinematic feel)
    flowUv.y = pow(flowUv.y, 1.5);

    // -----------------------
    // 🌊 ENERGY BANDS (like blood sea / cyber grid)
    // -----------------------
    float bands = sin(flowUv.y * 30.0 + time * 2.0);
    bands = smoothstep(0.4, 1.0, bands);

    // -----------------------
    // ⚡ STREAKS (directional lines)
    // -----------------------
    float streaks = sin(flowUv.x * 80.0 + time * 3.0);
    streaks = pow(abs(streaks), 8.0);

    // -----------------------
    // 🌌 RADIAL FOCUS
    // -----------------------
    float dist = distance(uv, vec2(0.5));
    float radial = smoothstep(0.8, 0.0, dist);

    // -----------------------
    // 🔥 HEIGHT GLOW
    // -----------------------
    float h = smoothstep(-1.0, 1.0, vHeight);

    // -----------------------
    // 🎨 COLOR (THIS MATTERS A LOT)
    // -----------------------
    vec3 deep = vec3(0.0, 0.01, 0.03);
    vec3 mid  = vec3(0.0, 0.4, 0.5);
    vec3 glow = vec3(0.2, 1.0, 0.7);

    vec3 color = mix(deep, mid, radial);

    // add energy layers
    color += glow * bands * 0.6;
    color += glow * streaks * 0.8;
    color += glow * h * 0.7;

    // -----------------------
    // ✨ FRESNEL (critical)
    // -----------------------
    vec3 viewDir = normalize(cameraPosition - vPos);
    float fresnel = pow(1.0 - abs(dot(viewDir, vec3(0.0,1.0,0.0))), 3.0);

    color += glow * fresnel * 1.2;

    // -----------------------
    // 🌫️ VIGNETTE
    // -----------------------
    float vignette = smoothstep(1.2, 0.2, dist);
    color *= vignette;

    gl_FragColor = vec4(color, 1.0);
}