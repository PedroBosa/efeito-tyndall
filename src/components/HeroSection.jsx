import { useEffect, useRef } from 'react';
import { Beaker, Lightbulb, ChevronDown } from 'lucide-react';

export default function HeroSection({ onStartExperiments }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationId;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Partículas com movimento Browniano
    const particles = [];
    const particleCount = 80;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 2,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.5 ? '#60A5FA' : '#DBEAFE'
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        // Movimento Browniano - pequenas mudanças aleatórias
        particle.speedX += (Math.random() - 0.5) * 0.1;
        particle.speedY += (Math.random() - 0.5) * 0.1;
        
        // Limitar velocidade
        particle.speedX = Math.max(-1, Math.min(1, particle.speedX));
        particle.speedY = Math.max(-1, Math.min(1, particle.speedY));
        
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Desenhar partícula com glow
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        
        // Glow effect
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.globalAlpha = particle.opacity * 0.3;
        ctx.fill();
        
        ctx.globalAlpha = 1;
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900" />
      
      {/* Canvas para partículas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />
      
      {/* Conteúdo */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="flex justify-center gap-4 mb-8">
          <Beaker className="w-16 h-16 text-blue-400 animate-pulse" />
          <Lightbulb className="w-16 h-16 text-yellow-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Coloides e o Efeito Tyndall
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-300 mb-4">
          Experimentos interativos em 2D
        </p>
        
        <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
          Explore a ciência por trás da dispersão da luz em sistemas coloidais através de visualizações interativas e animações educacionais.
        </p>
        
        <button
          onClick={onStartExperiments}
          className="btn-primary text-lg inline-flex items-center gap-2 group"
        >
          Começar Experimentos
          <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
        </button>
        
        {/* Indicadores decorativos */}
        <div className="mt-16 flex justify-center gap-8 text-slate-500">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">4</div>
            <div className="text-sm">Experimentos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">2D</div>
            <div className="text-sm">Vista Lateral</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400">∞</div>
            <div className="text-sm">Interativo</div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-slate-500" />
      </div>
    </section>
  );
}
