import { useState, useEffect, useRef } from 'react';
import { TreePine, Milk, Flame, Cookie, Sun, ExternalLink, Play, Pause } from 'lucide-react';

const examples = [
  {
    id: 'forest',
    title: 'Neblina na Floresta',
    icon: TreePine,
    description: 'Raios solares visíveis atravessando a neblina entre as árvores (Raios Crepusculares)',
    type: 'Aerossol',
    disperso: 'Gotículas de água',
    meio: 'Ar',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'milk',
    title: 'Copo de Leite',
    icon: Milk,
    description: 'Feixe de luz visível atravessando o leite diluído em água',
    type: 'Emulsão',
    disperso: 'Gordura e Proteínas',
    meio: 'Água',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'smoke',
    title: 'Fumaça de Incenso',
    icon: Flame,
    description: 'Laser visível atravessando fumaça de incenso',
    type: 'Aerossol Sólido',
    disperso: 'Partículas de carbono',
    meio: 'Ar',
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'gelatin',
    title: 'Gelatina',
    icon: Cookie,
    description: 'Luz dispersa dentro da estrutura coloidal do gel',
    type: 'Gel',
    disperso: 'Água',
    meio: 'Rede Proteica',
    color: 'from-pink-500 to-rose-600'
  },
  {
    id: 'sky',
    title: 'Céu Azul',
    icon: Sun,
    description: 'Espalhamento Rayleigh da luz solar pela atmosfera',
    type: 'Dispersão Rayleigh',
    disperso: 'Luz',
    meio: 'Atmosfera (N₂, O₂)',
    color: 'from-sky-500 to-blue-600'
  }
];

// --- Cenas Melhoradas ---

function ForestScene({ isActive }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 250;
    
    let animationId;
    let time = 0;
    
    // Partículas de neblina
    const fogParticles = Array.from({ length: 80 }, () => ({
      x: Math.random() * 400,
      y: Math.random() * 250,
      size: Math.random() * 20 + 10,
      speed: Math.random() * 0.2 + 0.05,
      opacity: Math.random() * 0.15 + 0.05
    }));

    // Árvores em camadas
    const trees = [
      { x: 50, h: 180, w: 60, color: '#064e3b', layer: 0 }, // Fundo
      { x: 150, h: 200, w: 70, color: '#064e3b', layer: 0 },
      { x: 280, h: 170, w: 50, color: '#064e3b', layer: 0 },
      { x: 350, h: 190, w: 60, color: '#064e3b', layer: 0 },
      
      { x: 0, h: 220, w: 80, color: '#065f46', layer: 1 }, // Meio
      { x: 100, h: 240, w: 90, color: '#065f46', layer: 1 },
      { x: 220, h: 210, w: 70, color: '#065f46', layer: 1 },
      { x: 320, h: 230, w: 80, color: '#065f46', layer: 1 },
    ];
    
    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, 400, 250);
      
      // Céu
      const skyGradient = ctx.createLinearGradient(0, 0, 0, 250);
      skyGradient.addColorStop(0, '#38bdf8');
      skyGradient.addColorStop(1, '#bae6fd');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, 400, 250);
      
      // Sol
      const sunX = 320;
      const sunY = 40;
      
      // Glow do sol
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 100);
      sunGlow.addColorStop(0, 'rgba(253, 224, 71, 0.8)');
      sunGlow.addColorStop(0.5, 'rgba(253, 224, 71, 0.2)');
      sunGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 100, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(sunX, sunY, 25, 0, Math.PI * 2);
      ctx.fill();
      
      // Desenhar árvores (Camada 0)
      trees.filter(t => t.layer === 0).forEach(t => drawTree(ctx, t));

      // Raios Crepusculares (God Rays)
      if (isActive) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen'; // Mistura de luz
        for (let i = 0; i < 6; i++) {
          const angle = Math.PI / 3 + (i * 0.15) + Math.sin(time * 0.5 + i) * 0.05;
          const width = 40 + Math.sin(time + i) * 10;
          
          const rayGradient = ctx.createLinearGradient(sunX, sunY, sunX - Math.cos(angle) * 400, sunY + Math.sin(angle) * 400);
          rayGradient.addColorStop(0, 'rgba(255, 255, 200, 0.4)');
          rayGradient.addColorStop(1, 'transparent');
          
          ctx.fillStyle = rayGradient;
          ctx.beginPath();
          ctx.moveTo(sunX, sunY);
          ctx.lineTo(sunX - Math.cos(angle - 0.1) * 400, sunY + Math.sin(angle - 0.1) * 400);
          ctx.lineTo(sunX - Math.cos(angle + 0.1) * 400, sunY + Math.sin(angle + 0.1) * 400);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      // Desenhar árvores (Camada 1)
      trees.filter(t => t.layer === 1).forEach(t => drawTree(ctx, t));
      
      // Neblina animada
      fogParticles.forEach(p => {
        p.x -= p.speed;
        if (p.x < -50) p.x = 450;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      animationId = requestAnimationFrame(animate);
    };

    const drawTree = (ctx, t) => {
      const groundY = 250;
      // Tronco
      ctx.fillStyle = '#3f2c22';
      ctx.fillRect(t.x + t.w * 0.4, groundY - t.h * 0.3, t.w * 0.2, t.h * 0.3);
      
      // Folhas (Triângulos)
      ctx.fillStyle = t.color;
      
      // Base
      ctx.beginPath();
      ctx.moveTo(t.x, groundY - t.h * 0.2);
      ctx.lineTo(t.x + t.w, groundY - t.h * 0.2);
      ctx.lineTo(t.x + t.w / 2, groundY - t.h * 0.6);
      ctx.fill();
      
      // Meio
      ctx.beginPath();
      ctx.moveTo(t.x + 5, groundY - t.h * 0.5);
      ctx.lineTo(t.x + t.w - 5, groundY - t.h * 0.5);
      ctx.lineTo(t.x + t.w / 2, groundY - t.h * 0.85);
      ctx.fill();
      
      // Topo
      ctx.beginPath();
      ctx.moveTo(t.x + 10, groundY - t.h * 0.75);
      ctx.lineTo(t.x + t.w - 10, groundY - t.h * 0.75);
      ctx.lineTo(t.x + t.w / 2, groundY - t.h);
      ctx.fill();
    };
    
    animate();
    return () => cancelAnimationFrame(animationId);
  }, [isActive]);
  
  return <canvas ref={canvasRef} className="w-full h-full rounded-lg" />;
}

