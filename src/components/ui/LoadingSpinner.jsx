import styles from './LoadingSpinner.module.css';

/**
 * Composant LoadingSpinner réutilisable
 * 
 * @param {Object} props
 * @param {string} props.size - Taille: 'sm', 'md', 'lg', 'xl' (défaut: 'md')
 * @param {string} props.color - Couleur: 'primary', 'white', 'gray' (défaut: 'primary')
 * @param {string} props.text - Texte optionnel à afficher sous le spinner
 * @param {boolean} props.fullPage - Si true, centre le spinner sur toute la page
 */
export default function LoadingSpinner({
    size = 'md',
    color = 'primary',
    text = '',
    fullPage = false
}) {
    const spinnerClasses = `${styles.spinner} ${styles[size]} ${styles[color]}`;

    const content = (
        <div className={styles.container}>
            <div className={spinnerClasses}>
                <div className={styles.circle}></div>
                <div className={styles.circle}></div>
                <div className={styles.circle}></div>
                <div className={styles.circle}></div>
            </div>
            {text && <p className={styles.text}>{text}</p>}
        </div>
    );

    if (fullPage) {
        return <div className={styles.fullPage}>{content}</div>;
    }

    return content;
}
