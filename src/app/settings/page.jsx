'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        }
    }, [status]);

    if (status === 'loading') {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>;
    }

    if (!session) return null;

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Paramètres</h1>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', marginTop: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Informations du compte</h2>

                <div style={{ marginBottom: '1rem' }}>
                    <strong>Email:</strong> {session.user.email}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <strong>Nom:</strong> {session.user.firstName} {session.user.lastName}
                </div>
                <div style={{ marginBottom: '2rem' }}>
                    <strong>Rôle:</strong> {session.user.role === 'freelance' ? 'Freelance' : 'Entreprise'}
                </div>

                <div style={{ borderTop: '2px solid #f0f0f0', paddingTop: '2rem', marginTop: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Actions</h3>
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="btn btn-outline"
                        style={{ marginRight: '1rem' }}
                    >
                        Déconnexion
                    </button>
                    <Link href="/dashboard" className="btn btn-primary">
                        Retour au dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