function MilkScene({ isActive }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 250;
    
    let animationId;
    let time = 0;
    
    // Partículas coloidais (gordura)
    const particles = Array.from({ length: 150 }, () => ({
      x: Math.random() * 120 + 140,
      y: Math.random() * 160 + 60,
      size: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2
    }));
    
    const animate = () => {
      time += 0.05;
      ctx.clearRect(0, 0, 400, 250);
      
      // Background (Mesa escura)
      const bgGradient = ctx.createLinearGradient(0, 0, 0, 250);
      bgGradient.addColorStop(0, '#1e293b');
      bgGradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, 400, 250);
      
      // Mesa
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 220, 400, 30);

      // --- Copo de Leite ---
      const glassX = 140;
      const glassY = 60;
      const glassW = 120;
      const glassH = 160;

      // Líquido (Leite diluído)
      ctx.fillStyle = 'rgba(240, 248, 255, 0.15)'; // Base leitosa
      ctx.fillRect(glassX + 5, glassY + 10, glassW - 10, glassH - 15);

      // Partículas
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        // Limites do copo
        if (p.x < glassX + 10 || p.x > glassX + glassW - 10) p.vx *= -1;
        if (p.y < glassY + 15 || p.y > glassY + glassH - 10) p.vy *= -1;

        // Verificar se está no feixe de luz
        const inBeam = isActive && p.y > 100 && p.y < 140;
        
        ctx.fillStyle = inBeam ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Vidro do copo (Bordas)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(glassX, glassY, glassW, glassH);
      
      // Reflexos no vidro
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(glassX + 10, glassY + 10, 10, glassH - 20);
      ctx.fillRect(glassX + glassW - 20, glassY + 10, 5, glassH - 20);

      // --- Laser / Lanterna ---
      const laserY = 120;
      
      // Corpo da lanterna
      ctx.fillStyle = '#475569';
      ctx.fillRect(20, laserY - 15, 60, 30);
      ctx.fillStyle = '#1e293b'; // Botão
      ctx.fillRect(40, laserY - 18, 10, 3);
      
      // Lente
      ctx.fillStyle = '#facc15'; // Luz amarela
      ctx.beginPath();
      ctx.ellipse(80, laserY, 5, 15, 0, 0, Math.PI * 2);
      ctx.fill();

      if (isActive) {
        // Feixe de luz (Efeito Tyndall)
        
        // 1. Feixe no ar (quase invisível)
        const airBeam = ctx.createLinearGradient(80, laserY, glassX, laserY);
        airBeam.addColorStop(0, 'rgba(253, 224, 71, 0.4)');
        airBeam.addColorStop(1, 'rgba(253, 224, 71, 0.05)');
        ctx.fillStyle = airBeam;
        ctx.beginPath();
        ctx.moveTo(80, laserY - 15);
        ctx.lineTo(glassX, laserY - 20);
        ctx.lineTo(glassX, laserY + 20);
        ctx.lineTo(80, laserY + 15);
        ctx.fill();

        // 2. Feixe no leite (MUITO VISÍVEL - Tyndall)
        const milkBeam = ctx.createLinearGradient(glassX, laserY, glassX + glassW, laserY);
        milkBeam.addColorStop(0, 'rgba(253, 224, 71, 0.8)'); // Forte na entrada
        milkBeam.addColorStop(1, 'rgba(253, 224, 71, 0.2)'); // Atenua
        
        ctx.fillStyle = milkBeam;
        ctx.beginPath();
        ctx.moveTo(glassX + 5, laserY - 20);
        ctx.lineTo(glassX + glassW - 5, laserY - 25);
        ctx.lineTo(glassX + glassW - 5, laserY + 25);
        ctx.lineTo(glassX + 5, laserY + 20);
        ctx.fill();

        // Brilho central intenso
        ctx.fillStyle = 'rgba(255, 255, 200, 0.3)';
        ctx.fillRect(glassX + 5, laserY - 5, glassW - 10, 10);
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(animationId);
  }, [isActive]);
  
  return <canvas ref={canvasRef} className="w-full h-full rounded-lg" />;
}

