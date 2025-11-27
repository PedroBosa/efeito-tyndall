import { useState, useEffect, useRef, useCallback } from 'react';
import { Car, Lightbulb, Cloud, AlertTriangle, Eye, RotateCcw, Gauge, Zap } from 'lucide-react';

export default function FogExperiment() {
  const canvasRef = useRef(null);
  const [headlightType, setHeadlightType] = useState('low');
  const [fogDensity, setFogDensity] = useState(50);
  const [speed, setSpeed] = useState(30);
  const [viewMode, setViewMode] = useState('external');
  
  const fogParticlesRef = useRef([]);
  const timeRef = useRef(0);
  const [stats, setStats] = useState({
    visibility: 0,
    glare: 0,
    effectiveRange: 0,
    scatterEvents: 0
  });

  // Inicializar partículas de neblina
  useEffect(() => {
    const particleCount = 150 + Math.floor(fogDensity * 4);
    fogParticlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * 700 + 100,
      y: Math.random() * 280 + 40,
      z: Math.random(),
      size: Math.random() * 12 + 4,
      opacity: Math.random() * 0.5 + 0.2,
      speed: Math.random() * 0.8 + 0.3,
      drift: Math.random() * 2 - 1,
      illuminated: false,
      glowIntensity: 0,
      scatterAngle: Math.random() * Math.PI * 2
    }));
  }, [fogDensity]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    timeRef.current += 0.02;
    const time = timeRef.current;
    
    ctx.clearRect(0, 0, width, height);
    
    // === CÉU NOTURNO COM GRADIENTE ATMOSFÉRICO ===
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
    skyGradient.addColorStop(0, '#0a0f1a');
    skyGradient.addColorStop(0.3, '#0f172a');
    skyGradient.addColorStop(0.7, '#1a2744');
    skyGradient.addColorStop(1, '#1e293b');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height);
    
    // Estrelas sutis
    if (fogDensity < 40) {
      const starOpacity = (40 - fogDensity) / 40 * 0.5;
      ctx.fillStyle = `rgba(255, 255, 255, ${starOpacity})`;
      for (let i = 0; i < 30; i++) {
        const sx = (i * 127 + 50) % width;
        const sy = (i * 83 + 20) % (height - 120);
        ctx.beginPath();
        ctx.arc(sx, sy, 0.5 + Math.sin(time + i) * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // === ESTRADA REALISTA ===
    const roadY = height - 90;
    
    // Acostamento
    ctx.fillStyle = '#1a2e1a';
    ctx.fillRect(0, roadY - 10, width, height - roadY + 10);
    
    // Asfalto com textura
    const asphaltGradient = ctx.createLinearGradient(0, roadY, 0, height);
    asphaltGradient.addColorStop(0, '#2a2a2a');
    asphaltGradient.addColorStop(0.3, '#1f1f1f');
    asphaltGradient.addColorStop(1, '#151515');
    ctx.fillStyle = asphaltGradient;
    ctx.fillRect(0, roadY, width, height - roadY);
    
    // Linhas laterais
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, roadY + 5);
    ctx.lineTo(width, roadY + 5);
    ctx.stroke();
    
    // Linha central tracejada
    ctx.strokeStyle = '#FCD34D';
    ctx.lineWidth = 4;
    ctx.setLineDash([40, 25]);
    ctx.lineDashOffset = -time * speed * 2;
    ctx.beginPath();
    ctx.moveTo(0, roadY + 45);
    ctx.lineTo(width, roadY + 45);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // === CARRO DETALHADO ===
    const carX = 30;
    const carY = roadY - 55;
    const carWidth = 200;
    const carHeight = 55;
    
    // Sombra do carro
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.ellipse(carX + carWidth/2, roadY + 5, carWidth/2 + 10, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Corpo do carro
    const bodyGradient = ctx.createLinearGradient(carX, carY + 20, carX, carY + carHeight);
    bodyGradient.addColorStop(0, '#4a5568');
    bodyGradient.addColorStop(0.5, '#2d3748');
    bodyGradient.addColorStop(1, '#1a202c');
    ctx.fillStyle = bodyGradient;
    
    ctx.beginPath();
    ctx.moveTo(carX + 15, carY + carHeight);
    ctx.lineTo(carX + 5, carY + 35);
    ctx.quadraticCurveTo(carX, carY + 25, carX + 15, carY + 20);
    ctx.lineTo(carX + carWidth - 10, carY + 20);
    ctx.quadraticCurveTo(carX + carWidth + 5, carY + 25, carX + carWidth, carY + 35);
    ctx.lineTo(carX + carWidth - 5, carY + carHeight);
    ctx.closePath();
    ctx.fill();
    
    // Reflexo no corpo
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(carX + 20, carY + 30);
    ctx.lineTo(carX + carWidth - 20, carY + 30);
    ctx.stroke();
    
    // Cabine / teto
    const cabinGradient = ctx.createLinearGradient(carX + 50, carY - 20, carX + 50, carY + 20);
    cabinGradient.addColorStop(0, '#3d4a5c');
    cabinGradient.addColorStop(1, '#2d3748');
    ctx.fillStyle = cabinGradient;
    
    ctx.beginPath();
    ctx.moveTo(carX + 55, carY + 20);
    ctx.quadraticCurveTo(carX + 60, carY - 5, carX + 80, carY - 15);
    ctx.lineTo(carX + 150, carY - 15);
    ctx.quadraticCurveTo(carX + 170, carY - 5, carX + 175, carY + 20);
    ctx.closePath();
    ctx.fill();
    
    // Janelas
    const windowGradient = ctx.createLinearGradient(carX + 70, carY - 10, carX + 160, carY + 15);
    windowGradient.addColorStop(0, '#1e3a5f');
    windowGradient.addColorStop(0.3, '#0f2744');
    windowGradient.addColorStop(1, '#1e3a5f');
    ctx.fillStyle = windowGradient;
    
    // Janela traseira
    ctx.beginPath();
    ctx.moveTo(carX + 72, carY + 15);
    ctx.quadraticCurveTo(carX + 75, carY, carX + 85, carY - 8);
    ctx.lineTo(carX + 105, carY - 8);
    ctx.lineTo(carX + 105, carY + 15);
    ctx.closePath();
    ctx.fill();
    
    // Para-brisa
    ctx.beginPath();
    ctx.moveTo(carX + 115, carY + 15);
    ctx.lineTo(carX + 115, carY - 8);
    ctx.lineTo(carX + 155, carY - 8);
    ctx.quadraticCurveTo(carX + 165, carY, carX + 168, carY + 15);
    ctx.closePath();
    ctx.fill();
    
    // Reflexo nas janelas
    ctx.strokeStyle = 'rgba(100, 180, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(carX + 78, carY + 5);
    ctx.lineTo(carX + 100, carY - 3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(carX + 125, carY - 3);
    ctx.lineTo(carX + 155, carY + 5);
    ctx.stroke();
    
    // Rodas
    const drawWheel = (cx, cy, radius) => {
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      
      const rimGradient = ctx.createRadialGradient(cx - 3, cy - 3, 0, cx, cy, radius * 0.7);
      rimGradient.addColorStop(0, '#a0a0a0');
      rimGradient.addColorStop(0.5, '#606060');
      rimGradient.addColorStop(1, '#404040');
      ctx.fillStyle = rimGradient;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.65, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = '#2a2a2a';
      ctx.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5 + time * (speed / 20);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * radius * 0.55, cy + Math.sin(angle) * radius * 0.55);
        ctx.stroke();
      }
      
      ctx.fillStyle = '#505050';
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.2, 0, Math.PI * 2);
      ctx.fill();
    };
    
    drawWheel(carX + 50, carY + carHeight + 5, 22);
    drawWheel(carX + carWidth - 45, carY + carHeight + 5, 22);
    
    // === CONFIGURAÇÃO DOS FARÓIS ===
    const isHighBeam = headlightType === 'high';
    const headlightY = isHighBeam ? carY + 28 : carY + 40;
    const beamAngle = isHighBeam ? -5 : 12;
    const beamSpread = isHighBeam ? 35 : 22;
    const beamLength = isHighBeam ? 550 : 400;
    
    const headlightX = carX + carWidth - 8;
    
    // Carcaça do farol
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.ellipse(headlightX, headlightY, 14, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Lente do farol
    const lensGradient = ctx.createRadialGradient(headlightX, headlightY, 0, headlightX, headlightY, 10);
    lensGradient.addColorStop(0, '#fffef0');
    lensGradient.addColorStop(0.5, '#fcd34d');
    lensGradient.addColorStop(1, '#f59e0b');
    ctx.fillStyle = lensGradient;
    ctx.beginPath();
    ctx.ellipse(headlightX + 2, headlightY, 8, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Brilho intenso da lente
    const lensGlow = ctx.createRadialGradient(headlightX + 5, headlightY, 0, headlightX, headlightY, 40);
    lensGlow.addColorStop(0, 'rgba(255, 250, 220, 0.9)');
    lensGlow.addColorStop(0.3, 'rgba(252, 211, 77, 0.4)');
    lensGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = lensGlow;
    ctx.beginPath();
    ctx.arc(headlightX + 5, headlightY, 40, 0, Math.PI * 2);
    ctx.fill();
    
    // === FEIXE DE LUZ PRINCIPAL - FÍSICA REALISTA ===
    const beamStartX = headlightX + 10;
    const beamStartY = headlightY;
    const angleRad = (beamAngle * Math.PI) / 180;
    const spreadRad = (beamSpread * Math.PI) / 180;
    
    // Calcular atenuação baseada na neblina (Lei de Beer-Lambert)
    // Quanto MAIOR a densidade, MENOR o alcance e intensidade
    const fogFactor = fogDensity / 100; // 0 a 1
    const attenuationCoeff = fogFactor * 0.025; // Coeficiente de extinção (aumentado!)
    const effectiveBeamLength = beamLength * (1 - fogFactor * 0.6); // Alcance reduz até 60%
    
    // Opacidade geral do feixe diminui com neblina densa
    const fogAttenuation = 1 - fogFactor * 0.5; // Luz perde até 50% da intensidade visível
    
    const endX = beamStartX + effectiveBeamLength;
    const endCenterY = beamStartY + Math.tan(angleRad) * effectiveBeamLength;
    const halfSpreadY = Math.tan(spreadRad / 2) * effectiveBeamLength;
    const topEndY = endCenterY - halfSpreadY;
    const bottomEndY = endCenterY + halfSpreadY;
    
    // Função para calcular intensidade em um ponto (atenuação exponencial)
    const getIntensityAt = (distance) => {
      return Math.exp(-attenuationCoeff * distance) * fogAttenuation;
    };
    
    // Desenhar múltiplas camadas do feixe para efeito volumétrico
    const numLayers = 12;
    for (let layer = 0; layer < numLayers; layer++) {
      const layerProgress = layer / numLayers;
      const layerDistance = effectiveBeamLength * layerProgress;
      const intensity = getIntensityAt(layerDistance);
      
      // Largura do feixe aumenta com a distância (divergência)
      const layerWidth = 8 + layerProgress * halfSpreadY * 2;
      const layerCenterY = beamStartY + Math.tan(angleRad) * layerDistance;
      const layerX = beamStartX + layerDistance;
      
      // Opacidade diminui com distância E com neblina densa
      const baseOpacity = (isHighBeam ? 0.4 : 0.3) * fogAttenuation;
      const layerOpacity = baseOpacity * intensity * (1 - layerProgress * 0.4);
      
      if (layerOpacity > 0.01) {
        // Glow externo suave
        const layerGlow = ctx.createRadialGradient(
          layerX, layerCenterY, 0,
          layerX, layerCenterY, layerWidth * 1.5
        );
        layerGlow.addColorStop(0, `rgba(255, 250, 220, ${layerOpacity * 0.6})`);
        layerGlow.addColorStop(0.4, `rgba(252, 220, 100, ${layerOpacity * 0.3})`);
        layerGlow.addColorStop(0.7, `rgba(252, 200, 80, ${layerOpacity * 0.1})`);
        layerGlow.addColorStop(1, 'transparent');
        
        ctx.fillStyle = layerGlow;
        ctx.beginPath();
        ctx.arc(layerX, layerCenterY, layerWidth * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Feixe principal com gradiente cônico - opacidade afetada pela neblina
    const mainBeamGradient = ctx.createLinearGradient(beamStartX, beamStartY, endX, endCenterY);
    const mainOpacity = (isHighBeam ? 0.35 : 0.28) * fogAttenuation;
    mainBeamGradient.addColorStop(0, `rgba(255, 255, 240, ${mainOpacity})`);
    mainBeamGradient.addColorStop(0.2, `rgba(255, 248, 200, ${mainOpacity * 0.7 * getIntensityAt(effectiveBeamLength * 0.2)})`);
    mainBeamGradient.addColorStop(0.5, `rgba(252, 230, 120, ${mainOpacity * 0.4 * getIntensityAt(effectiveBeamLength * 0.5)})`);
    mainBeamGradient.addColorStop(1, `rgba(252, 211, 77, ${mainOpacity * 0.05 * getIntensityAt(effectiveBeamLength)})`);
    
    // Desenhar cone de luz com bordas suaves
    ctx.beginPath();
    ctx.moveTo(beamStartX, beamStartY - 8);
    ctx.lineTo(beamStartX, beamStartY + 8);
    
    // Curva bezier para bordas mais naturais
    ctx.bezierCurveTo(
      beamStartX + effectiveBeamLength * 0.3, beamStartY + 20,
      beamStartX + effectiveBeamLength * 0.7, bottomEndY - 10,
      endX, Math.min(bottomEndY, height - 25)
    );
    ctx.lineTo(endX, Math.max(topEndY, 25));
    ctx.bezierCurveTo(
      beamStartX + effectiveBeamLength * 0.7, topEndY + 10,
      beamStartX + effectiveBeamLength * 0.3, beamStartY - 20,
      beamStartX, beamStartY - 8
    );
    ctx.closePath();
    ctx.fillStyle = mainBeamGradient;
    ctx.fill();
    
    // Núcleo brilhante do feixe (centro mais intenso)
    const coreWidth = isHighBeam ? 25 : 18;
    const coreGradient = ctx.createLinearGradient(beamStartX, beamStartY, endX * 0.6, endCenterY);
    const coreOpacity = (isHighBeam ? 0.55 : 0.4) * fogAttenuation; // Núcleo também afetado pela neblina
    coreGradient.addColorStop(0, `rgba(255, 255, 255, ${coreOpacity})`);
    coreGradient.addColorStop(0.3, `rgba(255, 255, 230, ${coreOpacity * 0.6 * getIntensityAt(effectiveBeamLength * 0.2)})`);
    coreGradient.addColorStop(0.7, `rgba(255, 245, 200, ${coreOpacity * 0.2 * getIntensityAt(effectiveBeamLength * 0.4)})`);
    coreGradient.addColorStop(1, 'transparent');
    
    ctx.beginPath();
    ctx.moveTo(beamStartX, beamStartY);
    ctx.lineTo(beamStartX + effectiveBeamLength * 0.6, endCenterY + coreWidth);
    ctx.lineTo(beamStartX + effectiveBeamLength * 0.6, endCenterY - coreWidth);
    ctx.closePath();
    ctx.fillStyle = coreGradient;
    ctx.fill();
    
    // Raios de luz individuais (efeito de dispersão) - diminuem com neblina
    const numRays = isHighBeam ? 8 : 5;
    for (let i = 0; i < numRays; i++) {
      const rayAngle = angleRad + (i - numRays/2) * (spreadRad / numRays) * 0.8;
      const rayLength = effectiveBeamLength * (0.5 + Math.random() * 0.3) * fogAttenuation; // Raios mais curtos com neblina
      const rayEndX = beamStartX + Math.cos(rayAngle) * rayLength;
      const rayEndY = beamStartY + Math.sin(rayAngle) * rayLength;
      
      const rayOpacity = (0.08 + Math.random() * 0.05) * fogAttenuation; // Raios mais fracos
      const rayGradient = ctx.createLinearGradient(beamStartX, beamStartY, rayEndX, rayEndY);
      rayGradient.addColorStop(0, `rgba(255, 255, 220, ${rayOpacity})`);
      rayGradient.addColorStop(0.5, `rgba(255, 240, 180, ${rayOpacity * 0.4})`);
      rayGradient.addColorStop(1, 'transparent');
      
      ctx.strokeStyle = rayGradient;
      ctx.lineWidth = 2 + Math.random() * 3;
      ctx.beginPath();
      ctx.moveTo(beamStartX, beamStartY);
      ctx.lineTo(rayEndX, rayEndY);
      ctx.stroke();
    }
    
    // Iluminação na estrada (reflexão difusa) - muito afetada pela neblina
    if (beamAngle > 0) {
      // Área iluminada principal - diminui significativamente com neblina
      const roadHitX = beamStartX + (roadY - beamStartY) / Math.tan(angleRad);
      const spotCenterX = Math.max(beamStartX + 80, Math.min(roadHitX, beamStartX + effectiveBeamLength * 0.7));
      const spotWidth = effectiveBeamLength * 0.4 * fogAttenuation; // Área iluminada menor com neblina
      
      const roadIllumination = ctx.createRadialGradient(
        spotCenterX, roadY + 15, 0,
        spotCenterX, roadY + 15, spotWidth
      );
      // Opacidade da estrada muito reduzida com neblina densa
      const roadOpacity = (isHighBeam ? 0.15 : 0.35) * fogAttenuation * getIntensityAt(spotCenterX - beamStartX);
      roadIllumination.addColorStop(0, `rgba(255, 250, 200, ${roadOpacity})`);
      roadIllumination.addColorStop(0.3, `rgba(252, 230, 150, ${roadOpacity * 0.6})`);
      roadIllumination.addColorStop(0.6, `rgba(252, 211, 77, ${roadOpacity * 0.2})`);
      roadIllumination.addColorStop(1, 'transparent');
      
      ctx.fillStyle = roadIllumination;
      ctx.beginPath();
      ctx.ellipse(spotCenterX, roadY + 15, spotWidth, 40, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Reflexo especular na estrada (brilho pontual)
      if (fogDensity < 60) {
        const specularOpacity = 0.15 * (1 - fogDensity / 100);
        const specular = ctx.createRadialGradient(
          spotCenterX - 20, roadY + 8, 0,
          spotCenterX - 20, roadY + 8, 30
        );
        specular.addColorStop(0, `rgba(255, 255, 255, ${specularOpacity})`);
        specular.addColorStop(0.5, `rgba(255, 255, 220, ${specularOpacity * 0.3})`);
        specular.addColorStop(1, 'transparent');
        ctx.fillStyle = specular;
        ctx.beginPath();
        ctx.ellipse(spotCenterX - 20, roadY + 8, 30, 12, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // === PARTÍCULAS DE NEBLINA COM FÍSICA DE ESPALHAMENTO MIE ===
    let scatterCount = 0;
    let backscatterCount = 0;
    const speedFactor = speed / 25;
    const fogOpacityBase = fogDensity / 100;
    
    // Ordenar por profundidade para renderização correta
    const sortedParticles = [...fogParticlesRef.current].sort((a, b) => a.z - b.z);
    
    sortedParticles.forEach(p => {
      // Movimento com turbulência
      p.x -= p.speed * speedFactor;
      p.y += Math.sin(time * 2 + p.scatterAngle) * p.drift * 0.4;
      p.y += Math.cos(time * 1.5 + p.x * 0.01) * 0.2; // Turbulência adicional
      
      if (p.x < 50) {
        p.x = width + Math.random() * 150;
        p.y = Math.random() * 280 + 40;
        p.z = Math.random();
        p.illuminated = false;
        p.glowIntensity = 0;
      }
      
      if (p.y < 30) p.y = 30;
      if (p.y > roadY - 10) p.y = roadY - 10;
      
      const dx = p.x - beamStartX;
      const dy = p.y - beamStartY;
      const distanceFromSource = Math.sqrt(dx * dx + dy * dy);
      
      // Verificar se está dentro do cone de luz
      if (dx > 0 && dx < effectiveBeamLength) {
        const beamCenterY = beamStartY + (dx / effectiveBeamLength) * (endCenterY - beamStartY);
        const beamHalfWidth = (dx / effectiveBeamLength) * halfSpreadY + 20;
        
        const distFromCenter = Math.abs(p.y - beamCenterY);
        const normalizedDist = distFromCenter / beamHalfWidth;
        const inBeam = normalizedDist < 1;
        
        if (inBeam) {
          p.illuminated = true;
          
          // Intensidade baseada na posição (Gaussian beam profile)
          const gaussianProfile = Math.exp(-normalizedDist * normalizedDist * 2);
          
          // Atenuação pela distância (Beer-Lambert)
          const distanceAttenuation = getIntensityAt(dx);
          
          // Intensidade final
          const intensity = gaussianProfile * distanceAttenuation;
          p.glowIntensity = Math.min(1, p.glowIntensity + 0.15 * intensity);
          
          // Contar eventos de espalhamento
          if (intensity > 0.3) {
            scatterCount++;
            // Backscatter é mais intenso para farol alto
            if (dx < effectiveBeamLength * 0.4 && isHighBeam) {
              backscatterCount++;
            }
          }
        } else {
          // Transição suave fora do feixe
          p.illuminated = false;
          p.glowIntensity = Math.max(0, p.glowIntensity - 0.04);
        }
      } else {
        p.illuminated = false;
        p.glowIntensity = Math.max(0, p.glowIntensity - 0.04);
      }
      
      const depthScale = 0.7 + p.z * 0.6;
      const particleSize = p.size * depthScale;
      
      // Desenhar partícula iluminada (Espalhamento Mie / Efeito Tyndall)
      if (p.glowIntensity > 0.03) {
        const dx = p.x - beamStartX;
        const distanceFromSource = Math.max(50, dx);
        
        // Tamanho do halo aumenta com intensidade e diminui com distância
        const baseGlowSize = particleSize * (isHighBeam ? 5 : 3);
        const glowSize = baseGlowSize * (0.5 + p.glowIntensity * 0.5);
        
        // Opacidade baseada em múltiplos fatores
        const fogFactor = fogOpacityBase * 1.2;
        const intensityFactor = p.glowIntensity * (isHighBeam ? 1 : 0.6);
        const glowOpacity = Math.min(0.9, intensityFactor * fogFactor);
        
        // Halo externo difuso (espalhamento forward)
        const outerHalo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize * 2);
        outerHalo.addColorStop(0, `rgba(255, 255, 255, ${glowOpacity * 0.5})`);
        outerHalo.addColorStop(0.15, `rgba(255, 252, 235, ${glowOpacity * 0.4})`);
        outerHalo.addColorStop(0.35, `rgba(255, 245, 200, ${glowOpacity * 0.25})`);
        outerHalo.addColorStop(0.6, `rgba(252, 220, 150, ${glowOpacity * 0.1})`);
        outerHalo.addColorStop(1, 'transparent');
        
        ctx.fillStyle = outerHalo;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowSize * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Halo médio (cor característica do Tyndall)
        const midHalo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
        midHalo.addColorStop(0, `rgba(255, 255, 245, ${glowOpacity * 0.7})`);
        midHalo.addColorStop(0.4, `rgba(255, 248, 220, ${glowOpacity * 0.4})`);
        midHalo.addColorStop(1, 'transparent');
        
        ctx.fillStyle = midHalo;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Núcleo brilhante (ponto de espalhamento)
        const coreSize = glowSize * 0.35;
        const coreGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, coreSize);
        coreGlow.addColorStop(0, `rgba(255, 255, 255, ${glowOpacity * 0.95})`);
        coreGlow.addColorStop(0.5, `rgba(255, 255, 240, ${glowOpacity * 0.5})`);
        coreGlow.addColorStop(1, `rgba(255, 250, 220, ${glowOpacity * 0.1})`);
        
        ctx.fillStyle = coreGlow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, coreSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Espalhamento lateral (asas de luz) - característico do Mie scattering
        if (p.glowIntensity > 0.4 && isHighBeam) {
          const wingLength = glowSize * 1.5;
          const wingOpacity = glowOpacity * 0.2;
          
          ctx.strokeStyle = `rgba(255, 250, 220, ${wingOpacity})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(p.x - wingLength, p.y);
          ctx.lineTo(p.x + wingLength, p.y);
          ctx.stroke();
          
          // Mini raios de espalhamento
          for (let r = 0; r < 4; r++) {
            const rayAngle = (r * Math.PI / 2) + time * 0.5;
            const rayLen = glowSize * 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(
              p.x + Math.cos(rayAngle) * rayLen,
              p.y + Math.sin(rayAngle) * rayLen
            );
            ctx.stroke();
          }
        }
      }
      
      // Partícula base (gotícula de água)
      const particleBaseOpacity = fogOpacityBase * p.opacity * (0.3 + p.glowIntensity * 0.5) * depthScale;
      ctx.fillStyle = `rgba(190, 205, 220, ${particleBaseOpacity})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, particleSize * 0.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Borda sutil da gotícula
      if (particleBaseOpacity > 0.15) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${particleBaseOpacity * 0.3})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });
    
    // === EFEITO "PAREDE BRANCA" (BACKSCATTER INTENSO) ===
    if (isHighBeam && fogDensity > 30) {
      const wallIntensity = ((fogDensity - 30) / 70) * 0.65;
      
      // Múltiplas camadas para efeito volumétrico
      for (let layer = 0; layer < 4; layer++) {
        const layerOffset = layer * 30;
        const layerIntensity = wallIntensity * (1 - layer * 0.2);
        const layerRadius = 180 - layer * 20;
        
        const whiteLayer = ctx.createRadialGradient(
          beamStartX + 50 + layerOffset, beamStartY, 0,
          beamStartX + 50 + layerOffset, beamStartY, layerRadius
        );
        whiteLayer.addColorStop(0, `rgba(255, 255, 255, ${layerIntensity * 0.6})`);
        whiteLayer.addColorStop(0.25, `rgba(255, 255, 245, ${layerIntensity * 0.4})`);
        whiteLayer.addColorStop(0.5, `rgba(255, 250, 230, ${layerIntensity * 0.2})`);
        whiteLayer.addColorStop(1, 'transparent');
        
        ctx.fillStyle = whiteLayer;
        ctx.beginPath();
        ctx.arc(beamStartX + 50 + layerOffset, beamStartY, layerRadius, -Math.PI/2.5, Math.PI/2.5);
        ctx.lineTo(beamStartX + 30, beamStartY);
        ctx.closePath();
        ctx.fill();
      }
      
      // Véu geral de luz retornando
      const veilGradient = ctx.createLinearGradient(beamStartX, 0, beamStartX + 300, 0);
      const veilOpacity = wallIntensity * 0.25;
      veilGradient.addColorStop(0, `rgba(255, 255, 255, ${veilOpacity})`);
      veilGradient.addColorStop(0.4, `rgba(255, 255, 240, ${veilOpacity * 0.5})`);
      veilGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = veilGradient;
      ctx.fillRect(beamStartX, 20, 300, roadY - 40);
      
      // Partículas brilhantes próximas (backscatter pontual)
      if (fogDensity > 50) {
        const numBrightSpots = Math.floor((fogDensity - 50) / 5);
        for (let i = 0; i < numBrightSpots; i++) {
          const spotX = beamStartX + 40 + (i * 37 + time * 20) % 150;
          const spotY = beamStartY + Math.sin(i * 2.7 + time) * 60;
          const spotSize = 5 + Math.sin(time * 3 + i) * 2;
          const spotOpacity = 0.3 + Math.sin(time * 2 + i * 1.5) * 0.15;
          
          const spotGlow = ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, spotSize * 2);
          spotGlow.addColorStop(0, `rgba(255, 255, 255, ${spotOpacity})`);
          spotGlow.addColorStop(0.5, `rgba(255, 255, 220, ${spotOpacity * 0.4})`);
          spotGlow.addColorStop(1, 'transparent');
          
          ctx.fillStyle = spotGlow;
          ctx.beginPath();
          ctx.arc(spotX, spotY, spotSize * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    
    // === OVERLAY MODO MOTORISTA ===
    if (viewMode === 'driver') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(0, 0, beamStartX + 30, height);
      
      const frameX = beamStartX + 50;
      const frameY = 25;
      const frameW = width - frameX - 30;
      const frameH = height - 70;
      
      ctx.strokeStyle = '#2a2a2a';
      ctx.lineWidth = 25;
      ctx.strokeRect(frameX, frameY, frameW, frameH);
      
      ctx.strokeStyle = '#404040';
      ctx.lineWidth = 3;
      ctx.strokeRect(frameX + 12, frameY + 12, frameW - 24, frameH - 24);
      
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(frameX - 10, height - 45, frameW + 40, 50);
      
      if (isHighBeam && fogDensity > 30) {
        const warningOpacity = Math.min(0.4, (fogDensity - 30) / 100);
        ctx.fillStyle = `rgba(255, 100, 100, ${warningOpacity})`;
        ctx.fillRect(frameX + 12, frameY + 12, frameW - 24, frameH - 24);
        
        ctx.font = 'bold 28px system-ui';
        ctx.fillStyle = '#FCD34D';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚠️ VISIBILIDADE COMPROMETIDA', width / 2 + 60, height / 2);
        ctx.font = '16px system-ui';
        ctx.fillStyle = '#fff';
        ctx.fillText('Reduza a velocidade e use farol baixo', width / 2 + 60, height / 2 + 35);
      }
    }
    
    // === LABEL DO FAROL ===
    ctx.font = 'bold 11px system-ui';
    ctx.fillStyle = isHighBeam ? '#fbbf24' : '#9ca3af';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(isHighBeam ? 'FAROL ALTO' : 'FAROL BAIXO', headlightX + 20, headlightY);
    
    // === ESTATÍSTICAS ===
    const visibility = isHighBeam 
      ? Math.max(15, 90 - fogDensity * 0.75) 
      : Math.max(45, 95 - fogDensity * 0.4);
    const glare = isHighBeam 
      ? Math.min(95, 15 + fogDensity * 0.8)
      : Math.min(25, 5 + fogDensity * 0.2);
    const effectiveRange = isHighBeam 
      ? Math.max(2, 18 - fogDensity * 0.16)
      : Math.max(5, 12 - fogDensity * 0.06);
    
    setStats({
      visibility: Math.round(visibility),
      glare: Math.round(glare),
      effectiveRange: Math.round(effectiveRange),
      scatterEvents: scatterCount
    });
    
  }, [headlightType, fogDensity, speed, viewMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = 800;
    canvas.height = 400;
    
    let animationId;
    const loop = () => {
      animate();
      animationId = requestAnimationFrame(loop);
    };
    loop();
    
    return () => cancelAnimationFrame(animationId);
  }, [animate]);

  const resetExperiment = () => {
    setHeadlightType('low');
    setFogDensity(50);
    setSpeed(30);
    setViewMode('external');
  };

  const dangerLevel = headlightType === 'high' && fogDensity > 30 
    ? fogDensity > 60 ? 'critical' : 'warning'
    : 'safe';

  return (
    <section id="experimento2" className="py-20 px-4 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium mb-4">
            ⚡ Experimento 2
          </span>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
            Faróis na Neblina
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Descubra por que usar farol alto na neblina é perigoso. 
            O <span className="text-amber-400 font-medium">Efeito Tyndall</span> explica o fenômeno de ofuscamento!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Canvas */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 shadow-2xl">
              <canvas
                ref={canvasRef}
                className="w-full rounded-xl shadow-inner"
                style={{ maxWidth: '800px', margin: '0 auto', display: 'block' }}
              />
              
              {/* Seletor de farol */}
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={() => setHeadlightType('low')}
                  className={`group flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 ${
                    headlightType === 'low'
                      ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-green-500/30 scale-105'
                      : 'bg-slate-700/80 text-slate-300 hover:bg-slate-600/80'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${headlightType === 'low' ? 'bg-white/20' : 'bg-slate-600'}`}>
                    <Lightbulb className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold">Farol Baixo</div>
                    <div className="text-xs opacity-80">Recomendado para neblina</div>
                  </div>
                </button>
                
                <button
                  onClick={() => setHeadlightType('high')}
                  className={`group flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 ${
                    headlightType === 'high'
                      ? 'bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30 scale-105'
                      : 'bg-slate-700/80 text-slate-300 hover:bg-slate-600/80'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${headlightType === 'high' ? 'bg-white/20' : 'bg-slate-600'}`}>
                    <Lightbulb className="w-6 h-6" fill="currentColor" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold">Farol Alto</div>
                    <div className="text-xs opacity-80">Perigoso na neblina!</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Painel de controles */}
          <div className="space-y-5">
            {/* Controles */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50">
              <h3 className="text-lg font-bold mb-5 flex items-center gap-2 text-white">
                <Cloud className="w-5 h-5 text-slate-400" />
                Controles
              </h3>
              
              {/* Densidade da neblina */}
              <div className="mb-6">
                <label className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Densidade da Neblina:</span>
                  <span className={`font-medium ${
                    fogDensity < 30 ? 'text-green-400' : fogDensity < 70 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {fogDensity < 30 ? 'Leve' : fogDensity < 70 ? 'Moderada' : 'Densa'}
                  </span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={fogDensity}
                  onChange={(e) => setFogDensity(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Leve</span>
                  <span>Densa</span>
                </div>
              </div>

              {/* Velocidade */}
              <div className="mb-6">
                <label className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Velocidade:</span>
                  <span className="font-medium text-blue-400">{speed} km/h</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Parado</span>
                  <span>100 km/h</span>
                </div>
              </div>

              {/* Modo de visão */}
              <div className="mb-5">
                <label className="block text-sm text-slate-400 mb-2">Perspectiva:</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('external')}
                    className={`flex-1 px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 font-medium ${
                      viewMode === 'external'
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-slate-700/80 text-slate-300 hover:bg-slate-600/80'
                    }`}
                  >
                    <Car className="w-4 h-4" />
                    Externa
                  </button>
                  <button
                    onClick={() => setViewMode('driver')}
                    className={`flex-1 px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 font-medium ${
                      viewMode === 'driver'
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-slate-700/80 text-slate-300 hover:bg-slate-600/80'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    Motorista
                  </button>
                </div>
              </div>

              <button
                onClick={resetExperiment}
                className="w-full py-2.5 rounded-xl bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 transition-all flex items-center justify-center gap-2 border border-slate-600/50"
              >
                <RotateCcw className="w-4 h-4" />
                Resetar
              </button>
            </div>

            {/* Indicadores */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                <Gauge className="w-5 h-5 text-blue-400" />
                Indicadores
              </h3>
              
              <div className="space-y-4">
                {/* Visibilidade */}
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-400">Visibilidade da Estrada</span>
                    <span className={`font-bold ${stats.visibility > 60 ? 'text-green-400' : stats.visibility > 35 ? 'text-amber-400' : 'text-red-400'}`}>
                      {stats.visibility}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-slate-700/80 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${
                        stats.visibility > 60 ? 'bg-gradient-to-r from-green-500 to-emerald-400' 
                        : stats.visibility > 35 ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                        : 'bg-gradient-to-r from-red-500 to-rose-400'
                      }`}
                      style={{ width: `${stats.visibility}%` }}
                    />
                  </div>
                </div>
                
                {/* Ofuscamento */}
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-400">Ofuscamento</span>
                    <span className={`font-bold ${stats.glare < 30 ? 'text-green-400' : stats.glare < 60 ? 'text-amber-400' : 'text-red-400'}`}>
                      {stats.glare}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-slate-700/80 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${
                        stats.glare < 30 ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                        : stats.glare < 60 ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                        : 'bg-gradient-to-r from-red-500 to-rose-400 animate-pulse'
                      }`}
                      style={{ width: `${stats.glare}%` }}
                    />
                  </div>
                </div>
                
                {/* Métricas adicionais */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-700/40 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-blue-400">{stats.effectiveRange}m</div>
                    <div className="text-xs text-slate-400">Alcance Efetivo</div>
                  </div>
                  <div className="bg-slate-700/40 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-amber-400 flex items-center justify-center gap-1">
                      <Zap className="w-4 h-4" />
                      {stats.scatterEvents}
                    </div>
                    <div className="text-xs text-slate-400">Espalhamentos</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recomendação */}
            <div className={`rounded-2xl p-5 border transition-all duration-300 ${
              dangerLevel === 'critical' 
                ? 'bg-red-500/15 border-red-500/40 shadow-lg shadow-red-500/10'
                : dangerLevel === 'warning'
                ? 'bg-amber-500/15 border-amber-500/40 shadow-lg shadow-amber-500/10'
                : 'bg-emerald-500/15 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
            }`}>
              {dangerLevel !== 'safe' ? (
                <>
                  <div className={`flex items-center gap-2 font-bold mb-2 ${
                    dangerLevel === 'critical' ? 'text-red-400' : 'text-amber-400'
                  }`}>
                    <AlertTriangle className="w-5 h-5" />
                    {dangerLevel === 'critical' ? '⚠️ MUITO PERIGOSO!' : '⚠️ ATENÇÃO'}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    O farol alto ilumina as gotículas de água, criando uma 
                    <strong className="text-white"> "parede branca"</strong> que reflete a luz de volta 
                    para o motorista. Isso reduz drasticamente a visibilidade real.
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
                    ✓ Configuração Segura
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    O farol baixo direciona a luz para baixo, passando 
                    <strong className="text-white"> "por baixo"</strong> da neblina mais densa. 
                    Isso minimiza o efeito Tyndall e mantém boa visibilidade da estrada.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
