'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './search.module.css';

const cities = ['Toutes les villes', 'Lomé', 'Kara', 'Sokodé', 'Atakpamé', 'Kpalimé'];

export default function FreelanceSearchPage() {
    const [freelances, setFreelances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedAvailability, setSelectedAvailability] = useState('');
    const [minRate, setMinRate] = useState('');
    const [maxRate, setMaxRate] = useState('');

    // Charger les freelances depuis l'API
    useEffect(() => {
        fetchFreelances();
    }, [searchQuery, selectedCity, selectedAvailability, minRate, maxRate]);

    const fetchFreelances = async () => {
        setLoading(true);
        try {
            // Construire les query params
            const params = new URLSearchParams();
            if (searchQuery) params.append('search', searchQuery);
            if (selectedCity && selectedCity !== 'Toutes les villes') params.append('city', selectedCity);
            if (selectedAvailability) params.append('availability', selectedAvailability);
            if (minRate) params.append('minRate', minRate);
            if (maxRate) params.append('maxRate', maxRate);

            const res = await fetch(`/api/freelances?${params.toString()}`);
            const data = await res.json();

            if (res.ok) {
                setFreelances(data.freelances || []);
            } else {
                console.error('Erreur:', data.error);
                setFreelances([]);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des freelances:', error);
            setFreelances([]);
        } finally {
            setLoading(false);
        }
    };

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setSelectedCity('');
        setSelectedAvailability('');
        setMinRate('');
        setMaxRate('');
    };

    return (
        <div className={styles.page}>
            {/* Navigation */}
            <nav className={styles.nav}>
                <div className="container">
                    <Link href="/" className={styles.logo}>
                        <span className={styles.logoText}>Freelance</span>
                        <span className={styles.logoAccent}>Togo</span>
                    </Link>
                </div>
            </nav>

            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <h1>Trouver un freelance</h1>
                    <p>Découvrez les meilleurs talents du Togo</p>
                </div>

                {/* Filters */}
                <div className={styles.filtersSection}>
                    <div className={styles.searchBar}>
                        <input
                            type="text"
                            placeholder="Rechercher par nom, compétence, titre..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    <div className={styles.filters}>
                        <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className={styles.select}
                        >
                            <option value="">Toutes les villes</option>
                            {cities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>

                        <select
                            value={selectedAvailability}
                            onChange={(e) => setSelectedAvailability(e.target.value)}
                            className={styles.select}
                        >
                            <option value="">Disponibilité</option>
                            <option value="disponible">Disponible</option>
                            <option value="occupé">Occupé</option>
                            <option value="bientôt disponible">Bientôt disponible</option>
                        </select>

                        <div className={styles.rateFilter}>
                            <input
                                type="number"
                                placeholder="Tarif min (FCFA)"
                                value={minRate}
                                onChange={(e) => setMinRate(e.target.value)}
                                className={styles.rateInput}
                            />
                            <span>-</span>
                            <input
                                type="number"
                                placeholder="Tarif max (FCFA)"
                                value={maxRate}
                                onChange={(e) => setMaxRate(e.target.value)}
                                className={styles.rateInput}
                            />
                        </div>

                        <button onClick={resetFilters} className={styles.resetBtn}>
                            Réinitialiser
                        </button>
                    </div>
                </div>

                {/* Results */}
                <div className={styles.results}>
                    <div className={styles.resultsHeader}>
                        <p>{freelances.length} freelance{freelances.length > 1 ? 's' : ''} trouvé{freelances.length > 1 ? 's' : ''}</p>
                    </div>

                    {loading ? (
                        <div className={styles.loading}>
                            <p>Chargement...</p>
                        </div>
                    ) : (
                        <>
                            <div className={styles.grid}>
                                {freelances.map((freelance) => (
                                    <Link
                                        key={freelance.id}
                                        href={`/freelances/${freelance.id}`}
                                        className={styles.card}
                                    >
                                        <div className={styles.cardHeader}>
                                            <div className={styles.avatar}>
                                                {freelance.image ? (
                                                    <img src={freelance.image} alt={freelance.name} />
                                                ) : (
                                                    <div className={styles.avatarPlaceholder}>
                                                        {freelance.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className={styles.cardInfo}>
                                                <h3>{freelance.name}</h3>
                                                <p className={styles.title}>{freelance.title}</p>
                                            </div>
                                        </div>

                                        <div className={styles.rating}>
                                            <span className={styles.stars}>⭐ {freelance.rating}</span>
                                            <span className={styles.reviews}>({freelance.reviews} avis)</span>
                                        </div>

                                        <div className={styles.skills}>
                                            {freelance.skills.slice(0, 3).map((skill, idx) => (
                                                <span key={idx} className={styles.skill}>{skill}</span>
                                            ))}
                                            {freelance.skills.length > 3 && (
                                                <span className={styles.skillMore}>+{freelance.skills.length - 3}</span>
                                            )}
                                        </div>

                                        <div className={styles.cardFooter}>
                                            <div className={styles.location}>
                                                📍 {freelance.city}
                                            </div>
                                            <div className={styles.rate}>
                                                {freelance.hourlyRate.toLocaleString()} FCFA/h
                                            </div>
                                        </div>

                                        <div className={styles.availability}>
                                            <span className={`${styles.badge} ${styles[freelance.availability.replace(' ', '-')]}`}>
                                                {freelance.availability}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {freelances.length === 0 && !loading && (
                                <div className={styles.noResults}>
                                    <p>Aucun freelance trouvé avec ces critères</p>
                                    <button onClick={resetFilters} className="btn btn-primary">
                                        Réinitialiser les filtres
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
