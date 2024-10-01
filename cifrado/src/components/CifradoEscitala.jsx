import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { cifrarEscitala, descifrarEscitala } from '../utils/cifrado';

function CifradoEscitala() {
    const [mensaje, setMensaje] = useState('');
    const [columnas, setColumnas] = useState();
    const [resultado, setResultado] = useState('');
    const [matriz, setMatriz] = useState([]);
    const [clave, setClave] = useState(0);

    const validarFormulario = () => {
        if (!mensaje) {
            toast.error('El campo de mensaje no puede estar vacío');
            return false;
        }
        if (columnas < 2) {
            toast.error('El número de columnas debe ser mayor o igual a 2');
            return false;
        }
        return true;
    };

    useEffect(() => {
        const matrizVacia = Array(3).fill().map(() => Array(3).fill(''));
        setMatriz(matrizVacia);
    }, []);

    const manejarCifrado = () => {
        if (!validarFormulario()) return;

        if (columnas > mensaje.length) {
            toast.error('El número de columnas no puede ser mayor que la longitud del mensaje.');
            return;
        }

        const { mensajeCifrado, matriz } = cifrarEscitala(mensaje, parseInt(columnas));
        setResultado(mensajeCifrado);
        setMatriz(matriz);
        setClave(parseInt(columnas));
    };

    const manejarDescifrado = () => {
        if (!validarFormulario()) return;

        if (parseInt(columnas) !== clave) {
            toast.error('La clave utilizada para el descifrado no coincide con la utilizada para el cifrado.');
            return;
        }

        try {
            const mensajeDescifrado = descifrarEscitala(mensaje, parseInt(columnas));
            setResultado(mensajeDescifrado);
        } catch (error) {
            toast.error('Error durante el descifrado');
        }
    };

    const copiarTexto = () => {
        if (resultado) {
            navigator.clipboard.writeText(resultado)
                .then(() => {
                    toast.success('Texto copiado');
                })
                .catch(() => {
                    toast.error('Error al copiar el texto');
                });
        }
    };

    return (
        <div className="container mx-auto p-6  rounded-md">
            <ToastContainer />
            <h2 className="text-4xl font-bold mb-6 text-center ">Cifrado Escítala</h2>
            <div className="flex flex-col md:flex-row gap-6 lg:px-20 ">
                <div className=" w-full p-4 rounded-lg bg-white shadow-2xl">
                    <label htmlFor="mensaje" className="block text-gray-700 font-medium mb-2">
                        Mensaje a cifrar/descifrar:
                    </label>
                    <input
                        id="mensaje"
                        className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                        placeholder="Escribe o pega el mensaje"
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                    />

                    <label htmlFor="columnas" className="block text-gray-700 font-medium mb-2">
                        Número de columnas (clave):
                    </label>
                    <input
                        id="columnas"
                        className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="number"
                        placeholder="Número de columnas"
                        min={0}
                        value={columnas}
                        onChange={(e) => setColumnas(parseInt(e.target.value))}
                    />

                    <div className="flex justify-center gap-4 font-bold">
                        <button
                            onClick={manejarCifrado}
                             className=" w-48 text-white bg-violet-600 px-4 py-2 rounded-lg hover:bg-violet-800 transition duration-200 hover:text-white font-bold"
                        >
                            Cifrar
                        </button>
                        <button
                            onClick={manejarDescifrado}
                           className="border-2 w-48  px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200 cursor-pointer font-bold "
                            disabled={!mensaje}
                        >
                            Descifrar
                        </button>
                    </div>

                    {resultado && (
                        <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-100">
                            <strong className="text-gray-800">Resultado:</strong> {resultado}
                            <button
                                onClick={copiarTexto}
                                className="ml-4 text-blue-500 underline cursor-pointer"
                            >
                                Copiar
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex w-full flex-col items-center shadow-2xl  p-4 rounded-lg bg-white">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Matriz generada:</h3>
                    <div className="w-full overflow-auto">
                        <table className="table-auto m-auto ">
                            <tbody>
                                {matriz.map((fila, i) => (
                                    <tr key={i} className='flex justify-center items-center text-center gap-4 p-2'>
                                        {fila.map((columna, j) => (
                                            <td key={j} className="border-2 h-12 w-12 border-violet-400 px-4 py-2 text-center flex justify-center items-center font-semibold rounded-md">
                                                {columna || ' '}
                                            </td>
                                        ))}
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

export default CifradoEscitala;
