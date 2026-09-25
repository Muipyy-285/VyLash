import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import { useLanguage } from '../context/LanguageContext';

const Feedback = () => {
    const { t } = useLanguage();
    const [name, setName] = useState('');
    const [rating, setRating] = useState(5);
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const feedbackData = {
                customer_name: name || 'Anonymous',
                content: content,
                rating: parseInt(rating),
                created_at: new Date().toISOString()
            };

            // Insert into Supabase 'feedback' table
            const { error } = await supabase
                .from('feedback')
                .insert([feedbackData]);

            if (error) {
                console.error('Supabase Error:', error);
            }

            setIsSubmitted(true);
            setName('');
            setContent('');
            setRating(5);
        } catch (error) {
            console.error('Connection Error:', error);
            setIsSubmitted(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="container" style={{ paddingTop: '150px', textAlign: 'center' }}>
                <div style={{ marginBottom: '2rem', color: 'var(--color-pink-500)' }}>
                    <CheckCircle size={80} />
                </div>
                <h1 className="text-gradient" style={{ marginBottom: '1rem' }}>{t.feedback.thankYou}</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    {t.feedback.subtitle}
                </p>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '120px', paddingBottom: '50px' }}>
            <h1 className="text-gradient" style={{ marginBottom: '1rem', textAlign: 'center' }}>{t.feedback.title}</h1>
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2.5rem' }}>{t.feedback.subtitle}</p>

            <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{t.contact.yourName}</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t.contact.fullNamePlaceholder || "Your name"}
                            style={{
                                width: '100%',
                                padding: '0.85rem',
                                background: 'rgba(255,255,255,0.7)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: 'var(--radius-sm)',
                                color: 'var(--color-black)'
                            }} />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{t.feedback.ratingLabel}</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {[1, 2, 3, 4, 5].map(num => (
                                <label key={num} style={{
                                    cursor: 'pointer',
                                    fontSize: '1.8rem',
                                    color: num <= rating ? 'var(--color-gold, #f59e0b)' : '#cbd5e1',
                                    transition: 'color 0.2s ease'
                                }}>
                                    <input
                                        type="radio"
                                        name="rating"
                                        value={num}
                                        checked={rating === num}
                                        onChange={() => setRating(num)}
                                        style={{ display: 'none' }}
                                    />
                                    ★
                                </label>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{t.feedback.commentLabel}</label>
                        <textarea
                            required
                            rows="4"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={t.feedback.commentPlaceholder}
                            style={{
                                width: '100%',
                                padding: '0.85rem',
                                background: 'rgba(255,255,255,0.7)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: 'var(--radius-sm)',
                                color: 'var(--color-black)',
                                fontFamily: 'inherit'
                            }}></textarea>
                    </div>

                    <button
                        className="btn-primary"
                        disabled={isSubmitting}
                        style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.9rem',
                            fontSize: '1rem',
                            opacity: isSubmitting ? 0.7 : 1
                        }}>
                        {isSubmitting ? t.contact.sendingBtn : t.feedback.submitBtn} <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Feedback;
