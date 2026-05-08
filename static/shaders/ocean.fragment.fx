precision highp float;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vWave;

uniform vec3 cameraPosition;

void main() {

    vec3 N = normalize(vNormal);

    //
    // light direction
    //

    vec3 L =
        normalize(vec3(-0.4, 1.0, -0.2));

    float diffuse =
        max(dot(N, L), 0.0);

    //
    // view direction
    //

    vec3 V =
        normalize(cameraPosition - vWorldPos);

    //
    // fresnel
    //

    float fresnel =
        pow(1.0 - max(dot(N, V), 0.0), 5.0);

    //
    // specular
    //

    vec3 H = normalize(L + V);

    float spec =
        pow(max(dot(N, H), 0.0), 64.0);

    //
    // water colors
    //

    vec3 deep =
        vec3(0.0, 0.04, 0.08);

    vec3 shallow =
        vec3(0.0, 0.9, 0.5);

    float depth =
        smoothstep(-1.0, 1.0, vWave);

    vec3 base =
        mix(deep, shallow, depth);

    //
    // foam
    //

    float foam =
        smoothstep(0.7, 1.0, vWave);

    //
    // final color
    //

    vec3 color =
        base * (diffuse + 0.2) +
        vec3(1.0) * spec * 1.5 +
        vec3(0.6, 1.0, 0.8) * fresnel * 0.6 +
        vec3(1.0) * foam * 0.4;

    gl_FragColor = vec4(color, 1.0);
}