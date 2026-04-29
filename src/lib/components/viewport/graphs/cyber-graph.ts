export type Vec3 = {
	x: number;
	y: number;
	z: number;
};

export type SectorArchetype =
	| 'archive-sector'
	| 'code-sector'
	| 'knowledge-sector'
	| 'vault-sector'
	| 'chaos-sector';

export type SubnetArchetype =
	| 'timeline-subnet'
	| 'neural-subnet'
	| 'grid-subnet'
	| 'vault-subnet'
	| 'glitch-subnet';

export type NodeArchetype =
	| 'terminal-shard'
	| 'memory-monolith'
	| 'data-core'
	| 'skill-crystal'
	| 'project-engine'
	| 'anomaly';

export type SectorDefinition = {
	name: string;
	archetype: SectorArchetype;
	center: Vec3;
	subnets: readonly string[];
	distortion: number;
	scale: number;
};

export type SubnetDefinition<SectorId extends string = string> = {
	sector: SectorId;
	name: string;
	archetype: SubnetArchetype;
	nodes: readonly string[];
	layout: 'spiral' | 'grid' | 'vault' | 'chaos' | 'corridor';
	distortion: number;
	scale: number;
};

export type ExperienceNodeDefinition<SubnetId extends string = string> = {
	subnet: SubnetId;
	sector: string;
	name: string;
	archetype: NodeArchetype;
	links: readonly string[];
	interaction: 'inspect' | 'warp' | 'terminal' | 'expand';
	intensity: number;
};

export type CyberGraph<
	Sectors extends Record<string, SectorDefinition>,
	Subnets extends Record<string, SubnetDefinition<keyof Sectors & string>>,
	Nodes extends Record<string, ExperienceNodeDefinition<keyof Subnets & string>>
> = {
	sectors: Sectors;
	subnets: Subnets;
	nodes: Nodes;
};

