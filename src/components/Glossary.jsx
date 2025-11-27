import { useState } from 'react';
import { X, Search } from 'lucide-react';

const glossaryTerms = [
  {
    term: 'Coloide',
    definition: 'Sistema heterogêneo onde partículas de tamanho entre 1 e 1000 nanômetros estão dispersas em um meio contínuo.',
    related: ['Efeito Tyndall', 'Dispersão', 'Sol']
  },
  {
    term: 'Efeito Tyndall',
    definition: 'Fenômeno de espalhamento da luz quando um feixe luminoso atravessa um meio coloidal, tornando o caminho da luz visível.',
    related: ['Coloide', 'Dispersão de luz', 'John Tyndall']
  },
  {
    term: 'Solução Verdadeira',
    definition: 'Mistura homogênea onde as partículas do soluto são menores que 1 nanômetro e não podem ser vistas nem com microscópio.',
    related: ['Soluto', 'Solvente', 'Homogêneo']
  },
  {
    term: 'Suspensão',
    definition: 'Mistura heterogênea onde partículas maiores que 1000 nanômetros estão dispersas em um líquido, mas sedimentam com o tempo.',
    related: ['Sedimentação', 'Heterogêneo']
  },
  {
    term: 'Sol',
    definition: 'Tipo de coloide onde partículas sólidas estão dispersas em um líquido. Exemplo: tinta, sangue.',
    related: ['Coloide', 'Emulsão']
  },
  {
    term: 'Emulsão',
    definition: 'Tipo de coloide onde gotículas de um líquido estão dispersas em outro líquido imiscível. Exemplo: leite, maionese.',
    related: ['Coloide', 'Leite']
  },
  {
    term: 'Aerossol',
    definition: 'Tipo de coloide onde partículas sólidas ou líquidas estão dispersas em um gás. Exemplo: neblina, fumaça.',
    related: ['Coloide', 'Neblina']
  },
  {
    term: 'Gel',
    definition: 'Tipo de coloide onde um líquido está disperso em uma rede sólida tridimensional. Exemplo: gelatina.',
    related: ['Coloide', 'Gelatina']
  },
  {
    term: 'Movimento Browniano',
    definition: 'Movimento aleatório e contínuo das partículas coloidais devido às colisões com as moléculas do meio dispersor.',
    related: ['Coloide', 'Robert Brown']
  },
  {
    term: 'Dispersão de Luz',
    definition: 'Fenômeno onde a luz é espalhada em diferentes direções ao interagir com partículas. A intensidade depende do tamanho das partículas.',
    related: ['Efeito Tyndall', 'Espalhamento Rayleigh']
  },
  {
    term: 'Espalhamento Rayleigh',
    definition: 'Tipo de dispersão de luz por partículas muito menores que o comprimento de onda da luz. Explica por que o céu é azul.',
    related: ['Dispersão de luz', 'Céu azul']
  },
  {
    term: 'Fase Dispersa',
    definition: 'As partículas que estão distribuídas no meio dispersor em um sistema coloidal.',
    related: ['Coloide', 'Meio Dispersor']
  },
  {
    term: 'Meio Dispersor',
    definition: 'A substância contínua na qual as partículas da fase dispersa estão distribuídas.',
    related: ['Coloide', 'Fase Dispersa']
  },
  {
    term: 'Nanômetro',
    definition: 'Unidade de medida igual a um bilionésimo de metro (10⁻⁹ m). Usado para medir partículas coloidais.',
    related: ['Escala', 'Partículas coloidais']
  },
  {
    term: 'John Tyndall',
    definition: 'Físico irlandês (1820-1893) que estudou e descreveu o fenômeno de espalhamento de luz que hoje leva seu nome.',
    related: ['Efeito Tyndall', 'Física']
  }
];

export default function Glossary({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTerm, setSelectedTerm] = useState(null);

  const filteredTerms = glossaryTerms.filter(item =>
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative glass-panel max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">📚 Glossário</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar termo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        
        {/* Terms list */}
        <div className="overflow-y-auto flex-1 space-y-3 pr-2">
          {filteredTerms.map((item) => (
            <div
              key={item.term}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedTerm === item.term
                  ? 'bg-blue-500/20 border border-blue-500/50'
                  : 'bg-slate-800/50 hover:bg-slate-800'
              }`}
              onClick={() => setSelectedTerm(selectedTerm === item.term ? null : item.term)}
            >
              <h3 className="font-semibold text-lg text-blue-400">{item.term}</h3>
              <p className="text-slate-300 text-sm mt-1">{item.definition}</p>
              
              {selectedTerm === item.term && item.related.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-700">
                  <span className="text-xs text-slate-500">Termos relacionados:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {item.related.map((rel) => (
                      <button
                        key={rel}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSearchTerm(rel);
                        }}
                        className="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors"
                      >
                        {rel}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {filteredTerms.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              Nenhum termo encontrado para "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
