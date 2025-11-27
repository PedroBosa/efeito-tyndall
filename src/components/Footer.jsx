import { Moon, Sun, Book, Github, Heart } from 'lucide-react';

export default function Footer({ darkMode, onToggleDarkMode, onOpenGlossary }) {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Sobre */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Sobre o Projeto</h3>
            <p className="text-slate-400 text-sm">
              Site educacional interativo sobre Coloides e o Efeito Tyndall, 
              desenvolvido para facilitar o aprendizado de química através de 
              visualizações 2D animadas.
            </p>
          </div>
          
          {/* Links rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenGlossary}
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Book className="w-4 h-4" />
                  Glossário
                </button>
              </li>
              <li>
                <a 
                  href="#teoria"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Teoria Básica
                </a>
              </li>
              <li>
                <a 
                  href="#experimento1"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Experimentos
                </a>
              </li>
            </ul>
          </div>
          
          {/* Configurações */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Configurações</h3>
            <button
              onClick={onToggleDarkMode}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              {darkMode ? (
                <>
                  <Sun className="w-4 h-4" />
                  Modo Claro
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4" />
                  Modo Escuro
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Linha divisória */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm flex items-center gap-1">
              Feito com <Heart className="w-4 h-4 text-red-500" /> para educação em Química
            </p>
            
            <div className="flex items-center gap-4">
              <span className="text-slate-500 text-sm">
                © 2024 Coloides & Efeito Tyndall
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
