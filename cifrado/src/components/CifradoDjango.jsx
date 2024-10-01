import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';

function CifradoDjango() {
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
    const [encryptErrorMessage, setEncryptErrorMessage] = useState('');
    const [decryptErrorMessage, setDecryptErrorMessage] = useState('');
    const [keyError, setKeyError] = useState(false);
    const [decryptKeyError, setDecryptKeyError] = useState(false);
    const [keyMismatchError, setKeyMismatchError] = useState(false);
    const [requiredFieldsError, setRequiredFieldsError] = useState({});
    const [phoneError, setPhoneError] = useState(false);
    const [creditCardError, setCreditCardError] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Reset error messages for the specific field
        if (requiredFieldsError[name]) {
            setRequiredFieldsError(prev => ({ ...prev, [name]: false }));
        }
        if (name === 'phone' && phoneError) {
            setPhoneError(false);
        }
        if (name === 'creditCard' && creditCardError) {
            setCreditCardError(false);
        }

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleEncrypt = () => {
        // Reset error states
        setEncryptErrorMessage('');
        setKeyError(false);
        setRequiredFieldsError({});
        setPhoneError(false);
        setCreditCardError(false);

        // Validaciones
        if (!validateUserKey(formData.userKey)) {
            setKeyError(true);
            setEncryptErrorMessage('La clave debe tener 16 caracteres, incluyendo números, mayúsculas y caracteres especiales.');
            return;
        }

        // Check for required fields
        const fieldsToValidate = ['name', 'email', 'phone', 'address', 'creditCard', 'password'];
        const errors = {};

        fieldsToValidate.forEach(field => {
            if (!formData[field].trim()) {
                errors[field] = true;
            }
        });

        if (Object.keys(errors).length > 0) {
            setRequiredFieldsError(errors);
            return;
        }

        if (!/^\d{10}$/.test(formData.phone)) {
            setPhoneError(true);
            return;
        }

        if (!/^\d*$/.test(formData.creditCard)) {
            setCreditCardError(true);
            return;
        }

        // Si hay errores de validación, no se envía el formulario
        if (Object.keys(errors).length > 0 || phoneError || creditCardError) {
            return;
        }
        setIsLoading(true);
        axios.post('https://cifrados.onrender.com/encryption/submit/', formData)
            .then(res => {
                setEncryptedData(res.data);
                setEncryptErrorMessage('');
                setKeyError(false);
                toast.success('Datos cifrados con éxito.');
                setIsLoading(false);
            })
            .catch(err => {
                toast.error('Error en el servidor. Inténtalo nuevamente más tarde.');
                setIsLoading(false);

            });
    };

    const validateUserKey = (key) => {
        const keyRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z]).{16}$/;
        return keyRegex.test(key);
    };

    const handleDecrypt = () => {
        if (!validateUserKey(decryptKey)) {
            setDecryptKeyError(true);
            setDecryptErrorMessage('La clave debe tener 16 caracteres, incluyendo números, mayúsculas y caracteres especiales.');
            return;
        }

        if (!encryptedData.encryptedName) {
            setDecryptErrorMessage('No hay datos cifrados para descifrar.');
            return;
        }
        setIsLoading2(true);
        axios.post('https://cifrados.onrender.com/encryption/decrypt/', {
            userKey: decryptKey,
            encryptedName: encryptedData.encryptedName,
            encryptedAddress: encryptedData.encryptedAddress,
            encryptedPhone: encryptedData.encryptedPhone,
            encryptedCreditCard: encryptedData.encryptedCreditCard,
            encryptedEmail: encryptedData.encryptedEmail,
            iv: encryptedData.iv
        })
            .then(res => {
                setDecryptedData(res.data);
                setDecryptErrorMessage('');
                setDecryptKeyError(false);
                setKeyMismatchError(false);
                setIsLoading2(false);
            })
            .catch(err => {
                if (err.response && err.response.data && err.response.data.error) {
                    setKeyMismatchError(true);
                    setIsLoading2(false);
                    setDecryptErrorMessage('Las claves no coinciden. Intenta nuevamente.');
                } else {
                    toast.error('Error en el servidor. Inténtalo nuevamente más tarde.');
                    setIsLoading2(false);

                }
                setDecryptKeyError(true);
            });
    };

    return (
        <div className="w-full mx-auto  rounded-md ">
            <ToastContainer />
            <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Formulario de cifrado */}
                <div className="col-span-2 md:max-h-[500px] rounded-md md:col-span-1 bg-white p-4">
                    <h1 className="text-2xl font-bold  text-center">Cifrado de Datos Django</h1>
                    <label className="mb-1">Clave (16 caracteres)</label>
                    <input
                        name="userKey"
                        placeholder="Clave"
                        className={`w-full p-2 border ${keyError ? 'border-red-500' : 'border-gray-300'} rounded mb-2`}
                        onChange={handleChange}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1">Nombre</label>
                            <input
                                name="name"
                                placeholder="Nombre"
                                className={`w-full p-2 border ${requiredFieldsError.name ? 'border-red-500' : 'border-gray-300'} rounded mb-2`}
                                onChange={handleChange}
                            />
                            {requiredFieldsError.name && <div className="text-red-500 mt-1">Este campo es requerido.</div>}
                        </div>

                        <div>
                            <label className="mb-1">Email</label>
                            <input
                                name="email"
                                placeholder="Email"
                                className={`w-full p-2 border ${requiredFieldsError.email ? 'border-red-500' : 'border-gray-300'} rounded mb-2`}
                                onChange={handleChange}
                            />
                            {requiredFieldsError.email && <div className="text-red-500 mt-1">Este campo es requerido.</div>}
                        </div>

                        <div>
                            <label className="mb-1">Teléfono</label>
                            <input
                                name="phone"
                                placeholder="Teléfono"
                                className={`w-full p-2 border ${phoneError || requiredFieldsError.phone ? 'border-red-500' : 'border-gray-300'} rounded mb-2`}
                                onChange={handleChange}
                            />
                            {phoneError && <div className="text-red-500 mt-1">El teléfono debe tener exactamente 10 números.</div>}
                            {requiredFieldsError.phone && <div className="text-red-500 mt-1">Este campo es requerido.</div>}
                        </div>

                        <div>
                            <label className="mb-1">Dirección</label>
                            <input
                                name="address"
                                placeholder="Dirección"
                                className={`w-full p-2 border ${requiredFieldsError.address ? 'border-red-500' : 'border-gray-300'} rounded mb-2`}
                                onChange={handleChange}
                            />
                            {requiredFieldsError.address && <div className="text-red-500 mt-1">Este campo es requerido.</div>}
                        </div>
                    </div>

                    <label className="mb-1">Tarjeta de Crédito</label>
                    <input
                        name="creditCard"
                        placeholder="Tarjeta de Crédito"
                        className={`w-full p-2 border ${creditCardError || requiredFieldsError.creditCard ? 'border-red-500' : 'border-gray-300'} rounded mb-2`}
                        onChange={handleChange}
                    />
                    {creditCardError && <div className="text-red-500 mt-1">La tarjeta de crédito solo debe contener números.</div>}
                    {requiredFieldsError.creditCard && <div className="text-red-500 mt-1">Este campo es requerido.</div>}

                    <label className="mb-1">Contraseña</label>
                    <input
                        name="password"
                        type="password"
                        placeholder="Contraseña"
                        className={`w-full p-2 border ${requiredFieldsError.password ? 'border-red-500' : 'border-gray-300'} rounded mb-4`}
                        onChange={handleChange}
                    />
                    {requiredFieldsError.password && <div className="text-red-500 mt-1">Este campo es requerido.</div>}

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

                {/* Sección para descifrar */}
                <div className="col-span-2 md:col-span-1">
                    <div className=" bg-white shadow-xl p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Datos Cifrados</h3>
                        <div className="p-4 bg-gray-100 rounded border border-gray-300 overflow-auto max-h-60">
                            <p className="break-words"><strong>Nombre Encriptado:</strong> {encryptedData?.encryptedName}</p>
                            <p className="break-words"><strong>Email Encriptado:</strong> {encryptedData?.encryptedEmail}</p>
                            <p className="break-words"><strong>Dirección Encriptada:</strong> {encryptedData?.encryptedAddress}</p>
                            <p className="break-words"><strong>Teléfono Encriptado:</strong> {encryptedData?.encryptedPhone}</p>
                            <p className="break-words"><strong>Tarjeta de Crédito Encriptada:</strong> {encryptedData.encryptedCreditCard}</p>
                            <p className="break-words"><strong>Contraseña Encriptada:</strong> {encryptedData?.hashPassword}</p>
                        </div>
                    </div>
                    {
                        Object.keys(encryptedData).length > 0 && (<div className='mt-6 bg-white shadow-md rounded-lg p-4'>
                            <h2 className="text-lg font-semibold mb-2">Descifrar Datos</h2>
                            <label className="mb-1">Clave de Descifrado</label>
                            <input
                                name="decryptKey"
                                placeholder="Clave"
                                className={`w-full p-2 border ${decryptKeyError ? 'border-red-500' : 'border-gray-300'} rounded mb-2`}
                                onChange={(e) => setDecryptKey(e.target.value)}
                            />
                            {decryptErrorMessage && <div className="text-red-500 mt-1">{decryptErrorMessage}</div>}
                            {keyMismatchError && <div className="text-red-500 mt-1">Las claves no coinciden. Intenta nuevamente.</div>}

                            <button
                                onClick={handleDecrypt}
                                disabled={Boolean(isLoading2)}
                                className="w-full mt-2 lg:w-48 text-white bg-violet-600 px-4 py-2 rounded-lg hover:bg-violet-800 transition duration-200 hover:text-white font-bold"
                            >
                                {
                                    isLoading2 ? <ClipLoader color="#fff" loading={isLoading2} size={10} /> : <>
                                        Descifrar
                                    </>
                                }
                            </button>
                        </div>)
                    }


                    {decryptedData.decryptedName && (
                        <div className="mt-6 bg-white shadow-md rounded-lg p-4">
                            <h3 className="text-lg font-semibold mb-2">Datos Descifrados</h3>
                            <p><strong>Nombre:</strong> {decryptedData.decryptedName}</p>
                            <p><strong>Email:</strong> {decryptedData.decryptedEmail}</p>
                            <p><strong>Teléfono:</strong> {decryptedData.decryptedPhone}</p>
                            <p><strong>Dirección:</strong> {decryptedData.decryptedAddress}</p>
                            <p><strong>Tarjeta de Crédito:</strong> {decryptedData.decryptedCreditCard}</p>
                            <p className="break-words"><strong>Contraseña:</strong> No es posible el decifrado de un hash!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CifradoDjango;
