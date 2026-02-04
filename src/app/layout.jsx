import './globals.css';
import { ToastProvider } from '@/components/Toast/ToastProvider';
import { Providers } from '@/components/Providers';

export const metadata = {
    title: 'Freelance Togo - Trouvez les meilleurs ingénieurs freelances au Togo',
    description: 'Plateforme de mise en relation entre ingénieurs freelances et entreprises au Togo',
};

export default function RootLayout({ children }) {
    return (
        <html lang="fr">
            <body>
                <Providers>
                    <ToastProvider>
                        {children}
                    </ToastProvider>
                </Providers>
            </body>
        </html>
    );
}
