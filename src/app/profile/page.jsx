'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';


export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        } else if (status === 'authenticated') {
            fetchProfile();
        }
    }, [status]);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/profile/freelance');
            if (res.ok) {
                const data = await res.json();
                setProfile(data.profile);
            } else {
                // Pas de profil, rediriger vers la création
                router.push('/profile/setup');
            }
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p>Chargement...</p>
            </div>
        );
    }

    if (!session) return null;

    if (!profile) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h1>Aucun profil trouvé</h1>
                <Link href="/profile/setup" className="btn btn-primary">
                    Créer mon profil
                </Link>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>Mon Profil</h1>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', marginTop: '2rem' }}>
                <h2>{profile.title}</h2>
                <p>{profile.bio}</p>
                <div style={{ marginTop: '1rem' }}>
                    <strong>Compétences:</strong> {profile.skills.join(', ')}
                </div>
                <div style={{ marginTop: '2rem' }}>
                    <Link href="/dashboard" className="btn btn-outline">
                        Retour au dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
