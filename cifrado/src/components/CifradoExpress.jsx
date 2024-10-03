import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';
function Cifrados() {
    const [formData, setFormData] = useState({
        userKey: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        creditCard: '',
        password: ''
    });

    const [decryptKey, setDecryptKey] = useState('');
    const [encryptedData, setEncryptedData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const [decryptedData, setDecryptedData] = useState({});
    const [errorMessages, setErrorMessages] = useState({
        userKey: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        creditCard: '',
        password: '',
        decryptKey: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Actualiza el formData en cada cambio
        setFormData({
            ...formData,
            [name]: value
        });

        // Llama a la función validateField para validar en tiempo real
        validateField(name, value);
    };

    const validateField = (name, value) => {
        let errorMessage = '';

        switch (name) {
            case 'userKey':
                if (!validateUserKey(value)) {
                    errorMessage = 'La clave debe tener 16 caracteres, incluyendo números, mayúsculas y caracteres especiales.';
                }
                break;
            case 'name':
                if (!value) {
                    errorMessage = 'El nombre es requerido.';
                }
                break;
            case 'email':
                if (!value) {
                    errorMessage = 'El email es requerido.';
                } else if (!validateEmail(value)) {
                    errorMessage = 'El email es inválido.';
                }
                break;
            case 'phone':
                if (!value) {
                    errorMessage = 'El teléfono es requerido.';
                } else if (!validatePhone(value)) {
                    errorMessage = 'El teléfono es inválido. Debe tener 10 números.';
                }
                break;
            case 'address':
                if (!value) {
                    errorMessage = 'La dirección es requerida.';
                }
                break;
            case 'creditCard':
                if (!value) {
                    errorMessage = 'El número de tarjeta de crédito es requerido.';
                } else if (!/^\d*$/.test(value)) {
                    errorMessage = 'Solo se permiten números en la tarjeta de crédito.';
                }
                break;
            case 'password':
                if (!value) {
                    errorMessage = 'La contraseña es requerida.';
                }
                break;
            case 'decryptKey':
                if (!validateUserKey(value)) {
                    errorMessage = 'La clave debe tener 16 caracteres, incluyendo números, mayúsculas y caracteres especiales.';
                }
                break;
            default:
                break;
        }

        // Actualiza los mensajes de error
        setErrorMessages((prev) => ({
            ...prev,
            [name]: errorMessage
        }));
    };

    const validateUserKey = (key) => {
        const keyRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z]).{16}$/;
        return keyRegex.test(key);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^\d{10}$/; // Suponiendo que se requieren 10 dígitos
        return phoneRegex.test(phone);
    };
    const api = "http://localhost:3001";
    // const api = "https://backend-cifrados.vercel.app";
    const handleEncrypt = () => {
        // Primero valida cada campo
        let hasErrors = false;
        for (const [key, value] of Object.entries(formData)) {
            validateField(key, value);
            if (!value || errorMessages[key] !== '') {
                hasErrors = true;  // Si algún campo tiene error, lo marcamos
            }
        }

        // Espera a que las validaciones se completen antes de proceder
        if (hasErrors) {
            toast.error('Por favor, corrige los errores antes de enviar.');
            return;  // Detiene la ejecución si hay errores
        } else {
            setIsLoading(true);
            axios.post(`${api}/submit`, formData)
                .then(res => {
                    setEncryptedData(res.data.encryptedData);
                    setIsLoading(false);
                })
                .catch(err => {
                    toast.error('Error en el servidor. Inténtalo nuevamente más tarde.');
                    setIsLoading(false);
                });
        }


    };


    const handleDecrypt = () => {
        validateField('decryptKey', decryptKey);

        if (errorMessages.decryptKey === '') {
            setIsLoading2(true);
            axios.post(`${api}/decrypt`, {
                userKey: decryptKey,
                encryptedName: encryptedData.encryptedName,
                encryptedAddress: encryptedData.encryptedAddress,
                encryptedPhone: encryptedData.encryptedPhone,
                encryptedCreditCard: encryptedData.encryptedCreditCard,
                encryptedEmail: encryptedData.encryptedEmail
            })
                .then(res => {
                    setDecryptedData(res.data.decryptedData);
                    setIsLoading2(false);
                })
                .catch(err => {
                    toast.error('Las claves no coinciden.');
                    setIsLoading2(false);
                });
        }
    };

    return (
        <div className=" w-full mx-auto md:px-6 grid grid-cols-1 md:grid-cols-6 gap-5 rounded-md">
            {/* Sección del formulario */}
            <div className="col-span-3 md:max-h-[500px] bg-white p-2 rounded-md shadow-2xl">
                <ToastContainer />
                <h1 className="text-2xl font-bold mb-6 text-center">Cifrado de Datos con Express</h1>

                <div className="grid md:grid-cols-2 gap-2 mb-4 ">
                    <div className="col-span-2">
                        <label htmlFor="userKey" className="block text-sm font-medium text-gray-700 mb-1">Clave (16 caracteres)</label>
                        <input
                            id="userKey"
                            name="userKey"
                            placeholder="Clave (16 caracteres)"
                            className={`w-full p-2 border ${errorMessages.userKey ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            onChange={handleChange}
                        />
                        {errorMessages.userKey && <p className="text-red-500 text-sm mt-1">{errorMessages.userKey}</p>}
                    </div>

                    {['name', 'email', 'phone', 'address', 'password'].map((field) => (
                        <div key={field} className={`col-span-${field === 'password' ? '2' : '1'}`}>
                            <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
                                {field === 'name' && 'Nombre'}
                                {field === 'email' && 'Email'}
                                {field === 'phone' && 'Teléfono'}
                                {field === 'address' && 'Dirección'}
                                {field === 'password' && 'Contraseña'}
                            </label>
                            <input
                                id={field}
                                name={field}
                                type={field === 'password' ? 'password' : 'text'}
                                placeholder={field}
                                className={`w-full p-2 border ${errorMessages[field] ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                onChange={handleChange}
                            />
                            {errorMessages[field] && <p className="text-red-500 text-sm mt-1">{errorMessages[field]}</p>}
                        </div>
                    ))}

                    <div className="col-span-2">
                        <label htmlFor="creditCard" className="block text-sm font-medium text-gray-700 mb-1">
                            Tarjeta de Crédito
                        </label>
                        <input
                            id="creditCard"
                            name="creditCard"
                            type="text" // Mantener como texto para permitir el formato
                            placeholder="Número de tarjeta de crédito"
                            className={`w-full p-2 border ${errorMessages.creditCard ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            onChange={handleChange}
                        />
                        {errorMessages.creditCard && <p className="text-red-500 text-sm mt-1">{errorMessages.creditCard}</p>}
                    </div>
                </div>

                <button
                    onClick={handleEncrypt}
                    disabled={Boolean(isLoading)}
                    className="w-full lg:w-48 text-white bg-violet-600 px-4 py-2 rounded-lg hover:bg-violet-800 transition duration-200 hover:text-white font-bold"
                >
                    {
                        isLoading ? <ClipLoader color="#fff" loading={isLoading} size={10} /> : <>
                            Cifrar
                        </>
                    }
                </button>


            </div>
            <div className="col-span-3">
                <div className=" bg-white shadow-xl p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Datos Cifrados</h3>
                    <div className="p-6 rounded-lg border border-gray-300 overflow-auto max-h-60 ">
                        <p className="break-words mb-2"><strong>Nombre Encriptado:</strong> <span className="text-gray-600">{encryptedData.encryptedName?.encryptedData}</span></p>
                        <p className="break-words mb-2"><strong>Email Encriptado:</strong> <span className="text-gray-600">{encryptedData.encryptedEmail?.encryptedData}</span></p>
                        <p className="break-words mb-2"><strong>Dirección Encriptada:</strong> <span className="text-gray-600">{encryptedData.encryptedAddress?.encryptedData}</span></p>
                        <p className="break-words mb-2"><strong>Teléfono Encriptado:</strong> <span className="text-gray-600">{encryptedData.encryptedPhone}</span></p>
                        <p className="break-words mb-2"><strong>Tarjeta de Crédito Encriptada:</strong> <span className="text-gray-600">{encryptedData.encryptedCreditCard}</span></p>
                        <p className="break-words mb-2"><strong>Contraseña Cifrada:</strong> <span className="text-gray-600">{encryptedData.digestCrypto}</span></p>
                    </div>
                </div>

                {
                    Object.keys(encryptedData).length > 0 && (
                        <>
                            {/* Sección para Descifrar */}
                            <div className="mt-6 bg-white shadow-md rounded-lg p-4">
                                <h3 className="text-lg font-semibold mb-4 text-gray-800">Descifrar Datos</h3>
                                <label htmlFor="decryptKey" className="block text-sm font-medium text-gray-700 mb-1">Clave para Descifrar</label>
                                <input
                                    id="decryptKey"
                                    type="text"
                                    placeholder="Ingrese la clave para descifrar"
                                    value={decryptKey}
                                    onChange={(e) => {
                                        setDecryptKey(e.target.value);
                                        validateField('decryptKey', e.target.value);
                                    }}
                                    className={`w-full p-3 border ${errorMessages.decryptKey ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150`}
                                />
                                {errorMessages.decryptKey && <p className="text-red-500 text-sm mt-1">{errorMessages.decryptKey}</p>}
                                <button
                                    disabled={Boolean(isLoading2)}
                                    onClick={handleDecrypt}
                                    className="w-full mt-2 lg:w-48 text-white bg-violet-600 px-4 py-2 rounded-lg hover:bg-violet-800 transition duration-200 hover:text-white font-bold"
                                >
                                    {
                                        isLoading2 ? <ClipLoader color="#fff" loading={isLoading2} size={10} /> : <>
                                            Descifrar
                                        </>
                                    }
                                </button>
                            </div>

                        </>
                    )
                }
                {Object.keys(decryptedData).length > 0 && (
                    <div className="mt-6 bg-white shadow-2xl p-4 rounded-md">

                        <h3 className="text-lg font-semibold mb-2">Datos Descifrados</h3>
                        <div className="p-4   max-h-60">
                            <p className="break-words"><strong>Nombre:</strong> {decryptedData.decryptedName}</p>
                            <p className="break-words"><strong>Email:</strong> {decryptedData.decryptedEmail}</p>
                            <p className="break-words"><strong>Dirección:</strong> {decryptedData.decryptedAddress}</p>
                            <p className="break-words"><strong>Teléfono:</strong> {decryptedData.decryptedPhone}</p>
                            <p className="break-words"><strong>Tarjeta de Crédito:</strong> {decryptedData.decryptedCreditCard}</p>
                            <p className="break-words"><strong>Contraseña:</strong> No es posible el decifrado de un hash!</p>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}

export default Cifrados;
