import { X, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

const scenarios = [
  {
    id: 'solution',
    title: 'Copo 1 - Solução Verdadeira',
    description: 'Partículas &lt; 1nm (NaCl em água)',
    stats: {
      visibility: 'Alta',
      tyndall: 'Não ocorre',
      illuminated: '0 partículas',
      dispersao: '0%'
    },
    badge: '❌ Sem Tyndall',
    color: 'from-blue-500/30 to-blue-400/10'
  },
  {
    id: 'colloid',
    title: 'Copo 2 - Coloide (Água + Amido)',
    description: 'Partículas 100-500nm',
    stats: {
      visibility: 'Moderada',
      tyndall: 'Observado',
      illuminated: '42 partículas',
      dispersao: '78%'
    },
    badge: '✓ Efeito Tyndall',
    color: 'from-yellow-500/20 to-orange-500/10'
  }
];

const differenceTable = [
  { factor: 'Tamanho das partículas', solution: '&lt; 1nm (íons)', colloid: '100-500nm (amido)' },
  { factor: 'Comportamento da luz', solution: 'Atravessa sem dispersão', colloid: 'Luz visível e espalhada' },
  { factor: 'Visibilidade', solution: 'Feixe invisível', colloid: 'Feixe brilhante' },
  { factor: 'Exemplo', solution: 'Água + sal', colloid: 'Água + amido' }
];

export default function ComparisonMode({ isOpen, onClose }) {
  const [intensity, setIntensity] = useState(70);
  const [angle, setAngle] = useState(15);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-panel max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10"
          aria-label="Fechar comparação"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 mb-6">
          <SlidersHorizontal className="w-5 h-5 text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold">Modo Comparação</h2>
            <p className="text-slate-400 text-sm">
              Compare o mesmo experimento com parâmetros diferentes lado a lado
            </p>
          </div>
        </div>

        {/* Controles compartilhados */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="text-sm text-slate-400">Intensidade da luz: {intensity}%</label>
            <input
              type="range"
              min="10"
              max="100"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="slider-track w-full"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400">Ângulo da lanterna: {angle}°</label>
            <input
              type="range"
              min="0"
              max="45"
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="slider-track w-full"
            />
          </div>
        </div>

        {/* Painéis lado a lado */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className={`rounded-3xl border border-white/10 p-6 bg-gradient-to-br ${scenario.color}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Configuração</p>
                  <h3 className="text-xl font-semibold">{scenario.title}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  scenario.id === 'colloid' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                }`}>
                  {scenario.badge}
                </span>
              </div>

              <p className="text-sm text-slate-300 mb-4">{scenario.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-900/40 rounded-xl p-3" data-tooltip="Nitidez percebida pelo observador">
                  <p className="text-xs text-slate-400">Visibilidade</p>
                  <p className="text-lg font-semibold">{scenario.stats.visibility}</p>
                </div>
                <div className="bg-slate-900/40 rounded-xl p-3" data-tooltip="Estado do espalhamento da luz">
                  <p className="text-xs text-slate-400">Efeito Tyndall</p>
                  <p className="text-lg font-semibold">{scenario.stats.tyndall}</p>
                </div>
                <div className="bg-slate-900/40 rounded-xl p-3" data-tooltip="Número médio de partículas atingidas">
                  <p className="text-xs text-slate-400">Partículas iluminadas</p>
                  <p className="text-lg font-semibold">{scenario.stats.illuminated}</p>
                </div>
                <div className="bg-slate-900/40 rounded-xl p-3" data-tooltip="Percentual relativo de dispersão">
                  <p className="text-xs text-slate-400">Intensidade</p>
                  <p className="text-lg font-semibold">{scenario.stats.dispersao}</p>
                </div>
              </div>

              <div className="mt-6 text-xs text-slate-400">
                <p>
                  Ajustes aplicados: intensidade {intensity}% • ângulo {angle}°
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabela de diferenças */}
        <div className="glass-panel">
          <h3 className="text-lg font-semibold mb-4">Tabela de diferenças principais</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-white/10">
                  <th className="py-3">Fator</th>
                  <th className="py-3">Solução</th>
                  <th className="py-3">Coloide</th>
                </tr>
              </thead>
              <tbody>
                {differenceTable.map((row) => (
                  <tr key={row.factor} className="border-b border-white/5">
                    <td className="py-3 font-medium text-slate-200">{row.factor}</td>
                    <td className="py-3 text-slate-300" dangerouslySetInnerHTML={{ __html: row.solution }} />
                    <td className="py-3 text-slate-300" dangerouslySetInnerHTML={{ __html: row.colloid }} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
