import { Scene, ShaderMaterial, Color3, Effect } from '@babylonjs/core';

/**
 * Creates a glowing matrix-style shader material for voxel / cyber cubes
 */
export function createMatrixCubeMaterial(scene: Scene): ShaderMaterial {
	// Vertex Shader
	Effect.ShadersStore['matrixVertexShader'] = `
    precision highp float;

    attribute vec3 position;
    attribute vec2 uv;

    uniform mat4 worldViewProjection;

    varying vec2 vUV;

    void main(void) {
        gl_Position = worldViewProjection * vec4(position, 1.0);
        vUV = uv;
    }
  `;

	// Fragment Shader
	Effect.ShadersStore['matrixFragmentShader'] = `
    precision highp float;

    varying vec2 vUV;

    uniform float time;
    uniform vec3 glowColor;

    // Random
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main(void) {
        vec2 uv = vUV;

        // Scale for digital rain effect
        uv *= vec2(20.0, 40.0);

        vec2 grid = floor(uv);

        // Falling speed
        float yOffset = floor(time * 10.0);

        // Animated column
        float rain = random(vec2(grid.x, grid.y + yOffset));

        // Character brightness
        float brightness = step(0.92, rain);

        // Vertical fade
        float fade = fract((uv.y + time * 8.0) / 40.0);
        fade = 1.0 - fade;

        // Grid lines for cube tech feel
        float lineX = smoothstep(0.95, 1.0, fract(vUV.x * 8.0));
        float lineY = smoothstep(0.95, 1.0, fract(vUV.y * 8.0));
        float gridGlow = max(lineX, lineY) * 0.25;

        vec3 color = glowColor * (brightness * fade + gridGlow);

        // Extra emissive pulse
        color *= 1.2 + sin(time * 3.0) * 0.1;

        gl_FragColor = vec4(color, 1.0);
    }
  `;

	const material = new ShaderMaterial(
		'matrixMaterial',
		scene,
		{
			vertex: 'matrix',
			fragment: 'matrix'
		},
		{
			attributes: ['position', 'uv'],
			uniforms: ['worldViewProjection', 'time', 'glowColor']
		}
	);

	material.setColor3('glowColor', new Color3(0.0, 1.0, 0.2)); // Matrix green

	material.backFaceCulling = false;
	material.alpha = 1.0;

	// Animate time
	scene.registerBeforeRender(() => {
		material.setFloat('time', performance.now() * 0.001);
	});

	return material;
}
