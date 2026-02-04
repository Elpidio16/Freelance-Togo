'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/Toast/ToastProvider';
import styles from './login.module.css';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { addToast } = useToast();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email: formData.email,
                password: formData.password,
            });

            if (result?.error) {
                // Afficher l'erreur
                addToast(result.error, 'error');
                setIsLoading(false);
                return;
            }

            if (result?.ok) {
                // Succès !
                addToast('🎉 Connexion réussie ! Bienvenue !', 'success');

                // Rediriger vers le dashboard ou la page d'accueil
                const callbackUrl = searchParams.get('callbackUrl') || '/';
                setTimeout(() => {
                    router.push(callbackUrl);
                    router.refresh();
                }, 1000);
            }

        } catch (error) {
            console.error('Erreur de connexion:', error);
            addToast('Une erreur est survenue. Veuillez réessayer.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
                <div className={styles.loginCard}>
                    <h1 className={styles.title}>Bon retour !</h1>
                    <p className={styles.subtitle}>Connectez-vous à votre compte</p>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="votre.email@example.com"
                            required
                        />

                        <Input
                            label="Mot de passe"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        <div className={styles.forgotPassword}>
                            <Link href="/auth/forgot-password" className={styles.link}>
                                Mot de passe oublié ?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className={styles.submitBtn}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Connexion...' : 'Se connecter'}
                        </Button>
                    </form>

                    <div className={styles.divider}>
                        <span>ou</span>
                    </div>

                    <div className={styles.socialButtons}>
                        <button className={styles.googleBtn} type="button">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853" />
                                <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.59.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" fill="#FBBC05" />
                                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                            </svg>
                            Continuer avec Google
                        </button>
                    </div>

                    <p className={styles.registerLink}>
                        Vous n'avez pas encore de compte ?{' '}
                        <Link href="/auth/register" className={styles.link}>
                            Créer un compte
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
