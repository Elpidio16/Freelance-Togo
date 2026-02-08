import './globals.css';
import { ToastProvider } from '@/components/Toast/ToastProvider';
import { Providers } from '@/components/Providers';
import MobileMenu from '@/components/navigation/MobileMenu';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CookieConsent from '@/components/legal/CookieConsent';
import SourceProtection from '@/components/security/SourceProtection';

export const metadata = {
    title: 'IngeniHub - Trouvez les meilleurs ingénieurs au Togo',
    description: 'Plateforme de mise en relation entre ingénieurs freelances et entreprises au Togo',
};

export default function RootLayout({ children }) {
    return (
        <html lang="fr" suppressHydrationWarning>
            <body>
                <Providers>
                    <ToastProvider>
                        <MobileMenu />
                        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                            <Navbar />
                            <main style={{ flex: 1 }}>
                                {children}
                            </main>
                            <Footer />
                        </div>
                        <CookieConsent />
                        <SourceProtection />
                    </ToastProvider>
                </Providers>
            </body>
        </html>
    );
}
