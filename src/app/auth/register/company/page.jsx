'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/Toast/ToastProvider';
import Input from '@/components/ui/Input';
import PhoneInput from '@/components/ui/PhoneInput';
import AuthLayout from '@/components/layout/AuthLayout';
import styles from '../freelance/freelance.module.css'; // Réutiliser le même style

export default function CompanyRegisterPage() {
    const router = useRouter();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        // Company specific fields
        companyName: '',
        sector: '',
        companySize: '',
        website: '',
        city: '',
    });

    const [errors, setErrors] = useState({});

    const sectors = [
        'Technologie & IT',
        'Finance & Banque',
        'Commerce & Retail',
        'Santé',
        'Éducation',
        'Construction',
        'Agriculture',
        'Tourisme & Hôtellerie',
        'Transport & Logistique',
        'Télécommunications',
        'Autre',
    ];

    const companySizes = [
        { value: '1-10', label: '1-10 employés' },
        { value: '11-50', label: '11-50 employés' },
        { value: '51-200', label: '51-200 employés' },
        { value: '200+', label: '200+ employés' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
        if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est requis';
        if (!formData.email.trim()) {
            newErrors.email = 'L\'email est requis';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email invalide';
        }
        if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est requis';
        if (!formData.password) {
            newErrors.password = 'Le mot de passe est requis';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }

        // Company fields
        if (!formData.companyName.trim()) newErrors.companyName = 'Le nom de l\'entreprise est requis';
        if (!formData.sector) newErrors.sector = 'Le secteur d\'activité est requis';
        if (!formData.companySize) newErrors.companySize = 'La taille de l\'entreprise est requise';
        if (!formData.city.trim()) newErrors.city = 'La ville est requise';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            addToast('Veuillez corriger les erreurs', 'error');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    role: 'company', // Important!
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Erreur lors de l\'inscription');
            }

            addToast('Compte créé avec succès ! Vérifiez votre email.', 'success');
            router.push('/auth/verify-pending');

        } catch (error) {
            addToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className={styles.container}>
                <div className={styles.formSection}>
                    <div className={styles.header}>
                        <Link href="/" className={styles.logo}>
                            <span className={styles.logoText}>Ingeni</span>
                            <span className={styles.logoAccent}>Hub</span>
                        </Link>
                        <h1>Créer un compte entreprise</h1>
                        <p>Trouvez les meilleurs ingénieurs pour vos projets</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label>Informations personnelles</label>
                            <div className={styles.row}>
                                <Input
                                    label="Prénom"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    error={errors.firstName}
                                    required
                                />
                                <Input
                                    label="Nom"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    error={errors.lastName}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Informations de l'entreprise</label>
                            <Input
                                label="Nom de l'entreprise"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                error={errors.companyName}
                                required
                            />

                            <div className={styles.row}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="sector">Secteur d'activité *</label>
                                    <select
                                        id="sector"
                                        name="sector"
                                        value={formData.sector}
                                        onChange={handleChange}
                                        className={`${styles.select} ${errors.sector ? styles.error : ''}`}
                                        required
                                    >
                                        <option value="">Sélectionner un secteur</option>
                                        {sectors.map(sector => (
                                            <option key={sector} value={sector}>{sector}</option>
                                        ))}
                                    </select>
                                    {errors.sector && <span className={styles.errorText}>{errors.sector}</span>}
                                </div>

                                <div className={styles.inputGroup}>
                                    <label htmlFor="companySize">Taille de l'entreprise *</label>
                                    <select
                                        id="companySize"
                                        name="companySize"
                                        value={formData.companySize}
                                        onChange={handleChange}
                                        className={`${styles.select} ${errors.companySize ? styles.error : ''}`}
                                        required
                                    >
                                        <option value="">Sélectionner</option>
                                        {companySizes.map(size => (
                                            <option key={size.value} value={size.value}>{size.label}</option>
                                        ))}
                                    </select>
                                    {errors.companySize && <span className={styles.errorText}>{errors.companySize}</span>}
                                </div>
                            </div>

                            <Input
                                label="Site web (optionnel)"
                                name="website"
                                type="url"
                                placeholder="https://example.com"
                                value={formData.website}
                                onChange={handleChange}
                            />

                            <Input
                                label="Ville"
                                name="city"
                                placeholder="Lomé"
                                value={formData.city}
                                onChange={handleChange}
                                error={errors.city}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Contact</label>
                            <Input
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                                required
                            />
                            <PhoneInput
                                label="Téléphone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                error={errors.phone}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Sécurité</label>
                            <Input
                                label="Mot de passe"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                                required
                            />
                            <Input
                                label="Confirmer le mot de passe"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                error={errors.confirmPassword}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={loading}
                        >
                            {loading ? 'Création en cours...' : 'Créer mon compte entreprise'}
                        </button>

                        <p className={styles.switchText}>
                            Vous êtes un freelance ? {' '}
                            <Link href="/auth/register/freelance">Créer un compte freelance</Link>
                        </p>

                        <p className={styles.loginText}>
                            Vous avez déjà un compte ? {' '}
                            <Link href="/auth/login">Connectez-vous</Link>
                        </p>
                    </form>
                </div>

                <div className={styles.infoSection}>
                    <h2>Pourquoi recruter sur IngeniHub ?</h2>
                    <div className={styles.features}>
                        <div className={styles.feature}>
                            <div className={styles.featureIcon}>🎯</div>
                            <h3>Talents vérifiés</h3>
                            <p>Tous nos freelances sont vérifiés et évalués par la communauté</p>
                        </div>
                        <div className={styles.feature}>
                            <div className={styles.featureIcon}>⚡</div>
                            <h3>Embauche rapide</h3>
                            <p>Trouvez et recrutez le freelance parfait en quelques clics</p>
                        </div>
                        <div className={styles.feature}>
                            <div className={styles.featureIcon}>💼</div>
                            <h3>Gestion simplifiée</h3>
                            <p>Gérez tous vos projets et freelances depuis un seul tableau de bord</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}
