import { useState, useEffect, useRef, useCallback } from 'react';
import { Zap, Eye, Clock, RotateCcw, Info, FlashlightOff, Flashlight } from 'lucide-react';

const substances = [
  {
    id: 'water',
    name: 'Água Pura',
    formula: 'H₂O',
    liquidColor: { top: 'rgba(59, 130, 246, 0.25)', bottom: 'rgba(37, 99, 235, 0.35)' },
    particleCount: 0,
    particleSize: 0,
    particleColor: 'transparent',
    tyndall: false,
    tyndallIntensity: 0,
    description: 'Sem partículas dispersas',
    type: 'Substância pura',
    category: 'pure'
  },
  {
    id: 'sugar',
    name: 'Água + Açúcar',
    formula: 'C₁₂H₂₂O₁₁',
    liquidColor: { top: 'rgba(96, 165, 250, 0.3)', bottom: 'rgba(59, 130, 246, 0.4)' },
    particleCount: 60,
    particleSize: 1.5,
    particleColor: 'rgba(200, 220, 255, 0.4)',
    tyndall: false,
    tyndallIntensity: 0,
    description: 'Partículas < 1nm',
    type: 'Solução verdadeira',
    category: 'solution'
  },
  {
    id: 'starch',
    name: 'Água + Amido',
    formula: '(C₆H₁₀O₅)n',
    liquidColor: { top: 'rgba(209, 213, 219, 0.5)', bottom: 'rgba(156, 163, 175, 0.6)' },
    particleCount: 45,
    particleSize: 4,
    particleColor: 'rgba(255, 255, 255, 0.75)',
    tyndall: true,
    tyndallIntensity: 0.7,
    description: 'Partículas 100-500nm',
    type: 'Coloide (Sol)',
    category: 'colloid'
  },
  {
    id: 'milk',
    name: 'Água + Leite',
    formula: 'Emulsão',
    liquidColor: { top: 'rgba(241, 245, 249, 0.75)', bottom: 'rgba(226, 232, 240, 0.85)' },
    particleCount: 65,
    particleSize: 5,
    particleColor: 'rgba(255, 255, 250, 0.85)',
    tyndall: true,
    tyndallIntensity: 1,
    description: 'Gotículas 100-1000nm',
    type: 'Coloide (Emulsão)',
    category: 'colloid'
  },
  {
    id: 'sand',
    name: 'Água + Areia',
    formula: 'SiO₂',
    liquidColor: { top: 'rgba(180, 160, 130, 0.35)', bottom: 'rgba(160, 140, 100, 0.5)' },
    particleCount: 30,
    particleSize: 10,
    particleColor: 'rgba(210, 180, 140, 0.95)',
    tyndall: 'partial',
    tyndallIntensity: 0.3,
    description: 'Partículas > 1000nm',
    type: 'Suspensão',
    category: 'suspension',
    sediments: true
  }
];

