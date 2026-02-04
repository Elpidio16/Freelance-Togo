'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();

    useEffect(() => {
        // V1: Redirect directly to freelance registration
        router.push('/auth/register/freelance');
    }, [router]);

    return null;
}
