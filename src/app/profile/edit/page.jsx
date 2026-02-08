'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useToast } from '@/components/Toast/ToastProvider';
import Input from '@/components/ui/Input';
import {
    validateSocialLink,
    validateCertificationId,
    validateCertificationUrl,
    CERTIFICATION_ISSUERS
} from '@/lib/validation';
import { CATEGORIES } from '@/lib/categories';
import styles from './profile-edit.module.css';

export default function ProfileEditPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        bio: '',
        category: '',
        hourlyRate: '',
        dailyRate: '',
        availability: 'disponible',
        skills: '',
        certifications: [],
        socialLinks: {
            linkedin: '',
            github: '',
            portfolio: '',
            twitter: '',
            other: '',
        },
        experiences: [],
        education: [],
        languages: [],
    });

    const [currentCertification, setCurrentCertification] = useState({
        name: '',
        issuer: '',
        date: '',
        credentialId: '',
        url: '',
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

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
            return;
        }

        if (status === 'authenticated') {
            fetchProfile();
        }
    }, [status]);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/profile/freelance');
            if (res.status === 404) {
                addToast('Vous n\'avez pas encore créé de profil', 'info');
                router.push('/profile/setup');
                return;
            }
            if (!res.ok) throw new Error('Erreur lors du chargement');

            const data = await res.json();
            const profile = data.profile;

            setFormData({
                title: profile.title || '',
                bio: profile.bio || '',
                category: profile.category || '',
                hourlyRate: profile.hourlyRate || '',
                dailyRate: profile.dailyRate || '',
                availability: profile.availability || 'disponible',
                skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : '',
                certifications: profile.certifications || [],
                socialLinks: profile.socialLinks || {
                    linkedin: '',
                    github: '',
                    portfolio: '',
                    twitter: '',
                    other: '',
                },
                experiences: profile.experience || [],
                education: profile.education || [],
                languages: profile.languages || [],
            });
        } catch (error) {
            console.error(error);
            addToast('Erreur lors du chargement du profil', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSocialLinkChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            socialLinks: { ...prev.socialLinks, [name]: value }
        }));
    };

    // Certifications
    const addCertification = () => {
        if (!currentCertification.name || currentCertification.name.trim().length < 3) {
            addToast('Le nom de la certification doit contenir au moins 3 caractères', 'error');
            return;
        }
        if (!currentCertification.issuer) {
            addToast('Veuillez sélectionner un organisme émetteur', 'error');
            return;
        }

        const idResult = validateCertificationId(currentCertification.credentialId);
        if (!idResult.valid) {
            addToast(idResult.error, 'error');
            return;
        }

        const urlResult = validateCertificationUrl(currentCertification.url);
        if (!urlResult.valid) {
            addToast(urlResult.error, 'error');
            return;
        }

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
        addToast('Certification ajoutée !', 'success');
    };

    const removeCertification = (index) => {
        setFormData(prev => ({
            ...prev,
            certifications: prev.certifications.filter((_, i) => i !== index)
        }));
        addToast('Certification supprimée', 'info');
    };

    // Experiences
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
        addToast('Expérience supprimée', 'info');
    };

    // Education
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
        addToast('Formation supprimée', 'info');
    };

    // Languages
    const addLanguage = () => {
        if (!currentLanguage.name) {
            addToast('Veuillez saisir le nom de la langue', 'error');
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
        addToast('Langue supprimée', 'info');
    };

    const handleSave = async () => {
        // Validation
        if (!formData.title || !formData.bio || !formData.category) {
            addToast('Titre, bio et catégorie sont requis', 'error');
            return;
        }

        if (formData.certifications.length === 0) {
            addToast('Au moins une certification est requise', 'error');
            return;
        }

        const hasAtLeastOneLink = Object.values(formData.socialLinks).some(link => link && link.trim() !== '');
        if (!hasAtLeastOneLink) {
            addToast('Au moins un lien social est requis', 'error');
            return;
        }

        setSaving(true);
        try {
            const payload = {
                title: formData.title,
                bio: formData.bio,
                category: formData.category,
                skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
                hourlyRate: parseFloat(formData.hourlyRate) || 0,
                dailyRate: parseFloat(formData.dailyRate) || 0,
                availability: formData.availability,
                certifications: formData.certifications,
                socialLinks: formData.socialLinks,
                experience: formData.experiences,
                education: formData.education,
                languages: formData.languages,
            };

            const res = await fetch('/api/profile/freelance', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Erreur lors de la mise à jour');
            }

            addToast('Profil mis à jour avec succès !', 'success');
            router.push('/profile/view');
        } catch (error) {
            console.error(error);
            addToast(error.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch('/api/profile/freelance', {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Erreur lors de la suppression');

            addToast('Profil supprimé avec succès', 'success');
            router.push('/profile/setup');
        } catch (error) {
            console.error(error);
            addToast('Erreur lors de la suppression du profil', 'error');
        }
    };

    if (loading || status === 'loading') {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>✏️ Modifier mon profil</h1>
                <Link href="/profile/view" className="btn btn-secondary">
                    ← Retour
                </Link>
            </div>

            <div className={styles.form}>
                {/* Informations de base */}
                <section className={styles.section}>
                    <h2>📝 Informations de base</h2>
                    <Input
                        label="Titre professionnel *"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Ex: Développeur Full Stack"
                    />
                    <div className={styles.formGroup}>
                        <label>Bio *</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows="5"
                            placeholder="Présentez-vous en quelques lignes..."
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Catégorie *</label>
                        <select name="category" value={formData.category} onChange={handleChange}>
                            <option value="">Sélectionnez une catégorie</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Disponibilité</label>
                        <select name="availability" value={formData.availability} onChange={handleChange}>
                            <option value="disponible">Disponible</option>
                            <option value="occupé">Occupé</option>
                            <option value="bientôt disponible">Bientôt disponible</option>
                        </select>
                    </div>
                </section>

                {/* Tarifs */}
                <section className={styles.section}>
                    <h2>💰 Tarifs</h2>
                    <Input
                        label="Tarif horaire (FCFA)"
                        name="hourlyRate"
                        type="number"
                        value={formData.hourlyRate}
                        onChange={handleChange}
                        placeholder="Ex: 5000"
                    />
                    <Input
                        label="Tarif journalier (FCFA)"
                        name="dailyRate"
                        type="number"
                        value={formData.dailyRate}
                        onChange={handleChange}
                        placeholder="Ex: 30000"
                    />
                </section>

                {/* Compétences */}
                <section className={styles.section}>
                    <h2>🛠️ Compétences</h2>
                    <Input
                        label="Compétences (séparées par des virgules)"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="Ex: JavaScript, React, Node.js"
                    />
                </section>

                {/* Certifications */}
                <section className={styles.section}>
                    <h2>🎓 Certifications *</h2>
                    <div className={styles.list}>
                        {formData.certifications.map((cert, index) => (
                            <div key={index} className={styles.listItem}>
                                <div>
                                    <strong>{cert.name}</strong>
                                    <p>{cert.issuer} - {cert.date}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeCertification(index)}
                                    className="btn btn-danger btn-sm"
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className={styles.addForm}>
                        <Input
                            label="Nom de la certification"
                            value={currentCertification.name}
                            onChange={(e) => setCurrentCertification(prev => ({ ...prev, name: e.target.value }))}
                        />
                        <div className={styles.formGroup}>
                            <label>Organisme émetteur</label>
                            <select
                                value={currentCertification.issuer}
                                onChange={(e) => setCurrentCertification(prev => ({ ...prev, issuer: e.target.value }))}
                            >
                                <option value="">Sélectionnez</option>
                                {CERTIFICATION_ISSUERS.map(issuer => (
                                    <option key={issuer} value={issuer}>{issuer}</option>
                                ))}
                            </select>
                        </div>
                        <Input
                            label="Date"
                            value={currentCertification.date}
                            onChange={(e) => setCurrentCertification(prev => ({ ...prev, date: e.target.value }))}
                            placeholder="Ex: 2023"
                        />
                        <Input
                            label="ID de certification"
                            value={currentCertification.credentialId}
                            onChange={(e) => setCurrentCertification(prev => ({ ...prev, credentialId: e.target.value }))}
                        />
                        <Input
                            label="URL de vérification"
                            value={currentCertification.url}
                            onChange={(e) => setCurrentCertification(prev => ({ ...prev, url: e.target.value }))}
                        />
                        <button type="button" onClick={addCertification} className="btn btn-secondary">
                            ➕ Ajouter
                        </button>
                    </div>
                </section>

                {/* Expériences */}
                <section className={styles.section}>
                    <h2>💼 Expériences</h2>
                    <div className={styles.list}>
                        {formData.experiences.map((exp, index) => (
                            <div key={index} className={styles.listItem}>
                                <div>
                                    <strong>{exp.role}</strong>
                                    <p>{exp.company} - {exp.duration}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeExperience(index)}
                                    className="btn btn-danger btn-sm"
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className={styles.addForm}>
                        <Input
                            label="Entreprise"
                            value={currentExperience.company}
                            onChange={(e) => setCurrentExperience(prev => ({ ...prev, company: e.target.value }))}
                        />
                        <Input
                            label="Poste"
                            value={currentExperience.role}
                            onChange={(e) => setCurrentExperience(prev => ({ ...prev, role: e.target.value }))}
                        />
                        <Input
                            label="Durée"
                            value={currentExperience.duration}
                            onChange={(e) => setCurrentExperience(prev => ({ ...prev, duration: e.target.value }))}
                            placeholder="Ex: 2020-2023"
                        />
                        <div className={styles.formGroup}>
                            <label>Description</label>
                            <textarea
                                value={currentExperience.description}
                                onChange={(e) => setCurrentExperience(prev => ({ ...prev, description: e.target.value }))}
                                rows="3"
                            />
                        </div>
                        <button type="button" onClick={addExperience} className="btn btn-secondary">
                            ➕ Ajouter
                        </button>
                    </div>
                </section>

                {/* Formation */}
                <section className={styles.section}>
                    <h2>🎓 Formation</h2>
                    <div className={styles.list}>
                        {formData.education.map((edu, index) => (
                            <div key={index} className={styles.listItem}>
                                <div>
                                    <strong>{edu.degree}</strong>
                                    <p>{edu.school} - {edu.year}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeEducation(index)}
                                    className="btn btn-danger btn-sm"
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className={styles.addForm}>
                        <Input
                            label="École"
                            value={currentEducation.school}
                            onChange={(e) => setCurrentEducation(prev => ({ ...prev, school: e.target.value }))}
                        />
                        <Input
                            label="Diplôme"
                            value={currentEducation.degree}
                            onChange={(e) => setCurrentEducation(prev => ({ ...prev, degree: e.target.value }))}
                        />
                        <Input
                            label="Domaine"
                            value={currentEducation.field}
                            onChange={(e) => setCurrentEducation(prev => ({ ...prev, field: e.target.value }))}
                        />
                        <Input
                            label="Année"
                            value={currentEducation.year}
                            onChange={(e) => setCurrentEducation(prev => ({ ...prev, year: e.target.value }))}
                        />
                        <button type="button" onClick={addEducation} className="btn btn-secondary">
                            ➕ Ajouter
                        </button>
                    </div>
                </section>

                {/* Langues */}
                <section className={styles.section}>
                    <h2>🌍 Langues</h2>
                    <div className={styles.list}>
                        {formData.languages.map((lang, index) => (
                            <div key={index} className={styles.listItem}>
                                <div>
                                    <strong>{lang.name}</strong>
                                    <p>{lang.level}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeLanguage(index)}
                                    className="btn btn-danger btn-sm"
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className={styles.addForm}>
                        <Input
                            label="Langue"
                            value={currentLanguage.name}
                            onChange={(e) => setCurrentLanguage(prev => ({ ...prev, name: e.target.value }))}
                        />
                        <div className={styles.formGroup}>
                            <label>Niveau</label>
                            <select
                                value={currentLanguage.level}
                                onChange={(e) => setCurrentLanguage(prev => ({ ...prev, level: e.target.value }))}
                            >
                                <option value="débutant">Débutant</option>
                                <option value="intermédiaire">Intermédiaire</option>
                                <option value="avancé">Avancé</option>
                                <option value="courant">Courant</option>
                                <option value="natif">Natif</option>
                            </select>
                        </div>
                        <button type="button" onClick={addLanguage} className="btn btn-secondary">
                            ➕ Ajouter
                        </button>
                    </div>
                </section>

                {/* Liens sociaux */}
                <section className={styles.section}>
                    <h2>🔗 Liens sociaux *</h2>
                    <Input
                        label="LinkedIn"
                        name="linkedin"
                        value={formData.socialLinks.linkedin}
                        onChange={handleSocialLinkChange}
                        placeholder="https://linkedin.com/in/..."
                    />
                    <Input
                        label="GitHub"
                        name="github"
                        value={formData.socialLinks.github}
                        onChange={handleSocialLinkChange}
                        placeholder="https://github.com/..."
                    />
                    <Input
                        label="Portfolio"
                        name="portfolio"
                        value={formData.socialLinks.portfolio}
                        onChange={handleSocialLinkChange}
                        placeholder="https://..."
                    />
                    <Input
                        label="Twitter"
                        name="twitter"
                        value={formData.socialLinks.twitter}
                        onChange={handleSocialLinkChange}
                        placeholder="https://twitter.com/..."
                    />
                    <Input
                        label="Autre"
                        name="other"
                        value={formData.socialLinks.other}
                        onChange={handleSocialLinkChange}
                        placeholder="https://..."
                    />
                </section>

                {/* Actions */}
                <div className={styles.actions}>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="btn btn-primary"
                    >
                        {saving ? 'Enregistrement...' : '💾 Enregistrer'}
                    </button>
                    <Link href="/profile/view" className="btn btn-secondary">
                        Annuler
                    </Link>
                    <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="btn btn-danger"
                    >
                        🗑️ Supprimer mon profil
                    </button>
                </div>
            </div>

            {/* Modal de confirmation de suppression */}
            {showDeleteConfirm && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>⚠️ Confirmer la suppression</h2>
                        <p>Êtes-vous sûr de vouloir supprimer votre profil ? Cette action est irréversible.</p>
                        <div className={styles.modalActions}>
                            <button onClick={handleDelete} className="btn btn-danger">
                                Oui, supprimer
                            </button>
                            <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-secondary">
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
