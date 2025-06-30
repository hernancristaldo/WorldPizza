export default class AsyncFetch {
    async fetch({ url, body, headers = {} }) {

        try {

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...headers
                },
                body: JSON.stringify(body),
            })

            // Si falló la ejecución del fetch.
            if (!response.ok) {

                if (response.status === 403) {
                    throw new Error(`(${response.status}) - Acceso no autorizado`);
                }
                else if (response.status === 400) {
                    throw new Error(`(${response.status}) - Solicitud no válida`);
                }
                else if (response.status === 500) {
                    throw new Error(`(${response.status}) - Se produjo un error al procesar la solicitud`);
                }
                else {
                    throw new Error(`Revise la conexión de red (${response.status})`);
                }

            }

            return await response.json();

        }
        catch (error) {

            return [{ resultado: "Error", errores: [{ descripcion: error }] }];

        }

    }
}