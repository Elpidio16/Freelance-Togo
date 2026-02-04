'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import styles from './submit-review.module.css';

export default function SubmitReviewPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const projectId = searchParams.get('projectId');
    const { showToast } = useToast();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        rating: 5,
        comment: '',
        skillsRating: {
            technical: 5,
            communication: 5,
            deadline: 5,
            quality: 5,
        },
        wouldRecommend: true,
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        } else if (status === 'authenticated' && projectId) {
            checkCanReview();
        } else if (status === 'authenticated' && !projectId) {
            showToast('Projet non spécifié', 'error');
            router.push('/projects');
        }
    }, [status, projectId]);

    const checkCanReview = async () => {
        try {
            const res = await fetch(`/api/reviews/can-review/${projectId}`);
            const data = await res.json();

            if (!data.canReview) {
                showToast(data.reason || 'Vous ne pouvez pas évaluer ce projet', 'error');
                router.push('/projects');
                return;
            }

            setProject(data.project);
        } catch (error) {
            console.error('Error:', error);
            showToast('Erreur lors de la vérification', 'error');
            router.push('/projects');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.comment.trim().length < 20) {
            showToast('Le commentaire doit contenir au moins 20 caractères', 'error');
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId,
                    freelanceId: project.freelanceId,
                    ...formData,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                showToast('Avis publié avec succès !', 'success');
                router.push('/projects');
            } else {
                showToast(data.error || 'Erreur lors de la publication', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('Erreur lors de la publication', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    if (status === 'loading' || loading) {
        return <div className={styles.loading}>Chargement...</div>;
    }

    if (!session || !project) return null;

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <button onClick={() => router.back()} className="btn btn-outline">
                    ← Retour
                </button>

                <div className={styles.header}>
                    <h1>Évaluer le projet</h1>
                    <p>Projet: <strong>{project.title}</strong></p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Overall Rating */}
                    <div className={styles.section}>
                        <label className={styles.label}>Note globale *</label>
                        <div className={styles.stars}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className={`${styles.star} ${star <= formData.rating ? styles.active : ''}`}
                                    onClick={() => setFormData({ ...formData, rating: star })}
                                >
                                    ⭐
                                </button>
                            ))}
                        </div>
                        <p className={styles.ratingText}>
                            {formData.rating === 5 && 'Excellent'}
                            {formData.rating === 4 && 'Très bien'}
                            {formData.rating === 3 && 'Bien'}
                            {formData.rating === 2 && 'Moyen'}
                            {formData.rating === 1 && 'Insuffisant'}
                        </p>
                    </div>

                    {/* Detailed Ratings */}
                    <div className={styles.section}>
                        <label className={styles.label}>Évaluation détaillée</label>

                        {Object.entries({
                            technical: 'Compétences techniques',
                            communication: 'Communication',
                            deadline: 'Respect des délais',
                            quality: 'Qualité du travail',
                        }).map(([key, label]) => (
                            <div key={key} className={styles.skillRating}>
                                <span>{label}</span>
                                <div className={styles.stars}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            className={`${styles.starSmall} ${star <= formData.skillsRating[key] ? styles.active : ''}`}
                                            onClick={() => setFormData({
                                                ...formData,
                                                skillsRating: { ...formData.skillsRating, [key]: star },
                                            })}
                                        >
                                            ⭐
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Comment */}
                    <div className={styles.section}>
                        <label className={styles.label}>Votre commentaire * (minimum 20 caractères)</label>
                        <textarea
                            value={formData.comment}
                            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                            placeholder="Partagez votre expérience avec ce freelance..."
                            rows={6}
                            required
                        />
                        <p className={styles.charCount}>{formData.comment.length} caractères</p>
                    </div>

                    {/* Recommendation */}
                    <div className={styles.section}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={formData.wouldRecommend}
                                onChange={(e) => setFormData({ ...formData, wouldRecommend: e.target.checked })}
                            />
                            Je recommande ce freelance
                        </label>
                    </div>

                    <div className={styles.actions}>
                        <button type="button" onClick={() => router.back()} className="btn btn-outline">
                            Annuler
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? 'Publication...' : 'Publier l\'avis'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