export const cyberGraph = {
	sectors: {
		'career-sector': {
			name: 'Career Archive',
			archetype: 'archive-sector',
			center: { x: 0, y: 0, z: 0 },
			subnets: ['career-timeline'],
			distortion: 0.2,
			scale: 900
		},

		'projects-sector': {
			name: 'Projects Mainframe',
			archetype: 'code-sector',
			center: { x: 1200, y: 0, z: 0 },
			subnets: ['ai-subnet', 'web-subnet'],
			distortion: 0.5,
			scale: 1100
		},

		'skills-sector': {
			name: 'Skills Matrix',
			archetype: 'knowledge-sector',
			center: { x: -1200, y: 0, z: 0 },
			subnets: ['skills-grid'],
			distortion: 0.35,
			scale: 1000
		},

		'education-sector': {
			name: 'Education Vault',
			archetype: 'vault-sector',
			center: { x: 0, y: 1200, z: 0 },
			subnets: ['education-vault'],
			distortion: 0.15,
			scale: 850
		},

		'experiments-sector': {
			name: 'Experimental Sandbox',
			archetype: 'chaos-sector',
			center: { x: 0, y: -1200, z: 0 },
			subnets: ['sandbox-glitch'],
			distortion: 0.9,
			scale: 1300
		}
	},

	subnets: {
		'career-timeline': {
			sector: 'career-sector',
			name: 'Timeline Corridor',
			archetype: 'timeline-subnet',
			nodes: ['job-early', 'job-mid', 'job-senior'],
			layout: 'corridor',
			distortion: 0.2,
			scale: 400
		},

		'ai-subnet': {
			sector: 'projects-sector',
			name: 'AI Neural Lattice',
			archetype: 'neural-subnet',
			nodes: ['project-ai-chat', 'project-agent'],
			layout: 'spiral',
			distortion: 0.6,
			scale: 500
		},

		'web-subnet': {
			sector: 'projects-sector',
			name: 'Web Grid',
			archetype: 'grid-subnet',
			nodes: ['project-saas'],
			layout: 'grid',
			distortion: 0.3,
			scale: 350
		},

		'skills-grid': {
			sector: 'skills-sector',
			name: 'Knowledge Grid',
			archetype: 'grid-subnet',
			nodes: ['skill-rust', 'skill-ts', 'skill-llm'],
			layout: 'grid',
			distortion: 0.4,
			scale: 450
		},

		'education-vault': {
			sector: 'education-sector',
			name: 'Archive Vault',
			archetype: 'vault-subnet',
			nodes: ['edu-degree'],
			layout: 'vault',
			distortion: 0.1,
			scale: 300
		},

		'sandbox-glitch': {
			sector: 'experiments-sector',
			name: 'Glitch Field',
			archetype: 'glitch-subnet',
			nodes: ['exp-galaxy-engine'],
			layout: 'chaos',
			distortion: 1.0,
			scale: 650
		}
	},

	nodes: {
		'job-early': {
			subnet: 'career-timeline',
			sector: 'career-sector',
			name: 'Early Developer Role',
			archetype: 'memory-monolith',
			links: ['project-saas', 'skill-ts'],
			interaction: 'inspect',
			intensity: 0.4
		},

		'job-mid': {
			subnet: 'career-timeline',
			sector: 'career-sector',
			name: 'Mid-Level Engineer',
			archetype: 'memory-monolith',
			links: ['project-ai-chat', 'skill-rust', 'skill-llm'],
			interaction: 'inspect',
			intensity: 0.6
		},

		'job-senior': {
			subnet: 'career-timeline',
			sector: 'career-sector',
			name: 'Senior Engineer',
			archetype: 'memory-monolith',
			links: ['project-agent', 'skill-llm'],
			interaction: 'inspect',
			intensity: 0.8
		},

		'project-ai-chat': {
			subnet: 'ai-subnet',
			sector: 'projects-sector',
			name: 'AI Chat System',
			archetype: 'project-engine',
			links: ['skill-rust', 'skill-llm'],
			interaction: 'terminal',
			intensity: 0.9
		},

		'project-agent': {
			subnet: 'ai-subnet',
			sector: 'projects-sector',
			name: 'Agent Pipeline System',
			archetype: 'project-engine',
			links: ['skill-llm'],
			interaction: 'terminal',
			intensity: 1.0
		},

		'project-saas': {
			subnet: 'web-subnet',
			sector: 'projects-sector',
			name: 'SaaS Dashboard',
			archetype: 'terminal-shard',
			links: ['skill-ts'],
			interaction: 'terminal',
			intensity: 0.7
		},

		'skill-rust': {
			subnet: 'skills-grid',
			sector: 'skills-sector',
			name: 'Rust',
			archetype: 'skill-crystal',
			links: ['project-ai-chat', 'job-mid'],
			interaction: 'expand',
			intensity: 0.8
		},

		'skill-ts': {
			subnet: 'skills-grid',
			sector: 'skills-sector',
			name: 'TypeScript',
			archetype: 'skill-crystal',
			links: ['project-saas', 'job-early'],
			interaction: 'expand',
			intensity: 0.75
		},

		'skill-llm': {
			subnet: 'skills-grid',
			sector: 'skills-sector',
			name: 'LLM Systems',
			archetype: 'data-core',
			links: ['project-ai-chat', 'project-agent', 'job-senior'],
			interaction: 'expand',
			intensity: 1.0
		},

		'edu-degree': {
			subnet: 'education-vault',
			sector: 'education-sector',
			name: 'Computer Science Degree',
			archetype: 'memory-monolith',
			links: ['job-early'],
			interaction: 'inspect',
			intensity: 0.5
		},

		'exp-galaxy-engine': {
			subnet: 'sandbox-glitch',
			sector: 'experiments-sector',
			name: 'Procedural Galaxy Engine',
			archetype: 'anomaly',
			links: ['project-ai-chat', 'skill-llm'],
			interaction: 'warp',
			intensity: 1.0
		}
	}
} as const;

export type CyberGraphType = typeof cyberGraph;

export type SectorId = keyof CyberGraphType['sectors'];
export type SubnetId = keyof CyberGraphType['subnets'];
export type ExperienceNodeId = keyof CyberGraphType['nodes'];
