import React, { useState } from 'react';
import { cifrarCesar, cifrarEscitala } from '../utils/cifrado';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ComparacionCifrados() {
    const [mensaje, setMensaje] = useState('');
    const [desplazamiento, setDesplazamiento] = useState(3);
    const [columnas, setColumnas] = useState(3);
    const [resultadoCesar, setResultadoCesar] = useState('');
    const [resultadoEscitala, setResultadoEscitala] = useState('');

    const manejarComparacion = () => {
        if (!mensaje.trim()) {
            toast.error('Por favor, ingresa un mensaje para comparar.');
            return;
        }
        if (desplazamiento <= 0) {
            toast.error('El desplazamiento para César debe ser mayor que 0.');
            return;
        }
        if (columnas < 2) {
            toast.error('El número de columnas para Escítala debe ser al menos 2.');
            return;
        }

        const cifradoCesar = cifrarCesar(mensaje, desplazamiento);
        setResultadoCesar(cifradoCesar);

        const { mensajeCifrado } = cifrarEscitala(mensaje, columnas);
        setResultadoEscitala(mensajeCifrado);
    };

    return (
        <div className="container mx-auto p-6 bg-gray-100 shadow-lg rounded-md max-w-3xl">
            <ToastContainer />
            <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">Comparación de Cifrados</h2>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="mensaje">
                        Mensaje a cifrar:
                    </label>
                    <input
                        id="mensaje"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                        placeholder="Escribe o pega el mensaje"
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                    />
                </div>

                <div className="flex gap-4 mb-4">
                    <div className="w-1/2">
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="desplazamiento">
                            Desplazamiento (César):
                        </label>
                        <input
                            id="desplazamiento"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="number"
                            min="1"
                            value={desplazamiento}
                            onChange={(e) => setDesplazamiento(parseInt(e.target.value))}
                        />
                    </div>

                    <div className="w-1/2">
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="columnas">
                            Columnas (Escítala):
                        </label>
                        <input
                            id="columnas"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="number"
                            min="2"
                            value={columnas}
                            onChange={(e) => setColumnas(parseInt(e.target.value))}
                        />
                    </div>
                </div>
                <div className="w-full flex justify-center">

                    <button
                        onClick={manejarComparacion}
                        className="border-2 w-64 font-bold border-blue-900 px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        Comparar Cifrados
                    </button>
                </div>
            </div>

            {resultadoCesar || resultadoEscitala ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-3xl font-semibold mb-4 text-gray-700">Cifrado César</h3>
                        <p><strong>Mensaje Original:</strong> {mensaje}</p>
                        <p><strong>Desplazamiento:</strong> {desplazamiento}</p>
                        <p className="mt-2"><strong>Mensaje Cifrado:</strong> {resultadoCesar}</p>
                        <div className="mt-4 p-4 bg-blue-100 border border-blue-300 rounded-lg">
                            <h4 className="font-semibold text-blue-700">Análisis de Seguridad:</h4>
                            <p>
                                El cifrado César es un método de sustitución simple que desplaza las letras del alfabeto por un número fijo.
                                Es fácil de implementar pero ofrece baja seguridad, ya que es susceptible a ataques de fuerza bruta y análisis de frecuencia.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-3xl font-semibold mb-4 text-gray-700">Cifrado Escítala</h3>
                        <p><strong>Mensaje Original:</strong> {mensaje}</p>
                        <p><strong>Columnas:</strong> {columnas}</p>
                        <p className="mt-2"><strong>Mensaje Cifrado:</strong> {resultadoEscitala}</p>
                        <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-lg">
                            <h4 className="font-semibold text-green-700">Análisis de Seguridad:</h4>
                            <p>
                                El cifrado Escítala es un método de transposición que reordena los caracteres del mensaje en una matriz y luego los lee en un orden específico.
                                Aunque más seguro que el cifrado César, también puede ser vulnerado con análisis de patrones y técnicas criptográficas avanzadas.
                            </p>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default ComparacionCifrados;
