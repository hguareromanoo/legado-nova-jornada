
import { useRef, useEffect, useState } from 'react';

interface StatProps {
  prefix: string;
  value: string;
  label: string;
  delay?: number;
}

const StatItem = ({ prefix, value, label, delay = 0 }: StatProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const statRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    if (statRef.current) {
      observer.observe(statRef.current);
    }

    return () => {
      if (statRef.current) {
        observer.unobserve(statRef.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={statRef}
      className={`text-center transform transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      <h3 className="text-4xl md:text-5xl font-bold text-w1-primary-accent mb-3">
        {prefix}{value}
      </h3>
      <p className="text-w1-secondary-text">{label}</p>
    </div>
  );
};

const StatsSection = () => {
  return (
    <section className="w1-section bg-w1-bg-light" id="stats">
      <div className="w1-container">
        <div className="text-center mb-12">
          <span className="text-w1-secondary-text uppercase tracking-wider">Nossos números</span>
          <h2 className="text-w1-text-dark mt-2">
            Números que trazem segurança para o seu patrimônio
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          <StatItem prefix="+" value="14" label="anos sendo a consultoria número 1 do Brasil" delay={100} />
          <StatItem prefix="+" value="40" label="anos com modelo de negócio europeu consolidado" delay={200} />
          <StatItem prefix="+" value="100" label="mil clientes satisfeitos" delay={300} />
          <StatItem prefix="+" value="1000" label="profissionais no ecossistema" delay={400} />
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
