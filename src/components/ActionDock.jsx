import { Camera, Share2, Printer, BookOpen, Columns3 } from 'lucide-react';

export default function ActionDock({
  onScreenshot,
  onShare,
  onPrint,
  onTutorial,
  onCompare,
  targetSectionId = 'experimento1'
}) {
  const buttons = [
    { icon: Camera, label: 'Salvar Screenshot', action: () => onScreenshot(targetSectionId) },
    { icon: Share2, label: 'Compartilhar Experimento', action: onShare },
    { icon: Printer, label: 'Imprimir Relatório', action: onPrint },
    { icon: BookOpen, label: 'Modo Tutorial', action: onTutorial },
    { icon: Columns3, label: 'Modo Comparação', action: onCompare }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {buttons.map(({ icon: Icon, label, action }) => (
        <button
          key={label}
          onClick={action}
          className="glass-panel !p-3 rounded-full hover:scale-105 transition-all"
          data-tooltip={label}
        >
          <Icon className="w-5 h-5 text-white" />
        </button>
      ))}
    </div>
  );
}
