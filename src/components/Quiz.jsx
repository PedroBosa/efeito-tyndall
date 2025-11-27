import { useState } from 'react';
import { CheckCircle, XCircle, Award, RotateCcw, ChevronRight } from 'lucide-react';

const quizQuestions = [
  {
    id: 1,
    question: 'O que é necessário para que o Efeito Tyndall ocorra?',
    options: [
      'Partículas muito pequenas (menores que 1nm)',
      'Partículas de tamanho coloidal (1-1000nm)',
      'Partículas muito grandes (maiores que 1mm)',
      'Apenas luz ultravioleta'
    ],
    correct: 1,
    explanation: 'O Efeito Tyndall ocorre quando partículas de tamanho coloidal (1-1000nm) espalham a luz visível. Partículas muito pequenas não conseguem espalhar luz, e partículas muito grandes bloqueiam a luz completamente.'
  },
  {
    id: 2,
    question: 'Por que é recomendado usar farol baixo em vez de farol alto na neblina?',
    options: [
      'Porque economiza bateria',
      'Porque o farol baixo é mais bonito',
      'Porque o farol alto causa mais espalhamento de luz, reduzindo a visibilidade',
      'Porque o farol alto pode queimar'
    ],
    correct: 2,
    explanation: 'O farol alto ilumina diretamente as gotículas de água da neblina (coloides no ar), causando intenso espalhamento de luz (Efeito Tyndall). Isso cria uma "parede branca" que reflete a luz de volta para o motorista, reduzindo a visibilidade.'
  },
  {
    id: 3,
    question: 'Qual destes NÃO apresenta Efeito Tyndall?',
    options: [
      'Leite',
      'Água com amido',
      'Água com sal (solução saturada)',
      'Neblina'
    ],
    correct: 2,
    explanation: 'Água com sal forma uma solução verdadeira, onde as partículas (íons Na⁺ e Cl⁻) são muito pequenas para espalhar luz visível. Leite, água com amido e neblina são todos sistemas coloidais que apresentam o Efeito Tyndall.'
  },
  {
    id: 4,
    question: 'O que diferencia um coloide de uma suspensão?',
    options: [
      'A cor do líquido',
      'O tamanho das partículas e a estabilidade',
      'A temperatura',
      'O tipo de recipiente usado'
    ],
    correct: 1,
    explanation: 'Coloides têm partículas entre 1-1000nm e são estáveis (não sedimentam). Suspensões têm partículas maiores que 1000nm e são instáveis - as partículas sedimentam com o tempo devido à gravidade.'
  },
  {
    id: 5,
    question: 'Os raios crepusculares (feixes de luz do sol atravessando nuvens) são um exemplo de:',
    options: [
      'Reflexão total',
      'Refração da luz',
      'Efeito Tyndall atmosférico',
      'Absorção de luz'
    ],
    correct: 2,
    explanation: 'Os raios crepusculares ocorrem porque as gotículas de água e partículas de poeira na atmosfera (coloides) espalham a luz solar, tornando o caminho dos raios visível. Este é um exemplo clássico do Efeito Tyndall na natureza!'
  }
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizComplete, setQuizComplete] = useState(false);

  const handleAnswerSelect = (index) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === quizQuestions[currentQuestion].correct;
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setAnswers([...answers, { question: currentQuestion, answer: selectedAnswer, correct: isCorrect }]);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setQuizComplete(false);
  };

  const question = quizQuestions[currentQuestion];
  const percentage = Math.round((score / quizQuestions.length) * 100);

  if (quizComplete) {
    return (
      <section className="py-20 px-4 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-2xl mx-auto">
          <div className="glass-panel text-center">
            <Award className={`w-20 h-20 mx-auto mb-6 ${
              percentage >= 80 ? 'text-yellow-400' : 
              percentage >= 60 ? 'text-blue-400' : 'text-slate-400'
            }`} />
            
            <h2 className="text-3xl font-bold mb-4">Quiz Concluído!</h2>
            
            <div className="text-6xl font-bold mb-2">
              <span className={
                percentage >= 80 ? 'text-green-400' : 
                percentage >= 60 ? 'text-yellow-400' : 'text-red-400'
              }>
                {score}
              </span>
              <span className="text-slate-500">/{quizQuestions.length}</span>
            </div>
            
            <p className="text-xl text-slate-400 mb-6">{percentage}% de acertos</p>
            
            <div className={`inline-block px-6 py-3 rounded-full mb-8 ${
              percentage >= 80 ? 'bg-green-500/20 text-green-400' : 
              percentage >= 60 ? 'bg-yellow-500/20 text-yellow-400' : 
              'bg-red-500/20 text-red-400'
            }`}>
              {percentage >= 80 ? '🏆 Excelente! Você domina o assunto!' : 
               percentage >= 60 ? '👍 Bom trabalho! Continue estudando!' : 
               '📚 Revise os conceitos e tente novamente!'}
            </div>
            
            {/* Resumo das respostas */}
            <div className="text-left mb-8">
              <h4 className="font-semibold mb-4">Resumo:</h4>
              <div className="space-y-2">
                {answers.map((a, i) => (
                  <div 
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      a.correct ? 'bg-green-500/10' : 'bg-red-500/10'
                    }`}
                  >
                    {a.correct ? (
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    )}
                    <span className="text-sm text-slate-300">
                      Questão {i + 1}: {quizQuestions[i].question.slice(0, 50)}...
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <button
              onClick={resetQuiz}
              className="btn-primary flex items-center gap-2 mx-auto"
            >
              <RotateCcw className="w-5 h-5" />
              Tentar Novamente
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <span className="badge-success mb-4 inline-block">Quiz Interativo</span>
          <h2 className="text-3xl font-bold mb-2">Teste seus Conhecimentos</h2>
          <p className="text-slate-400">
            Responda às perguntas para verificar o que aprendeu sobre Coloides e Efeito Tyndall
          </p>
        </div>

        <div className="glass-panel">
          {/* Progresso */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-slate-400">
              Questão {currentQuestion + 1} de {quizQuestions.length}
            </span>
            <span className="text-sm text-blue-400">
              Pontuação: {score}/{currentQuestion + (showResult ? 1 : 0)}
            </span>
          </div>
          
          <div className="h-2 bg-slate-700 rounded-full mb-8 overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${((currentQuestion + (showResult ? 1 : 0)) / quizQuestions.length) * 100}%` }}
            />
          </div>

          {/* Pergunta */}
          <h3 className="text-xl font-semibold mb-6">{question.question}</h3>

          {/* Opções */}
          <div className="space-y-3 mb-6">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === question.correct;
              
              let bgColor = 'bg-slate-700 hover:bg-slate-600';
              let borderColor = 'border-transparent';
              
              if (showResult) {
                if (isCorrect) {
                  bgColor = 'bg-green-500/20';
                  borderColor = 'border-green-500';
                } else if (isSelected && !isCorrect) {
                  bgColor = 'bg-red-500/20';
                  borderColor = 'border-red-500';
                }
              } else if (isSelected) {
                bgColor = 'bg-blue-500/20';
                borderColor = 'border-blue-500';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${bgColor} ${borderColor} ${
                    showResult ? 'cursor-default' : 'cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      isSelected ? 'bg-blue-500 text-white' : 'bg-slate-600 text-slate-300'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-slate-200">{option}</span>
                    
                    {showResult && isCorrect && (
                      <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-400 ml-auto" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explicação */}
          {showResult && (
            <div className={`p-4 rounded-lg mb-6 ${
              selectedAnswer === question.correct 
                ? 'bg-green-500/10 border border-green-500/30' 
                : 'bg-blue-500/10 border border-blue-500/30'
            }`}>
              <h4 className={`font-semibold mb-2 ${
                selectedAnswer === question.correct ? 'text-green-400' : 'text-blue-400'
              }`}>
                {selectedAnswer === question.correct ? '✓ Correto!' : '💡 Explicação:'}
              </h4>
              <p className="text-sm text-slate-300">{question.explanation}</p>
            </div>
          )}

          {/* Botões */}
          <div className="flex justify-end gap-4">
            {!showResult ? (
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className={`btn-primary flex items-center gap-2 ${
                  selectedAnswer === null ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Confirmar Resposta
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="btn-primary flex items-center gap-2"
              >
                {currentQuestion < quizQuestions.length - 1 ? (
                  <>
                    Próxima Questão
                    <ChevronRight className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    Ver Resultado
                    <Award className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
