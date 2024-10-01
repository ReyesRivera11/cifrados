import React, { useState } from 'react';
import CifradoCesar from './components/CifradoCesar';
import CifradoEscitala from './components/CifradoEscitala';
import ComparacionCifrados from './components/ComparacionCifrados';
import Cifrados from './components/CifradoExpress';
import CifradoDjango from './components/CifradoDjango';
import AcercaDe from './components/AcercaDe';

function App() {
  const [tipoCifrado, setTipoCifrado] = useState('cesar');
  const [menuOpen, setMenuOpen] = useState(false);

  const tabClass = (tipo) => {
    return tipoCifrado === tipo
      ? 'bg-violet-500 text-white shadow-md rounded-lg' // Activo: Fondo negro, texto blanco
      : 'text-black hover:bg-gray-200 hover:text-black hover:rounded-lg transition-colors'; // Inactivo: Texto negro, hover con fondo gris claro
  };

  return (
    <div className=" bg-gray-200/30 min-h-screen flex flex-col items-center  relative">
      {/* Navigation Bar */}
      <nav className="flex bg-white items-center justify-between  text-gray-900 fixed top-0 left-0 w-full z-10  text-nowrap p-3">
        <h1 className=" font-bold uppercase ">Aplicación de Cifrado</h1>

        {/* Burger Menu for Mobile */}
        <button
          className="text-gray-900 lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden  lg:flex justify-center items-center space-x-6">
          <button className={`py-1 px-4  transition ${tabClass('cesar')}`} onClick={() => setTipoCifrado('cesar')}>
            Cifrado César
          </button>
          <button className={`py-1 px-4  transition ${tabClass('escitala')}`} onClick={() => setTipoCifrado('escitala')}>
            Cifrado Escítala
          </button>
          <button className={`py-1 px-4  transition ${tabClass('comparacion')}`} onClick={() => setTipoCifrado('comparacion')}>
            Comparación
          </button>
          <button className={`py-1 px-4  transition ${tabClass('cifrados')}`} onClick={() => setTipoCifrado('cifrados')}>
            Cifrado (Express)
          </button>
          <button className={`py-1 px-4  transition ${tabClass('django')}`} onClick={() => setTipoCifrado('django')}>
            Cifrado (Django)
          </button>
          <button className={`py-1 px-4  transition ${tabClass('acerca')}`} onClick={() => setTipoCifrado('acerca')}>
            Acerca de
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`lg:hidden ${menuOpen ? 'block' : 'hidden'} w-full p-4 absolute z-20 bg-white shadow-lg`}>
        <button className={`w-full py-2  transition ${tabClass('cesar')}`} onClick={() => { setTipoCifrado('cesar'); setMenuOpen(false); }}>
          Cifrado César
        </button>
        <button className={`w-full py-2  transition ${tabClass('escitala')}`} onClick={() => { setTipoCifrado('escitala'); setMenuOpen(false); }}>
          Cifrado Escítala
        </button>
        <button className={`w-full py-2  transition ${tabClass('comparacion')}`} onClick={() => { setTipoCifrado('comparacion'); setMenuOpen(false); }}>
          Comparación
        </button>
        <button className={`w-full py-2  transition ${tabClass('cifrados')}`} onClick={() => { setTipoCifrado('cifrados'); setMenuOpen(false); }}>
          Cifrado (Express)
        </button>
        <button className={`w-full py-2  transition ${tabClass('django')}`} onClick={() => { setTipoCifrado('django'); setMenuOpen(false); }}>
          Cifrado (Django)
        </button>
        <button className={`w-full py-2  transition ${tabClass('acerca')}`} onClick={() => { setTipoCifrado('acerca'); setMenuOpen(false); }}>
          Acerca de
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full p-8 mt-12  h-auto">
        {tipoCifrado === 'cesar' && <CifradoCesar />}
        {tipoCifrado === 'escitala' && <CifradoEscitala />}
        {tipoCifrado === 'comparacion' && <ComparacionCifrados />}
        {tipoCifrado === 'cifrados' && <Cifrados />}
        {tipoCifrado === 'django' && <CifradoDjango />}
        {tipoCifrado === 'acerca' && <AcercaDe />}
      </div>
    </div>
  );
}

export default App;
