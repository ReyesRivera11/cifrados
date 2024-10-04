import React from 'react';
import Autor from "../assets/autor.jpg";    
function AcercaDe() {
    return (
        <div className="w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-6 gap-5 rounded-md">
            {/* Sección de información del autor */}
            <div className="col-span-3 md:max-h-[500px] bg-white p-4 rounded-md shadow-2xl">
                <h1 className="text-xl font-bold mb-6 text-center">Acerca del Autor</h1>
                <div className="text-center">
                    <img 
                        src={Autor} 
                        alt="Imagen del Autor"
                        className="w-48 h-48 rounded-full mx-auto mb-4 shadow-lg"
                    />
                    <p className="text-lg font-semibold">Nombre: <span className="font-normal">Reyes Bautista Rivera</span></p>
                    <p className="text-lg font-semibold">Cuatrimestre: <span className="font-normal">7mo</span></p>
                    <p className="text-lg font-semibold">Grupo: <span className="font-normal">A</span></p>
                    <p className="text-lg font-semibold">Carrera: <span className="font-normal">Ingeniería en desarrollo y gestión de software</span></p>
                    <p className="text-lg font-semibold">Universidad: <span className="font-normal">Universidad Tecnológica de la Huasteca Hidalguense</span></p>
                </div>
            </div>

            {/* Sección de la finalidad de la página */}
            <div className="col-span-3 bg-white p-4 rounded-md shadow-2xl">
                <h2 className="text-xl font-bold mb-4 text-center">Finalidad de la Página de Cifrados</h2>
                <p className="text-justify text-gray-700 leading-relaxed">
                    Esta página está diseñada para demostrar cómo funcionan varios métodos de cifrado. Se incluyen los siguientes tipos de cifrado:
                </p>
                <ul className="list-disc pl-5 mt-4 space-y-2 text-gray-700">
                    <li>
                        <strong>Cifrado César:</strong> Un método de cifrado por sustitución que desplaza las letras del alfabeto.
                    </li>
                    <li>
                        <strong>Escítala:</strong> Una técnica antigua que utiliza un bastón para leer mensajes cifrados en una cinta de pergamino.
                    </li>
                    <li>
                        <strong>Cifrado Simétrico Serpent:</strong> Un método en el que tanto el emisor como el receptor utilizan la misma clave para cifrar y descifrar.
                    </li>
                    <li>
                        <strong>Cifrado Asimétrico (RSA):</strong> Utiliza un par de claves, una pública y una privada, para cifrar y descifrar datos.
                    </li>
                    <li>
                        <strong>Hash (GOST R 34.11-94):</strong> Un algoritmo de hashing que produce una huella digital única a partir de un conjunto de datos, utilizado en la verificación de integridad y almacenamiento de contraseñas.
                    </li>
                </ul>
                <p className="mt-4 text-justify text-gray-700 leading-relaxed">
                    El objetivo es visualizar el funcionamiento de estos algoritmos mediante un enfoque práctico, brindando la posibilidad de cifrar y descifrar datos en tiempo real.
                </p>
            </div>
        </div>
    );
}

export default AcercaDe;
