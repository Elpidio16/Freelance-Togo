'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BrowseProjectsPage() {
    const { status } = useSession();
    const router = useRouter();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ search: '', location: 'all' });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        } else if (status === 'authenticated') {
            fetchProjects();
        }
    }, [status]);

    const fetchProjects = async () => {
        try {
            const params = new URLSearchParams({
                status: 'open',
                ...(filters.search && { search: filters.search }),
                ...(filters.location !== 'all' && { location: filters.location }),
            });

            const res = await fetch(`/api/projects?${params}`);
            if (res.ok) {
                const data = await res.json();
                setProjects(data.projects);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === 'authenticated') {
            fetchProjects();
        }
    }, [filters]);

    if (status === 'loading' || loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>;
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>Parcourir les projets</h1>

            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Rechercher un projet..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid #e0e0e0' }}
                    />
                    <select
                        value={filters.location}
                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                        style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid #e0e0e0' }}
                    >
                        <option value="all">Toutes les localisations</option>
                        <option value="Remote">Remote</option>
                        <option value="Lomé">Lomé</option>
                        <option value="Kara">Kara</option>
                        <option value="Sokodé">Sokodé</option>
                    </select>
                </div>
            </div>

            {projects.length === 0 ? (
                <div style={{ background: 'white', padding: '3rem', borderRadius: '12px', textAlign: 'center' }}>
                    <h2>Aucun projet disponible</h2>
                    <p style={{ color: '#666' }}>Revenez plus tard pour voir les nouveaux projets.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {projects.map((project) => (
                        <Link
                            key={project._id}
                            href={`/projects/${project._id}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'transform 0.2s' }}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>{project.title}</h3>
                                    <p style={{ color: '#999', margin: 0 }}>par {project.company?.name}</p>
                                </div>
                                <p style={{ color: '#666', marginBottom: '1rem' }}>
                                    {project.description.substring(0, 200)}...
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                                    {project.skills.slice(0, 5).map((skill) => (
                                        <span key={skill} style={{ background: '#f0f0f0', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.85rem' }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', color: '#999' }}>
                                    <span>💰 {project.budget?.min?.toLocaleString()} - {project.budget?.max?.toLocaleString()} FCFA</span>
                                    <span>📍 {project.location}</span>
                                    <span>📅 {new Date(project.deadline).toLocaleDateString('fr-FR')}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
