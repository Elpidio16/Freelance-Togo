'use client';

import { useState } from 'react';
import { useToast } from '@/components/Toast/ToastProvider';
import styles from './ContactModal.module.css';

export default function ContactModal({ freelance, onClose }) {
    const { addToast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    freelanceId: freelance.id,
                    freelanceName: freelance.name,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                addToast('✅ Message envoyé avec succès !', 'success');
                onClose();
            } else {
                addToast(data.error || 'Erreur lors de l\'envoi', 'error');
            }
        } catch (error) {
            addToast('Une erreur est survenue', 'error');
        } finally {
            setSending(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Contacter {freelance.name}</h2>
                    <button onClick={onClose} className={styles.closeBtn}>×</button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>Votre nom *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Téléphone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Sujet *</label>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Ex: Projet de développement web"
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Message *</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={6}
                            placeholder="Décrivez votre projet ou votre besoin..."
                            required
                        />
                    </div>

                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className="btn btn-outline">
                            Annuler
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={sending}>
                            {sending ? 'Envoi...' : 'Envoyer le message'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
