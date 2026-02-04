'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './favorites.module.css';

export default function FavoritesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [favorites, setFavorites] = useState([]);
    const [pools, setPools] = useState([]);
    const [selectedPool, setSelectedPool] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        } else if (status === 'authenticated') {
            if (session.user.role !== 'company') {
                router.push('/dashboard');
            } else {
                fetchFavorites();
            }
        }
    }, [status, selectedPool]);

    const fetchFavorites = async () => {
        try {
            const params = selectedPool !== 'all' ? `?pool=${selectedPool}` : '';
            const res = await fetch(`/api/favorites${params}`);
            if (res.ok) {
                const data = await res.json();
                setFavorites(data.favorites || []);
                setPools(['all', ...(data.pools || [])]);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (favoriteId) => {
        if (!confirm('Retirer ce freelance de vos favoris ?')) return;

        try {
            const res = await fetch(`/api/favorites/${favoriteId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setFavorites(favorites.filter(fav => fav._id !== favoriteId));
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (status === 'loading' || loading) {
        return <div className={styles.loading}>Chargement...</div>;
    }

    if (!session || session.user.role !== 'company') return null;

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
                    <div>
                        <h1>Mes Favoris</h1>
                        <p>Vos freelances préférés pour vos futurs projets</p>
                    </div>
                    <Link href="/dashboard" className="btn btn-outline">
                        Retour au dashboard
                    </Link>
                </div>

                {/* Pool Filter */}
                <div className={styles.filters}>
                    <div className={styles.poolTabs}>
                        {pools.map((pool) => (
                            <button
                                key={pool}
                                className={`${styles.poolTab} ${selectedPool === pool ? styles.active : ''}`}
                                onClick={() => setSelectedPool(pool)}
                            >
                                {pool === 'all' ? 'Tous' : pool} ({favorites.filter(f => pool === 'all' || f.poolName === pool).length})
                            </button>
                        ))}
                    </div>
                </div>

                {favorites.length === 0 ? (
                    <div className={styles.empty}>
                        <div className={styles.emptyIcon}>⭐</div>
                        <h2>Aucun favori</h2>
                        <p>Ajoutez des freelances à vos favoris pour les retrouver facilement</p>
                        <Link href="/freelances/search" className="btn btn-primary">
                            Parcourir les freelances
                        </Link>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {favorites.map((fav) => (
                            <div key={fav._id} className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.avatar}>
                                        {fav.freelance.name.charAt(0)}
                                    </div>
                                    <div className={styles.cardInfo}>
                                        <Link href={`/freelances/${fav.freelance.id}`} className={styles.name}>
                                            {fav.freelance.name}
                                        </Link>
                                        <p className={styles.jobTitle}>{fav.freelance.jobTitle}</p>
                                        {fav.freelance.location && (
                                            <p className={styles.location}>📍 {fav.freelance.location}</p>
                                        )}
                                    </div>
                                </div>

                                {fav.freelance.skills && fav.freelance.skills.length > 0 && (
                                    <div className={styles.skills}>
                                        {fav.freelance.skills.slice(0, 3).map((skill, idx) => (
                                            <span key={idx} className={styles.skill}>{skill}</span>
                                        ))}
                                        {fav.freelance.skills.length > 3 && (
                                            <span className={styles.skillMore}>+{fav.freelance.skills.length - 3}</span>
                                        )}
                                    </div>
                                )}

                                <div className={styles.cardMeta}>
                                    {fav.freelance.rating > 0 && (
                                        <span className={styles.rating}>⭐ {fav.freelance.rating}</span>
                                    )}
                                    {fav.freelance.dailyRate && (
                                        <span className={styles.rate}>
                                            {fav.freelance.dailyRate.toLocaleString()} FCFA/jour
                                        </span>
                                    )}
                                </div>

                                {fav.notes && (
                                    <div className={styles.notes}>
                                        <strong>Notes:</strong> {fav.notes}
                                    </div>
                                )}

                                <div className={styles.cardActions}>
                                    <Link href={`/freelances/${fav.freelance.id}`} className="btn btn-outline btn-sm">
                                        Voir profil
                                    </Link>
                                    <button
                                        onClick={() => handleRemove(fav._id)}
                                        className="btn btn-outline btn-sm"
                                    >
                                        ❌ Retirer
                                    </button>
                                </div>

                                {fav.poolName !== 'Général' && (
                                    <div className={styles.poolBadge}>{fav.poolName}</div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
