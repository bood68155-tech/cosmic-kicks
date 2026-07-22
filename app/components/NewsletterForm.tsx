'use client';

import { useState, type FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('success');
    setEmail('');
    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-6 flex w-full max-w-sm flex-col items-center gap-3 sm:flex-row">
      <label htmlFor="newsletter-email" className="sr-only">Email address</label>
      <input id="newsletter-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required className="glass-input flex-1 text-center sm:text-left" />
      <button type="submit" className={`btn-glass shrink-0 ${status === 'success' ? '!border-cosmic-teal/30 !bg-cosmic-teal/10 !text-cosmic-teal' : ''}`} disabled={status === 'success'}>
        {status === 'success' ? 'Subscribed!' : (<>{'Subscribe'}<ArrowRight size={14} /></>)}
      </button>
    </form>
  );
}
