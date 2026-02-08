/**
 * Validation utilities for form inputs
 * Provides comprehensive validation for all user inputs
 */

// Validation des noms (prénom, nom, nom d'entreprise)
export const validateName = (name, minLength = 2, maxLength = 50) => {
    if (!name || name.trim().length === 0) {
        return { valid: false, error: 'Ce champ est requis' };
    }

    const trimmedName = name.trim();

    if (trimmedName.length < minLength) {
        return { valid: false, error: `Minimum ${minLength} caractères requis` };
    }

    if (trimmedName.length > maxLength) {
        return { valid: false, error: `Maximum ${maxLength} caractères autorisés` };
    }

    // Lettres, espaces, tirets et apostrophes uniquement
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    if (!nameRegex.test(trimmedName)) {
        return { valid: false, error: 'Lettres, espaces, tirets et apostrophes uniquement' };
    }

    return { valid: true, value: trimmedName };
};

// Validation du nom d'entreprise
export const validateCompanyName = (name) => {
    if (!name || name.trim().length === 0) {
        return { valid: false, error: 'Le nom de l\'entreprise est requis' };
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
        return { valid: false, error: 'Minimum 2 caractères requis' };
    }

    if (trimmedName.length > 100) {
        return { valid: false, error: 'Maximum 100 caractères autorisés' };
    }

    // Lettres, chiffres, espaces et caractères spéciaux courants
    const companyRegex = /^[a-zA-Z0-9À-ÿ\s&'.,()-]+$/;
    if (!companyRegex.test(trimmedName)) {
        return { valid: false, error: 'Caractères non autorisés détectés' };
    }

    return { valid: true, value: trimmedName };
};

// Validation de l'email
export const validateEmail = (email) => {
    if (!email || email.trim().length === 0) {
        return { valid: false, error: 'L\'email est requis' };
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Regex email standard
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
        return { valid: false, error: 'Format d\'email invalide' };
    }

    // Vérifier les domaines suspects
    const suspiciousDomains = ['test.com', 'example.com', 'temp.com'];
    const domain = trimmedEmail.split('@')[1];
    if (suspiciousDomains.includes(domain)) {
        return { valid: false, error: 'Veuillez utiliser un email valide' };
    }

    return { valid: true, value: trimmedEmail };
};

// Validation du téléphone togolais
export const validatePhone = (phone) => {
    if (!phone || phone.trim().length === 0) {
        return { valid: false, error: 'Le numéro de téléphone est requis' };
    }

    // Nettoyer le numéro (enlever espaces et tirets)
    const cleanPhone = phone.replace(/[\s-]/g, '');

    // Format togolais: +228 XX XX XX XX (8 chiffres après +228)
    const togoleseRegex = /^\+228\d{8}$/;
    const togoleseRegexAlt = /^228\d{8}$/;
    const togoleseRegexShort = /^\d{8}$/;

    if (togoleseRegex.test(cleanPhone)) {
        return { valid: true, value: cleanPhone };
    }

    if (togoleseRegexAlt.test(cleanPhone)) {
        return { valid: true, value: '+' + cleanPhone };
    }

    if (togoleseRegexShort.test(cleanPhone)) {
        return { valid: true, value: '+228' + cleanPhone };
    }

    return {
        valid: false,
        error: 'Format invalide. Utilisez +228 XX XX XX XX (8 chiffres)'
    };
};

// Validation du mot de passe
export const validatePassword = (password) => {
    if (!password || password.length === 0) {
        return { valid: false, error: 'Le mot de passe est requis' };
    }

    if (password.length < 8) {
        return { valid: false, error: 'Minimum 8 caractères requis' };
    }

    if (password.length > 128) {
        return { valid: false, error: 'Maximum 128 caractères autorisés' };
    }

    // Au moins une majuscule
    if (!/[A-Z]/.test(password)) {
        return { valid: false, error: 'Au moins une majuscule requise' };
    }

    // Au moins une minuscule
    if (!/[a-z]/.test(password)) {
        return { valid: false, error: 'Au moins une minuscule requise' };
    }

    // Au moins un chiffre
    if (!/\d/.test(password)) {
        return { valid: false, error: 'Au moins un chiffre requis' };
    }

    // Au moins un caractère spécial
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        return { valid: false, error: 'Au moins un caractère spécial requis (!@#$%^&*...)' };
    }

    return { valid: true, value: password };
};

// Validation de la confirmation du mot de passe
export const validatePasswordConfirmation = (password, confirmation) => {
    if (!confirmation || confirmation.length === 0) {
        return { valid: false, error: 'Veuillez confirmer le mot de passe' };
    }

    if (password !== confirmation) {
        return { valid: false, error: 'Les mots de passe ne correspondent pas' };
    }

    return { valid: true, value: confirmation };
};

// Validation du titre professionnel
export const validateTitle = (title) => {
    if (!title || title.trim().length === 0) {
        return { valid: false, error: 'Le titre professionnel est requis' };
    }

    const trimmedTitle = title.trim();

    if (trimmedTitle.length < 5) {
        return { valid: false, error: 'Minimum 5 caractères requis' };
    }

    if (trimmedTitle.length > 100) {
        return { valid: false, error: 'Maximum 100 caractères autorisés' };
    }

    return { valid: true, value: trimmedTitle };
};

