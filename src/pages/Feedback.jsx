import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

const Feedback = () => {
    const [submitted, setSubmitted] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rating, setRating] = useState(5);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

        try {
            const response = await fetch(`${apiBaseUrl}/api/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, rating, message }),
            });

            if (response.ok) {
                setSubmitted(true);
            } else {
                alert('เกิดข้อผิดพลาดในการส่งความคิดเห็น กรุณาลองใหม่อีกครั้ง');
            }
        } catch (error) {
            console.error('Feedback Error:', error);
            alert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="container" style={{ paddingTop: '150px', textAlign: 'center' }}>
                <div style={{ marginBottom: '2rem', color: 'var(--color-pink-500)' }}>
                    <CheckCircle size={80} />
                </div>
                <h1 className="text-gradient" style={{ marginBottom: '1rem' }}>Thank You!</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    We appreciate your feedback. <br />
                    It helps us improve VyLash for everyone.
                </p>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '120px', paddingBottom: '50px' }}>
            <h1 className="text-gradient" style={{ marginBottom: '2rem', textAlign: 'center' }}>We'd Love to Hear From You</h1>

            <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name (Optional)</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: 'var(--radius-sm)',
                                color: 'white'
                            }} />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Rating</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {[1, 2, 3, 4, 5].map(num => (
                                <label key={num} style={{
                                    cursor: 'pointer',
                                    fontSize: '1.5rem',
                                    color: num <= rating ? 'var(--color-pink-500)' : 'rgba(255,255,255,0.2)',
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
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Your Message</label>
                        <textarea
                            required
                            rows="5"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Tell us what you think..."
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: 'var(--radius-sm)',
                                color: 'white',
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
                            opacity: isSubmitting ? 0.7 : 1
                        }}>
                        {isSubmitting ? 'Sending...' : 'Send Feedback'} <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Feedback;
