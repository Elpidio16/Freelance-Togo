'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './search.module.css';

const cities = [
    'Lomé', 'Kara', 'Sokodé', 'Atakpamé', 'Kpalimé',
    'Dapaong', 'Tsévié', 'Aného', 'Bassar', 'Tabligbo', 'Niamtougou',
    'Bafilo', 'Kandé', 'Vogan', 'Badou', 'Mango', 'Pagouda',
    'Sotouboua', 'Blitta', 'Tandjouaré', 'Cinkassé', 'Kévé', 'Agou'
];

export default function FreelanceSearchPage() {
    const [engineers, setEngineers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedAvailability, setSelectedAvailability] = useState('');
    const [minRate, setMinRate] = useState('');
    const [maxRate, setMaxRate] = useState('');

    // Charger les ingénieurs depuis l'API
    useEffect(() => {
        fetchEngineers();
    }, [searchQuery, selectedCategory, selectedCity, selectedAvailability, minRate, maxRate]);

    const fetchEngineers = async () => {
        setLoading(true);
        try {
            // Construire les query params
            const params = new URLSearchParams();
            if (searchQuery) params.append('search', searchQuery);
            if (selectedCategory) params.append('category', selectedCategory);
            if (selectedCity && selectedCity !== 'Toutes les villes') params.append('city', selectedCity);
            if (selectedAvailability) params.append('availability', selectedAvailability);
            if (minRate) params.append('minRate', minRate);
            if (maxRate) params.append('maxRate', maxRate);

            const res = await fetch(`/api/freelances?${params.toString()}`);
            const data = await res.json();

            if (res.ok) {
                setEngineers(data.freelances || []);
            } else {
                console.error('Erreur:', data.error);
                setEngineers([]);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des ingénieurs:', error);
            setEngineers([]);
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
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <h1>Trouver un ingénieur</h1>
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
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className={styles.select}
                        >
                            <option value="">Toutes les catégories</option>
                            <option value="Informatique & IT">Informatique & IT</option>
                            <option value="Génie Civil">Génie Civil</option>
                            <option value="Génie Électrique">Génie Électrique</option>
                            <option value="Génie Mécanique">Génie Mécanique</option>
                            <option value="Télécommunications">Télécommunications</option>
                            <option value="Génie Industriel">Génie Industriel</option>
                        </select>

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
                        <p>{engineers.length} ingénieur{engineers.length > 1 ? 's' : ''} trouvé{engineers.length > 1 ? 's' : ''}</p>
                    </div>

                    {loading ? (
                        <div className={styles.loading}>
                            <p>Chargement...</p>
                        </div>
                    ) : (
                        <>
                            <div className={styles.grid}>
                                {engineers.map((engineer) => (
                                    <Link
                                        key={engineer.id}
                                        href={`/freelances/${engineer.id}`}
                                        className={styles.card}
                                    >
                                        <div className={styles.cardHeader}>
                                            <div className={styles.avatar}>
                                                {engineer.image ? (
                                                    <img src={engineer.image} alt={engineer.name} />
                                                ) : (
                                                    <div className={styles.avatarPlaceholder}>
                                                        {engineer.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className={styles.cardInfo}>
                                                <h3>{engineer.name}</h3>
                                                <p className={styles.title}>{engineer.title}</p>
                                            </div>
                                        </div>

                                        <div className={styles.rating}>
                                            <span className={styles.stars}>⭐ {engineer.rating}</span>
                                            <span className={styles.reviews}>({engineer.reviews} avis)</span>
                                        </div>

                                        <div className={styles.skills}>
                                            {engineer.skills.slice(0, 3).map((skill, idx) => (
                                                <span key={idx} className={styles.skill}>{skill}</span>
                                            ))}
                                            {engineer.skills.length > 3 && (
                                                <span className={styles.skillMore}>+{engineer.skills.length - 3}</span>
                                            )}
                                        </div>

                                        <div className={styles.cardFooter}>
                                            <div className={styles.location}>
                                                📍 {engineer.city}
                                            </div>
                                            <div className={styles.rate}>
                                                {engineer.hourlyRate.toLocaleString()} FCFA/h
                                            </div>
                                        </div>

                                        <div className={styles.availability}>
                                            <span className={`${styles.badge} ${styles[engineer.availability.replace(' ', '-')]}`}>
                                                {engineer.availability}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {engineers.length === 0 && !loading && (
                                <div className={styles.noResults}>
                                    <p>Aucun ingénieur trouvé avec ces critères</p>
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
