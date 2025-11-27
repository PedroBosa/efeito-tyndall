import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TutorialOverlay({ isOpen, onClose, steps = [] }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const step = steps[currentStep] ?? {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-panel max-w-xl w-full text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10"
          aria-label="Fechar tutorial"
        >
          <X className="w-5 h-5" />
        </button>
        <span className="badge-warning inline-block mb-3">Modo Tutorial</span>
        <h2 className="text-2xl font-bold mb-2">Passo {currentStep + 1}</h2>
        <p className="text-slate-300 mb-4">{step.title}</p>
        <p className="text-sm text-slate-400 mb-6">{step.description}</p>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className={`btn-secondary flex items-center gap-2 ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>
          <button
            onClick={() => {
              if (currentStep === steps.length - 1) {
                onClose();
              } else {
                setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
              }
            }}
            className="btn-primary flex items-center gap-2"
          >
            {currentStep === steps.length - 1 ? 'Concluir' : 'Próximo'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
