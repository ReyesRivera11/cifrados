export function cifrarCesar(mensaje, desplazamiento) {
    return mensaje.split('').map(char => {
        if (char.match(/[a-z]/i)) {
            let code = char.charCodeAt(0);
            let limite = char === char.toUpperCase() ? 65 : 97;
            return String.fromCharCode(((code - limite + desplazamiento) % 26) + limite);
        }
        return char;
    }).join('');
}

export function descifrarCesar(mensaje, desplazamiento) {
    return cifrarCesar(mensaje, 26 - desplazamiento);
}



export const cifrarEscitala = (mensaje, columnas) => {
    const longitud = mensaje.length;
    const filas = Math.ceil(longitud / columnas);
    const matriz = Array.from({ length: filas }, () => Array(columnas).fill(''));

    for (let i = 0; i < longitud; i++) {
        const fila = Math.floor(i / columnas);
        const columna = i % columnas;
        matriz[fila][columna] = mensaje[i];
    }

    let mensajeCifrado = '';
    for (let col = 0; col < columnas; col++) {
        for (let row = 0; row < filas; row++) {
            if (matriz[row][col] !== '') {
                mensajeCifrado += matriz[row][col];
            }
        }
    }

    return { mensajeCifrado, matriz };
};

export const descifrarEscitala = (mensajeCifrado, columnas) => {
    const longitud = mensajeCifrado.length;
    const filas = Math.ceil(longitud / columnas);
    const matriz = Array.from({ length: filas }, () => Array(columnas).fill(''));

    const numFullColumns = longitud % columnas;

    let index = 0;
    for (let col = 0; col < columnas; col++) {
        for (let row = 0; row < filas; row++) {
            if (numFullColumns !== 0 && col >= numFullColumns && row === filas - 1) continue;
            if (index < longitud) {
                matriz[row][col] = mensajeCifrado[index++];
            }
        }
    }

    let mensajeDescifrado = '';
    for (let row = 0; row < filas; row++) {
        for (let col = 0; col < columnas; col++) {
            if (matriz[row][col] !== '') {
                mensajeDescifrado += matriz[row][col];
            }
        }
    }

    return mensajeDescifrado;
};




