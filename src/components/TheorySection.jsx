import { Atom, Ruler, Layers, Droplets, Cloud, Cookie } from 'lucide-react';

const concepts = [
  {
    icon: Atom,
    title: 'O que são Coloides?',
    description: 'Misturas heterogêneas onde partículas de 1 a 1000 nanômetros estão dispersas em um meio.',
    visual: 'coloid-diagram',
    color: 'blue'
  },
  {
    icon: Ruler,
    title: 'Escala de Tamanhos',
    description: 'Partículas coloidais são maiores que moléculas, mas menores que partículas de suspensão.',
    visual: 'scale',
    color: 'purple'
  },
  {
    icon: Layers,
    title: 'Efeito Tyndall',
    description: 'Fenômeno de espalhamento da luz ao atravessar um meio coloidal, tornando o feixe visível.',
    visual: 'tyndall',
    color: 'cyan'
  }
];

const colloidTypes = [
  { name: 'Sol', disperso: 'Sólido', meio: 'Líquido', exemplo: 'Tinta, sangue', icon: Droplets },
  { name: 'Emulsão', disperso: 'Líquido', meio: 'Líquido', exemplo: 'Leite, maionese', icon: Droplets },
  { name: 'Espuma', disperso: 'Gás', meio: 'Líquido', exemplo: 'Chantilly', icon: Cloud },
  { name: 'Aerossol', disperso: 'Líquido/Sólido', meio: 'Gás', exemplo: 'Neblina, fumaça', icon: Cloud },
  { name: 'Gel', disperso: 'Líquido', meio: 'Sólido', exemplo: 'Gelatina', icon: Cookie },
];

function ScaleDiagram() {
  return (
    <div className="relative h-24 bg-slate-800/50 rounded-lg p-4 overflow-hidden">
      <div className="absolute inset-x-4 top-1/2 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 rounded" />
      
      {/* Markers */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="w-2 h-2 bg-blue-400 rounded-full" />
        <span className="text-xs mt-6 text-blue-400">&lt;1nm</span>
        <span className="text-xs text-slate-500">Moléculas</span>
      </div>
      
      <div className="absolute left-1/3 top-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="w-4 h-4 bg-purple-400 rounded-full animate-pulse" />
        <span className="text-xs mt-4 text-purple-400">1-1000nm</span>
        <span className="text-xs text-slate-500">Coloides</span>
      </div>
      
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="w-6 h-6 bg-red-400 rounded-full" />
        <span className="text-xs mt-2 text-red-400">&gt;1000nm</span>
        <span className="text-xs text-slate-500">Suspensões</span>
      </div>
    </div>
  );
}

function TyndallDiagram() {
  return (
    <div className="relative h-24 bg-slate-800/50 rounded-lg overflow-hidden">
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <div className="w-8 h-8 bg-yellow-400 rounded-full glow-yellow" />
      </div>
      
      {/* Light beam */}
      <div 
        className="absolute left-12 top-1/2 -translate-y-1/2 h-4 bg-gradient-to-r from-yellow-400/80 to-yellow-400/0"
        style={{ width: 'calc(100% - 4rem)' }}
      />
      
      {/* Partículas espalhando luz */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 bg-white/60 rounded-full animate-pulse"
          style={{
            left: `${20 + i * 10}%`,
            top: `${40 + (i % 2 === 0 ? 10 : -10)}%`,
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
      
      <div className="absolute bottom-2 right-2 text-xs text-slate-400">
        Luz visível no coloide
      </div>
    </div>
  );
}

function ColoidDiagram() {
  return (
    <div className="relative h-24 bg-slate-800/50 rounded-lg p-4 flex items-center justify-around">
      {/* Solução */}
      <div className="text-center">
        <div className="relative w-16 h-16 border-2 border-blue-400/50 rounded bg-blue-400/10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-300 rounded-full"
              style={{
                left: `${Math.random() * 80 + 10}%`,
                top: `${Math.random() * 80 + 10}%`
              }}
            />
          ))}
        </div>
        <span className="text-xs text-slate-400 mt-1">Solução</span>
      </div>
      
      <div className="text-2xl text-slate-500">vs</div>
      
      {/* Coloide */}
      <div className="text-center">
        <div className="relative w-16 h-16 border-2 border-purple-400/50 rounded bg-purple-400/10">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-purple-300 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 70 + 15}%`,
                top: `${Math.random() * 70 + 15}%`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
        <span className="text-xs text-slate-400 mt-1">Coloide</span>
      </div>
    </div>
  );
}

export default function TheorySection() {
  const renderVisual = (type) => {
    switch (type) {
      case 'coloid-diagram':
        return <ColoidDiagram />;
      case 'scale':
        return <ScaleDiagram />;
      case 'tyndall':
        return <TyndallDiagram />;
      default:
        return null;
    }
  };

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    cyan: 'from-cyan-500 to-cyan-600'
  };

  return (
    <section id="teoria" className="py-20 px-4 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">
          Teoria Básica
        </h2>
        <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
          Entenda os conceitos fundamentais antes de começar os experimentos
        </p>
        
        {/* Conceitos principais */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {concepts.map((concept, index) => {
            const Icon = concept.icon;
            return (
              <div
                key={index}
                className="glass-panel hover:scale-105 transition-transform duration-300"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[concept.color]} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{concept.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{concept.description}</p>
                {renderVisual(concept.visual)}
              </div>
            );
          })}
        </div>
        
        {/* Tipos de Coloides */}
        <div className="glass-panel">
          <h3 className="text-2xl font-semibold mb-6 text-center">Tipos de Coloides</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Tipo</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Fase Dispersa</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Meio Dispersor</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Exemplo</th>
                </tr>
              </thead>
              <tbody>
                {colloidTypes.map((type, index) => {
                  const Icon = type.icon;
                  return (
                    <tr 
                      key={index}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-4 flex items-center gap-2">
                        <Icon className="w-4 h-4 text-blue-400" />
                        {type.name}
                      </td>
                      <td className="py-3 px-4 text-slate-300">{type.disperso}</td>
                      <td className="py-3 px-4 text-slate-300">{type.meio}</td>
                      <td className="py-3 px-4 text-slate-400">{type.exemplo}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
