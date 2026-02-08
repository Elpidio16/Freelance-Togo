'use client';

import Link from 'next/link';
import styles from '../legal.module.css';

export default function CookiesPage() {
    return (
        <div className={styles.page}>
            <div className="container">
                <div className={styles.header}>
                    <h1>Politique des Cookies</h1>
                    <p className={styles.lastUpdated}>Dernière mise à jour : 8 février 2026</p>
                </div>

                <div className={styles.content}>
                    <section className={styles.section}>
                        <h2>1. Qu'est-ce qu'un cookie ?</h2>
                        <p>
                            Un cookie est un petit fichier texte stocké sur votre appareil (ordinateur, tablette, smartphone)
                            lorsque vous visitez un site web. Les cookies permettent au site de mémoriser vos actions et
                            préférences sur une période donnée.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>2. Pourquoi utilisons-nous des cookies ?</h2>
                        <p>
                            IngeniHub utilise des cookies pour améliorer votre expérience utilisateur et assurer le
                            bon fonctionnement de la plateforme. Les cookies nous permettent de :
                        </p>
                        <ul>
                            <li>Maintenir votre session de connexion</li>
                            <li>Mémoriser vos préférences (langue, paramètres d'affichage)</li>
                            <li>Analyser l'utilisation de la plateforme pour l'améliorer</li>
                            <li>Assurer la sécurité de votre compte</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>3. Types de cookies utilisés</h2>

                        <h3>3.1 Cookies strictement nécessaires</h3>
                        <p>
                            Ces cookies sont essentiels au fonctionnement de la plateforme. Ils vous permettent de naviguer
                            sur le site et d'utiliser ses fonctionnalités de base.
                        </p>
                        <ul>
                            <li><strong>next-auth.session-token</strong> : Gère votre session de connexion</li>
                            <li><strong>next-auth.csrf-token</strong> : Protection contre les attaques CSRF</li>
                            <li><strong>cookieConsent</strong> : Mémorise votre choix concernant les cookies</li>
                        </ul>

                        <h3>3.2 Cookies de performance</h3>
                        <p>
                            Ces cookies collectent des informations sur la façon dont vous utilisez notre plateforme,
                            comme les pages que vous visitez le plus souvent. Ces données nous aident à améliorer le
                            fonctionnement du site.
                        </p>

                        <h3>3.3 Cookies fonctionnels</h3>
                        <p>
                            Ces cookies permettent au site de mémoriser vos choix (comme votre nom d'utilisateur, votre
                            langue ou votre région) et offrent des fonctionnalités améliorées et personnalisées.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>4. Durée de conservation des cookies</h2>
                        <p>Les cookies que nous utilisons ont différentes durées de vie :</p>
                        <ul>
                            <li><strong>Cookies de session</strong> : Supprimés lorsque vous fermez votre navigateur</li>
                            <li><strong>Cookies persistants</strong> : Restent sur votre appareil pendant une durée déterminée (généralement 30 jours à 1 an)</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>5. Cookies tiers</h2>
                        <p>
                            Certains cookies sont placés par des services tiers que nous utilisons pour améliorer notre
                            plateforme :
                        </p>
                        <ul>
                            <li><strong>Vercel Analytics</strong> : Pour analyser les performances du site</li>
                            <li><strong>Cloudinary</strong> : Pour la gestion des images</li>
                        </ul>
                        <p>
                            Ces services tiers ont leurs propres politiques de confidentialité et de cookies. Nous vous
                            encourageons à les consulter.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>6. Comment gérer les cookies ?</h2>

                        <h3>6.1 Via notre bannière de consentement</h3>
                        <p>
                            Lors de votre première visite, une bannière vous permet d'accepter ou de refuser les cookies
                            non essentiels. Vous pouvez modifier votre choix à tout moment en supprimant les cookies de
                            votre navigateur.
                        </p>

                        <h3>6.2 Via votre navigateur</h3>
                        <p>
                            Vous pouvez configurer votre navigateur pour refuser tous les cookies ou pour vous avertir
                            lorsqu'un cookie est envoyé. Voici comment procéder pour les navigateurs les plus courants :
                        </p>
                        <ul>
                            <li><strong>Chrome</strong> : Paramètres → Confidentialité et sécurité → Cookies et autres données de sites</li>
                            <li><strong>Firefox</strong> : Paramètres → Vie privée et sécurité → Cookies et données de sites</li>
                            <li><strong>Safari</strong> : Préférences → Confidentialité → Cookies et données de sites web</li>
                            <li><strong>Edge</strong> : Paramètres → Cookies et autorisations de site → Cookies et données de sites</li>
                        </ul>
                        <p>
                            <strong>Note :</strong> La désactivation de certains cookies peut affecter le fonctionnement
                            de la plateforme et limiter votre accès à certaines fonctionnalités.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>7. Cookies et données personnelles</h2>
                        <p>
                            Certains cookies peuvent contenir des données personnelles, notamment si vous êtes connecté
                            à votre compte. Ces données sont traitées conformément à notre{' '}
                            <Link href="/legal/privacy">Politique de Confidentialité</Link> et au RGPD.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>8. Modifications de cette politique</h2>
                        <p>
                            Nous pouvons mettre à jour cette Politique des Cookies pour refléter les changements dans
                            nos pratiques ou pour d'autres raisons opérationnelles, légales ou réglementaires. Nous vous
                            encourageons à consulter régulièrement cette page.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>9. Contact</h2>
                        <p>
                            Pour toute question concernant notre utilisation des cookies, vous pouvez nous contacter à :
                        </p>
                        <ul>
                            <li><strong>Email :</strong> privacy@ingenihub.com</li>
                            <li><strong>Adresse :</strong> Lomé, Togo</li>
                        </ul>
                    </section>
                </div>

                <div className={styles.footer}>
                    <Link href="/" className="btn btn-outline">
                        Retour à l'accueil
                    </Link>
                    <Link href="/legal/privacy" className="btn btn-primary">
                        Politique de confidentialité
                    </Link>
                </div>
            </div>
        </div>
    );
}
