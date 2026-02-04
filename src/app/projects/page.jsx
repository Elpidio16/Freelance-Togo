'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProjectsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        } else if (status === 'authenticated') {
            if (session.user.role === 'freelance') {
                router.push('/projects/browse');
            } else {
                fetchMyProjects();
            }
        }
    }, [status, session]);

    const fetchMyProjects = async () => {
        try {
            const res = await fetch('/api/projects/my-projects');
            if (res.ok) {
                const data = await res.json();
                setProjects(data.projects || []);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading' || loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>;
    }

    if (!session) return null;

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Mes Projets</h1>
                <Link href="/projects/new" className="btn btn-primary">
                    + Nouveau projet
                </Link>
            </div>

            {projects.length === 0 ? (
                <div style={{ background: 'white', padding: '3rem', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💼</div>
                    <h2>Aucun projet publié</h2>
                    <p style={{ color: '#666', marginTop: '1rem' }}>
                        Créez votre premier projet pour trouver des talents freelances.
                    </p>
                    <div style={{ marginTop: '2rem' }}>
                        <Link href="/projects/new" className="btn btn-primary">
                            Publier un projet
                        </Link>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {projects.map((project) => (
                        <Link
                            key={project._id}
                            href={`/projects/${project._id}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                <h3 style={{ margin: '0 0 0.5rem 0' }}>{project.title}</h3>
                                <p style={{ color: '#666', margin: '0 0 1rem 0' }}>
                                    {project.description.substring(0, 150)}...
                                </p>
                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#999' }}>
                                    <span>📍 {project.location}</span>
                                    <span>💰 {project.budget?.min?.toLocaleString()} - {project.budget?.max?.toLocaleString()} FCFA</span>
                                    <span className={`badge badge-${project.status}`}>{project.status}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            <div style={{ marginTop: '2rem' }}>
                <Link href="/dashboard" className="btn btn-outline">
                    Retour au dashboard
                </Link>
            </div>
        </div>
    );
}
