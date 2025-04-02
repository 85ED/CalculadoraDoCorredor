import React, { useState, useEffect } from 'react';
import { User, Heart, Activity, RefreshCw, Info, Footprints, Calendar, MapPin, Mountain, Loader as Road, Link2, Image, Plus, Edit2, Trash2, Download, Upload, Search, Filter } from 'lucide-react';

interface Race {
  id: string;
  name: string;
  location: string;
  distance: number;
  date: string;
  type: 'Asfalto' | 'Trail';
  image?: string;
  eventLink?: string;
  notes?: string;
}

function App() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [result, setResult] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [nextRaceCountdown, setNextRaceCountdown] = useState<string>('');
  
  // Race management states
  const [races, setRaces] = useState<Race[]>([]);
  const [showRaceForm, setShowRaceForm] = useState(false);
  const [editingRace, setEditingRace] = useState<Race | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Asfalto' | 'Trail'>('all');
  
  // Update current date/time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Calculate days until next race
  useEffect(() => {
    const now = new Date();
    const futureRaces = races
      .filter(race => new Date(race.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (futureRaces.length > 0) {
      const nextRace = futureRaces[0];
      const daysUntil = Math.ceil((new Date(nextRace.date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      setNextRaceCountdown(`Faltam ${daysUntil} dias para ${nextRace.name}`);
    } else {
      setNextRaceCountdown('Nenhuma prova futura cadastrada');
    }
  }, [races, currentDateTime]);

  // Format current date and time
  const formattedDateTime = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(currentDateTime);

  // Race form states
  const [raceForm, setRaceForm] = useState<Race>({
    id: '',
    name: '',
    location: '',
    distance: 0,
    date: '',
    type: 'Asfalto',
    image: '',
    eventLink: '',
    notes: ''
  });

  // Initialize default races
  useEffect(() => {
    const defaultRaces: Race[] = [
      {
        id: '1',
        name: 'UTMB - Chamonix',
        location: 'Suiça',
        distance: 174,
        date: '2025-09-01',
        type: 'Trail'
      },
      {
        id: '2',
        name: 'Evolution Itatiaia National Park',
        location: 'Brasil',
        distance: 130,
        date: '2025-12-01',
        type: 'Trail'
      }
    ];
    
    setRaces(defaultRaces);
    localStorage.setItem('races', JSON.stringify(defaultRaces));
  }, []);

  // Save races to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('races', JSON.stringify(races));
  }, [races]);

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

  const handleAddRace = () => {
    setEditingRace(null);
    setRaceForm({
      id: '',
      name: '',
      location: '',
      distance: 0,
      date: '',
      type: 'Asfalto',
      image: '',
      eventLink: '',
      notes: ''
    });
    setShowRaceForm(true);
  };

  const handleEditRace = (race: Race) => {
    setEditingRace(race);
    setRaceForm(race);
    setShowRaceForm(true);
  };

  const handleDeleteRace = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta prova?')) {
      setRaces(races.filter(race => race.id !== id));
    }
  };

  const handleSaveRace = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRace) {
      setRaces(races.map(race => race.id === editingRace.id ? { ...raceForm, id: editingRace.id } : race));
    } else {
      setRaces([...races, { ...raceForm, id: Date.now().toString() }]);
    }
    setShowRaceForm(false);
  };

  const handleExportRaces = () => {
    const dataStr = JSON.stringify(races, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'minhas-corridas.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportRaces = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedRaces = JSON.parse(e.target?.result as string);
          setRaces(importedRaces);
        } catch (error) {
          alert('Erro ao importar arquivo. Verifique se é um arquivo JSON válido.');
        }
      };
      reader.readAsText(file);
    }
  };

  const filteredRaces = races
    .filter(race => {
      const matchesSearch = race.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          race.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || race.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-indigo-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <img 
                src="https://github.com/85ED.png" 
                alt="Edson Felix" 
                className="w-16 h-16 rounded-full object-cover border-2 border-white"
              />
              <div>
                <h1 className="text-xl font-bold">Calculadora do Corredor</h1>
                <p className="text-indigo-200 text-sm">Todos os seus dados e métricas em um só lugar</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center space-x-4">
                <Activity className="h-5 w-5" />
                <span>Treine com inteligência</span>
              </div>
              <div className="text-sm text-indigo-200 mt-1 text-center md:text-right">
                {formattedDateTime}
              </div>
              <div className="text-xs text-indigo-300 mt-1 text-center md:text-right">
                {nextRaceCountdown}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Race Management Section */}
          <div className="bg-white rounded-xl shadow-md h-full">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <Footprints className="h-6 w-6 mr-2 text-indigo-600" />
                  Minhas Provas
                </h2>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleAddRace}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Prova
                  </button>
                  <label className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200 flex items-center cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Importar
                    <input
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={handleImportRaces}
                    />
                  </label>
                  <button
                    onClick={handleExportRaces}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200 flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </button>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar provas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as 'all' | 'Asfalto' | 'Trail')}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Todas as modalidades</option>
                  <option value="Asfalto">Asfalto</option>
                  <option value="Trail">Trail</option>
                </select>
              </div>

              {/* Race List */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {filteredRaces.map(race => {
                  const isUpcoming = new Date(race.date) > new Date();
                  return (
                    <div
                      key={race.id}
                      className={`p-4 rounded-lg border ${
                        isUpcoming ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{race.name}</h3>
                          <div className="flex items-center text-gray-600 mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {race.location}
                          </div>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(race.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              {race.type === 'Asfalto' ? (
                                <Road className="h-4 w-4 mr-1" />
                              ) : (
                                <Mountain className="h-4 w-4 mr-1" />
                              )}
                              {race.type}
                            </span>
                            <span>{race.distance}km</span>
                          </div>
                          {race.eventLink && (
                            <a
                              href={race.eventLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-800 flex items-center mt-2 text-sm"
                            >
                              <Link2 className="h-4 w-4 mr-1" />
                              Link do evento
                            </a>
                          )}
                          {race.notes && (
                            <p className="mt-2 text-sm text-gray-600">{race.notes}</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditRace(race)}
                            className="text-gray-600 hover:text-indigo-600"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRace(race.id)}
                            className="text-gray-600 hover:text-red-600"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Z2 Calculator Section */}
          <div className="bg-white rounded-xl shadow-md h-full">
            <div className="p-6">
              <div className="flex items-center justify-center mb-6 relative">
                <Heart className="h-8 w-8 text-red-500 mr-2" />
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
                    <User className="h-4 w-4 mr-2" />
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
        </div>
      </main>

      {/* Race Form Modal */}
      {showRaceForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSaveRace} className="p-6 space-y-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {editingRace ? 'Editar Prova' : 'Nova Prova'}
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome da corrida</label>
                <input
                  type="text"
                  required
                  value={raceForm.name}
                  onChange={(e) => setRaceForm({ ...raceForm, name: e.target.value })}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Estado ou País</label>
                <input
                  type="text"
                  required
                  value={raceForm.location}
                  onChange={(e) => setRaceForm({ ...raceForm, location: e.target.value })}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Distância (km)</label>
                <input
                  type="number"
                  required
                  value={raceForm.distance}
                  onChange={(e) => setRaceForm({ ...raceForm, distance: Number(e.target.value) })}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Data</label>
                <input
                  type="date"
                  required
                  value={raceForm.date}
                  onChange={(e) => setRaceForm({ ...raceForm, date: e.target.value })}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Modalidade</label>
                <select
                  value={raceForm.type}
                  onChange={(e) => setRaceForm({ ...raceForm, type: e.target.value as 'Asfalto' | 'Trail' })}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Asfalto">Asfalto</option>
                  <option value="Trail">Trail</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Link do evento (opcional)</label>
                <input
                  type="url"
                  value={raceForm.eventLink || ''}
                  onChange={(e) => setRaceForm({ ...raceForm, eventLink: e.target.value })}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Observações (opcional)</label>
                <textarea
                  value={raceForm.notes || ''}
                  onChange={(e) => setRaceForm({ ...raceForm, notes: e.target.value })}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRaceForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {editingRace ? 'Salvar Alterações' : 'Adicionar Prova'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-indigo-800 text-white py-6 mt-10">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Calculadora do Corredor - Desenvolvido por <span className="font-bold">Edson Felix</span></p>
          <p className="text-indigo-300 text-sm mt-2">Treine para melhorar sua performance e saúde</p>
        </div>
      </footer>
    </div>
  );
}

export default App;