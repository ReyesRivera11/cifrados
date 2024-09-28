import React, { useState } from 'react';
import CifradoCesar from './components/CifradoCesar';
import CifradoEscitala from './components/CifradoEscitala';
import ComparacionCifrados from './components/ComparacionCifrados';

function App() {
  const [tipoCifrado, setTipoCifrado] = useState('cesar');

  const tabClass = (tipo) => {
    return tipoCifrado === tipo
      ? 'bg-blue-600 text-white'
      : 'bg-gray-200 text-gray-600 hover:bg-gray-300';
  };

  return (
    <div className="p-8 bg-gray-800 min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-white mb-6 text-center">
        Aplicación de Cifrado
      </h1>
      
      <div className="flex w-full max-w-2xl justify-between mb-8">
        <button
          className={`w-1/3 py-3 text-lg font-medium transition-all duration-200 ${tabClass('cesar')} rounded-l-lg shadow-md`}
          onClick={() => setTipoCifrado('cesar')}
        >
          Cifrado César
        </button>
        <button
          className={`w-1/3 py-3 text-lg font-medium transition-all duration-200 ${tabClass('escitala')} shadow-md`}
          onClick={() => setTipoCifrado('escitala')}
        >
          Cifrado Escítala
        </button>
        <button
          className={`w-1/3 py-3 text-lg font-medium transition-all duration-200 ${tabClass('comparacion')} rounded-r-lg shadow-md`}
          onClick={() => setTipoCifrado('comparacion')}
        >
          Comparación
        </button>
      </div>
      
      <div className="w-full max-w-2xl  rounded-lg shadow-lg">
        {tipoCifrado === 'cesar' && <CifradoCesar />}
        {tipoCifrado === 'escitala' && <CifradoEscitala />}
        {tipoCifrado === 'comparacion' && <ComparacionCifrados />}
      </div>
    </div>
  );
}

export default App;
