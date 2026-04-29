export const semanticGraph = {
	nodes: {
		'oracle-engineer': {
			type: 'career',
			label: 'Software Engineer @ Oracle',
			description: 'Works on large-scale cloud and backend systems.',
			links: ['mscs-gt', 'skill-java', 'skill-cloud', 'skill-system-design']
		},

		'mscs-gt': {
			type: 'education',
			label: 'M.S. Computer Science @ Georgia Tech',
			description: 'AI systems and machine learning specialization.',
			links: ['oracle-engineer', 'skill-ai-systems', 'skill-ml']
		},

		'skill-java': {
			type: 'skill',
			label: 'Java',
			links: ['oracle-engineer']
		},

		'skill-cloud': {
			type: 'skill',
			label: 'Cloud Infrastructure',
			links: ['oracle-engineer', 'cert-cloud-foundations']
		},

		'skill-system-design': {
			type: 'skill',
			label: 'System Design',
			links: ['oracle-engineer']
		},

		'skill-ml': {
			type: 'skill',
			label: 'Machine Learning',
			links: ['mscs-gt', 'skill-ai-systems']
		},

		'skill-ai-systems': {
			type: 'skill',
			label: 'AI / LLM Systems',
			links: ['mscs-gt', 'project-ai-systems', 'cert-ai-fundamentals']
		},

		'skill-typescript': {
			type: 'skill',
			label: 'TypeScript',
			links: ['project-resume-world']
		},

		'skill-babylonjs': {
			type: 'skill',
			label: 'BabylonJS',
			links: ['project-resume-world']
		},

		'project-resume-world': {
			type: 'project',
			label: 'Interactive Resume World',
			links: ['oracle-engineer', 'skill-typescript', 'skill-babylonjs', 'skill-ai-systems']
		},

		'project-ai-systems': {
			type: 'project',
			label: 'AI Systems Exploration',
			links: ['skill-ai-systems', 'mscs-gt']
		},

		'cert-ai-fundamentals': {
			type: 'certification',
			label: 'AI / Generative AI Certification',
			links: ['skill-ai-systems', 'mscs-gt']
		},

		'cert-cloud-foundations': {
			type: 'certification',
			label: 'Cloud Infrastructure Certification',
			links: ['skill-cloud', 'oracle-engineer']
		}
	}
} as const;
