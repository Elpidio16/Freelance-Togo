'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useToast } from '@/components/Toast/ToastProvider';
import styles from './profile-view.module.css';

export default function ProfileViewPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { addToast } = useToast();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

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
            setProfile(data.profile);
        } catch (error) {
            console.error(error);
            addToast('Erreur lors du chargement du profil', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loading || status === 'loading') {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Chargement de votre profil...</p>
                </div>
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.avatar}>
                        {session?.user?.firstName?.[0]}{session?.user?.lastName?.[0]}
                    </div>
                    <div className={styles.headerInfo}>
                        <h1>{session?.user?.firstName} {session?.user?.lastName}</h1>
                        <p className={styles.title}>{profile.title}</p>
                        <span className={styles.category}>{profile.category}</span>
                    </div>
                </div>
                <Link href="/profile/edit" className="btn btn-primary">
                    ✏️ Modifier mon profil
                </Link>
            </div>

            <div className={styles.grid}>
                {/* Bio & Disponibilité */}
                <div className={styles.card}>
                    <h2>📝 À propos</h2>
                    <p className={styles.bio}>{profile.bio}</p>
                    <div className={styles.availability}>
                        <span className={`${styles.badge} ${styles[profile.availability]}`}>
                            {profile.availability === 'disponible' && '🟢 Disponible'}
                            {profile.availability === 'occupé' && '🔴 Occupé'}
                            {profile.availability === 'bientôt disponible' && '🟡 Bientôt disponible'}
                        </span>
                    </div>
                </div>

                {/* Tarifs */}
                <div className={styles.card}>
                    <h2>💰 Tarifs</h2>
                    <div className={styles.rates}>
                        {profile.hourlyRate > 0 && (
                            <div className={styles.rate}>
                                <span className={styles.rateLabel}>Tarif horaire</span>
                                <span className={styles.rateValue}>{profile.hourlyRate.toLocaleString()} FCFA/h</span>
                            </div>
                        )}
                        {profile.dailyRate > 0 && (
                            <div className={styles.rate}>
                                <span className={styles.rateLabel}>Tarif journalier</span>
                                <span className={styles.rateValue}>{profile.dailyRate.toLocaleString()} FCFA/j</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Compétences */}
                {profile.skills && profile.skills.length > 0 && (
                    <div className={styles.card}>
                        <h2>🛠️ Compétences</h2>
                        <div className={styles.skills}>
                            {profile.skills.map((skill, index) => (
                                <span key={index} className={styles.skill}>{skill}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Certifications */}
                {profile.certifications && profile.certifications.length > 0 && (
                    <div className={styles.card}>
                        <h2>🎓 Certifications</h2>
                        <div className={styles.certifications}>
                            {profile.certifications.map((cert, index) => (
                                <div key={index} className={styles.certification}>
                                    <h3>{cert.name}</h3>
                                    <p className={styles.certIssuer}>{cert.issuer}</p>
                                    <p className={styles.certDate}>{cert.date}</p>
                                    {cert.url && (
                                        <a href={cert.url} target="_blank" rel="noopener noreferrer" className={styles.certLink}>
                                            🔗 Voir la certification
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Expériences */}
                {profile.experience && profile.experience.length > 0 && (
                    <div className={styles.card}>
                        <h2>💼 Expériences</h2>
                        <div className={styles.experiences}>
                            {profile.experience.map((exp, index) => (
                                <div key={index} className={styles.experience}>
                                    <h3>{exp.role}</h3>
                                    <p className={styles.expCompany}>{exp.company}</p>
                                    <p className={styles.expDuration}>{exp.duration}</p>
                                    {exp.description && <p className={styles.expDesc}>{exp.description}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Formation */}
                {profile.education && profile.education.length > 0 && (
                    <div className={styles.card}>
                        <h2>🎓 Formation</h2>
                        <div className={styles.education}>
                            {profile.education.map((edu, index) => (
                                <div key={index} className={styles.educationItem}>
                                    <h3>{edu.degree}</h3>
                                    <p className={styles.eduSchool}>{edu.school}</p>
                                    <p className={styles.eduField}>{edu.field}</p>
                                    <p className={styles.eduYear}>{edu.year}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Langues */}
                {profile.languages && profile.languages.length > 0 && (
                    <div className={styles.card}>
                        <h2>🌍 Langues</h2>
                        <div className={styles.languages}>
                            {profile.languages.map((lang, index) => (
                                <div key={index} className={styles.language}>
                                    <span className={styles.langName}>{lang.name}</span>
                                    <span className={styles.langLevel}>{lang.level}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Liens sociaux */}
                {profile.socialLinks && Object.values(profile.socialLinks).some(link => link) && (
                    <div className={styles.card}>
                        <h2>🔗 Liens</h2>
                        <div className={styles.socialLinks}>
                            {profile.socialLinks.linkedin && (
                                <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                    LinkedIn
                                </a>
                            )}
                            {profile.socialLinks.github && (
                                <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                    GitHub
                                </a>
                            )}
                            {profile.socialLinks.portfolio && (
                                <a href={profile.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                    Portfolio
                                </a>
                            )}
                            {profile.socialLinks.twitter && (
                                <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                    Twitter
                                </a>
                            )}
                            {profile.socialLinks.other && (
                                <a href={profile.socialLinks.other} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                    Autre
                                </a>
                            )}
                        </div>
                    </div>
                )}

                {/* Statistiques */}
                <div className={styles.card}>
                    <h2>📊 Statistiques</h2>
                    <div className={styles.stats}>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>{profile.completedProjects}</span>
                            <span className={styles.statLabel}>Projets complétés</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>{profile.averageRating.toFixed(1)}/5</span>
                            <span className={styles.statLabel}>Note moyenne</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>{profile.totalReviews}</span>
                            <span className={styles.statLabel}>Avis reçus</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
