import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { AnimatedSection } from './animations/AnimatedSection';
import { FAQItem } from './shared/FAQItem';

/**
 * FAQ section with accordion items
 */
export const FAQSection: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const { t, tObj } = useTranslation();
  
  const faqs = tObj<Array<{ question: string; answer: string }>>('hero.faqs');

  return (
    <div className="bg-[#0a1628] py-24 md:py-32 px-6 relative overflow-hidden">
      {/* Tinted background image */}
      <div className="absolute inset-0">
        <img 
          src="/generated/coastal-modern-blueprint.png" 
          alt="" 
          className="w-full h-full object-cover opacity-[0.03]"
        />
      </div>
      <div className="max-w-3xl mx-auto relative z-10">
        <AnimatedSection className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-white tracking-[-0.02em]">{t('hero.faqTitle')}</h2>
          <p className="text-blue-200/60 font-light">{t('hero.faqSubtitle')}</p>
        </AnimatedSection>
        
        <AnimatedSection delay={100}>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 md:p-8">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQ === index}
                onToggle={() => setOpenFAQ(openFAQ === index ? null : index)}
              />
            ))}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};




