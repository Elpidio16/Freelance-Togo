'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function ReviewsPage() {
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
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>Mes Évaluations</h1>
            <div style={{ background: 'white', padding: '3rem', borderRadius: '12px', marginTop: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⭐</div>
                <h2>Aucune évaluation pour le moment</h2>
                <p style={{ color: '#666', marginTop: '1rem' }}>
                    Vos avis clients apparaîtront ici une fois que vous aurez terminé vos premiers projets.
                </p>
                <div style={{ marginTop: '2rem' }}>
                    <Link href="/dashboard" className="btn btn-primary">
                        Retour au dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
