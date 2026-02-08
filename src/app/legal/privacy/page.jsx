'use client';

import Link from 'next/link';
import styles from '../legal.module.css';

export default function PrivacyPage() {
    return (
        <div className={styles.page}>
            <div className="container">
                <div className={styles.header}>
                    <h1>Politique de Confidentialité</h1>
                    <p className={styles.lastUpdated}>Dernière mise à jour : 8 février 2026</p>
                </div>

                <div className={styles.content}>
                    <section className={styles.section}>
                        <h2>1. Introduction</h2>
                        <p>
                            Chez IngeniHub, nous accordons une grande importance à la protection de vos données
                            personnelles. Cette Politique de Confidentialité explique comment nous collectons, utilisons,
                            partageons et protégeons vos informations personnelles conformément au Règlement Général sur
                            la Protection des Données (RGPD) et aux lois togolaises applicables.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>2. Responsable du traitement</h2>
                        <p>
                            Le responsable du traitement de vos données personnelles est :
                        </p>
                        <ul>
                            <li><strong>Nom :</strong> IngeniHub</li>
                            <li><strong>Email :</strong> privacy@ingenihub.com</li>
                            <li><strong>Adresse :</strong> Lomé, Togo</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>3. Données collectées</h2>

                        <h3>3.1 Données d'identification</h3>
                        <ul>
                            <li>Nom et prénom</li>
                            <li>Adresse email</li>
                            <li>Numéro de téléphone</li>
                            <li>Mot de passe (crypté)</li>
                        </ul>

                        <h3>3.2 Données professionnelles (pour les freelances)</h3>
                        <ul>
                            <li>Titre professionnel</li>
                            <li>Compétences et expertises</li>
                            <li>Expérience professionnelle</li>
                            <li>Formations et certifications</li>
                            <li>Portfolio et réalisations</li>
                            <li>Tarifs et disponibilité</li>
                        </ul>

                        <h3>3.3 Données d'entreprise (pour les entreprises)</h3>
                        <ul>
                            <li>Nom de l'entreprise</li>
                            <li>Secteur d'activité</li>
                            <li>Taille de l'entreprise</li>
                            <li>Adresse</li>
                            <li>Site web</li>
                        </ul>

                        <h3>3.4 Données de navigation</h3>
                        <ul>
                            <li>Adresse IP</li>
                            <li>Type de navigateur</li>
                            <li>Pages visitées</li>
                            <li>Durée de visite</li>
                            <li>Cookies (voir section dédiée)</li>
                        </ul>

                        <h3>3.5 Données de communication</h3>
                        <ul>
                            <li>Messages échangés sur la plateforme</li>
                            <li>Candidatures aux projets</li>
                            <li>Avis et évaluations</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>4. Finalités du traitement</h2>
                        <p>Nous utilisons vos données personnelles pour :</p>
                        <ul>
                            <li><strong>Gestion de compte :</strong> Créer et gérer votre compte utilisateur</li>
                            <li><strong>Mise en relation :</strong> Faciliter la connexion entre freelances et entreprises</li>
                            <li><strong>Communication :</strong> Vous envoyer des notifications importantes (nouveaux projets, candidatures, messages)</li>
                            <li><strong>Amélioration du service :</strong> Analyser l'utilisation de la plateforme pour l'améliorer</li>
                            <li><strong>Sécurité :</strong> Prévenir la fraude et protéger la plateforme</li>
                            <li><strong>Obligations légales :</strong> Respecter nos obligations légales et réglementaires</li>
                            <li><strong>Marketing :</strong> Vous envoyer des informations sur nos services (avec votre consentement)</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>5. Base légale du traitement</h2>
                        <p>Nous traitons vos données sur les bases légales suivantes :</p>
                        <ul>
                            <li><strong>Exécution du contrat :</strong> Pour fournir nos services</li>
                            <li><strong>Consentement :</strong> Pour les communications marketing et certains cookies</li>
                            <li><strong>Intérêt légitime :</strong> Pour améliorer nos services et assurer la sécurité</li>
                            <li><strong>Obligation légale :</strong> Pour respecter nos obligations légales</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>6. Partage des données</h2>

                        <h3>6.1 Avec d'autres utilisateurs</h3>
                        <p>
                            Votre profil public (nom, photo, compétences, expérience) est visible par les autres
                            utilisateurs de la plateforme pour faciliter la mise en relation.
                        </p>

                        <h3>6.2 Avec des prestataires de services</h3>
                        <p>Nous partageons vos données avec des prestataires tiers qui nous aident à fournir nos services :</p>
                        <ul>
                            <li><strong>Hébergement :</strong> Vercel (États-Unis)</li>
                            <li><strong>Base de données :</strong> MongoDB Atlas (cloud)</li>
                            <li><strong>Stockage de fichiers :</strong> Cloudinary</li>
                            <li><strong>Envoi d'emails :</strong> Resend</li>
                            <li><strong>Authentification :</strong> NextAuth.js</li>
                        </ul>
                        <p>
                            Ces prestataires sont tenus par des accords de confidentialité et ne peuvent utiliser
                            vos données que pour fournir leurs services.
                        </p>

                        <h3>6.3 Obligations légales</h3>
                        <p>
                            Nous pouvons divulguer vos données si la loi l'exige ou pour protéger nos droits,
                            notre propriété ou notre sécurité.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>7. Transferts internationaux</h2>
                        <p>
                            Certains de nos prestataires de services sont situés en dehors du Togo, notamment aux
                            États-Unis et dans l'Union Européenne. Nous nous assurons que ces transferts sont
                            effectués conformément au RGPD et aux lois applicables, notamment par le biais de
                            clauses contractuelles types.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>8. Durée de conservation</h2>
                        <p>Nous conservons vos données personnelles :</p>
                        <ul>
                            <li><strong>Compte actif :</strong> Tant que votre compte est actif</li>
                            <li><strong>Compte fermé :</strong> 3 ans après la fermeture du compte</li>
                            <li><strong>Données de facturation :</strong> 10 ans (obligation légale)</li>
                            <li><strong>Cookies :</strong> Selon les durées indiquées dans notre politique cookies</li>
                        </ul>
                        <p>
                            Après ces périodes, vos données sont supprimées ou anonymisées, sauf obligation légale
                            de conservation plus longue.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>9. Vos droits</h2>
                        <p>Conformément au RGPD, vous disposez des droits suivants :</p>

                        <h3>9.1 Droit d'accès</h3>
                        <p>Vous pouvez demander une copie de vos données personnelles.</p>

                        <h3>9.2 Droit de rectification</h3>
                        <p>Vous pouvez corriger vos données inexactes ou incomplètes.</p>

                        <h3>9.3 Droit à l'effacement</h3>
                        <p>Vous pouvez demander la suppression de vos données dans certaines conditions.</p>

                        <h3>9.4 Droit à la limitation</h3>
                        <p>Vous pouvez demander la limitation du traitement de vos données.</p>

                        <h3>9.5 Droit à la portabilité</h3>
                        <p>Vous pouvez recevoir vos données dans un format structuré et les transférer à un autre responsable.</p>

                        <h3>9.6 Droit d'opposition</h3>
                        <p>Vous pouvez vous opposer au traitement de vos données pour des raisons légitimes.</p>

                        <h3>9.7 Droit de retirer votre consentement</h3>
                        <p>Vous pouvez retirer votre consentement à tout moment pour les traitements basés sur le consentement.</p>

                        <h3>9.8 Comment exercer vos droits</h3>
                        <p>
                            Pour exercer vos droits, contactez-nous à <strong>privacy@ingenihub.com</strong>.
                            Nous répondrons à votre demande dans un délai d'un mois.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>10. Cookies</h2>
                        <p>
                            Nous utilisons des cookies pour améliorer votre expérience sur la plateforme. Les cookies
                            sont de petits fichiers texte stockés sur votre appareil.
                        </p>

                        <h3>10.1 Types de cookies utilisés</h3>
                        <ul>
                            <li><strong>Cookies essentiels :</strong> Nécessaires au fonctionnement de la plateforme (authentification, sécurité)</li>
                            <li><strong>Cookies de performance :</strong> Pour analyser l'utilisation de la plateforme</li>
                            <li><strong>Cookies fonctionnels :</strong> Pour mémoriser vos préférences</li>
                        </ul>

                        <h3>10.2 Gestion des cookies</h3>
                        <p>
                            Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.
                            Notez que la désactivation de certains cookies peut affecter le fonctionnement de la plateforme.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>11. Sécurité</h2>
                        <p>
                            Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées
                            pour protéger vos données contre la perte, l'utilisation abusive, l'accès non autorisé,
                            la divulgation, l'altération ou la destruction.
                        </p>
                        <p>Ces mesures incluent :</p>
                        <ul>
                            <li>Chiffrement des données sensibles (mots de passe, communications)</li>
                            <li>Connexions sécurisées (HTTPS)</li>
                            <li>Contrôles d'accès stricts</li>
                            <li>Surveillance et détection des intrusions</li>
                            <li>Sauvegardes régulières</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>12. Mineurs</h2>
                        <p>
                            Notre plateforme n'est pas destinée aux personnes de moins de 18 ans. Nous ne collectons
                            pas sciemment de données personnelles auprès de mineurs. Si vous pensez qu'un mineur nous
                            a fourni des données, contactez-nous immédiatement.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>13. Modifications de la politique</h2>
                        <p>
                            Nous pouvons modifier cette Politique de Confidentialité à tout moment. Les modifications
                            seront publiées sur cette page avec une nouvelle date de mise à jour. Nous vous encourageons
                            à consulter régulièrement cette page.
                        </p>
                        <p>
                            En cas de modifications importantes, nous vous en informerons par email ou par notification
                            sur la plateforme.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>14. Contact et réclamations</h2>
                        <p>
                            Pour toute question concernant cette Politique de Confidentialité ou pour exercer vos droits,
                            contactez-nous à :
                        </p>
                        <ul>
                            <li><strong>Email :</strong> privacy@ingenihub.com</li>
                            <li><strong>Adresse :</strong> Lomé, Togo</li>
                        </ul>
                        <p>
                            Vous avez également le droit de déposer une plainte auprès de l'autorité de protection
                            des données compétente au Togo.
                        </p>
                    </section>
                </div>

                <div className={styles.footer}>
                    <Link href="/" className="btn btn-outline">
                        Retour à l'accueil
                    </Link>
                    <Link href="/legal/terms" className="btn btn-primary">
                        Conditions d'utilisation
                    </Link>
                </div>
            </div>
        </div>
    );
}