export default function LabBenchExperiment() {
  const canvasRef = useRef(null);
  const [laserOn, setLaserOn] = useState(true);
  const [laserIntensity, setLaserIntensity] = useState(80);
  const [timeAcceleration, setTimeAcceleration] = useState(1);
  const [selectedSubstance, setSelectedSubstance] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  
  const particlesRef = useRef({});
  const timeRef = useRef(0);
  
  // Inicializar partículas
  useEffect(() => {
    substances.forEach(sub => {
      if (sub.particleCount > 0) {
        particlesRef.current[sub.id] = Array.from({ length: sub.particleCount }, (_, i) => ({
          x: Math.random() * 90 + 15,
          y: Math.random() * 130 + 30,
          size: sub.particleSize * (0.7 + Math.random() * 0.6),
          vx: (Math.random() - 0.5) * 0.4,
          vy: sub.sediments ? Math.random() * 0.3 + 0.1 : (Math.random() - 0.5) * 0.4,
          settled: false,
          illuminated: false,
          glowIntensity: 0,
          phase: Math.random() * Math.PI * 2
        }));
      }
    });
  }, []);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + timeAcceleration);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeAcceleration]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    timeRef.current += 0.016;
    const time = timeRef.current;
    
    ctx.clearRect(0, 0, width, height);
    
    // === FUNDO GRADIENTE ===
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#0a0f1a');
    bgGradient.addColorStop(1, '#1a1f2e');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);
    
    // === BANCADA DE LABORATÓRIO ===
    const benchY = height - 50;
    
    // Superfície da bancada
    const benchGradient = ctx.createLinearGradient(0, benchY, 0, height);
    benchGradient.addColorStop(0, '#374151');
    benchGradient.addColorStop(0.3, '#1f2937');
    benchGradient.addColorStop(1, '#111827');
    ctx.fillStyle = benchGradient;
    ctx.fillRect(0, benchY, width, height - benchY);
    
    // Linha de borda da bancada
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, benchY);
    ctx.lineTo(width, benchY);
    ctx.stroke();
    
    // Reflexo na bancada
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.fillRect(0, benchY + 2, width, 8);
    
    // === CONFIGURAÇÕES DOS BÉQUERES ===
    const beakerWidth = 120;
    const beakerHeight = 180;
    const beakerSpacing = 145;
    const startX = 45;
    const beakerY = benchY - beakerHeight - 15;
    const laserY = beakerY + 90; // Posição fixa do laser no meio
    
    // === LASER EMITTER ===
    const laserOpacity = laserOn ? laserIntensity / 100 : 0;
    
    // Caixa do emissor
    const emitterX = 8;
    const emitterWidth = 35;
    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.roundRect(emitterX, laserY - 18, emitterWidth, 36, 4);
    ctx.fill();
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Lente do laser
    if (laserOn) {
      const lensGlow = ctx.createRadialGradient(
        emitterX + emitterWidth, laserY, 0,
        emitterX + emitterWidth, laserY, 25
      );
      lensGlow.addColorStop(0, `rgba(239, 68, 68, ${laserOpacity})`);
      lensGlow.addColorStop(0.4, `rgba(239, 68, 68, ${laserOpacity * 0.4})`);
      lensGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = lensGlow;
      ctx.beginPath();
      ctx.arc(emitterX + emitterWidth, laserY, 25, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.fillStyle = laserOn ? '#ef4444' : '#6b7280';
    ctx.beginPath();
    ctx.arc(emitterX + emitterWidth - 2, laserY, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Indicador LED
    ctx.fillStyle = laserOn ? '#22c55e' : '#374151';
    ctx.beginPath();
    ctx.arc(emitterX + 10, laserY - 8, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Label do emissor
    ctx.font = 'bold 8px system-ui';
    ctx.fillStyle = '#9ca3af';
    ctx.textAlign = 'center';
    ctx.fillText('LASER', emitterX + emitterWidth/2, laserY + 25);
    
    // === FEIXE DE LASER PRINCIPAL ===
    if (laserOn) {
      // Feixe base atravessando tudo
      const beamGradient = ctx.createLinearGradient(emitterX + emitterWidth, laserY, width - 20, laserY);
      beamGradient.addColorStop(0, `rgba(239, 68, 68, ${laserOpacity * 0.9})`);
      beamGradient.addColorStop(0.5, `rgba(239, 68, 68, ${laserOpacity * 0.7})`);
      beamGradient.addColorStop(1, `rgba(239, 68, 68, ${laserOpacity * 0.3})`);
      
      ctx.strokeStyle = beamGradient;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(emitterX + emitterWidth + 5, laserY);
      ctx.lineTo(width - 15, laserY);
      ctx.stroke();
      
      // Glow sutil do feixe
      ctx.strokeStyle = `rgba(239, 68, 68, ${laserOpacity * 0.15})`;
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.moveTo(emitterX + emitterWidth + 5, laserY);
      ctx.lineTo(width - 15, laserY);
      ctx.stroke();
      
      // Ponto final (receptor)
      ctx.fillStyle = '#374151';
      ctx.beginPath();
      ctx.roundRect(width - 25, laserY - 10, 15, 20, 2);
      ctx.fill();
      ctx.fillStyle = `rgba(239, 68, 68, ${laserOpacity * 0.8})`;
      ctx.beginPath();
      ctx.arc(width - 17, laserY, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // === DESENHAR CADA BÉQUER ===
    substances.forEach((sub, index) => {
      const x = startX + index * beakerSpacing;
      const liquidY = beakerY + 18;
      const liquidHeight = beakerHeight - 18;
      
      // Sombra do béquer
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(x + beakerWidth/2 + 5, benchY + 3, beakerWidth/2 - 5, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // === LÍQUIDO ===
      const liquidGradient = ctx.createLinearGradient(x, liquidY, x, liquidY + liquidHeight);
      liquidGradient.addColorStop(0, sub.liquidColor.top);
      liquidGradient.addColorStop(0.7, sub.liquidColor.bottom);
      liquidGradient.addColorStop(1, sub.liquidColor.bottom);
      ctx.fillStyle = liquidGradient;
      ctx.fillRect(x + 3, liquidY, beakerWidth - 6, liquidHeight - 3);
      
      // Menisco (superfície côncava)
      ctx.fillStyle = sub.liquidColor.top;
      ctx.beginPath();
      ctx.moveTo(x + 3, liquidY);
      ctx.quadraticCurveTo(x + beakerWidth/2, liquidY + 8, x + beakerWidth - 3, liquidY);
      ctx.lineTo(x + beakerWidth - 3, liquidY + 10);
      ctx.quadraticCurveTo(x + beakerWidth/2, liquidY + 3, x + 3, liquidY + 10);
      ctx.closePath();
      ctx.fill();
      
      // === EFEITO TYNDALL NO LÍQUIDO ===
      if (laserOn && laserY > liquidY && laserY < liquidY + liquidHeight) {
        const beamInLiquidStart = x + 3;
        const beamInLiquidEnd = x + beakerWidth - 3;
        const beamWidth = beamInLiquidEnd - beamInLiquidStart;
        
        if (sub.tyndall === true) {
          const intensity = sub.tyndallIntensity * laserOpacity;
          
          // Dispersão lateral intensa
          for (let layer = 0; layer < 5; layer++) {
            const layerSpread = 8 + layer * 8;
            const layerOpacity = intensity * (0.4 - layer * 0.07);
            
            const disperseGradient = ctx.createLinearGradient(
              beamInLiquidStart, laserY - layerSpread,
              beamInLiquidStart, laserY + layerSpread
            );
            disperseGradient.addColorStop(0, 'transparent');
            disperseGradient.addColorStop(0.3, `rgba(255, 120, 120, ${layerOpacity * 0.3})`);
            disperseGradient.addColorStop(0.5, `rgba(255, 80, 80, ${layerOpacity})`);
            disperseGradient.addColorStop(0.7, `rgba(255, 120, 120, ${layerOpacity * 0.3})`);
            disperseGradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = disperseGradient;
            ctx.fillRect(beamInLiquidStart, laserY - layerSpread, beamWidth, layerSpread * 2);
          }
          
          // Núcleo brilhante do feixe
          const coreGradient = ctx.createLinearGradient(beamInLiquidStart, laserY, beamInLiquidEnd, laserY);
          coreGradient.addColorStop(0, `rgba(255, 255, 255, ${intensity * 0.9})`);
          coreGradient.addColorStop(0.5, `rgba(255, 200, 200, ${intensity * 0.8})`);
          coreGradient.addColorStop(1, `rgba(255, 150, 150, ${intensity * 0.6})`);
          
          ctx.fillStyle = coreGradient;
          ctx.fillRect(beamInLiquidStart, laserY - 4, beamWidth, 8);
          
          // Raios de scattering
          ctx.strokeStyle = `rgba(255, 100, 100, ${intensity * 0.4})`;
          ctx.lineWidth = 1;
          for (let r = 0; r < 12; r++) {
            const rayX = beamInLiquidStart + (r + 0.5) * (beamWidth / 12);
            const rayAngle = Math.sin(time * 3 + r) * 0.3;
            const rayLength = 15 + Math.sin(time * 2 + r * 0.5) * 8;
            
            ctx.beginPath();
            ctx.moveTo(rayX, laserY);
            ctx.lineTo(rayX + rayLength * Math.sin(rayAngle), laserY - rayLength * Math.cos(rayAngle));
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(rayX, laserY);
            ctx.lineTo(rayX - rayLength * Math.sin(rayAngle), laserY + rayLength * Math.cos(rayAngle));
            ctx.stroke();
          }
          
        } else if (sub.tyndall === 'partial') {
          // Suspensão - feixe parcialmente bloqueado
          const intensity = sub.tyndallIntensity * laserOpacity;
          
          // Feixe fragmentado
          ctx.strokeStyle = `rgba(239, 68, 68, ${laserOpacity * 0.5})`;
          ctx.lineWidth = 3;
          ctx.setLineDash([8, 12]);
          ctx.beginPath();
          ctx.moveTo(beamInLiquidStart, laserY);
          ctx.lineTo(beamInLiquidEnd, laserY);
          ctx.stroke();
          ctx.setLineDash([]);
          
          // Pouco scattering
          ctx.fillStyle = `rgba(255, 100, 100, ${intensity * 0.15})`;
          ctx.fillRect(beamInLiquidStart, laserY - 8, beamWidth, 16);
          
        } else {
          // Solução/Água pura - feixe passa reto, quase invisível
          ctx.strokeStyle = `rgba(239, 68, 68, ${laserOpacity * 0.25})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(beamInLiquidStart, laserY);
          ctx.lineTo(beamInLiquidEnd, laserY);
          ctx.stroke();
        }
      }
      
      // === PARTÍCULAS ===
      if (particlesRef.current[sub.id]) {
        particlesRef.current[sub.id].forEach((p, pIndex) => {
          // Movimento
          if (sub.sediments) {
            const maxSettleY = 140 + pIndex * 0.8;
            if (!p.settled && p.y < maxSettleY) {
              p.y += p.vy * timeAcceleration * 0.5;
              p.x += Math.sin(time * 2 + p.phase) * 0.3;
            } else {
              p.settled = true;
              p.y = Math.min(p.y, maxSettleY);
            }
          } else {
            // Browniano
            p.vx += (Math.random() - 0.5) * 0.08;
            p.vy += (Math.random() - 0.5) * 0.08;
            p.vx = Math.max(-0.4, Math.min(0.4, p.vx)) * 0.99;
            p.vy = Math.max(-0.4, Math.min(0.4, p.vy)) * 0.99;
            p.x += p.vx;
            p.y += p.vy;
          }
          
          // Limites
          if (p.x < 15) { p.x = 15; p.vx *= -0.5; }
          if (p.x > 105) { p.x = 105; p.vx *= -0.5; }
          if (p.y < 30) { p.y = 30; p.vy *= -0.5; }
          if (p.y > 160) { p.y = 160; p.vy *= -0.5; }
          
          const particleX = x + p.x;
          const particleY = beakerY + p.y;
          
          // Verificar iluminação
          const isIlluminated = laserOn && Math.abs(particleY - laserY) < p.size + 6;
          
          if (isIlluminated && sub.tyndall) {
            p.glowIntensity = Math.min(1, p.glowIntensity + 0.2);
          } else {
            p.glowIntensity = Math.max(0, p.glowIntensity - 0.1);
          }
          
          // Desenhar glow
          if (p.glowIntensity > 0.1) {
            const glowSize = p.size * 4;
            const glow = ctx.createRadialGradient(particleX, particleY, 0, particleX, particleY, glowSize);
            glow.addColorStop(0, `rgba(255, 200, 200, ${p.glowIntensity * 0.8})`);
            glow.addColorStop(0.4, `rgba(255, 100, 100, ${p.glowIntensity * 0.3})`);
            glow.addColorStop(1, 'transparent');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(particleX, particleY, glowSize, 0, Math.PI * 2);
            ctx.fill();
          }
          
          // Partícula
          ctx.fillStyle = sub.particleColor;
          ctx.beginPath();
          ctx.arc(particleX, particleY, p.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Borda sutil
          if (p.size > 3) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      }
      
      // === VIDRO DO BÉQUER ===
      // Bordas do béquer
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, beakerY);
      ctx.lineTo(x, beakerY + beakerHeight);
      ctx.lineTo(x + beakerWidth, beakerY + beakerHeight);
      ctx.lineTo(x + beakerWidth, beakerY);
      ctx.stroke();
      
      // Borda superior (bico)
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.8)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x - 2, beakerY);
      ctx.lineTo(x + 8, beakerY - 5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + beakerWidth + 2, beakerY);
      ctx.lineTo(x + beakerWidth - 8, beakerY - 5);
      ctx.stroke();
      
      // Reflexo no vidro
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(x + 5, beakerY + 20, 8, beakerHeight - 40);
      
      // Marcações de volume
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.lineWidth = 1;
      ctx.font = '8px system-ui';
      ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
      ctx.textAlign = 'right';
      for (let m = 1; m <= 3; m++) {
        const markY = beakerY + 25 + m * 40;
        ctx.beginPath();
        ctx.moveTo(x + beakerWidth - 12, markY);
        ctx.lineTo(x + beakerWidth - 4, markY);
        ctx.stroke();
        ctx.fillText(`${(4-m)*50}`, x + beakerWidth - 14, markY + 3);
      }
      
      // === LABELS ===
      ctx.textAlign = 'center';
      
      // Nome da substância
      ctx.font = 'bold 13px system-ui';
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(sub.name, x + beakerWidth/2, beakerY + beakerHeight + 22);
      
      // Fórmula
      ctx.font = '11px system-ui';
      ctx.fillStyle = '#64748b';
      ctx.fillText(sub.formula, x + beakerWidth/2, beakerY + beakerHeight + 38);
      
      // Badge de resultado
      if (laserOn) {
        const badgeY = beakerY - 8;
        ctx.font = 'bold 10px system-ui';
        
        if (sub.tyndall === true) {
          // Badge verde com glow
          const badgeGlow = ctx.createRadialGradient(x + beakerWidth/2, badgeY, 0, x + beakerWidth/2, badgeY, 40);
          badgeGlow.addColorStop(0, 'rgba(34, 197, 94, 0.2)');
          badgeGlow.addColorStop(1, 'transparent');
          ctx.fillStyle = badgeGlow;
          ctx.beginPath();
          ctx.arc(x + beakerWidth/2, badgeY, 40, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = '#22c55e';
          ctx.fillText('✓ TYNDALL', x + beakerWidth/2, badgeY);
        } else if (sub.tyndall === 'partial') {
          ctx.fillStyle = '#f59e0b';
          ctx.fillText('⚠ SUSPENSÃO', x + beakerWidth/2, badgeY);
        } else {
          ctx.fillStyle = '#ef4444';
          ctx.fillText('✗ SEM EFEITO', x + beakerWidth/2, badgeY);
        }
      }
    });
    
  }, [laserOn, laserIntensity, elapsedTime, timeAcceleration]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = 780;
    canvas.height = 340;
    
    let animationId;
    const loop = () => {
      animate();
      animationId = requestAnimationFrame(loop);
    };
    loop();
    
    return () => cancelAnimationFrame(animationId);
  }, [animate]);

  const resetExperiment = () => {
    setLaserOn(true);
    setLaserIntensity(80);
    setTimeAcceleration(1);
    setElapsedTime(0);
    
    // Resetar partículas
    substances.forEach(sub => {
      if (particlesRef.current[sub.id]) {
        particlesRef.current[sub.id].forEach(p => {
          p.y = Math.random() * 130 + 30;
          p.settled = false;
          p.glowIntensity = 0;
        });
      }
    });
  };

  return (
    <section id="experimento3" className="py-20 px-4 bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium mb-4">
            🔬 Experimento 3
          </span>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-200 to-pink-400 bg-clip-text text-transparent">
            Bancada de Laboratório
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Compare o comportamento da luz laser atravessando diferentes substâncias. 
            Identifique quais são <span className="text-blue-400">soluções</span>, 
            <span className="text-green-400"> coloides</span> e 
            <span className="text-amber-400"> suspensões</span>!
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
          <canvas
            ref={canvasRef}
            className="w-full rounded-xl shadow-inner mx-auto block"
            style={{ maxWidth: '780px' }}
          />
          
          {/* Controles */}
          <div className="mt-6 grid md:grid-cols-4 gap-4">
            {/* Botão Laser */}
            <button
              onClick={() => setLaserOn(!laserOn)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                laserOn
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-lg shadow-red-500/10'
                  : 'bg-slate-700/50 text-slate-400 border border-slate-600/50'
              }`}
            >
              {laserOn ? <Zap className="w-5 h-5" /> : <FlashlightOff className="w-5 h-5" />}
              {laserOn ? 'Laser Ligado' : 'Laser Desligado'}
            </button>
            
            {/* Intensidade */}
            <div className="bg-slate-700/30 rounded-xl p-3 border border-slate-600/30">
              <label className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Intensidade</span>
                <span className="text-red-400">{laserIntensity}%</span>
              </label>
              <input
                type="range"
                min="20"
                max="100"
                value={laserIntensity}
                onChange={(e) => setLaserIntensity(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>
            
            {/* Aceleração de tempo */}
            <div className="bg-slate-700/30 rounded-xl p-3 border border-slate-600/30">
              <label className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Vel. Sedimentação</span>
                <span className="text-amber-400">{timeAcceleration}x</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={timeAcceleration}
                onChange={(e) => setTimeAcceleration(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
            
            {/* Reset */}
            <button
              onClick={resetExperiment}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-700/50 text-slate-300 border border-slate-600/50 hover:bg-slate-600/50 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Resetar
            </button>
          </div>
          
          {/* Legenda */}
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-slate-400">Solução (sem Tyndall)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-slate-400">Coloide (Tyndall visível)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-slate-400">Suspensão (sedimenta)</span>
            </div>
          </div>
        </div>
        
        {/* Cards de informação */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <h4 className="font-bold text-blue-400 mb-2">💧 Soluções Verdadeiras</h4>
            <p className="text-sm text-slate-300">
              Partículas menores que 1nm. A luz passa sem dispersão visível. 
              Exemplos: água com sal, água com açúcar.
            </p>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <h4 className="font-bold text-green-400 mb-2">✨ Coloides</h4>
            <p className="text-sm text-slate-300">
              Partículas de 1nm a 1000nm. Exibem o Efeito Tyndall - a luz é espalhada 
              e forma um rastro visível.
            </p>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
            <h4 className="font-bold text-amber-400 mb-2">⏬ Suspensões</h4>
            <p className="text-sm text-slate-300">
              Partículas maiores que 1000nm. Sedimentam com o tempo e 
              bloqueiam parcialmente a luz.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
