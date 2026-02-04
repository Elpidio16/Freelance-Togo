'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/Toast/ToastProvider';
import Link from 'next/link';
import styles from './new-project.module.css';

const skillSuggestions = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Django', 'PHP', 'Laravel',
    'Java', 'Spring Boot', 'C#', '.NET', 'Ruby', 'Rails', 'Go', 'Rust',
    'TypeScript', 'Vue.js', 'Angular', 'Next.js', 'Express', 'MongoDB',
    'PostgreSQL', 'MySQL', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
    'DevOps', 'CI/CD', 'Git', 'REST API', 'GraphQL', 'Mobile', 'Flutter',
    'React Native', 'iOS', 'Android', 'UI/UX Design', 'Figma', 'Adobe XD',
];

export default function NewProjectPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { addToast } = useToast();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        skills: [],
        budget: { min: '', max: '' },
        projectType: 'fixed',
        deadline: '',
        location: 'Remote',
        experienceLevel: 'any',
    });
    const [skillInput, setSkillInput] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect if not company
    if (status === 'authenticated' && session?.user?.role !== 'company') {
        router.push('/dashboard');
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('budget.')) {
            const budgetField = name.split('.')[1];
            setFormData({
                ...formData,
                budget: { ...formData.budget, [budgetField]: value },
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const addSkill = (skill) => {
        if (skill && !formData.skills.includes(skill)) {
            setFormData({ ...formData, skills: [...formData.skills, skill] });
            setSkillInput('');
        }
    };

    const removeSkill = (skill) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter((s) => s !== skill),
        });
    };

    const nextStep = () => {
        if (step === 1) {
            if (!formData.title || !formData.description) {
                addToast('Veuillez remplir tous les champs', 'error');
                return;
            }
        } else if (step === 2) {
            if (formData.skills.length === 0) {
                addToast('Ajoutez au moins une compétence', 'error');
                return;
            }
        } else if (step === 3) {
            if (!formData.budget.min || !formData.budget.max || !formData.deadline) {
                addToast('Veuillez remplir tous les champs', 'error');
                return;
            }
            if (parseInt(formData.budget.min) > parseInt(formData.budget.max)) {
                addToast('Le budget minimum ne peut pas être supérieur au maximum', 'error');
                return;
            }
        }
        setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    budget: {
                        min: parseInt(formData.budget.min),
                        max: parseInt(formData.budget.max),
                        currency: 'FCFA',
                    },
                }),
            });

            const data = await res.json();

            if (res.ok) {
                addToast('✅ Projet publié avec succès !', 'success');
                router.push('/projects');
            } else {
                addToast(data.error || 'Erreur lors de la création du projet', 'error');
            }
        } catch (error) {
            addToast('Une erreur est survenue', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading') {
        return <div className={styles.loading}>Chargement...</div>;
    }

    return (
        <div className={styles.page}>
            <nav className={styles.nav}>
                <div className="container">
                    <Link href="/" className={styles.logo}>
                        <span className={styles.logoText}>Freelance</span>
                        <span className={styles.logoAccent}>Togo</span>
                    </Link>
                </div>
            </nav>

            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Publier un nouveau projet</h1>
                    <p>Trouvez le freelance parfait pour votre projet</p>
                </div>

                <div className={styles.progressBar}>
                    <div className={`${styles.progressStep} ${step >= 1 ? styles.active : ''}`}>
                        <div className={styles.stepNumber}>1</div>
                        <span>Description</span>
                    </div>
                    <div className={`${styles.progressStep} ${step >= 2 ? styles.active : ''}`}>
                        <div className={styles.stepNumber}>2</div>
                        <span>Compétences</span>
                    </div>
                    <div className={`${styles.progressStep} ${step >= 3 ? styles.active : ''}`}>
                        <div className={styles.stepNumber}>3</div>
                        <span>Budget</span>
                    </div>
                    <div className={`${styles.progressStep} ${step >= 4 ? styles.active : ''}`}>
                        <div className={styles.stepNumber}>4</div>
                        <span>Publier</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {step === 1 && (
                        <div className={styles.stepContent}>
                            <h2>Description du projet</h2>
                            <div className={styles.inputGroup}>
                                <label>Titre du projet *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Ex: Développement d'une application mobile"
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Description complète *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={8}
                                    placeholder="Décrivez votre projet en détail..."
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className={styles.stepContent}>
                            <h2>Compétences requises</h2>
                            <div className={styles.inputGroup}>
                                <label>Ajouter des compétences</label>
                                <div className={styles.skillInput}>
                                    <input
                                        type="text"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addSkill(skillInput);
                                            }
                                        }}
                                        placeholder="Tapez une compétence..."
                                    />
                                    <button
                                        type="button"
                                        onClick={() => addSkill(skillInput)}
                                        className="btn btn-outline"
                                    >
                                        Ajouter
                                    </button>
                                </div>
                            </div>

                            {formData.skills.length > 0 && (
                                <div className={styles.selectedSkills}>
                                    {formData.skills.map((skill) => (
                                        <span key={skill} className={styles.skillTag}>
                                            {skill}
                                            <button type="button" onClick={() => removeSkill(skill)}>×</button>
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className={styles.skillSuggestions}>
                                <p>Suggestions :</p>
                                <div className={styles.suggestions}>
                                    {skillSuggestions
                                        .filter((s) => !formData.skills.includes(s))
                                        .slice(0, 15)
                                        .map((skill) => (
                                            <button
                                                key={skill}
                                                type="button"
                                                onClick={() => addSkill(skill)}
                                                className={styles.suggestionBtn}
                                            >
                                                + {skill}
                                            </button>
                                        ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className={styles.stepContent}>
                            <h2>Budget et délais</h2>
                            <div className={styles.inputGroup}>
                                <label>Type de projet</label>
                                <select name="projectType" value={formData.projectType} onChange={handleChange}>
                                    <option value="fixed">Prix fixe</option>
                                    <option value="hourly">Tarif horaire</option>
                                </select>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.inputGroup}>
                                    <label>Budget minimum (FCFA) *</label>
                                    <input
                                        type="number"
                                        name="budget.min"
                                        value={formData.budget.min}
                                        onChange={handleChange}
                                        min="0"
                                        required
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Budget maximum (FCFA) *</label>
                                    <input
                                        type="number"
                                        name="budget.max"
                                        value={formData.budget.max}
                                        onChange={handleChange}
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Date limite *</label>
                                <input
                                    type="date"
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>

                            <div className={styles.row}>
                                <div className={styles.inputGroup}>
                                    <label>Localisation</label>
                                    <select name="location" value={formData.location} onChange={handleChange}>
                                        <option value="Remote">Remote</option>
                                        <option value="Lomé">Lomé</option>
                                        <option value="Kara">Kara</option>
                                        <option value="Sokodé">Sokodé</option>
                                        <option value="Atakpamé">Atakpamé</option>
                                    </select>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Niveau d'expérience</label>
                                    <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange}>
                                        <option value="any">Tous niveaux</option>
                                        <option value="junior">Junior</option>
                                        <option value="intermediate">Intermédiaire</option>
                                        <option value="senior">Senior</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className={styles.stepContent}>
                            <h2>Récapitulatif</h2>
                            <div className={styles.summary}>
                                <div className={styles.summaryItem}>
                                    <strong>Titre:</strong> {formData.title}
                                </div>
                                <div className={styles.summaryItem}>
                                    <strong>Description:</strong> {formData.description}
                                </div>
                                <div className={styles.summaryItem}>
                                    <strong>Compétences:</strong> {formData.skills.join(', ')}
                                </div>
                                <div className={styles.summaryItem}>
                                    <strong>Budget:</strong> {parseInt(formData.budget.min).toLocaleString()} - {parseInt(formData.budget.max).toLocaleString()} FCFA
                                </div>
                                <div className={styles.summaryItem}>
                                    <strong>Type:</strong> {formData.projectType === 'fixed' ? 'Prix fixe' : 'Tarif horaire'}
                                </div>
                                <div className={styles.summaryItem}>
                                    <strong>Deadline:</strong> {new Date(formData.deadline).toLocaleDateString('fr-FR')}
                                </div>
                                <div className={styles.summaryItem}>
                                    <strong>Localisation:</strong> {formData.location}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={styles.actions}>
                        {step > 1 && (
                            <button type="button" onClick={prevStep} className="btn btn-outline">
                                Précédent
                            </button>
                        )}
                        {step < 4 ? (
                            <button type="button" onClick={nextStep} className="btn btn-primary">
                                Suivant
                            </button>
                        ) : (
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Publication...' : 'Publier le projet'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
