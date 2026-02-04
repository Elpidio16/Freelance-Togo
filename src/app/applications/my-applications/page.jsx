'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function MyApplicationsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        } else if (status === 'authenticated') {
            if (session.user.role !== 'freelance') {
                router.push('/dashboard');
            } else {
                fetchApplications();
            }
        }
    }, [status, session]);

    const fetchApplications = async () => {
        try {
            const res = await fetch('/api/applications/my-applications');
            if (res.ok) {
                const data = await res.json();
                setApplications(data.applications || []);
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

    const getStatusBadge = (status) => {
        const styles = {
            pending: { bg: '#fef5f1', color: '#e67e50', text: 'En attente' },
            accepted: { bg: '#e8f5e9', color: '#4caf50', text: 'Acceptée ✓' },
            rejected: { bg: '#ffebee', color: '#f44336', text: 'Refusée' },
        };
        const style = styles[status] || styles.pending;
        return (
            <span style={{
                background: style.bg,
                color: style.color,
                padding: '0.5rem 1rem',
                borderRadius: '999px',
                fontSize: '0.85rem',
                fontWeight: 600,
            }}>
                {style.text}
            </span>
        );
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1>Mes candidatures</h1>
                <p style={{ color: '#666', marginTop: '0.5rem' }}>
                    Suivez l'état de vos candidatures aux projets
                </p>
            </div>

            {applications.length === 0 ? (
                <div style={{ background: 'white', padding: '3rem', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
                    <h2>Aucune candidature</h2>
                    <p style={{ color: '#666', marginTop: '1rem' }}>
                        Vous n'avez pas encore postulé à des projets.
                    </p>
                    <div style={{ marginTop: '2rem' }}>
                        <Link href="/projects/browse" className="btn btn-primary">
                            Parcourir les projets
                        </Link>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {applications.map((app) => (
                        <div
                            key={app._id}
                            style={{
                                background: 'white',
                                padding: '2rem',
                                borderRadius: '12px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <Link
                                        href={`/projects/${app.project._id}`}
                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                    >
                                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', color: '#e67e50' }}>
                                            {app.project.title}
                                        </h3>
                                    </Link>
                                    <p style={{ color: '#999', margin: 0, fontSize: '0.9rem' }}>
                                        Postulé le {new Date(app.appliedAt).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                                {getStatusBadge(app.status)}
                            </div>

                            <p style={{ color: '#666', marginBottom: '1rem' }}>
                                {app.project.description.substring(0, 150)}...
                            </p>

                            <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                                    <div>
                                        <strong style={{ color: '#666' }}>Votre tarif proposé:</strong>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#e67e50', marginTop: '0.25rem' }}>
                                            {app.proposedRate.toLocaleString()} FCFA
                                        </div>
                                    </div>
                                    <div>
                                        <strong style={{ color: '#666' }}>Durée estimée:</strong>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '0.25rem' }}>
                                            {app.estimatedDuration}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '1rem', marginTop: '1rem' }}>
                                <strong style={{ color: '#666', fontSize: '0.9rem' }}>Votre lettre de motivation:</strong>
                                <p style={{ color: '#333', marginTop: '0.5rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
                                    {app.coverLetter}
                                </p>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', fontSize: '0.9rem', color: '#999' }}>
                                <span>💰 Budget projet: {app.project.budget?.min?.toLocaleString()} - {app.project.budget?.max?.toLocaleString()} FCFA</span>
                                <span>📅 Deadline: {new Date(app.project.deadline).toLocaleDateString('fr-FR')}</span>
                                <span className={`badge badge-${app.project.status}`}>{app.project.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <Link href="/projects/browse" className="btn btn-primary">
                    Parcourir les projets
                </Link>
                <Link href="/dashboard" className="btn btn-outline">
                    Retour au dashboard
                </Link>
            </div>
        </div>
    );
}
