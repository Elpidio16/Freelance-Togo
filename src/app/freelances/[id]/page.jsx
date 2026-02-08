'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ContactModal from '@/components/ContactModal';
import styles from './profile.module.css';

export default function FreelanceProfilePage() {
    const params = useParams();
    const freelanceId = params.id;
    const [freelance, setFreelance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showContactModal, setShowContactModal] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [reviewStats, setReviewStats] = useState(null);

    useEffect(() => {
        fetchFreelance();
        fetchReviews();
    }, [freelanceId]);

    const fetchFreelance = async () => {
        try {
            const res = await fetch(`/api/freelances/${freelanceId}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Freelance non trouvé');
            }

            setFreelance(data.freelance);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const res = await fetch(`/api/freelances/${freelanceId}/reviews`);
            if (res.ok) {
                const data = await res.json();
                setReviews(data.reviews || []);
                setReviewStats(data.stats);
            }
        } catch (err) {
            console.error('Error fetching reviews:', err);
        }
    };

    if (loading) {
        return (
            <div className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.loading}>
                        <p>Chargement...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !freelance) {
        return (
            <div className={styles.page}>
                <div className={styles.container}>
                    <h1>Freelance non trouvé</h1>
                    <Link href="/freelances/search" className="btn btn-primary">
                        Retour à la recherche
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.profileHeader}>
                    <div className={styles.headerLeft}>
                        <div className={styles.avatarLarge}>
                            {freelance.image ? (
                                <img src={freelance.image} alt={freelance.name} />
                            ) : (
                                <div className={styles.avatarPlaceholder}>
                                    {freelance.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className={styles.headerInfo}>
                            <h1>{freelance.name}</h1>
                            <p className={styles.jobTitle}>{freelance.title}</p>
                            <p className={styles.category}>📂 {freelance.category}</p>
                            <div className={styles.rating}>
                                <span className={styles.stars}>⭐ {freelance.rating}</span>
                                <span className={styles.reviews}>({freelance.reviews} avis)</span>
                                <span className={styles.projects}>• {freelance.completedProjects} projets terminés</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.headerRight}>
                        <div className={styles.rateCard}>
                            {freelance.hourlyRate > 0 && (
                                <div className={styles.rateItem}>
                                    <span className={styles.rateLabel}>Tarif horaire</span>
                                    <span className={styles.rateValue}>{freelance.hourlyRate.toLocaleString()} FCFA</span>
                                </div>
                            )}
                            {freelance.dailyRate > 0 && (
                                <div className={styles.rateItem}>
                                    <span className={styles.rateLabel}>Tarif journalier</span>
                                    <span className={styles.rateValue}>{freelance.dailyRate.toLocaleString()} FCFA</span>
                                </div>
                            )}
                            <div className={styles.availability}>
                                <span className={`${styles.badge} ${styles[freelance.availability.replace(' ', '-')]}`}>
                                    {freelance.availability}
                                </span>
                            </div>
                        </div>
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={() => setShowContactModal(true)}
                        >
                            📧 Contacter
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className={styles.content}>
                    {/* À propos */}
                    <section className={styles.section}>
                        <h2>À propos</h2>
                        <p className={styles.bio}>{freelance.bio}</p>
                    </section>

                    {/* Compétences */}
                    {freelance.skills && freelance.skills.length > 0 && (
                        <section className={styles.section}>
                            <h2>Compétences</h2>
                            <div className={styles.skillsGrid}>
                                {freelance.skills.map((skill, idx) => (
                                    <span key={idx} className={styles.skillBadge}>{skill}</span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Portfolio */}
                    {freelance.portfolio && freelance.portfolio.length > 0 && (
                        <section className={styles.section}>
                            <h2>Portfolio</h2>
                            <div className={styles.portfolioGrid}>
                                {freelance.portfolio.map((project, idx) => (
                                    <div key={idx} className={styles.portfolioCard}>
                                        <h3>{project.title}</h3>
                                        <p>{project.description}</p>
                                        {project.technologies && project.technologies.length > 0 && (
                                            <div className={styles.techStack}>
                                                {project.technologies.map((tech, i) => (
                                                    <span key={i} className={styles.tech}>{tech}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Expérience */}
                    {freelance.experience && freelance.experience.length > 0 && (
                        <section className={styles.section}>
                            <h2>Expérience professionnelle</h2>
                            <div className={styles.timeline}>
                                {freelance.experience.map((exp, idx) => (
                                    <div key={idx} className={styles.timelineItem}>
                                        <div className={styles.timelineDot}></div>
                                        <div className={styles.timelineContent}>
                                            <h3>{exp.role}</h3>
                                            <p className={styles.company}>{exp.company}</p>
                                            <p className={styles.duration}>{exp.duration}</p>
                                            <p className={styles.description}>{exp.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Formation */}
                    {freelance.education && freelance.education.length > 0 && (
                        <section className={styles.section}>
                            <h2>Formation</h2>
                            {freelance.education.map((edu, idx) => (
                                <div key={idx} className={styles.educationItem}>
                                    <h3>{edu.degree}</h3>
                                    <p>{edu.school} • {edu.year}</p>
                                </div>
                            ))}
                        </section>
                    )}

                    {/* Langues */}
                    {freelance.languages && freelance.languages.length > 0 && (
                        <section className={styles.section}>
                            <h2>Langues</h2>
                            <div className={styles.languagesGrid}>
                                {freelance.languages.map((lang, idx) => (
                                    <div key={idx} className={styles.languageItem}>
                                        <span className={styles.langName}>{lang.name}</span>
                                        <span className={styles.langLevel}>{lang.level}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Reviews */}
                    <section className={styles.section}>
                        <h2>Évaluations ({reviewStats?.totalReviews || 0})</h2>

                        {reviewStats && reviewStats.totalReviews > 0 ? (
                            <>
                                <div className={styles.reviewsStats}>
                                    <div className={styles.averageRating}>
                                        <div className={styles.ratingNumber}>{reviewStats.averageRating}</div>
                                        <div className={styles.stars}>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span key={star} className={star <= Math.round(reviewStats.averageRating) ? styles.starFilled : styles.starEmpty}>
                                                    ⭐
                                                </span>
                                            ))}
                                        </div>
                                        <div className={styles.reviewCount}>
                                            Basé sur {reviewStats.totalReviews} avis
                                        </div>
                                    </div>

                                    <div className={styles.ratingBars}>
                                        {[5, 4, 3, 2, 1].map((rating) => (
                                            <div key={rating} className={styles.ratingBar}>
                                                <span>{rating}★</span>
                                                <div className={styles.barContainer}>
                                                    <div
                                                        className={styles.barFill}
                                                        style={{
                                                            width: `${reviewStats.totalReviews > 0 ? (reviewStats.ratingDistribution[rating] / reviewStats.totalReviews) * 100 : 0}%`
                                                        }}
                                                    ></div>
                                                </div>
                                                <span className={styles.barCount}>{reviewStats.ratingDistribution[rating]}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.reviewsList}>
                                    {reviews.map((review) => (
                                        <div key={review._id} className={styles.reviewCard}>
                                            <div className={styles.reviewHeader}>
                                                <div>
                                                    <h4>{review.company.name}</h4>
                                                    <p className={styles.reviewProject}>{review.project.title}</p>
                                                </div>
                                                <div className={styles.reviewRating}>
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <span key={star} className={star <= review.rating ? styles.starFilled : styles.starEmpty}>
                                                            ⭐
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className={styles.reviewComment}>{review.comment}</p>
                                            <div className={styles.reviewDate}>
                                                {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className={styles.noReviews}>
                                <p>Aucune évaluation pour le moment</p>
                            </div>
                        )}
                    </section>
                </div>
            </div>

            {/* Contact Modal */}
            {showContactModal && (
                <ContactModal
                    freelance={freelance}
                    onClose={() => setShowContactModal(false)}
                />
            )}
        </div>
    );
}
