'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import PhoneInput from '@/components/ui/PhoneInput';
import { useToast } from '@/components/Toast/ToastProvider';
import AuthLayout from '@/components/layout/AuthLayout';
import {
    validateName,
    validateEmail,
    validatePhone,
    validatePassword,
    validatePasswordConfirmation,
    validateCity,
    getPasswordStrength,
    CITIES
} from '@/lib/validation';
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
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        // Update password strength indicator
        if (name === 'password') {
            setPasswordStrength(getPasswordStrength(value));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Comprehensive validation
        const newErrors = {};

        // Validate first name
        const firstNameResult = validateName(formData.firstName);
        if (!firstNameResult.valid) {
            newErrors.firstName = firstNameResult.error;
        }

        // Validate last name
        const lastNameResult = validateName(formData.lastName);
        if (!lastNameResult.valid) {
            newErrors.lastName = lastNameResult.error;
        }

        // Validate email
        const emailResult = validateEmail(formData.email);
        if (!emailResult.valid) {
            newErrors.email = emailResult.error;
        }

        // Validate phone
        const phoneResult = validatePhone(formData.phone);
        if (!phoneResult.valid) {
            newErrors.phone = phoneResult.error;
        }

        // Validate city
        const cityResult = validateCity(formData.city);
        if (!cityResult.valid) {
            newErrors.city = cityResult.error;
        }

        // Validate password
        const passwordResult = validatePassword(formData.password);
        if (!passwordResult.valid) {
            newErrors.password = passwordResult.error;
        }

        // Validate password confirmation
        const confirmResult = validatePasswordConfirmation(formData.password, formData.confirmPassword);
        if (!confirmResult.valid) {
            newErrors.confirmPassword = confirmResult.error;
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            addToast('Veuillez corriger les erreurs dans le formulaire', 'error');
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


    return (
        <AuthLayout>
            <div className={styles.container}>
                <div className={styles.formSection}>
                    <div className={styles.header}>
                        <Link href="/" className={styles.logo}>
                            <span className={styles.logoText}>Ingeni</span>
                            <span className={styles.logoAccent}>Hub</span>
                        </Link>
                        <h1>Créer mon profil d'ingénieur</h1>
                        <p>Rejoignez des centaines d'ingénieurs qui utilisent IngeniHub</p>
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
                            <div className="form-group">
                                <label className="label">
                                    Ville au Togo
                                    <span style={{ color: 'var(--accent-color)' }}> *</span>
                                </label>
                                <select
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className={`select ${errors.city ? 'input-error' : ''}`}
                                    required
                                >
                                    <option value="">Sélectionnez une ville</option>
                                    {CITIES.sort().map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                                {errors.city && (
                                    <span className="text-sm" style={{ color: '#ef4444', marginTop: '0.25rem', display: 'block' }}>{errors.city}</span>
                                )}
                            </div>
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

                        <p className={styles.loginText}>
                            Vous avez déjà un compte ? {' '}
                            <Link href="/auth/login">Connectez-vous</Link>
                        </p>

                        <div className={styles.divider}>
                            <span>ou</span>
                        </div>

                        <div className={styles.socialButtons}>
                            <button
                                className={styles.googleBtn}
                                type="button"
                                onClick={() => signIn('google', { callbackUrl: '/' })}
                            >
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853" />
                                    <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.59.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" fill="#FBBC05" />
                                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                                </svg>
                                Continuer avec Google
                            </button>
                        </div>
                    </form>
                </div>

                <div className={styles.infoSection}>
                    <h2>Pourquoi rejoindre IngeniHub ?</h2>
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
        </AuthLayout>
    );
}