function SmokeScene({ isActive }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 250;
    
    let animationId;
    
    // Sistema de partículas de fumaça
    const smokeParticles = [];
    
    const animate = () => {
      ctx.clearRect(0, 0, 400, 250);
      
      // Background escuro
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, 400, 250);
      
      // Base do incensário
      ctx.fillStyle = '#7c3aed';
      ctx.beginPath();
      ctx.moveTo(180, 240);
      ctx.lineTo(220, 240);
      ctx.lineTo(210, 220);
      ctx.lineTo(190, 220);
      ctx.fill();
      
      // Vareta
      ctx.strokeStyle = '#a8a29e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(200, 220);
      ctx.lineTo(200, 180);
      ctx.stroke();
      
      // Ponta em brasa
      const glowSize = 2 + Math.random() * 2;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(200, 180, glowSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Gerar fumaça
      if (Math.random() > 0.3) {
        smokeParticles.push({
          x: 200,
          y: 180,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -1 - Math.random(),
          size: 2 + Math.random() * 3,
          opacity: 0.6,
          life: 100 + Math.random() * 50
        });
      }
      
      // Laser Vermelho
      if (isActive) {
        // Emissor
        ctx.fillStyle = '#333';
        ctx.fillRect(10, 100, 40, 20);
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(50, 110, 3, 0, Math.PI * 2);
        ctx.fill();

        // Feixe Laser
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)'; // Vermelho laser
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(50, 110);
        ctx.lineTo(390, 110);
        ctx.stroke();
        
        // Glow do feixe
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.2)';
        ctx.lineWidth = 6;
        ctx.stroke();
      }
      
      // Atualizar e desenhar partículas
      for (let i = smokeParticles.length - 1; i >= 0; i--) {
        const p = smokeParticles[i];
        
        // Física da fumaça (turbulência)
        p.x += p.vx + Math.sin(p.y * 0.05) * 0.5;
        p.y += p.vy;
        p.size += 0.05;
        p.opacity -= 0.003;
        p.life--;
        
        if (p.opacity <= 0 || p.life <= 0) {
          smokeParticles.splice(i, 1);
          continue;
        }
        
        // Interação com Laser
        let color = `rgba(200, 200, 200, ${p.opacity})`; // Fumaça cinza normal
        
        if (isActive && Math.abs(p.y - 110) < 5) {
          // Partícula iluminada pelo laser!
          color = `rgba(255, 100, 100, ${p.opacity + 0.2})`; // Brilha vermelho
          
          // Efeito de brilho extra
          ctx.fillStyle = 'rgba(255, 50, 50, 0.3)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    return () => {
      cancelAnimationFrame(animationId);
      smokeParticles.length = 0;
    };
  }, [isActive]);
  
  return <canvas ref={canvasRef} className="w-full h-full rounded-lg" />;
}

