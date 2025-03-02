import React, { useState } from 'react';
import { User, Heart, Activity, RefreshCw, Info, FileWarning as Running } from 'lucide-react';

function App() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [result, setResult] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  const calculateZ2 = () => {
    if (!name || !age) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    const fmc = 220 - parseInt(age);
    const z2Min = Math.round(fmc * 0.6);
    const z2Max = Math.round(fmc * 0.7);

    setResult(`Prezado(a) ${name}, o exercício cardiovascular mais eficiente para a queima de calorias ocorre na Zona 2. 
    
Com base nas informações fornecidas, sua frequência cardíaca máxima (FMC) é de ${fmc} bpm. 

Dessa forma, a faixa ideal da Zona 2 para otimizar a queima de calorias está entre ${z2Min} e ${z2Max} bpm.

Cuide da sua saúde e bem-estar!`);
  };

  const reset = () => {
    setName('');
    setAge('');
    setResult('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-indigo-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="https://raw.githubusercontent.com/85ED/CalculadoraDoCorredor/main/imagens%20/IMG_6961.jpg" 
              alt="Edson Felix" 
              className="w-16 h-16 rounded-full object-cover border-2 border-white"
            />
            <div>
              <h1 className="text-xl font-bold">Calculadora do Corredor</h1>
              <p className="text-indigo-200 text-sm">Seus cálculos estão aqui</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Activity className="h-5 w-5" />
            <span>Treine com inteligência</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-center mb-6 relative">
              <img 
                src="https://raw.githubusercontent.com/85ED/CalculadoraDoCorredor/main/imagens%20/icon.png" 
                alt="Runner Icon" 
                className="h-8 w-8 mr-2"
              />
              <h2 className="text-2xl font-bold text-gray-800">Conheça sua Zona 2</h2>
              <div 
                className="ml-2 relative"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <Info className="h-5 w-5 text-indigo-600 cursor-help" />
                
                {showTooltip && (
                  <div className="absolute z-10 w-80 max-h-80 overflow-y-auto p-4 bg-white rounded-lg shadow-lg border border-indigo-100 text-sm text-left -right-2 top-8">
                    <h3 className="font-bold text-indigo-800 mb-2">Base Científica Resumida:</h3>
                    <h4 className="font-semibold mt-2">Definição da Zona 2</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>A Zona 2 corresponde a 60-70% da frequência cardíaca máxima (FMC).</li>
                      <li>É uma intensidade moderada, onde você ainda consegue conversar enquanto se exercita.</li>
                    </ul>
                    
                    <h4 className="font-semibold mt-2">Queima de Calorias e Gordura</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>O corpo utiliza principalmente gorduras como fonte de energia nessa zona, ao invés de carboidratos.</li>
                      <li>Isso ocorre porque o metabolismo aeróbico está mais ativo, favorecendo a queima de gordura de maneira eficiente e sustentável.</li>
                    </ul>
                    
                    <h4 className="font-semibold mt-2">Benefícios Comprovados</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Estudos indicam que o treinamento na Zona 2 melhora a resistência, a capacidade mitocondrial e a saúde cardiovascular.</li>
                      <li>Atletas de resistência, como maratonistas e ciclistas, utilizam essa estratégia para aumentar a eficiência energética.</li>
                    </ul>
                    
                    <h4 className="font-semibold mt-2">Fonte Científica para Referência:</h4>
                    <p className="text-xs italic">Brooks, G. A., & Mercier, J. (1994). Journal of Applied Physiology.</p>
                    <p className="text-xs italic">Achten, J., & Jeukendrup, A. E. (2003). Sports Medicine.</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 flex items-center">
                  <Running className="h-4 w-4 mr-2" />
                  Qual o seu nome, corredor?
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Digite seu nome"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 flex items-center">
                  <Activity className="h-4 w-4 mr-2" />
                  Informe sua idade sem medinho:
                </label>
                <input
                  type="number"
                  id="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Digite sua idade"
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={calculateZ2}
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200 flex items-center justify-center"
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Calcular Sua Zona 2
                </button>
                <button
                  onClick={reset}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-200 flex items-center justify-center"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Limpar
                </button>
              </div>
              
              {result && (
                <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                  <h3 className="text-lg font-semibold text-indigo-800 mb-2">Resultado:</h3>
                  <div className="text-gray-700 whitespace-pre-line">
                    {result}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-indigo-800 text-white py-6 mt-10">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Calculadora do Corredor - Desenvolvido por <span className="font-bold">Edson Felix</span></p>
          <p className="text-indigo-300 text-sm mt-2">Treine na Zona 2 para melhorar sua queima de Calorias</p>
        </div>
      </footer>
    </div>
  );
}

export default App;