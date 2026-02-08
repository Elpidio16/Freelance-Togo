'use client';

import Link from 'next/link';
import styles from '../legal.module.css';

export default function TermsPage() {
    return (
        <div className={styles.page}>
            <div className="container">
                <div className={styles.header}>
                    <h1>Conditions Générales d'Utilisation</h1>
                    <p className={styles.lastUpdated}>Dernière mise à jour : 8 février 2026</p>
                </div>

                <div className={styles.content}>
                    <section className={styles.section}>
                        <h2>1. Présentation de la plateforme</h2>
                        <p>
                            IngeniHub est une plateforme de mise en relation entre ingénieurs et entreprises au Togo,
                            spécialisée dans les domaines de l'ingénierie. La plateforme permet aux entreprises de publier
                            des projets et aux ingénieurs de postuler à ces projets.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>2. Acceptation des conditions</h2>
                        <p>
                            En accédant et en utilisant IngeniHub, vous acceptez d'être lié par les présentes
                            Conditions Générales d'Utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas
                            utiliser notre plateforme.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>3. Inscription et compte utilisateur</h2>

                        <h3>3.1 Création de compte</h3>
                        <p>
                            Pour utiliser certaines fonctionnalités de la plateforme, vous devez créer un compte.
                            Vous vous engagez à fournir des informations exactes, complètes et à jour.
                        </p>

                        <h3>3.2 Types de comptes</h3>
                        <ul>
                            <li><strong>Compte Ingénieur :</strong> Pour les professionnels souhaitant proposer leurs services</li>
                            <li><strong>Compte Entreprise :</strong> Pour les entreprises souhaitant publier des projets</li>
                        </ul>

                        <h3>3.3 Sécurité du compte</h3>
                        <p>
                            Vous êtes responsable de la confidentialité de vos identifiants de connexion et de toutes
                            les activités effectuées sous votre compte. Vous devez nous informer immédiatement de toute
                            utilisation non autorisée de votre compte.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>4. Utilisation de la plateforme</h2>

                        <h3>4.1 Pour les entreprises</h3>
                        <ul>
                            <li>Publier des projets avec des descriptions précises et complètes</li>
                            <li>Examiner les candidatures des freelances</li>
                            <li>Communiquer de manière professionnelle avec les freelances</li>
                            <li>Respecter les engagements pris envers les freelances sélectionnés</li>
                        </ul>

                        <h3>4.2 Pour les freelances</h3>
                        <ul>
                            <li>Créer un profil professionnel complet et véridique</li>
                            <li>Postuler aux projets correspondant à vos compétences</li>
                            <li>Respecter les délais et engagements pris</li>
                            <li>Fournir un travail de qualité professionnelle</li>
                        </ul>

                        <h3>4.3 Comportements interdits</h3>
                        <p>Il est strictement interdit de :</p>
                        <ul>
                            <li>Publier du contenu illégal, offensant ou inapproprié</li>
                            <li>Usurper l'identité d'une autre personne ou entité</li>
                            <li>Tenter de contourner les systèmes de sécurité de la plateforme</li>
                            <li>Utiliser la plateforme pour des activités frauduleuses</li>
                            <li>Harceler, menacer ou intimider d'autres utilisateurs</li>
                            <li>Extraire ou copier des données de la plateforme de manière automatisée</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>5. Propriété intellectuelle</h2>
                        <p>
                            Tous les contenus présents sur Freelance Togo (textes, graphiques, logos, images, etc.)
                            sont la propriété de Freelance Togo ou de ses concédants de licence et sont protégés par
                            les lois sur la propriété intellectuelle.
                        </p>
                        <p>
                            Les utilisateurs conservent la propriété du contenu qu'ils publient sur la plateforme,
                            mais accordent à Freelance Togo une licence non exclusive pour utiliser, afficher et
                            distribuer ce contenu dans le cadre du fonctionnement de la plateforme.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>6. Relations contractuelles</h2>
                        <p>
                            Freelance Togo est une plateforme de mise en relation. Les contrats de prestation sont
                            conclus directement entre les entreprises et les freelances. Freelance Togo n'est pas
                            partie à ces contrats et n'assume aucune responsabilité quant à leur exécution.
                        </p>
                        <p>
                            Nous recommandons fortement aux parties de formaliser leurs accords par écrit et de
                            définir clairement les modalités de collaboration, les livrables, les délais et la
                            rémunération.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>7. Paiements et frais</h2>
                        <p>
                            Les modalités de paiement sont convenues directement entre l'entreprise et le freelance.
                            Freelance Togo peut prélever des frais de service sur les transactions effectuées via la
                            plateforme, selon les conditions tarifaires en vigueur.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>8. Avis et évaluations</h2>
                        <p>
                            Les utilisateurs peuvent laisser des avis sur les freelances avec lesquels ils ont
                            collaboré. Ces avis doivent être honnêtes, constructifs et basés sur une expérience réelle.
                        </p>
                        <p>
                            Freelance Togo se réserve le droit de modérer ou de supprimer les avis qui ne respectent
                            pas ces critères ou qui contiennent du contenu inapproprié.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>9. Résiliation</h2>
                        <p>
                            Vous pouvez fermer votre compte à tout moment en nous contactant. IngeniHub se
                            réserve le droit de suspendre ou de résilier votre compte en cas de violation des
                            présentes conditions, sans préavis et sans remboursement.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>10. Limitation de responsabilité</h2>
                        <p>
                            Freelance Togo fournit la plateforme "en l'état" et ne garantit pas qu'elle sera
                            exempte d'erreurs ou disponible en permanence. Nous ne sommes pas responsables des
                            dommages directs ou indirects résultant de l'utilisation de la plateforme.
                        </p>
                        <p>
                            Nous ne sommes pas responsables de la qualité des services fournis par les freelances,
                            ni du comportement des utilisateurs de la plateforme.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>11. Protection des données</h2>
                        <p>
                            L'utilisation de vos données personnelles est régie par notre{' '}
                            <Link href="/legal/privacy">Politique de Confidentialité</Link>.
                            En utilisant IngeniHub, vous acceptez le traitement de vos données conformément
                            à cette politique.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>12. Modifications des conditions</h2>
                        <p>
                            Freelance Togo se réserve le droit de modifier les présentes Conditions Générales
                            d'Utilisation à tout moment. Les modifications entreront en vigueur dès leur publication
                            sur la plateforme. Votre utilisation continue de la plateforme après ces modifications
                            constitue votre acceptation des nouvelles conditions.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>13. Droit applicable et juridiction</h2>
                        <p>
                            Les présentes Conditions Générales d'Utilisation sont régies par le droit togolais.
                            Tout litige relatif à l'interprétation ou à l'exécution des présentes sera soumis à
                            la compétence exclusive des tribunaux de Lomé, Togo.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>14. Contact</h2>
                        <p>
                            Pour toute question concernant ces Conditions Générales d'Utilisation, vous pouvez
                            nous contacter à :
                        </p>
                        <ul>
                            <li><strong>Email :</strong> legal@ingenihub.com</li>
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
