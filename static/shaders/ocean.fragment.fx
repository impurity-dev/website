precision highp float;

varying vec3 vPosition;
varying vec3 vNormal;
varying float vHeight;

uniform vec3 lightDirection;
uniform vec3 cameraPosition;

uniform vec3 waterColor;
uniform vec3 deepColor;

void main() {

    vec3 N = normalize(vNormal);
    vec3 L = normalize(-lightDirection);
    vec3 V = normalize(cameraPosition - vPosition);

    // -------------------------
    // Diffuse lighting
    // -------------------------
    float NdotL = max(dot(N, L), 0.0);
    float diffuse = NdotL * 0.6 + 0.4;

    // -------------------------
    // Fresnel (CRITICAL AAA LOOK)
    // -------------------------
    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 4.0);

    // -------------------------
    // Specular highlight
    // -------------------------
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0), 64.0);

    // -------------------------
    // Depth coloring (fake)
    // -------------------------
    float depthFactor = smoothstep(-1.0, 1.0, vHeight);
    vec3 baseColor = mix(deepColor, waterColor, depthFactor);

    // -------------------------
    // Final color composition
    // -------------------------
    vec3 color =
        baseColor * diffuse +
        vec3(1.0) * spec * 1.2 +
        baseColor * fresnel * 0.8;

    // subtle foam on peaks
    color += step(0.5, vHeight) * 0.1;

    gl_FragColor = vec4(color, 1.0);
}