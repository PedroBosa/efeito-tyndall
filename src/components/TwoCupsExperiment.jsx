import { useState, useEffect, useRef, useCallback } from 'react';
import { Flashlight, Eye, RotateCcw, Info } from 'lucide-react';

export default function TwoCupsExperiment() {
  const canvasRef = useRef(null);
  const [targetCup, setTargetCup] = useState('both'); // 'cup1', 'cup2', 'both'
  const [flashlightAngle, setFlashlightAngle] = useState(90); // 0-180 graus (90 = vertical)
  const [flashlightDistance, setFlashlightDistance] = useState(50); // Distância do centro
  const [lightIntensity, setLightIntensity] = useState(80);
  const [microscopicMode, setMicroscopicMode] = useState(false);
  const [illuminatedCount, setIlluminatedCount] = useState(0);
  
  // Partículas para cada copo
  const particlesRef = useRef({
    cup1: [], // Solução - partículas muito pequenas
    cup2: []  // Coloide - partículas maiores
  });

  // Inicializar partículas
  useEffect(() => {
    // Solução verdadeira - partículas microscópicas (invisíveis a olho nu)
    // Íons são < 1nm, impossível ver sem modo microscópico
    particlesRef.current.cup1 = Array.from({ length: 150 }, () => ({
      x: Math.random() * 140 + 5,
      y: Math.random() * 180 + 40,
      size: Math.random() * 0.8 + 0.3, // Muito pequenas (0.3-1.1px)
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      illuminated: false
    }));

    // Coloide - partículas coloidais (100-1000nm, visíveis com luz)
    // Menores que antes para parecer mais realista
    particlesRef.current.cup2 = Array.from({ length: 40 }, () => ({
      x: Math.random() * 140 + 5,
      y: Math.random() * 180 + 40,
      size: Math.random() * 2 + 2, // Menores (2-4px) para ser mais realista
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      illuminated: false,
      glowIntensity: 0
    }));
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Configurações dos copos
    const cupWidth = 150;
    const cupHeight = 250;
    const cup1X = 80;
    const cup2X = 320;
    const cupY = 180;
    
    // Calcular quais copos serão iluminados
    const illuminateCup1 = targetCup === 'cup1' || targetCup === 'both';
    const illuminateCup2 = targetCup === 'cup2' || targetCup === 'both';
    
    // Desenhar feixes de luz
    const beamOpacity = lightIntensity / 100;
    
    const drawLightBeam = (cupX, isColloid, cupIndex) => {
      // Centro do copo (alvo da luz)
      const cupCenterX = cupX + cupWidth / 2;
      const cupCenterY = cupY + cupHeight / 2;
      const liquidTopY = cupY + 20; // Onde começa o líquido
      const cupBottom = cupY + cupHeight;
      const cupLeft = cupX;
      const cupRight = cupX + cupWidth;
      
      // Converter ângulo para radianos (0° = esquerda, 90° = cima, 180° = direita)
      const angleRad = (flashlightAngle * Math.PI) / 180;
      
      // Calcular posição da lanterna baseada no ângulo e distância
      const dist = 120 + flashlightDistance * 1.5;
      const flashX = cupCenterX - Math.cos(angleRad) * dist;
      const flashY = cupCenterY - Math.sin(angleRad) * dist;
      
      // Direção do feixe (da lanterna para o centro do copo)
      const dirX = cupCenterX - flashX;
      const dirY = cupCenterY - flashY;
      const len = Math.sqrt(dirX * dirX + dirY * dirY);
      const normX = dirX / len;
      const normY = dirY / len;
      
      // Vetor perpendicular para a largura do feixe
      const perpX = -normY;
      const perpY = normX;
      
      // Desenhar lanterna profissional
      ctx.save();
      ctx.translate(flashX, flashY);
      ctx.rotate(Math.atan2(dirY, dirX) - Math.PI/2);
      
      // Sombra da lanterna
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(3, 20, 12, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Corpo principal da lanterna (metal)
      const bodyGradient = ctx.createLinearGradient(-18, 0, 18, 0);
      bodyGradient.addColorStop(0, '#1F2937');
      bodyGradient.addColorStop(0.3, '#4B5563');
      bodyGradient.addColorStop(0.5, '#6B7280');
      bodyGradient.addColorStop(0.7, '#4B5563');
      bodyGradient.addColorStop(1, '#1F2937');
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.roundRect(-18, -20, 36, 35, 4);
      ctx.fill();
      
      // Borda metálica
      ctx.strokeStyle = '#9CA3AF';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(-18, -20, 36, 35, 4);
      ctx.stroke();
      
      // Cabeça da lanterna (onde sai a luz)
      const headGradient = ctx.createLinearGradient(-14, 15, 14, 15);
      headGradient.addColorStop(0, '#374151');
      headGradient.addColorStop(0.5, '#4B5563');
      headGradient.addColorStop(1, '#374151');
      ctx.fillStyle = headGradient;
      ctx.beginPath();
      ctx.moveTo(-14, 15);
      ctx.lineTo(-18, 25);
      ctx.lineTo(18, 25);
      ctx.lineTo(14, 15);
      ctx.closePath();
      ctx.fill();
      
      // Lente da lanterna
      const lensGradient = ctx.createRadialGradient(0, 25, 0, 0, 25, 14);
      lensGradient.addColorStop(0, '#FEFCE8');
      lensGradient.addColorStop(0.5, '#FDE047');
      lensGradient.addColorStop(1, '#EAB308');
      ctx.fillStyle = lensGradient;
      ctx.beginPath();
      ctx.ellipse(0, 25, 12, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Brilho intenso na lente
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.ellipse(-3, 24, 3, 1.5, -0.3, 0, Math.PI * 2);
      ctx.fill();
      
      // Glow ao redor da lente
      const lanternGlow = ctx.createRadialGradient(0, 25, 0, 0, 25, 40);
      lanternGlow.addColorStop(0, `rgba(253, 224, 71, ${beamOpacity * 0.6})`);
      lanternGlow.addColorStop(0.5, `rgba(253, 224, 71, ${beamOpacity * 0.2})`);
      lanternGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = lanternGlow;
      ctx.beginPath();
      ctx.arc(0, 25, 40, 0, Math.PI * 2);
      ctx.fill();
      
      // Botão de liga/desliga
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.arc(0, -5, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(-1, -6, 1.5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
      
      // Largura do feixe baseada na distância (mais perto = mais concentrado)
      const distanceFactor = 1 + (flashlightDistance / 100); // 1.0 a 2.0
      const beamWidth = 8 + (flashlightDistance / 10); // 8-18px baseado na distância
      
      // Intensidade baseada na distância (mais perto = mais intenso)
      const distanceIntensity = 1 - (flashlightDistance / 200); // 1.0 a 0.5
      const adjustedOpacity = beamOpacity * distanceIntensity;
      
      // Função para calcular interseção com linha horizontal
      const intersectHorizontal = (y) => {
        if (normY === 0) return null;
        const t = (y - flashY) / normY;
        if (t < 0) return null;
        return { x: flashX + normX * t, y: y, t: t };
      };
      
      // Função para calcular interseção com linha vertical
      const intersectVertical = (x) => {
        if (normX === 0) return null;
        const t = (x - flashX) / normX;
        if (t < 0) return null;
        return { x: x, y: flashY + normY * t, t: t };
      };
      
      // Encontrar ponto de entrada no líquido
      let entryPoint = null;
      
      // Verificar interseção com superfície do líquido (topo)
      const topIntersect = intersectHorizontal(liquidTopY);
      if (topIntersect && topIntersect.x >= cupLeft && topIntersect.x <= cupRight) {
        entryPoint = topIntersect;
      }
      
      // Verificar interseção com lado esquerdo do copo
      if (!entryPoint) {
        const leftIntersect = intersectVertical(cupLeft);
        if (leftIntersect && leftIntersect.y >= liquidTopY && leftIntersect.y <= cupBottom) {
          entryPoint = leftIntersect;
        }
      }
      
      // Verificar interseção com lado direito do copo
      if (!entryPoint) {
        const rightIntersect = intersectVertical(cupRight);
        if (rightIntersect && rightIntersect.y >= liquidTopY && rightIntersect.y <= cupBottom) {
          entryPoint = rightIntersect;
        }
      }
      
      // Calcular ponto final do feixe (saída ou fundo do copo)
      const beamLength = 400;
      const farEndX = flashX + normX * beamLength;
      const farEndY = flashY + normY * beamLength;
      
      // === PARTE 1: Feixe no AR (da lanterna até o líquido) - SEMPRE FINO ===
      if (entryPoint) {
        // Gradiente suave do feixe no ar
        const airGradient = ctx.createLinearGradient(flashX, flashY, entryPoint.x, entryPoint.y);
        airGradient.addColorStop(0, `rgba(255, 248, 220, ${adjustedOpacity * 0.8})`);
        airGradient.addColorStop(0.5, `rgba(253, 230, 138, ${adjustedOpacity * 0.6})`);
        airGradient.addColorStop(1, `rgba(252, 211, 77, ${adjustedOpacity * 0.5})`);
        
        // Desenhar feixe com bordas suaves
        ctx.beginPath();
        ctx.moveTo(flashX + perpX * beamWidth/2, flashY + perpY * beamWidth/2);
        ctx.lineTo(flashX - perpX * beamWidth/2, flashY - perpY * beamWidth/2);
        ctx.lineTo(entryPoint.x - perpX * beamWidth/2, entryPoint.y - perpY * beamWidth/2);
        ctx.lineTo(entryPoint.x + perpX * beamWidth/2, entryPoint.y + perpY * beamWidth/2);
        ctx.closePath();
        ctx.fillStyle = airGradient;
        ctx.fill();
        
        // Núcleo brilhante central no ar
        const coreWidth = beamWidth * 0.3;
        const coreGradient = ctx.createLinearGradient(flashX, flashY, entryPoint.x, entryPoint.y);
        coreGradient.addColorStop(0, `rgba(255, 255, 255, ${adjustedOpacity * 0.5})`);
        coreGradient.addColorStop(1, `rgba(255, 255, 240, ${adjustedOpacity * 0.3})`);
        
        ctx.beginPath();
        ctx.moveTo(flashX + perpX * coreWidth/2, flashY + perpY * coreWidth/2);
        ctx.lineTo(flashX - perpX * coreWidth/2, flashY - perpY * coreWidth/2);
        ctx.lineTo(entryPoint.x - perpX * coreWidth/2, entryPoint.y - perpY * coreWidth/2);
        ctx.lineTo(entryPoint.x + perpX * coreWidth/2, entryPoint.y + perpY * coreWidth/2);
        ctx.closePath();
        ctx.fillStyle = coreGradient;
        ctx.fill();
        
        // === PARTE 2: Feixe DENTRO do líquido com CLIPPING ===
        // Usar clipping para garantir que o feixe não saia do copo
        ctx.save();
        ctx.beginPath();
        ctx.rect(cupX, cupY, cupWidth, cupHeight);
        ctx.clip();
        
        // Ponto de saída baseado na direção (longe o suficiente para ser cortado pelo clip)
        const exitX = entryPoint.x + normX * 300;
        const exitY = entryPoint.y + normY * 300;
        
        if (isColloid) {
          // COLOIDE: Feixe EXPANDE progressivamente ao entrar no líquido
          const expandedWidth = beamWidth * 3.5;
          
          // Glow externo suave (efeito de espalhamento)
          const outerGlow = ctx.createLinearGradient(entryPoint.x, entryPoint.y, exitX, exitY);
          outerGlow.addColorStop(0, `rgba(253, 224, 71, ${adjustedOpacity * 0.35})`);
          outerGlow.addColorStop(1, `rgba(253, 224, 71, ${adjustedOpacity * 0.1})`);
          
          const outerWidth = expandedWidth * 1.5;
          ctx.beginPath();
          ctx.moveTo(entryPoint.x + perpX * beamWidth, entryPoint.y + perpY * beamWidth);
          ctx.lineTo(entryPoint.x - perpX * beamWidth, entryPoint.y - perpY * beamWidth);
          ctx.lineTo(exitX - perpX * outerWidth/2, exitY - perpY * outerWidth/2);
          ctx.lineTo(exitX + perpX * outerWidth/2, exitY + perpY * outerWidth/2);
          ctx.closePath();
          ctx.fillStyle = outerGlow;
          ctx.fill();
          
          // Feixe principal que expande
          const liquidGradient = ctx.createLinearGradient(entryPoint.x, entryPoint.y, exitX, exitY);
          liquidGradient.addColorStop(0, `rgba(255, 251, 235, ${adjustedOpacity * 0.95})`);
          liquidGradient.addColorStop(0.3, `rgba(254, 243, 199, ${adjustedOpacity * 0.85})`);
          liquidGradient.addColorStop(0.7, `rgba(253, 230, 138, ${adjustedOpacity * 0.7})`);
          liquidGradient.addColorStop(1, `rgba(252, 211, 77, ${adjustedOpacity * 0.5})`);
          
          ctx.beginPath();
          ctx.moveTo(entryPoint.x + perpX * beamWidth/2, entryPoint.y + perpY * beamWidth/2);
          ctx.lineTo(entryPoint.x - perpX * beamWidth/2, entryPoint.y - perpY * beamWidth/2);
          ctx.lineTo(exitX - perpX * expandedWidth/2, exitY - perpY * expandedWidth/2);
          ctx.lineTo(exitX + perpX * expandedWidth/2, exitY + perpY * expandedWidth/2);
          ctx.closePath();
          ctx.fillStyle = liquidGradient;
          ctx.fill();
          
          // Núcleo brilhante central
          const glowGradient = ctx.createLinearGradient(entryPoint.x, entryPoint.y, exitX, exitY);
          glowGradient.addColorStop(0, `rgba(255, 255, 255, ${adjustedOpacity * 0.7})`);
          glowGradient.addColorStop(0.5, `rgba(255, 255, 255, ${adjustedOpacity * 0.4})`);
          glowGradient.addColorStop(1, `rgba(255, 255, 255, ${adjustedOpacity * 0.1})`);
          
          ctx.beginPath();
          ctx.moveTo(entryPoint.x + perpX * 2, entryPoint.y + perpY * 2);
          ctx.lineTo(entryPoint.x - perpX * 2, entryPoint.y - perpY * 2);
          ctx.lineTo(exitX - perpX * 8, exitY - perpY * 8);
          ctx.lineTo(exitX + perpX * 8, exitY + perpY * 8);
          ctx.closePath();
          ctx.fillStyle = glowGradient;
          ctx.fill();
          
          // Partículas de dispersão
          for (let i = 0; i < 12; i++) {
            const t = 0.1 + (i / 12) * 0.6;
            const px = entryPoint.x + (exitX - entryPoint.x) * t;
            const py = entryPoint.y + (exitY - entryPoint.y) * t;
            
            const currentWidth = beamWidth/2 + (expandedWidth/2 - beamWidth/2) * t;
            const offsetX = (Math.random() - 0.5) * currentWidth;
            const offsetY = (Math.random() - 0.5) * currentWidth;
            
            ctx.beginPath();
            ctx.arc(px + offsetX, py + offsetY, 1 + Math.random() * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${(0.3 + Math.random() * 0.4) * adjustedOpacity})`;
            ctx.fill();
          }
        } else {
          // SOLUÇÃO: Feixe continua FINO e quase invisível
          const liquidGradient = ctx.createLinearGradient(entryPoint.x, entryPoint.y, exitX, exitY);
          liquidGradient.addColorStop(0, `rgba(252, 211, 77, ${adjustedOpacity * 0.15})`);
          liquidGradient.addColorStop(0.5, `rgba(252, 211, 77, ${adjustedOpacity * 0.08})`);
          liquidGradient.addColorStop(1, `rgba(252, 211, 77, ${adjustedOpacity * 0.02})`);
          
          ctx.beginPath();
          ctx.moveTo(entryPoint.x + perpX * beamWidth/2, entryPoint.y + perpY * beamWidth/2);
          ctx.lineTo(entryPoint.x - perpX * beamWidth/2, entryPoint.y - perpY * beamWidth/2);
          ctx.lineTo(exitX - perpX * beamWidth/2, exitY - perpY * beamWidth/2);
          ctx.lineTo(exitX + perpX * beamWidth/2, exitY + perpY * beamWidth/2);
          ctx.closePath();
          ctx.fillStyle = liquidGradient;
          ctx.fill();
        }
        
        ctx.restore(); // Remove o clipping
      } else {
        // Se não encontrou ponto de entrada, desenha feixe completo no ar
        const airGradient = ctx.createLinearGradient(flashX, flashY, farEndX, farEndY);
        airGradient.addColorStop(0, `rgba(252, 211, 77, ${adjustedOpacity * 0.7})`);
        airGradient.addColorStop(1, `rgba(252, 211, 77, ${adjustedOpacity * 0.1})`);
        
        ctx.beginPath();
        ctx.moveTo(flashX + perpX * beamWidth/2, flashY + perpY * beamWidth/2);
        ctx.lineTo(flashX - perpX * beamWidth/2, flashY - perpY * beamWidth/2);
        ctx.lineTo(farEndX - perpX * beamWidth/2, farEndY - perpY * beamWidth/2);
        ctx.lineTo(farEndX + perpX * beamWidth/2, farEndY + perpY * beamWidth/2);
        ctx.closePath();
        ctx.fillStyle = airGradient;
        ctx.fill();
      }
    };
    
    // Desenhar copo com visual profissional (estilo béquer de laboratório)
    const drawCup = (x, y, label, isColloid) => {
      // Sombra do copo
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(x + cupWidth/2 + 5, y + cupHeight + 8, cupWidth/2 - 5, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Fundo do copo (vidro)
      ctx.fillStyle = 'rgba(148, 163, 184, 0.1)';
      ctx.fillRect(x, y, cupWidth, cupHeight);
      
      // Líquido
      const liquidY = y + 18;
      const liquidHeight = cupHeight - 18;
      
      if (isColloid) {
        // Coloide: cor leitosa/turva
        const liquidGradient = ctx.createLinearGradient(x, liquidY, x, y + cupHeight);
        liquidGradient.addColorStop(0, 'rgba(220, 230, 240, 0.85)');
        liquidGradient.addColorStop(0.5, 'rgba(200, 215, 230, 0.8)');
        liquidGradient.addColorStop(1, 'rgba(180, 200, 220, 0.75)');
        ctx.fillStyle = liquidGradient;
      } else {
        // Solução: transparente/cristalina
        const liquidGradient = ctx.createLinearGradient(x, liquidY, x, y + cupHeight);
        liquidGradient.addColorStop(0, 'rgba(100, 180, 255, 0.25)');
        liquidGradient.addColorStop(0.5, 'rgba(80, 160, 240, 0.2)');
        liquidGradient.addColorStop(1, 'rgba(60, 140, 220, 0.25)');
        ctx.fillStyle = liquidGradient;
      }
      ctx.fillRect(x + 3, liquidY, cupWidth - 6, liquidHeight - 3);
      
      // Superfície do líquido (menisco)
      ctx.beginPath();
      ctx.ellipse(x + cupWidth/2, liquidY, cupWidth/2 - 3, 6, 0, 0, Math.PI * 2);
      ctx.fillStyle = isColloid ? 'rgba(230, 240, 250, 0.6)' : 'rgba(150, 200, 255, 0.3)';
      ctx.fill();
      
      // Reflexo no vidro (lado esquerdo)
      const reflectGradient = ctx.createLinearGradient(x, y, x + 20, y);
      reflectGradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
      reflectGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = reflectGradient;
      ctx.fillRect(x + 3, y + 5, 15, cupHeight - 10);
      
      // Contorno do copo (vidro de laboratório)
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.8)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + cupHeight);
      ctx.lineTo(x + cupWidth, y + cupHeight);
      ctx.lineTo(x + cupWidth, y);
      ctx.stroke();
      
      // Borda superior do copo (lábio do béquer)
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.9)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x - 2, y);
      ctx.lineTo(x + cupWidth + 2, y);
      ctx.stroke();
      
      // Marcações de volume no copo
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.lineWidth = 1;
      for (let i = 1; i <= 4; i++) {
        const markY = y + cupHeight - (i * cupHeight / 5);
        ctx.beginPath();
        ctx.moveTo(x + 5, markY);
        ctx.lineTo(x + 20, markY);
        ctx.stroke();
      }
      
      // Labels profissionais
      ctx.fillStyle = '#F1F5F9';
      ctx.font = 'bold 15px "Segoe UI", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, x + cupWidth/2, y + cupHeight + 28);
      
      ctx.font = '12px "Segoe UI", system-ui, sans-serif';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText(isColloid ? '(Água + Amido)' : '(Água + Sal)', x + cupWidth/2, y + cupHeight + 46);
    };
    
    drawCup(cup1X, cupY, 'Solução Verdadeira', false);
    drawCup(cup2X, cupY, 'Coloide', true);
    
    // Desenhar feixes de luz se estiverem ativos
    if (illuminateCup1) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      drawLightBeam(cup1X, false, 0);
      ctx.restore();
    }
    
    if (illuminateCup2) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      drawLightBeam(cup2X, true, 1);
      ctx.restore();
    }
    
    // Atualizar e desenhar partículas
    let count = 0;
    const sizeMultiplier = microscopicMode ? 3 : 1;
    
    // Partículas do Copo 1 (muito pequenas, quase invisíveis)
    particlesRef.current.cup1.forEach(p => {
      // Movimento Browniano
      p.vx += (Math.random() - 0.5) * 0.1;
      p.vy += (Math.random() - 0.5) * 0.1;
      p.vx = Math.max(-0.5, Math.min(0.5, p.vx));
      p.vy = Math.max(-0.5, Math.min(0.5, p.vy));
      
      p.x += p.vx;
      p.y += p.vy;
      
      // Manter dentro do copo
      if (p.x < 5) { p.x = 5; p.vx *= -1; }
      if (p.x > 145) { p.x = 145; p.vx *= -1; }
      if (p.y < 40) { p.y = 40; p.vy *= -1; }
      if (p.y > 220) { p.y = 220; p.vy *= -1; }
      
      // Desenhar partícula (muito pequena, quase invisível)
      if (microscopicMode) {
        ctx.beginPath();
        ctx.arc(cup1X + p.x, cupY + p.y - 20, p.size * sizeMultiplier, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 197, 253, 0.5)`;
        ctx.fill();
      }
    });
    
    // Partículas do Copo 2 (maiores e visíveis)
    particlesRef.current.cup2.forEach(p => {
      // Movimento Browniano
      p.vx += (Math.random() - 0.5) * 0.15;
      p.vy += (Math.random() - 0.5) * 0.15;
      p.vx = Math.max(-0.8, Math.min(0.8, p.vx));
      p.vy = Math.max(-0.8, Math.min(0.8, p.vy));
      
      p.x += p.vx;
      p.y += p.vy;
      
      // Manter dentro do copo
      if (p.x < 10) { p.x = 10; p.vx *= -1; }
      if (p.x > 140) { p.x = 140; p.vx *= -1; }
      if (p.y < 45) { p.y = 45; p.vy *= -1; }
      if (p.y > 215) { p.y = 215; p.vy *= -1; }
      
      // Verificar se está sendo iluminada
      const particleScreenX = cup2X + p.x;
      const particleScreenY = cupY + p.y - 20;
      const beamCenterX = cup2X + cupWidth/2;
      
      p.illuminated = illuminateCup2 && Math.abs(particleScreenX - beamCenterX) < 40;
      
      if (p.illuminated) {
        p.glowIntensity = Math.min(1, p.glowIntensity + 0.1);
        count++;
      } else {
        p.glowIntensity = Math.max(0, p.glowIntensity - 0.05);
      }
      
      // Desenhar partícula
      const size = p.size * sizeMultiplier;
      
      // Glow quando iluminada (efeito Tyndall)
      if (p.glowIntensity > 0) {
        const glowSize = size * 4; // Glow maior que a partícula
        const glowGradient = ctx.createRadialGradient(
          particleScreenX, particleScreenY, 0,
          particleScreenX, particleScreenY, glowSize
        );
        glowGradient.addColorStop(0, `rgba(255, 255, 255, ${p.glowIntensity * 0.9})`);
        glowGradient.addColorStop(0.3, `rgba(252, 211, 77, ${p.glowIntensity * 0.6})`);
        glowGradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(particleScreenX, particleScreenY, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();
      }
      
      // Partícula principal
      ctx.beginPath();
      ctx.arc(particleScreenX, particleScreenY, size, 0, Math.PI * 2);
      ctx.fillStyle = p.illuminated 
        ? `rgba(255, 255, 255, ${0.7 + p.glowIntensity * 0.3})`
        : 'rgba(203, 213, 225, 0.6)';
      ctx.fill();
    });
    
    setIlluminatedCount(count);
    
    // Indicadores de resultado profissionais
    const drawResult = (x, y, success) => {
      // Fundo do badge
      const badgeWidth = 200;
      const badgeHeight = 28;
      const badgeX = x - badgeWidth/2;
      const badgeY = y - badgeHeight/2 - 5;
      
      // Sombra
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.roundRect(badgeX + 2, badgeY + 2, badgeWidth, badgeHeight, 6);
      ctx.fill();
      
      // Badge background
      if (success) {
        const successGradient = ctx.createLinearGradient(badgeX, badgeY, badgeX, badgeY + badgeHeight);
        successGradient.addColorStop(0, 'rgba(16, 185, 129, 0.95)');
        successGradient.addColorStop(1, 'rgba(5, 150, 105, 0.95)');
        ctx.fillStyle = successGradient;
      } else {
        const errorGradient = ctx.createLinearGradient(badgeX, badgeY, badgeX, badgeY + badgeHeight);
        errorGradient.addColorStop(0, 'rgba(239, 68, 68, 0.9)');
        errorGradient.addColorStop(1, 'rgba(185, 28, 28, 0.9)');
        ctx.fillStyle = errorGradient;
      }
      
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 6);
      ctx.fill();
      
      // Borda
      ctx.strokeStyle = success ? 'rgba(52, 211, 153, 0.8)' : 'rgba(248, 113, 113, 0.8)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Ícone e texto
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 13px "Segoe UI", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      if (success) {
        ctx.fillText('✓ Efeito Tyndall OBSERVADO', x, y);
      } else {
        ctx.fillText('✗ Sem Efeito Tyndall', x, y);
      }
      
      ctx.textBaseline = 'alphabetic';
    };
    
    if (illuminateCup1) {
      drawResult(cup1X + cupWidth/2, cupY - 20, false);
    }
    if (illuminateCup2) {
      drawResult(cup2X + cupWidth/2, cupY - 20, true);
    }
    
  }, [targetCup, flashlightAngle, flashlightDistance, lightIntensity, microscopicMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = 560;
    canvas.height = 500;
    
    let animationId;
    const loop = () => {
      animate();
      animationId = requestAnimationFrame(loop);
    };
    loop();
    
    return () => cancelAnimationFrame(animationId);
  }, [animate]);

  const resetExperiment = () => {
    setTargetCup('both');
    setFlashlightAngle(90);
    setFlashlightDistance(50);
    setLightIntensity(80);
    setMicroscopicMode(false);
  };

  return (
    <section id="experimento1" className="py-20 px-4 bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="badge-success mb-4 inline-block">Experimento 1</span>
          <h2 className="text-4xl font-bold mb-4">Teste dos Dois Copos</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Compare como a luz se comporta ao atravessar uma solução verdadeira e um coloide. 
            Observe o Efeito Tyndall em ação!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Canvas do experimento */}
          <div className="lg:col-span-2">
            <div className="glass-panel">
              <canvas
                ref={canvasRef}
                className="w-full rounded-lg bg-slate-950"
                style={{ maxWidth: '560px', margin: '0 auto', display: 'block' }}
              />
              
              {/* Legenda */}
              <div className="mt-4 flex flex-wrap gap-4 justify-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-400/30" />
                  <span className="text-slate-400">Solução (partículas &lt;1nm)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/60" />
                  <span className="text-slate-400">Coloide (1-1000nm)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Painel de controles */}
          <div className="space-y-6">
            <div className="glass-panel">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Flashlight className="w-5 h-5 text-yellow-400" />
                Controles
              </h3>
              
              {/* Seletor de copo */}
              <div className="mb-6">
                <label className="block text-sm text-slate-400 mb-2">Iluminar:</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'cup1', label: 'Copo 1' },
                    { value: 'cup2', label: 'Copo 2' },
                    { value: 'both', label: 'Ambos' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setTargetCup(option.value)}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        targetCup === option.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ângulo da lanterna */}
              <div className="mb-6">
                <label className="block text-sm text-slate-400 mb-2">
                  Ângulo: {flashlightAngle}° {flashlightAngle < 45 ? '(Esquerda)' : flashlightAngle > 135 ? '(Direita)' : flashlightAngle === 90 ? '(Vertical)' : ''}
                </label>
                <input
                  type="range"
                  min="30"
                  max="150"
                  value={flashlightAngle}
                  onChange={(e) => setFlashlightAngle(Number(e.target.value))}
                  className="slider-track w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>↖ Esquerda</span>
                  <span>↑ Cima</span>
                  <span>↗ Direita</span>
                </div>
              </div>

              {/* Distância da lanterna */}
              <div className="mb-6">
                <label className="block text-sm text-slate-400 mb-2">
                  Distância: {flashlightDistance < 30 ? 'Perto' : flashlightDistance > 70 ? 'Longe' : 'Média'}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={flashlightDistance}
                  onChange={(e) => setFlashlightDistance(Number(e.target.value))}
                  className="slider-track w-full"
                />
              </div>

              {/* Intensidade da luz */}
              <div className="mb-6">
                <label className="block text-sm text-slate-400 mb-2">
                  Intensidade da Luz: {lightIntensity}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={lightIntensity}
                  onChange={(e) => setLightIntensity(Number(e.target.value))}
                  className="slider-track w-full"
                />
              </div>

              {/* Modo microscópico */}
              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={microscopicMode}
                    onChange={() => setMicroscopicMode((prev) => !prev)}
                  />
                  <div className={`w-12 h-6 rounded-full transition-colors ${
                    microscopicMode ? 'bg-blue-600' : 'bg-slate-600'
                  }`}>
                    <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                      microscopicMode ? 'translate-x-6' : 'translate-x-0.5'
                    } mt-0.5`} />
                  </div>
                  <span className="text-sm flex items-center gap-2" data-tooltip="Amplia o tamanho das partículas para visualização">
                    <Eye className="w-4 h-4" />
                    Modo Microscópico
                  </span>
                </label>
              </div>

              {/* Botão reset */}
              <button
                onClick={resetExperiment}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Resetar Experimento
              </button>
            </div>

            {/* Painel de dados */}
            <div className="glass-panel">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-400" />
                Dados em Tempo Real
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center" data-tooltip="Contagem de partículas coloidais que estão refletindo luz agora">
                  <span className="text-slate-400">Partículas iluminadas:</span>
                  <span className="font-mono text-blue-400">{illuminatedCount}</span>
                </div>
                <div className="flex justify-between items-center" data-tooltip="Percentual relativo de espalhamento baseado na luz incidente">
                  <span className="text-slate-400">Intensidade dispersão:</span>
                  <span className="font-mono text-yellow-400">
                    {targetCup === 'cup1' ? '0%' : `${Math.round(illuminatedCount * 2)}%`}
                  </span>
                </div>
                <div className="flex justify-between items-center" data-tooltip="Classificação atual da mistura iluminada">
                  <span className="text-slate-400">Tipo:</span>
                  <span className={`badge-${targetCup === 'cup1' ? 'error' : 'success'}`}>
                    {targetCup === 'cup1' ? 'Solução' : 'Coloide (Sol)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Explicação */}
            <div className="glass-panel bg-blue-500/10 border-blue-500/30">
              <h4 className="font-semibold text-blue-400 mb-2">💡 Por que isso acontece?</h4>
              <p className="text-sm text-slate-300">
                {targetCup === 'cup1' 
                  ? 'Na solução verdadeira, as partículas são muito pequenas (< 1nm) e não conseguem espalhar luz visível. O feixe atravessa sem ser percebido.'
                  : 'No coloide, as partículas têm tamanho entre 1-1000nm, suficiente para espalhar a luz e tornar o caminho do feixe visível. Este é o Efeito Tyndall!'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