// Validation de la bio
export const validateBio = (bio) => {
    if (!bio || bio.trim().length === 0) {
        return { valid: false, error: 'La bio est requise' };
    }

    const trimmedBio = bio.trim();

    if (trimmedBio.length < 50) {
        return { valid: false, error: 'Minimum 50 caractères requis pour une bio complète' };
    }

    if (trimmedBio.length > 1000) {
        return { valid: false, error: 'Maximum 1000 caractères autorisés' };
    }

    return { valid: true, value: trimmedBio };
};

// Validation des tarifs
export const validateRate = (rate, type = 'hourly') => {
    if (!rate || rate === '') {
        return { valid: true, value: 0 }; // Optionnel
    }

    const numRate = parseFloat(rate);

    if (isNaN(numRate)) {
        return { valid: false, error: 'Veuillez entrer un nombre valide' };
    }

    if (numRate < 0) {
        return { valid: false, error: 'Le tarif ne peut pas être négatif' };
    }

    const maxRate = type === 'hourly' ? 1000000 : 10000000;
    if (numRate > maxRate) {
        return { valid: false, error: `Maximum ${maxRate.toLocaleString()} FCFA` };
    }

    return { valid: true, value: Math.round(numRate) };
};

// Validation des compétences
export const validateSkills = (skillsString) => {
    if (!skillsString || skillsString.trim().length === 0) {
        return { valid: false, error: 'Au moins 3 compétences sont requises' };
    }

    const skills = skillsString.split(',').map(s => s.trim()).filter(s => s.length > 0);

    if (skills.length < 3) {
        return { valid: false, error: 'Au moins 3 compétences sont requises' };
    }

    // Vérifier chaque compétence
    for (const skill of skills) {
        if (skill.length < 2) {
            return { valid: false, error: 'Chaque compétence doit contenir au moins 2 caractères' };
        }
        if (skill.length > 50) {
            return { valid: false, error: 'Chaque compétence doit contenir maximum 50 caractères' };
        }
    }

    return { valid: true, value: skills };
};

// Validation de la ville
export const validateCity = (city) => {
    const validCities = [
        'Lomé', 'Kara', 'Sokodé', 'Atakpamé', 'Kpalimé', 'Dapaong', 'Tsévié', 'Aného',
        'Bassar', 'Tabligbo', 'Niamtougou', 'Bafilo', 'Kandé', 'Vogan', 'Badou',
        'Mango', 'Pagouda', 'Sotouboua', 'Blitta', 'Tandjouaré', 'Cinkassé',
        'Pagouda', 'Kévé', 'Agou', 'Elavagnon', 'Tohoun', 'Assahoun'
    ];

    if (!city || city === '') {
        return { valid: false, error: 'Veuillez sélectionner une ville' };
    }

    if (!validCities.includes(city)) {
        return { valid: false, error: 'Ville non valide' };
    }

    return { valid: true, value: city };
};

// Validation de la catégorie
export const validateCategory = (category) => {
    const validCategories = [
        'Informatique & IT',
        'Génie Civil',
        'Génie Électrique',
        'Génie Mécanique',
        'Télécommunications',
        'Génie Industriel',
        'Autre'
    ];

    if (!category || category === '') {
        return { valid: false, error: 'Veuillez sélectionner une catégorie' };
    }

    if (!validCategories.includes(category)) {
        return { valid: false, error: 'Catégorie non valide' };
    }

    return { valid: true, value: category };
};

// Validation du secteur d'activité
export const validateSector = (sector) => {
    if (!sector || sector === '') {
        return { valid: false, error: 'Veuillez sélectionner un secteur d\'activité' };
    }

    return { valid: true, value: sector };
};

// Validation de la taille d'entreprise
export const validateCompanySize = (size) => {
    const validSizes = ['1-10', '11-50', '51-200', '201-500', '500+'];

    if (!size || size === '') {
        return { valid: false, error: 'Veuillez sélectionner la taille de l\'entreprise' };
    }

    if (!validSizes.includes(size)) {
        return { valid: false, error: 'Taille d\'entreprise non valide' };
    }

    return { valid: true, value: size };
};

// Helper pour obtenir la force du mot de passe
export const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };

    let score = 0;

    // Longueur
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    // Complexité
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

    if (score <= 2) return { score, label: 'Faible', color: '#ef4444' };
    if (score <= 4) return { score, label: 'Moyen', color: '#f59e0b' };
    return { score, label: 'Fort', color: '#10b981' };
};

