'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import PhoneInput from '@/components/ui/PhoneInput';
import { useToast } from '@/components/Toast/ToastProvider';
import styles from './freelance.module.css';

export default function RegisterFreelancePage() {
    const router = useRouter();
    const { addToast } = useToast();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        city: '',
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        const newErrors = {};

        if (!formData.firstName) newErrors.firstName = 'Prénom requis';
        if (!formData.lastName) newErrors.lastName = 'Nom requis';
        if (!formData.email) {
            newErrors.email = 'Email requis';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email invalide';
        }
        if (!formData.phone) newErrors.phone = 'Téléphone requis';
        if (!formData.city) newErrors.city = 'Ville requise';
        if (!formData.password) {
            newErrors.password = 'Mot de passe requis';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            addToast('Veuillez corriger les erreurs', 'error');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    role: 'freelance'
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                addToast(data.error || 'Une erreur est survenue', 'error');
                return;
            }

            // Succès !
            addToast('📧 Compte créé ! Vérifiez votre email pour activer votre compte.', 'success');

            // Rediriger vers la page de vérification
            setTimeout(() => {
                router.push(`/auth/verify-pending?email=${encodeURIComponent(formData.email)}`);
            }, 2000);

        } catch (error) {
            console.error('Erreur:', error);
            addToast('Une erreur est survenue. Veuillez réessayer.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

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
                <div className={styles.formSection}>
                    <div className={styles.header}>
                        <Link href="/" className={styles.logo}>
                            <span className={styles.logoText}>Freelance</span>
                            <span className={styles.logoAccent}>Togo</span>
                        </Link>
                        <h1>Créer mon profil de freelance</h1>
                        <p>Rejoignez des centaines de freelances qui utilisent Freelance Togo</p>
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
                            <label>Contact</label>
                            <Input
                                label="Email professionnel"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                                placeholder="votre.email@example.com"
                                required
                            />
                            <PhoneInput
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                error={errors.phone}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Localisation</label>
                            <Input
                                label="Ville au Togo"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                error={errors.city}
                                placeholder="Lomé, Kara, Sokodé..."
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Sécurité</label>
                            <Input
                                label="Mot de passe"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                                required
                            />
                            <Input
                                label="Confirmer le mot de passe"
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                error={errors.confirmPassword}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Création en cours...' : 'Créer mon compte'}
                        </button>

                        <p className={styles.switchText}>
                            Vous êtes une entreprise ? {' '}
                            <Link href="/auth/register/company">Créer un compte entreprise</Link>
                        </p>

                        <p className={styles.loginText}>
                            Vous avez déjà un compte ? {' '}
                            <Link href="/auth/login">Connectez-vous</Link>
                        </p>
                    </form>
                </div>

                <div className={styles.infoSection}>
                    <h2>Pourquoi rejoindre Freelance Togo ?</h2>
                    <div className={styles.features}>
                        <div className={styles.feature}>
                            <div className={styles.featureIcon}>💼</div>
                            <h3>Missions de qualité</h3>
                            <p>Accédez à des projets d'entreprises togolaises et internationales</p>
                        </div>
                        <div className={styles.feature}>
                            <div className={styles.featureIcon}>⚡</div>
                            <h3>Gestion simplifiée</h3>
                            <p>Gérez vos propositions et projets depuis un seul tableau de bord</p>
                        </div>
                        <div className={styles.feature}>
                            <div className={styles.featureIcon}>🎯</div>
                            <h3>Profil professionnel</h3>
                            <p>Créez un profil qui met en valeur vos compétences et expériences</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
