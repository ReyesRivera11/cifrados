import React from 'react';

const ComparacionFrameworks = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full">
      <h1 className="text-2xl font-bold text-center mb-6">Comparación de Frameworks: Express.js vs Django</h1>
      <p className="text-lg mb-4">
        En este proyecto se implementaron métodos de cifrado utilizando dos frameworks diferentes: <strong>Express.js</strong> y <strong>Django</strong>. A continuación se presenta una comparación en términos de implementación y rendimiento al trabajar con los algoritmos de cifrado <strong>Serpent</strong>, <strong>GOST R 34.11-94</strong> y <strong>RSA</strong>.
      </p>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Express.js</h2>
        <p className="mb-2">
          Express.js es un framework minimalista basado en Node.js. Permite realizar operaciones de cifrado utilizando la librería <strong>crypto</strong> y otras bibliotecas externas. En este proyecto se implementaron los siguientes métodos de cifrado:
        </p>
        <ul className="list-disc pl-5 mb-4">
          <li>
            <strong>Cifrado Serpent:</strong> Se utilizó para cifrar datos sensibles como <strong>nombre, dirección y email</strong>. Se creó una implementación personalizada utilizando operaciones XOR y rotación de bits.
          </li>
          <li>
            <strong>Cifrado RSA:</strong> Se aplicó para cifrar <strong>números de teléfono y tarjetas de crédito</strong> usando claves públicas y privadas, garantizando la seguridad en la transmisión de estos datos.
          </li>
          <li>
            <strong>Hash GOST R 34.11-94:</strong> Un algoritmo de hashing utilizado para crear huellas digitales únicas de las <strong>contraseñas</strong>, asegurando que estas no se puedan descifrar fácilmente.
          </li>
        </ul>
        <p>
          Express.js se destacó por su <strong>velocidad y eficiencia</strong> en el manejo de estas operaciones, especialmente en tareas de cifrado y descifrado asíncrono.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Django</h2>
        <p className="mb-2">
          Django es un framework robusto y escalable basado en Python. Utiliza la librería <strong>PyCryptodome</strong> para realizar operaciones de cifrado. Se implementaron los siguientes métodos de cifrado en este proyecto:
        </p>
        <ul className="list-disc pl-5 mb-4">
          <li>
            <strong>Cifrado Serpent:</strong> Se empleó para cifrar <strong>nombre, dirección y email</strong> de manera similar a Express.js, utilizando operaciones XOR y rotación de bits en una estructura de bloque.
          </li>
          <li>
            <strong>Cifrado RSA:</strong> Se utilizó para proteger <strong>números de teléfono y tarjetas de crédito</strong>, aprovechando la seguridad de la criptografía asimétrica.
          </li>
          <li>
            <strong>Hash GOST R 34.11-94:</strong> Implementado para el hashing de <strong>contraseñas</strong>, creando una huella digital única y verificable de las mismas.
          </li>
        </ul>
        <p>
          Aunque Django ofrece un <strong>entorno más estructurado</strong> y herramientas integradas para la seguridad, puede presentar una ligera disminución de rendimiento en comparación con Express.js debido a la naturaleza síncrona de Python.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Comparación Final</h2>
        <table className="w-full border-collapse bg-gray-100 shadow-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2 text-left">Criterio</th>
              <th className="border px-4 py-2 text-left">Express.js</th>
              <th className="border px-4 py-2 text-left">Django</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">Rendimiento</td>
              <td className="border px-4 py-2">Mayor rendimiento debido a su naturaleza asíncrona y eficiente manejo de E/S.</td>
              <td className="border px-4 py-2">Rendimiento estable, pero puede ser más lento para operaciones intensivas.</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Facilidad de Implementación</td>
              <td className="border px-4 py-2">Flexibilidad, pero requiere más código para seguridad y cifrado personalizado.</td>
              <td className="border px-4 py-2">Más fácil de implementar con herramientas integradas para seguridad y cifrado.</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Soporte de Cifrado</td>
              <td className="border px-4 py-2">Soporte amplio a través de bibliotecas externas como `crypto`, `node-rsa` y `node-gost-crypto`.</td>
              <td className="border px-4 py-2">Soporte de cifrado sólido con `PyCryptodome` y bibliotecas adicionales.</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Seguridad</td>
              <td className="border px-4 py-2">Requiere configuración manual de seguridad para protección CSRF y otros ataques.</td>
              <td className="border px-4 py-2">Proporciona herramientas integradas para protección CSRF y validación de formularios.</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Datos Cifrados</td>
              <td className="border px-4 py-2">
                Nombre, dirección, email (Serpent); teléfono, tarjeta de crédito (RSA); contraseña (GOST R 34.11-94).
              </td>
              <td className="border px-4 py-2">
                Nombre, dirección, email (Serpent); teléfono, tarjeta de crédito (RSA); contraseña (GOST R 34.11-94).
              </td>
            </tr>
          </tbody>
        </table>
        <p className="mt-4">
          En conclusión, la elección entre Express.js y Django dependerá del proyecto y los requisitos específicos. Si se prioriza el rendimiento y la flexibilidad, Express.js es una excelente opción. Si se busca robustez y facilidad de desarrollo, Django es más adecuado.
        </p>
      </div>
    </div>
  );
};

export default ComparacionFrameworks;