// Validation des liens sociaux
export const validateSocialLink = (url, platform = 'generic') => {
    if (!url || url.trim().length === 0) {
        return { valid: true, value: '' }; // Optionnel
    }

    const trimmedUrl = url.trim();

    // Validation de base de l'URL
    try {
        const urlObj = new URL(trimmedUrl);
        if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
            return { valid: false, error: 'L\'URL doit commencer par http:// ou https://' };
        }

        // Validation spécifique par plateforme
        const hostname = urlObj.hostname.toLowerCase();

        switch (platform) {
            case 'linkedin':
                if (!hostname.includes('linkedin.com')) {
                    return { valid: false, error: 'L\'URL doit être un lien LinkedIn (linkedin.com)' };
                }
                break;
            case 'github':
                if (!hostname.includes('github.com')) {
                    return { valid: false, error: 'L\'URL doit être un lien GitHub (github.com)' };
                }
                break;
            case 'twitter':
                if (!hostname.includes('twitter.com') && !hostname.includes('x.com')) {
                    return { valid: false, error: 'L\'URL doit être un lien Twitter/X (twitter.com ou x.com)' };
                }
                break;
            case 'portfolio':
            case 'other':
                // Pas de restriction spécifique, juste vérifier que c'est une URL valide
                if (!urlObj.hostname || urlObj.hostname.length < 3) {
                    return { valid: false, error: 'L\'URL semble invalide' };
                }
                break;
        }

        return { valid: true, value: trimmedUrl };
    } catch (e) {
        return { valid: false, error: 'Format d\'URL invalide (ex: https://example.com)' };
    }
};

// Validation de l'ID de certification
export const validateCertificationId = (id) => {
    if (!id || id.trim().length === 0) {
        return { valid: true, value: '' }; // Optionnel
    }

    const trimmedId = id.trim();

    if (trimmedId.length < 3) {
        return { valid: false, error: 'L\'ID doit contenir au moins 3 caractères' };
    }

    if (trimmedId.length > 100) {
        return { valid: false, error: 'L\'ID est trop long (max 100 caractères)' };
    }

    // Format: lettres, chiffres, tirets, underscores uniquement
    if (!/^[a-zA-Z0-9\-_]+$/.test(trimmedId)) {
        return { valid: false, error: 'L\'ID ne doit contenir que des lettres, chiffres, tirets (-) et underscores (_)' };
    }

    return { valid: true, value: trimmedId };
};

// Validation de l'URL de certification
export const validateCertificationUrl = (url) => {
    if (!url || url.trim().length === 0) {
        return { valid: true, value: '' }; // Optionnel
    }

    const trimmedUrl = url.trim();

    try {
        const urlObj = new URL(trimmedUrl);

        if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
            return { valid: false, error: 'L\'URL doit commencer par http:// ou https://' };
        }

        if (!urlObj.hostname || urlObj.hostname.length < 3) {
            return { valid: false, error: 'L\'URL semble invalide (domaine manquant)' };
        }

        return { valid: true, value: trimmedUrl };
    } catch (e) {
        return { valid: false, error: 'Format d\'URL invalide (ex: https://coursera.org/verify/ABC123)' };
    }
};

// Validation d'une expérience professionnelle
export const validateExperience = (experience) => {
    const errors = {};

    if (!experience.title || experience.title.trim().length < 3) {
        errors.title = 'Le titre du poste doit contenir au moins 3 caractères';
    }

    if (!experience.company || experience.company.trim().length < 2) {
        errors.company = 'Le nom de l\'entreprise doit contenir au moins 2 caractères';
    }

    if (!experience.startDate || experience.startDate.trim().length < 4) {
        errors.startDate = 'La date de début est requise';
    }

    if (Object.keys(errors).length > 0) {
        return { valid: false, errors };
    }

    return { valid: true };
};

// Validation d'une formation
export const validateEducation = (education) => {
    const errors = {};

    if (!education.degree || education.degree.trim().length < 3) {
        errors.degree = 'Le diplôme doit contenir au moins 3 caractères';
    }

    if (!education.school || education.school.trim().length < 2) {
        errors.school = 'Le nom de l\'établissement doit contenir au moins 2 caractères';
    }

    if (!education.year || education.year.trim().length < 4) {
        errors.year = 'L\'année est requise';
    }

    if (Object.keys(errors).length > 0) {
        return { valid: false, errors };
    }

    return { valid: true };
};

// Validation d'une langue
export const validateLanguage = (language) => {
    const errors = {};

    if (!language.name || language.name.trim().length < 2) {
        errors.name = 'Le nom de la langue doit contenir au moins 2 caractères';
    }

    const validLevels = ['Débutant', 'Intermédiaire', 'Avancé', 'Courant', 'Natif'];
    if (!language.level || !validLevels.includes(language.level)) {
        errors.level = 'Le niveau est requis';
    }

    if (Object.keys(errors).length > 0) {
        return { valid: false, errors };
    }

    return { valid: true };
};

// Liste des organismes émetteurs de certifications
export const CERTIFICATION_ISSUERS = [
    'Coursera',
    'Udemy',
    'edX',
    'LinkedIn Learning',
    'Google',
    'Microsoft',
    'AWS (Amazon Web Services)',
    'Meta (Facebook)',
    'IBM',
    'Oracle',
    'Cisco',
    'CompTIA',
    'PMI (Project Management Institute)',
    'Université de Lomé',
    'École Polytechnique de Lomé',
    'CERCO (Centre Régional de Certification)',
    'Autre'
];
