export const CATEGORIES = [
    {
        id: 'informatique-it',
        name: 'Informatique & IT',
        icon: '💻',
        description: 'Développement web, mobile, logiciels, cloud',
    },
    {
        id: 'telecommunications',
        name: 'Télécommunications',
        icon: '📡',
        description: 'Réseaux, infrastructures, systèmes télécoms',
    },
    {
        id: 'genie-civil',
        name: 'Génie Civil',
        icon: '🏗️',
        description: 'Construction, infrastructures, BTP',
    },
    {
        id: 'genie-electrique',
        name: 'Génie Électrique',
        icon: '⚡',
        description: 'Systèmes électriques, énergie, automatisation',
    },
    {
        id: 'genie-mecanique',
        name: 'Génie Mécanique',
        icon: '⚙️',
        description: 'Mécanique, thermique, conception industrielle',
    },
    {
        id: 'genie-industriel',
        name: 'Génie Industriel',
        icon: '🏭',
        description: 'Production, logistique, optimisation',
    },
    {
        id: 'design-uiux',
        name: 'Design UI/UX',
        icon: '🎨',
        description: 'Interfaces, expérience utilisateur, design graphique',
    },
    {
        id: 'data-science',
        name: 'Data Science',
        icon: '📊',
        description: 'Analyse de données, IA, machine learning',
    },
    {
        id: 'devops',
        name: 'DevOps',
        icon: '🔧',
        description: 'CI/CD, infrastructure, automatisation, cloud',
    },
    {
        id: 'cybersecurite',
        name: 'Cybersécurité',
        icon: '🔒',
        description: 'Sécurité informatique, audits, pentesting',
    },
    {
        id: 'marketing-digital',
        name: 'Marketing Digital',
        icon: '📈',
        description: 'SEO, publicité en ligne, réseaux sociaux',
    },
];

// Helper function to get category by name
export function getCategoryByName(name) {
    return CATEGORIES.find(cat => cat.name === name);
}

// Helper function to get all category names
export function getCategoryNames() {
    return CATEGORIES.map(cat => cat.name);
}
