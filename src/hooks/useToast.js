'use client';

import { useState, useEffect } from 'react';

export function useToast() {
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    return { showToast, toast };
}
