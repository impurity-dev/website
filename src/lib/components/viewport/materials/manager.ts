import {
	Scene,
	StandardMaterial,
	PBRMaterial,
	Color3,
	FresnelParameters,
	CubeTexture
} from '@babylonjs/core';

export class MaterialManager {
	private readonly standard: Map<string, StandardMaterial> = new Map();
	private readonly pbr: Map<string, PBRMaterial> = new Map();

	/**
	 * Neon green wireframe / matrix material
	 */
	createMatrixMaterial(scene: Scene, name = 'matrix'): StandardMaterial {
		const regMat = this.standard.get(name);
		if (regMat) return regMat;
		const mat = new StandardMaterial(name, scene);
		this.standard.set(name, mat);
		mat.emissiveColor = new Color3(0.1, 1.0, 0.2);
		mat.diffuseColor = new Color3(0, 0, 0);
		mat.specularColor = new Color3(0, 0, 0);
		mat.wireframe = true;
		mat.alpha = 0.95;
		return mat;
	}

	/**
	 * Bright holographic blue material
	 */
	createHologramMaterial(scene: Scene, name = 'hologram'): StandardMaterial {
		const regMat = this.standard.get(name);
		if (regMat) return regMat;
		const mat = new StandardMaterial(name, scene);
		this.standard.set(name, mat);
		mat.emissiveColor = new Color3(0.2, 0.8, 1.0);
		mat.diffuseColor = new Color3(0.02, 0.05, 0.1);
		mat.specularColor = new Color3(0.5, 0.9, 1.0);
		mat.alpha = 0.65;
		mat.emissiveFresnelParameters = new FresnelParameters();
		mat.emissiveFresnelParameters.bias = 0.2;
		mat.emissiveFresnelParameters.power = 2;
		return mat;
	}

	/**
	 * Dark metallic asteroid / debris material
	 */
	createAsteroidMaterial(scene: Scene, name = 'asteroid'): PBRMaterial {
		const regMat = this.pbr.get(name);
		if (regMat) return regMat;
		const mat = new PBRMaterial(name, scene);
		this.pbr.set(name, mat);
		mat.albedoColor = new Color3(0.15, 0.15, 0.18);
		mat.metallic = 0.4;
		mat.roughness = 0.9;
		return mat;
	}

	/**
	 * Gold cyber relic / artifact material
	 */
	createGoldenRelicMaterial(scene: Scene, name = 'golden-relic'): PBRMaterial {
		const regMat = this.pbr.get(name);
		if (regMat) return regMat;
		const mat = new PBRMaterial(name, scene);
		this.pbr.set(name, mat);
		mat.albedoColor = new Color3(1.0, 0.75, 0.2);
		mat.metallic = 1.0;
		mat.roughness = 0.25;
		mat.emissiveColor = new Color3(0.25, 0.15, 0.02);
		return mat;
	}

	/**
	 * Purple cosmic crystal material
	 */
	createCrystalMaterial(scene: Scene, name = 'crystal'): PBRMaterial {
		const regMat = this.pbr.get(name);
		if (regMat) return regMat;
		const mat = new PBRMaterial(name, scene);
		this.pbr.set(name, mat);
		mat.albedoColor = new Color3(0.6, 0.2, 1.0);
		mat.metallic = 0.1;
		mat.roughness = 0.05;
		mat.alpha = 0.75;
		mat.emissiveColor = new Color3(0.25, 0.05, 0.4);
		return mat;
	}

	/**
	 * Star energy core / plasma material
	 */
	createEnergyCoreMaterial(scene: Scene, name = 'energy-core'): StandardMaterial {
		const regMat = this.standard.get(name);
		if (regMat) return regMat;
		const mat = new StandardMaterial(name, scene);
		this.standard.set(name, mat);
		mat.emissiveColor = new Color3(1.0, 0.4, 0.1);
		mat.diffuseColor = new Color3(0.05, 0.01, 0);
		mat.specularColor = new Color3(1.0, 0.7, 0.3);
		return mat;
	}

	/**
	 * Deep space chrome material
	 */
	createSpaceChromeMaterial(
		scene: Scene,
		reflectionTexture?: CubeTexture,
		name = 'space-chrome'
	): PBRMaterial {
		const regMat = this.pbr.get(name);
		if (regMat) return regMat;
		const mat = new PBRMaterial(name, scene);
		this.pbr.set(name, mat);
		mat.albedoColor = new Color3(0.8, 0.85, 1.0);
		mat.metallic = 1.0;
		mat.roughness = 0.1;
		if (reflectionTexture) {
			mat.reflectionTexture = reflectionTexture;
		}
		return mat;
	}
}
