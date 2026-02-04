'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useToast } from '@/components/Toast/ToastProvider';
import Input from '@/components/ui/Input';
import styles from './profile-setup.module.css';

export default function ProfileSetupPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        // Étape 1 : Infos de base
        title: '',
        bio: '',
        hourlyRate: '',
        dailyRate: '',
        availability: 'disponible',

        // Étape 2 : Compétences
        skills: '',

        // Étape 3 : Certifications
        certifications: [],

        // Étape 4 : Liens sociaux
        socialLinks: {
            linkedin: '',
            github: '',
            portfolio: '',
            twitter: '',
            other: '',
        },

        // Étape 5 : Expérience
        experiences: [],

        // Étape 6 : Formation
        education: [],

        // Étape 7 : Langues
        languages: [],
    });

    const [currentExperience, setCurrentExperience] = useState({
        company: '',
        role: '',
        duration: '',
        description: '',
    });

    const [currentEducation, setCurrentEducation] = useState({
        school: '',
        degree: '',
        field: '',
        year: '',
    });

    const [currentLanguage, setCurrentLanguage] = useState({
        name: '',
        level: 'intermédiaire',
    });

    const [currentCertification, setCurrentCertification] = useState({
        name: '',
        issuer: '',
        date: '',
        credentialId: '',
        url: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addExperience = () => {
        if (!currentExperience.company || !currentExperience.role) {
            addToast('Veuillez remplir au moins l\'entreprise et le poste', 'error');
            return;
        }
        setFormData(prev => ({
            ...prev,
            experiences: [...prev.experiences, currentExperience]
        }));
        setCurrentExperience({ company: '', role: '', duration: '', description: '' });
        addToast('Expérience ajoutée !', 'success');
    };

    const removeExperience = (index) => {
        setFormData(prev => ({
            ...prev,
            experiences: prev.experiences.filter((_, i) => i !== index)
        }));
    };

    const addEducation = () => {
        if (!currentEducation.school || !currentEducation.degree) {
            addToast('Veuillez remplir au moins l\'école et le diplôme', 'error');
            return;
        }
        setFormData(prev => ({
            ...prev,
            education: [...prev.education, currentEducation]
        }));
        setCurrentEducation({ school: '', degree: '', field: '', year: '' });
        addToast('Formation ajoutée !', 'success');
    };

    const removeEducation = (index) => {
        setFormData(prev => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index)
        }));
    };

    const addLanguage = () => {
        if (!currentLanguage.name) {
            addToast('Veuillez saisir une langue', 'error');
            return;
        }
        setFormData(prev => ({
            ...prev,
            languages: [...prev.languages, currentLanguage]
        }));
        setCurrentLanguage({ name: '', level: 'intermédiaire' });
        addToast('Langue ajoutée !', 'success');
    };

    const removeLanguage = (index) => {
        setFormData(prev => ({
            ...prev,
            languages: prev.languages.filter((_, i) => i !== index)
        }));
    };

    const addCertification = () => {
        // Validation du nom (min 3 caractères, max 100)
        if (!currentCertification.name || currentCertification.name.trim().length < 3) {
            addToast('Le nom de la certification doit contenir au moins 3 caractères', 'error');
            return;
        }
        if (currentCertification.name.length > 100) {
            addToast('Le nom de la certification est trop long (max 100 caractères)', 'error');
            return;
        }

        // Validation de l'émetteur (min 2 caractères, max 100)
        if (!currentCertification.issuer || currentCertification.issuer.trim().length < 2) {
            addToast('L\'organisme émetteur doit contenir au moins 2 caractères', 'error');
            return;
        }
        if (currentCertification.issuer.length > 100) {
            addToast('Le nom de l\'organisme est trop long (max 100 caractères)', 'error');
            return;
        }

        // Validation de la date (si fournie) - format texte mais sensé
        if (currentCertification.date && currentCertification.date.trim()) {
            const dateText = currentCertification.date.trim();
            if (dateText.length < 4) {
                addToast('La date doit être plus précise (ex: Décembre 2023, 2023, etc.)', 'error');
                return;
            }
            // Vérifier qu'il y a au moins un chiffre (pour l'année)
            if (!/\d/.test(dateText)) {
                addToast('La date doit contenir au moins une année', 'error');
                return;
            }
        }

        // Validation de l'ID de certification (si fourni) - alphanumérique + tirets/underscores
        if (currentCertification.credentialId && currentCertification.credentialId.trim()) {
            const credId = currentCertification.credentialId.trim();
            if (credId.length < 3) {
                addToast('L\'ID de certification doit contenir au moins 3 caractères', 'error');
                return;
            }
            if (!/^[a-zA-Z0-9\-_]+$/.test(credId)) {
                addToast('L\'ID de certification ne doit contenir que des lettres, chiffres, tirets et underscores', 'error');
                return;
            }
        }

        // Validation stricte de l'URL (si fournie)
        if (currentCertification.url && currentCertification.url.trim()) {
            const url = currentCertification.url.trim();
            try {
                const urlObj = new URL(url);
                if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
                    addToast('L\'URL doit commencer par http:// ou https://', 'error');
                    return;
                }
                // Vérifier qu'il y a bien un domaine
                if (!urlObj.hostname || urlObj.hostname.length < 3) {
                    addToast('L\'URL semble invalide (domaine manquant)', 'error');
                    return;
                }
            } catch (e) {
                addToast('L\'URL du certificat n\'est pas valide (ex: https://example.com/cert)', 'error');
                return;
            }
        }

        // Tout est valide, on ajoute
        setFormData(prev => ({
            ...prev,
            certifications: [...prev.certifications, {
                name: currentCertification.name.trim(),
                issuer: currentCertification.issuer.trim(),
                date: currentCertification.date?.trim() || '',
                credentialId: currentCertification.credentialId?.trim() || '',
                url: currentCertification.url?.trim() || '',
            }]
        }));
        setCurrentCertification({ name: '', issuer: '', date: '', credentialId: '', url: '' });
        addToast('Certification ajoutée avec succès !', 'success');
    };

    const removeCertification = (index) => {
        setFormData(prev => ({
            ...prev,
            certifications: prev.certifications.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.bio) {
            addToast('Veuillez remplir les champs obligatoires', 'error');
            return;
        }

        setLoading(true);

        try {
            const skillsArray = formData.skills
                .split(',')
                .map(s => s.trim())
                .filter(s => s);

            const res = await fetch('/api/profile/freelance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: formData.title,
                    bio: formData.bio,
                    skills: skillsArray,
                    hourlyRate: formData.hourlyRate ? parseInt(formData.hourlyRate) : 0,
                    dailyRate: formData.dailyRate ? parseInt(formData.dailyRate) : 0,
                    availability: formData.availability,
                    certifications: formData.certifications,
                    socialLinks: formData.socialLinks,
                    experience: formData.experiences,
                    education: formData.education,
                    languages: formData.languages,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Erreur lors de la création du profil');
            }

            addToast('Profil créé avec succès !', 'success');
            router.push('/dashboard');

        } catch (error) {
            addToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    // Validation des URLs
    const isValidUrl = (url) => {
        if (!url || url.trim() === '') return true; // URLs vides autorisées
        try {
            const urlObj = new URL(url);
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch {
            return false;
        }
    };

    const nextStep = () => {
        // Étape 1: Infos de base
        if (step === 1 && (!formData.title || !formData.bio)) {
            addToast('Veuillez remplir le titre et la bio', 'error');
            return;
        }

        // Étape 2: Compétences
        if (step === 2 && !formData.skills) {
            addToast('Veuillez ajouter au moins une compétence', 'error');
            return;
        }

        // Étape 3: Certifications (OBLIGATOIRE - min 1)
        if (step === 3 && formData.certifications.length === 0) {
            addToast('Veuillez ajouter au moins une certification', 'error');
            return;
        }

        // Étape 4: Liens sociaux (OBLIGATOIRE - min 1)
        if (step === 4) {
            const hasAtLeastOneLink = Object.values(formData.socialLinks).some(link => link && link.trim() !== '');
            if (!hasAtLeastOneLink) {
                addToast('Veuillez ajouter au moins un lien social', 'error');
                return;
            }

            // Valider les URLs fournies
            for (const [platform, url] of Object.entries(formData.socialLinks)) {
                if (url && url.trim() !== '' && !isValidUrl(url)) {
                    addToast(`Le lien ${platform} n'est pas une URL valide`, 'error');
                    return;
                }
            }
        }

        setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    return (
        <div className={styles.page}>
            <nav className={styles.nav}>
                <div className="container">
                    <Link href="/" className={styles.logo}>
                        <span className={styles.logoText}>Freelance</span>
                        <span className={styles.logoAccent}>Togo</span>
                    </Link>
                </div>
            </nav>

            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Créez votre profil de freelance</h1>
                    <p>Complétez votre profil pour être visible par les entreprises</p>
                    <div className={styles.progress}>
                        <div className={styles.progressBar} style={{ width: `${(step / 7) * 100}%` }}></div>
                    </div>
                    <p className={styles.stepInfo}>Étape {step} sur 7</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Étape 1 : Infos de base */}
                    {step === 1 && (
                        <div className={styles.step}>
                            <h2>Informations de base</h2>
                            <Input
                                label="Titre professionnel *"
                                name="title"
                                placeholder="Ex: Développeur Full-Stack"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                            <div className={styles.textareaGroup}>
                                <label>Bio / Présentation *</label>
                                <textarea
                                    name="bio"
                                    placeholder="Décrivez votre parcours, vos compétences principales..."
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows={6}
                                    className={styles.textarea}
                                    required
                                />
                            </div>
                            <div className={styles.row}>
                                <Input
                                    label="Tarif horaire (FCFA)"
                                    name="hourlyRate"
                                    type="number"
                                    placeholder="15000"
                                    value={formData.hourlyRate}
                                    onChange={handleChange}
                                />
                                <Input
                                    label="Tarif journalier (FCFA)"
                                    name="dailyRate"
                                    type="number"
                                    placeholder="120000"
                                    value={formData.dailyRate}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Disponibilité</label>
                                <select
                                    name="availability"
                                    value={formData.availability}
                                    onChange={handleChange}
                                    className={styles.select}
                                >
                                    <option value="disponible">Disponible</option>
                                    <option value="occupé">Occupé</option>
                                    <option value="bientôt disponible">Bientôt disponible</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Étape 2 : Compétences */}
                    {step === 2 && (
                        <div className={styles.step}>
                            <h2>Compétences</h2>
                            <div className={styles.textareaGroup}>
                                <label>Listez vos compétences (séparées par des virgules) *</label>
                                <textarea
                                    name="skills"
                                    placeholder="React, Node.js, MongoDB, TypeScript, etc."
                                    value={formData.skills}
                                    onChange={handleChange}
                                    rows={4}
                                    className={styles.textarea}
                                    required
                                />
                                <p className={styles.hint}>Exemple : React, Node.js, Python, Figma...</p>
                            </div>
                        </div>
                    )}

                    {/* Étape 3 : Certifications */}
                    {step === 3 && (
                        <div className={styles.step}>
                            <h2>Certifications *</h2>
                            <p className={styles.hint}>⚠️ Au moins une certification est requise pour valider votre expertise</p>

                            {formData.certifications.length > 0 && (
                                <div className={styles.list}>
                                    {formData.certifications.map((cert, idx) => (
                                        <div key={idx} className={styles.listItem}>
                                            <div>
                                                <strong>{cert.name}</strong> - {cert.issuer}
                                                {cert.date && <p>{cert.date}</p>}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeCertification(idx)}
                                                className={styles.removeBtn}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className={styles.addSection}>
                                <h3>Ajouter une certification</h3>
                                <Input
                                    label="Nom de la certification"
                                    placeholder="Ex: AWS Certified Developer"
                                    value={currentCertification.name}
                                    onChange={(e) => setCurrentCertification({ ...currentCertification, name: e.target.value })}
                                    maxLength={100}
                                    required
                                />
                                <Input
                                    label="Organisme émetteur"
                                    placeholder="Ex: Amazon Web Services"
                                    value={currentCertification.issuer}
                                    onChange={(e) => setCurrentCertification({ ...currentCertification, issuer: e.target.value })}
                                    maxLength={100}
                                    required
                                />
                                <div className={styles.row}>
                                    <Input
                                        label="Date d'obtention"
                                        placeholder="Ex: Décembre 2023 ou 2023"
                                        value={currentCertification.date}
                                        onChange={(e) => setCurrentCertification({ ...currentCertification, date: e.target.value })}
                                        maxLength={50}
                                    />
                                    <Input
                                        label="ID de certification"
                                        placeholder="Ex: ABC123-XYZ (lettres, chiffres, - et _)"
                                        value={currentCertification.credentialId}
                                        onChange={(e) => setCurrentCertification({ ...currentCertification, credentialId: e.target.value })}
                                        maxLength={50}
                                    />
                                </div>
                                <Input
                                    label="URL du certificat"
                                    type="url"
                                    placeholder="https://exemple.com/mon-certificat"
                                    value={currentCertification.url}
                                    onChange={(e) => setCurrentCertification({ ...currentCertification, url: e.target.value })}
                                />
                                <button type="button" onClick={addCertification} className="btn btn-outline">
                                    + Ajouter cette certification
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Étape 4 : Liens Sociaux */}
                    {step === 4 && (
                        <div className={styles.step}>
                            <h2>Liens Sociaux *</h2>
                            <p className={styles.hint}>⚠️ Au moins un lien professionnel est requis (LinkedIn, GitHub, Portfolio, etc.)</p>

                            <Input
                                label="LinkedIn"
                                placeholder="https://linkedin.com/in/votre-profil"
                                value={formData.socialLinks.linkedin}
                                onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, linkedin: e.target.value } })}
                            />
                            <Input
                                label="GitHub"
                                placeholder="https://github.com/votre-username"
                                value={formData.socialLinks.github}
                                onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, github: e.target.value } })}
                            />
                            <Input
                                label="Portfolio"
                                placeholder="https://votresite.com"
                                value={formData.socialLinks.portfolio}
                                onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, portfolio: e.target.value } })}
                            />
                            <Input
                                label="Twitter/X"
                                placeholder="https://twitter.com/votre-handle"
                                value={formData.socialLinks.twitter}
                                onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, twitter: e.target.value } })}
                            />
                            <Input
                                label="Autre lien"
                                placeholder="https://..."
                                value={formData.socialLinks.other}
                                onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, other: e.target.value } })}
                            />
                        </div>
                    )}

                    {/* Étape 5 : Expérience */}
                    {step === 5 && (
                        <div className={styles.step}>
                            <h2>Expérience professionnelle (optionnel)</h2>

                            {formData.experiences.length > 0 && (
                                <div className={styles.list}>
                                    {formData.experiences.map((exp, idx) => (
                                        <div key={idx} className={styles.listItem}>
                                            <div>
                                                <strong>{exp.role}</strong> - {exp.company}
                                                <p>{exp.duration}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeExperience(idx)}
                                                className={styles.removeBtn}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className={styles.addSection}>
                                <h3>Ajouter une expérience</h3>
                                <Input
                                    label="Entreprise"
                                    value={currentExperience.company}
                                    onChange={(e) => setCurrentExperience({ ...currentExperience, company: e.target.value })}
                                />
                                <Input
                                    label="Poste"
                                    value={currentExperience.role}
                                    onChange={(e) => setCurrentExperience({ ...currentExperience, role: e.target.value })}
                                />
                                <Input
                                    label="Durée"
                                    placeholder="Ex: 2020 - 2023"
                                    value={currentExperience.duration}
                                    onChange={(e) => setCurrentExperience({ ...currentExperience, duration: e.target.value })}
                                />
                                <div className={styles.textareaGroup}>
                                    <label>Description</label>
                                    <textarea
                                        value={currentExperience.description}
                                        onChange={(e) => setCurrentExperience({ ...currentExperience, description: e.target.value })}
                                        rows={3}
                                        className={styles.textarea}
                                    />
                                </div>
                                <button type="button" onClick={addExperience} className="btn btn-outline">
                                    + Ajouter cette expérience
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Étape 6 : Formation */}
                    {step === 6 && (
                        <div className={styles.step}>
                            <h2>Formation (optionnel)</h2>

                            {formData.education.length > 0 && (
                                <div className={styles.list}>
                                    {formData.education.map((edu, idx) => (
                                        <div key={idx} className={styles.listItem}>
                                            <div>
                                                <strong>{edu.degree}</strong> - {edu.school}
                                                <p>{edu.year}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeEducation(idx)}
                                                className={styles.removeBtn}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className={styles.addSection}>
                                <h3>Ajouter une formation</h3>
                                <Input
                                    label="École/Université"
                                    value={currentEducation.school}
                                    onChange={(e) => setCurrentEducation({ ...currentEducation, school: e.target.value })}
                                />
                                <Input
                                    label="Diplôme"
                                    value={currentEducation.degree}
                                    onChange={(e) => setCurrentEducation({ ...currentEducation, degree: e.target.value })}
                                />
                                <div className={styles.row}>
                                    <Input
                                        label="Domaine"
                                        placeholder="Ex: Informatique"
                                        value={currentEducation.field}
                                        onChange={(e) => setCurrentEducation({ ...currentEducation, field: e.target.value })}
                                    />
                                    <Input
                                        label="Année"
                                        placeholder="2020"
                                        value={currentEducation.year}
                                        onChange={(e) => setCurrentEducation({ ...currentEducation, year: e.target.value })}
                                    />
                                </div>
                                <button type="button" onClick={addEducation} className="btn btn-outline">
                                    + Ajouter cette formation
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Étape 7 : Langues */}
                    {step === 7 && (
                        <div className={styles.step}>
                            <h2>Langues (optionnel)</h2>

                            {formData.languages.length > 0 && (
                                <div className={styles.list}>
                                    {formData.languages.map((lang, idx) => (
                                        <div key={idx} className={styles.listItem}>
                                            <div>
                                                <strong>{lang.name}</strong> - {lang.level}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeLanguage(idx)}
                                                className={styles.removeBtn}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className={styles.addSection}>
                                <h3>Ajouter une langue</h3>
                                <div className={styles.row}>
                                    <Input
                                        label="Langue"
                                        placeholder="Français"
                                        value={currentLanguage.name}
                                        onChange={(e) => setCurrentLanguage({ ...currentLanguage, name: e.target.value })}
                                    />
                                    <div className={styles.inputGroup}>
                                        <label>Niveau</label>
                                        <select
                                            value={currentLanguage.level}
                                            onChange={(e) => setCurrentLanguage({ ...currentLanguage, level: e.target.value })}
                                            className={styles.select}
                                        >
                                            <option value="débutant">Débutant</option>
                                            <option value="intermédiaire">Intermédiaire</option>
                                            <option value="avancé">Avancé</option>
                                            <option value="natif">Natif</option>
                                        </select>
                                    </div>
                                </div>
                                <button type="button" onClick={addLanguage} className="btn btn-outline">
                                    + Ajouter cette langue
                                </button>
                            </div>
                        </div>
                    )}

                    <div className={styles.actions}>
                        {step > 1 && (
                            <button type="button" onClick={prevStep} className="btn btn-outline">
                                ← Précédent
                            </button>
                        )}
                        {step < 7 ? (
                            <button type="button" onClick={nextStep} className="btn btn-primary">
                                Suivant →
                            </button>
                        ) : (
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Création...' : '✓ Créer mon profil'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
