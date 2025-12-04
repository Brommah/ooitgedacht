import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { AnimatedSection } from './animations/AnimatedSection';
import { ShieldIcon, CertifiedIcon, LiveDataIcon, PermitIcon } from './icons/TrustIcons';

/**
 * Trust indicators section with animated icons
 */
export const TrustIndicatorsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useGSAP(() => {
    if (!sectionRef.current || cardsRef.current.length === 0) return;

    gsap.from(cardsRef.current, {
      y: 40,
      opacity: 0,
      scale: 0.9,
      duration: 0.6,
      stagger: 0.1,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: sectionRef });

  const indicators = [
    {
      icon: <ShieldIcon />,
      title: 'Veilig & Transparant',
      subtitle: 'Elke wijziging wordt gelogd',
    },
    {
      icon: <CertifiedIcon />,
      title: 'Expert Gevalideerd',
      subtitle: 'Door erkende constructeurs',
    },
    {
      icon: <LiveDataIcon />,
      title: 'Actuele Data',
      subtitle: 'Prijzen van vandaag',
    },
    {
      icon: <PermitIcon />,
      title: 'Vergunningsklaar',
      subtitle: 'Direct bruikbaar dossier',
    },
  ];

  return (
    <AnimatedSection delay={200} className="mt-16 md:mt-24">
      <div ref={sectionRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {indicators.map((item, index) => (
          <div
            key={item.title}
            ref={(el) => { if (el) cardsRef.current[index] = el; }}
            className="group text-center"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-5 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl flex items-center justify-center group-hover:border-blue-400/40 group-hover:from-blue-500/15 group-hover:to-blue-600/10 transition-all duration-300 shadow-lg shadow-blue-500/5">
              <div className="group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
            </div>
            <div className="text-sm md:text-base font-medium text-white mb-1.5">{item.title}</div>
            <div className="text-xs md:text-sm text-blue-200/50 font-light">{item.subtitle}</div>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
};