function GelatinScene({ isActive }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 250;
    
    let animationId;
    let time = 0;
    
    const animate = () => {
      time += 0.05;
      ctx.clearRect(0, 0, 400, 250);
      
      // Background
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, 400, 250);
      
      // Prato
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.ellipse(200, 200, 100, 30, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Gelatina (Wobble effect)
      const wobble = Math.sin(time * 0.5) * 2;
      const gelX = 200;
      const gelY = 150;
      
      // Corpo da gelatina
      const gelGradient = ctx.createRadialGradient(gelX, gelY, 10, gelX, gelY, 80);
      gelGradient.addColorStop(0, 'rgba(236, 72, 153, 0.9)');
      gelGradient.addColorStop(1, 'rgba(190, 24, 93, 0.8)');
      
      ctx.fillStyle = gelGradient;
      ctx.beginPath();
      // Forma de domo
      ctx.moveTo(gelX - 70 + wobble, 190);
      ctx.bezierCurveTo(
        gelX - 70 + wobble, 100 + wobble, 
        gelX + 70 - wobble, 100 - wobble, 
        gelX + 70 - wobble, 190
      );
      ctx.fill();
      
      // Brilho especular
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.ellipse(gelX - 20 + wobble, 130 + wobble, 15, 8, -0.5, 0, Math.PI * 2);
      ctx.fill();
      
      if (isActive) {
        // Laser Verde
        const laserY = 150;
        
        // Emissor
        ctx.fillStyle = '#333';
        ctx.fillRect(20, laserY - 10, 40, 20);
        
        // Feixe entrando
        ctx.strokeStyle = 'rgba(74, 222, 128, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(60, laserY);
        ctx.lineTo(gelX - 60, laserY);
        ctx.stroke();
        
        // Feixe DENTRO da gelatina (Espalhamento forte)
        ctx.strokeStyle = 'rgba(74, 222, 128, 0.9)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(gelX - 60, laserY);
        ctx.lineTo(gelX + 60, laserY);
        ctx.stroke();
        
        // Glow interno (Dispersão)
        const beamGlow = ctx.createLinearGradient(gelX - 60, laserY, gelX + 60, laserY);
        beamGlow.addColorStop(0, 'rgba(74, 222, 128, 0.6)');
        beamGlow.addColorStop(1, 'rgba(74, 222, 128, 0.2)');
        ctx.fillStyle = beamGlow;
        ctx.fillRect(gelX - 60, laserY - 5, 120, 10);
        
        // Partículas internas iluminadas
        for(let i=0; i<20; i++) {
            const px = gelX - 50 + Math.random() * 100;
            const py = laserY - 5 + Math.random() * 10;
            ctx.fillStyle = '#bbf7d0';
            ctx.beginPath();
            ctx.arc(px, py, 1, 0, Math.PI*2);
            ctx.fill();
        }
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(animationId);
  }, [isActive]);
  
  return <canvas ref={canvasRef} className="w-full h-full rounded-lg" />;
}

function SkyScene({ isActive }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 250;
    
    let animationId;
    let time = 0;
    
    const animate = () => {
      time += 0.005;
      ctx.clearRect(0, 0, 400, 250);
      
      // Céu gradiente
      const skyGradient = ctx.createLinearGradient(0, 0, 0, 250);
      skyGradient.addColorStop(0, '#0284c7'); // Azul escuro topo
      skyGradient.addColorStop(1, '#bae6fd'); // Azul claro horizonte
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, 400, 250);
      
      // Sol
      const sunY = 50;
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(350, sunY, 30, 0, Math.PI * 2);
      ctx.fill();
      
      // Nuvens (Brancas - Mie Scattering)
      const drawCloud = (x, y, scale) => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(x, y, 20 * scale, 0, Math.PI * 2);
        ctx.arc(x + 25 * scale, y - 10 * scale, 25 * scale, 0, Math.PI * 2);
        ctx.arc(x + 50 * scale, y, 20 * scale, 0, Math.PI * 2);
        ctx.fill();
      };
      
      drawCloud(50 + Math.sin(time) * 20, 60, 1);
      drawCloud(150 + Math.sin(time * 0.8) * 15, 100, 0.8);
      
      if (isActive) {
        // Visualização do Espalhamento Rayleigh
        
        // Molécula de ar (Zoom)
        const molX = 200;
        const molY = 180;
        
        // Círculo de destaque
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(molX, molY, 60, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fill();
        
        // Molécula N2
        ctx.fillStyle = '#60a5fa';
        ctx.beginPath();
        ctx.arc(molX - 10, molY, 10, 0, Math.PI * 2);
        ctx.arc(molX + 10, molY, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Luz branca chegando
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(molX - 50, molY - 40);
        ctx.lineTo(molX, molY);
        ctx.stroke();
        
        // Espalhamento AZUL (Forte)
        for(let i=0; i<8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const len = 30 + Math.random() * 10;
            ctx.strokeStyle = '#3b82f6'; // Azul
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(molX, molY);
            ctx.lineTo(molX + Math.cos(angle) * len, molY + Math.sin(angle) * len);
            ctx.stroke();
        }
        
        // Espalhamento VERMELHO (Fraco/Nulo)
        // (Não desenhamos ou desenhamos muito curto para mostrar que passa direto ou espalha pouco)
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(molX, molY);
        ctx.lineTo(molX + 40, molY + 30); // Passa quase reto
        ctx.stroke();
        
        // Texto explicativo
        ctx.fillStyle = '#fff';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Espalha Azul', molX, molY + 80);
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(animationId);
  }, [isActive]);
  
  return <canvas ref={canvasRef} className="w-full h-full rounded-lg" />;
}

