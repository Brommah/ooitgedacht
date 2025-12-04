import React, { useState } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { AnimatedSection } from './animations/AnimatedSection';

/**
 * Newsletter signup section
 */
export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const { t, language } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    alert(t('hero.thankYouSignup'));
    setEmail('');
  };

  return (
    <div className="py-24 md:py-32 px-6 relative overflow-hidden bg-[#0a1628]">
      {/* Background image */}
      <div className="absolute inset-0">
        <img 
          src="/generated/forest-house-systems.jpg" 
          alt="" 
          className="w-full h-full object-cover opacity-[0.12]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/70 to-[#0a1628]/50" />
      </div>
      
      <div className="max-w-2xl mx-auto text-center relative z-10">
        <AnimatedSection>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-xs font-bold uppercase tracking-widest mb-8 text-white/80">
            <Mail size={14} /> {t('hero.stayUpdated')}
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4 tracking-[-0.02em]">
            {t('hero.weeklyLandNewsTips')}
          </h2>
          <p className="text-lg text-white/60 font-light mb-8 leading-relaxed">
            {t('hero.newsletterDesc')}
          </p>
          
          <form 
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={language === 'en' ? 'your@email.com' : 'jouw@email.nl'}
              required
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/40 outline-none focus:border-white/40 transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-[#0a1628] font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
            >
              {t('hero.subscribe')} <ArrowRight size={16} />
            </button>
          </form>
          
          <p className="text-xs text-white/40 mt-4">
            {t('hero.subscribersAlready')}
          </p>
        </AnimatedSection>
      </div>
    </div>
  );
};




