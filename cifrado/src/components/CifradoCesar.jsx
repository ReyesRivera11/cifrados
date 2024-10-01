import React, { useState } from 'react';
import { cifrarCesar, descifrarCesar } from '../utils/cifrado';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CifradoCesar() {
    const [mensaje, setMensaje] = useState('');
    const [desplazamiento, setDesplazamiento] = useState();
    const [resultado, setResultado] = useState('');
    const [desplazamientoUsado, setDesplazamientoUsado] = useState(null);

    const manejarCifrado = () => {
        if (!mensaje.trim()) {
            toast.error('Por favor, ingresa un mensaje.');
            return;
        }
        if (desplazamiento <= 0) {
            toast.error('El desplazamiento debe ser mayor que 0.');
            return;
        }
        setResultado(cifrarCesar(mensaje, parseInt(desplazamiento)));
        setDesplazamientoUsado(desplazamiento);
    };

    const manejarDescifrado = () => {
        if (!mensaje.trim()) {
            toast.error('Por favor, ingresa un mensaje.');
            return;
        }
        if (desplazamiento <= 0) {
            toast.error('El desplazamiento debe ser mayor que 0.');
            return;
        }
        if (desplazamientoUsado === null || desplazamientoUsado !== desplazamiento) {
            toast.error('El desplazamiento debe coincidir con el utilizado al cifrar.');
            return;
        }
        setResultado(descifrarCesar(mensaje, parseInt(desplazamiento)));
    };

    const copiarResultado = async () => {
        if (resultado) {
            await navigator.clipboard.writeText(resultado);
            toast.success('Resultado copiado al portapapeles.');
        } else {
            toast.error('No hay nada que copiar.');
        }
    };

    const handleMensajeChange = (e) => {
        const inputValue = e.target.value;
        const filteredValue = inputValue.replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚ ]/g, '');
        if (inputValue !== filteredValue) {
            toast.warn('Solo se permiten letras y espacios. Los demás caracteres han sido eliminados.');
        }
        setMensaje(filteredValue);
    };

    return (
        <div className=" m-auto bg-white shadow-2xl  p-2 rounded-md max-w-3xl ">
            <ToastContainer />
            <div className="max-w-xl m-auto  rounded-lg">
                <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">Cifrado César</h2>
                <label className="block mb-2 text-gray-700 font-medium" htmlFor="mensaje">Mensaje</label>
                <input
                    id="mensaje"
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    type="text"
                    placeholder="Escribe el mensaje"
                    value={mensaje}
                    onChange={handleMensajeChange}
                />

                <label className="block mb-2 text-gray-700 font-medium" htmlFor="desplazamiento">Desplazamiento</label>
                <input
                    id="desplazamiento"
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    type="number"
                    placeholder="Desplazamiento"
                    min={0}
                    value={desplazamiento}
                    onChange={(e) => setDesplazamiento(e.target.value)}
                />

                <div className="flex justify-center gap-4">
                    <button
                        className=" w-48 text-white bg-violet-600 px-4 py-2 rounded-lg hover:bg-violet-800 transition duration-200 hover:text-white font-bold"

                        onClick={manejarCifrado}
                    >
                        Cifrar
                    </button>
                    <button
                        onClick={manejarDescifrado}
                        className="border-2 w-48  px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200 cursor-pointer font-bold "
                    >
                        Descifrar
                    </button>
                </div>

                <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-between">
                    <p className="text-gray-700 font-mono mr-2">Resultado: {resultado}</p>
                    {resultado && (
                        <button
                            onClick={copiarResultado}
                            className="text-blue-500 font-semibold hover:underline"
                        >
                            Copiar
                        </button>
                    )}
                </div>
            </div>


        </div>
    );
}

export default CifradoCesar;