export default function EverydayExamples() {
  const [activeExample, setActiveExample] = useState(null);
  const [hoveredExample, setHoveredExample] = useState(null);

  const renderScene = (id, isActive) => {
    switch (id) {
      case 'forest':
        return <ForestScene isActive={isActive} />;
      case 'milk':
        return <MilkScene isActive={isActive} />;
      case 'smoke':
        return <SmokeScene isActive={isActive} />;
      case 'gelatin':
        return <GelatinScene isActive={isActive} />;
      case 'sky':
        return <SkyScene isActive={isActive} />;
      default:
        return null;
    }
  };

  return (
    <section id="experimento4" className="py-20 px-4 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="badge-warning mb-4 inline-block">Experimento 4</span>
          <h2 className="text-4xl font-bold mb-4">Exemplos do Cotidiano</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            O Efeito Tyndall está presente em diversos fenômenos do dia a dia. 
            Clique em cada exemplo para ver a animação!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examples.map((example) => {
            const Icon = example.icon;
            const isActive = activeExample === example.id;
            const isHovered = hoveredExample === example.id;
            const showAnimation = isActive || isHovered;
            
            return (
              <div
                key={example.id}
                className={`glass-panel cursor-pointer transition-all duration-300 ${
                  isActive ? 'ring-2 ring-blue-500 scale-105' : ''
                } ${isHovered ? 'scale-102' : ''}`}
                onClick={() => setActiveExample(isActive ? null : example.id)}
                onMouseEnter={() => setHoveredExample(example.id)}
                onMouseLeave={() => setHoveredExample(null)}
              >
                {/* Cabeçalho */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${example.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{example.title}</h3>
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">{example.type}</span>
                  </div>
                </div>
                
                {/* Canvas da cena */}
                <div className="h-56 bg-slate-950 rounded-lg overflow-hidden mb-4 relative border border-slate-800 shadow-inner">
                  {renderScene(example.id, showAnimation)}
                  
                  {/* Overlay de "Clique para interagir" se não estiver ativo */}
                  {!isActive && !isHovered && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                      <div className="bg-slate-900/80 p-2 rounded-full border border-slate-700">
                        <Play className="w-6 h-6 text-slate-300 ml-1" />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Descrição */}
                <p className="text-sm text-slate-300 mb-4 leading-relaxed">{example.description}</p>
                
                {/* Informações técnicas */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  <div className="bg-slate-800/50 rounded px-3 py-2 border border-slate-700/50">
                    <span className="text-slate-500 block mb-1">Disperso</span>
                    <span className="text-slate-200 font-medium">{example.disperso}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded px-3 py-2 border border-slate-700/50">
                    <span className="text-slate-500 block mb-1">Meio</span>
                    <span className="text-slate-200 font-medium">{example.meio}</span>
                  </div>
                </div>
                
                {/* Botão de ação */}
                <button
                  className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  {isActive ? (
                    <>
                      <Pause className="w-4 h-4" /> Animação Ativa
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" /> Ver Experimento
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Card explicativo sobre dispersão Rayleigh */}
        <div className="mt-12 glass-panel bg-gradient-to-r from-sky-900/20 to-blue-900/20 border-sky-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10">
            <h4 className="font-semibold text-sky-400 mb-3 flex items-center gap-2 text-lg">
              <Sun className="w-5 h-5" />
              Por que o céu é azul?
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed max-w-4xl">
              O espalhamento Rayleigh é um caso especial do Efeito Tyndall que ocorre quando as 
              partículas são muito menores que o comprimento de onda da luz. As moléculas de N₂ e O₂ 
              na atmosfera espalham a <strong className="text-blue-400">luz azul</strong> (λ ≈ 475nm) 
              muito mais do que a <strong className="text-red-400">luz vermelha</strong> (λ ≈ 650nm), 
              fazendo o céu parecer azul durante o dia. No pôr do sol, a luz atravessa uma camada maior da atmosfera, 
              e como o azul já foi espalhado, apenas o vermelho chega até nós!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
