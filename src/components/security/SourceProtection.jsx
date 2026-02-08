'use client';

import { useEffect } from 'react';

export default function SourceProtection() {
    useEffect(() => {
        // Désactiver le clic droit
        const handleContextMenu = (e) => {
            e.preventDefault();
            return false;
        };

        // Désactiver les raccourcis clavier
        const handleKeyDown = (e) => {
            // F12
            if (e.key === 'F12') {
                e.preventDefault();
                return false;
            }

            // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (DevTools)
            if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
                e.preventDefault();
                return false;
            }

            // Ctrl+U (View Source)
            if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
                e.preventDefault();
                return false;
            }

            // Ctrl+S (Save)
            if (e.ctrlKey && (e.key === 'S' || e.key === 's')) {
                e.preventDefault();
                return false;
            }

            // Cmd+Option+I (Mac DevTools)
            if (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'i')) {
                e.preventDefault();
                return false;
            }
            // Cmd+Option+U (Mac Source)
            if (e.metaKey && e.altKey && (e.key === 'U' || e.key === 'u')) {
                e.preventDefault();
                return false;
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return null; // Ce composant n'affiche rien
}
