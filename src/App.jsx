import { useEffect, useMemo, useState } from 'react';
import html2canvas from 'html2canvas';
import './App.css';

import HeroSection from './components/HeroSection.jsx';
import TheorySection from './components/TheorySection.jsx';
import TwoCupsExperiment from './components/TwoCupsExperiment.jsx';
import FogExperiment from './components/FogExperiment.jsx';
import LabBenchExperiment from './components/LabBenchExperiment.jsx';
import EverydayExamples from './components/EverydayExamples.jsx';
import Quiz from './components/Quiz.jsx';
import Glossary from './components/Glossary.jsx';
import Footer from './components/Footer.jsx';
import ActionDock from './components/ActionDock.jsx';
import TutorialOverlay from './components/TutorialOverlay.jsx';
import ComparisonMode from './components/ComparisonMode.jsx';

const experimentSections = [
  { id: 'experimento1', label: 'Solução vs Coloide' },
  { id: 'experimento2', label: 'Farol na Neblina' },
  { id: 'experimento3', label: 'Laser no Laboratório' },
  { id: 'experimento4', label: 'Exemplos do Cotidiano' }
];

const navLinks = [
  { label: 'Início', href: '#hero' },
  { label: 'Teoria', href: '#teoria' },
  ...experimentSections.map((section, index) => ({
    label: `Exp. ${index + 1}`,
    href: `#${section.id}`
  })),
  { label: 'Quiz', href: '#quiz' }
].flat();

const tutorialSteps = [
  {
    title: 'Compare os Dois Copos',
    description: 'No Experimento 1, mova a lanterna e ative o modo microscópico para enxergar o Efeito Tyndall se formando.'
  },
  {
    title: 'Ajuste a Neblina',
    description: 'Experimente diferentes densidades e faróis no Experimento 2 para perceber quando surge a "parede branca".'
  },
  {
    title: 'Teste Substâncias',
    description: 'No Experimento 3, selecione líquidos no laboratório e ligue o laser para comparar coloides, soluções e suspensões.'
  },
  {
    title: 'Conecte com o Cotidiano',
    description: 'Visite os exemplos reais no Experimento 4 e depois faça o Quiz para fixar o conteúdo.'
  }
];

const sectionLabelMap = experimentSections.reduce((acc, section) => {
  acc[section.id] = section.label;
  return acc;
}, {});

function App() {
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [activeSectionId, setActiveSectionId] = useState('experimento1');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);

  const experimentIds = useMemo(() => experimentSections.map((section) => section.id), []);

  useEffect(() => {
    document.body.classList.toggle('theme-light', !darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (!feedbackMessage) return;
    const timeout = setTimeout(() => setFeedbackMessage(''), 3500);
    return () => clearTimeout(timeout);
  }, [feedbackMessage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveSectionId(visible[0].target.id);
        }
      },
      { threshold: 0.4 }
    );

    const targets = experimentIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    targets.forEach((element) => observer.observe(element));

    return () => {
      targets.forEach((element) => observer.unobserve(element));
      observer.disconnect();
    };
  }, [experimentIds]);

  const scrollToExperiments = () => {
    document.getElementById('teoria')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScreenshot = async (sectionId = activeSectionId) => {
    const target = document.getElementById(sectionId);
    if (!target) {
      setFeedbackMessage('Não encontrei a seção para capturar.');
      return;
    }

    try {
      setIsCapturing(true);
      const canvas = await html2canvas(target, {
        backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
        scale: Math.min(3, window.devicePixelRatio || 1.5)
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.href = image;
      link.download = `efeito-tyndall-${sectionId}-${timestamp}.png`;
      link.click();
      setFeedbackMessage('Screenshot salva com sucesso!');
    } catch (error) {
      console.error(error);
      setFeedbackMessage('Erro ao gerar a captura.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleShare = async () => {
    const sectionName = sectionLabelMap[activeSectionId] ?? 'Experimento';
    const data = {
      title: 'Coloides e Efeito Tyndall',
      text: `Veja o ${sectionName} que estou explorando no laboratório virtual!`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(data);
        setFeedbackMessage('Link compartilhado!');
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setFeedbackMessage('Link copiado para a área de transferência.');
      } else {
        setFeedbackMessage('Compartilhamento não suportado neste navegador.');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error(error);
        setFeedbackMessage('Não foi possível compartilhar.');
      }
    }
  };

  const handlePrint = () => {
    window.print();
    setFeedbackMessage('Gerando visualização para impressão...');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <header className="fixed top-0 left-0 right-0 z-30 bg-slate-950/80 backdrop-blur border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <a href="#hero" className="font-semibold tracking-wide">Coloides 2D</a>
          <nav className="hidden md:flex items-center gap-4 text-sm">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  link.href === `#${activeSectionId}` ? 'bg-white/10 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => setIsGlossaryOpen(true)}
              className="btn-secondary text-xs py-2 px-4"
            >
              Glossário
            </button>
          </nav>
        </div>
      </header>

      <main className="pt-24">
        <HeroSection onStartExperiments={scrollToExperiments} />
        <TheorySection />
        <TwoCupsExperiment />
        <FogExperiment />
        <LabBenchExperiment />
        <EverydayExamples />
        <section id="quiz">
          <Quiz />
        </section>
        <Footer
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((prev) => !prev)}
          onOpenGlossary={() => setIsGlossaryOpen(true)}
        />
      </main>

      <ActionDock
        onScreenshot={handleScreenshot}
        onShare={handleShare}
        onPrint={handlePrint}
        onTutorial={() => setIsTutorialOpen(true)}
        onCompare={() => setIsComparisonOpen(true)}
        targetSectionId={activeSectionId}
      />

      <TutorialOverlay
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        steps={tutorialSteps}
      />

      <ComparisonMode
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
      />

      <Glossary
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />

      {feedbackMessage && (
        <div className="fixed bottom-6 left-6 z-40">
          <div className="glass-panel py-2 px-4 text-sm max-w-xs">
            {feedbackMessage}
          </div>
        </div>
      )}

      {isCapturing && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <div className="glass-panel text-center">
            Gerando captura da seção...
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
