import AsyncFetch from '/js/Utilidades/Asyncfetch.js';
import InstanciaCry from '/js/Utilidades/cry.js';

export default class Vistos {
    constructor() {
        this.asyncFetch = new AsyncFetch()
        this.token = null

        if (Vistos.instance) {
            return Vistos.instance;
        }

        Vistos.instance = this;
    }
    async actualizarVistos(id_tabla) {

        this.token = await InstanciaCry.decSer(sessionStorage.getItem('tkn'));

        // Se recupera la tabla de gestiones
        const tabla = document.getElementById(id_tabla);

        // Si existe
        if (tabla) {

            // Se habilita el evento para mostrar y ocultar los empleados.
            this.evtMouseOver();

            // Recuperamos NotificacionesEmpleadosSubDepartamentosVistos.
            let notificacionesEmpleados = await this.getNotificacionesEmpleadosSubDepartamentosVistos();

            // Se llama al metodo que actualiza los tildes.
            this.insertarTildes(tabla, notificacionesEmpleados);
        }
        else {
            return;
        }
    }
    async getNotificacionesEmpleadosSubDepartamentosVistos() {

        // Se recuperan las notificaciones.
        const response = await this.asyncFetch.fetch({
            url: "/Controllers/ABMCNotificacionesEmpleadosSubDepartamentosVistos.ashx",
            body: {
                accion: "CNotificacionesEmpleadosSubDepartamentoVistos",
                id_empleado: null,
                id_notificacion: null
            },
            headers: {
                'X-CSRF-Token': this.token
            }
        });

        const { errores, resultado } = Array.isArray(response) ? response[0] : response;

        if (resultado !== "Ok") {

            return null;
        }

        return response;
    }
    insertarTildes(tabla, notificacionesEmpleados) {

        // Se obtienen las filas de la tabla.
        let rows = tabla.querySelectorAll('.table-row');

        // Se recuperan los id de las gestiones en la tabla.
        const ids_gestiones = [];

        rows.forEach(elem => {
            ids_gestiones.push(elem.dataset.id);
        });

        // Se recuperan las notificaciones de las gestiones filtradas.
        const notificacionesEmpleadosFiltradas = notificacionesEmpleados.filter(notificacion =>
            ids_gestiones.includes(notificacion.notificacion.id_interno)
        );

        // Se recorren las filas para setear los tildes.
        rows.forEach(row => {

            // Si el estado de la gestion es 'pendiente'.
            if (row.children[10].children[1].textContent === "Pendiente") {

                // Se reseteada el contenido de la etiqueta <span>
                row.children[11].children[1].children[0].innerHTML = "✔✔";

                // Se carga el contenedor de empleados.
                setearContenedorTildes(row);

                // Se recuperan las notificaciones de la gestion especifica.
                let notificacionesGestion = notificacionesEmpleadosFiltradas.filter(n => n.notificacion.id_interno === row.dataset.id);

                // Se recuperan las notificaciones que fueron vistas.
                let vistos = notificacionesGestion.filter(noti => noti.visto === true);

                // Se llama a la funcion que setea el color de los tildes segun las vistas.
                setearColorTildes(row, vistos, notificacionesGestion);
            }
        });


        function setearContenedorTildes(row) {

            // Se crea e inserta el contenedor para los empleados.

            const tilde = row.querySelector('[data-element="visto"]');

            const contenedorEmpleados = document.createElement("div");
            contenedorEmpleados.dataset.element = "contenedor-empleados";

            contenedorEmpleados.style.display = "none";


            tilde.insertAdjacentElement("beforeend", contenedorEmpleados);

            return;
        }

        function setearColorTildes(row, vistos, notificacionesGestion) {

            const tilde = row.querySelector('[data-element="visto"]');

            // Si la cantidad de vistos es '0' los tildes quedan en negro.
            if (vistos.length === 0) {

                tilde.classList.add("cargado");
            }
            else {

                // Si los vistos son menos que la cantidad de notificaciones.
                if (vistos.length < notificacionesGestion.length) {

                    // Los tilden quedan en verde y se cargan los nombres de los empleados.
                    tilde.classList.add("visto");
                    setearNombresEmpleados(row, vistos);
                }

                // Si los vistos son iguales a las notificaciones los tildes quedan en azul.
                if (vistos.length === notificacionesGestion.length) {
                    tilde.classList.add("allVisto");
                }
            }

            return;
        }

        function setearNombresEmpleados(row, vistos) {

            const contenedorEmpleados = row.querySelector('[data-element="contenedor-empleados"]');
            contenedorEmpleados.classList.add("contenedor-empleados");
            contenedorEmpleados.innerHTML = "";

            // Se inserta el encabezado.
            const encabezado = document.createElement("p");
            encabezado.innerHTML = "Visto por:";
            encabezado.classList.add("encabezado-contenedor");
            contenedorEmpleados.appendChild(encabezado);

            const listaEmpleados = {};

            // Se recorren los vistos y se recuperan los nombres.
            vistos.forEach(elem => {

                const { empleado } = elem;

                const id = empleado.id;
                const nombre = empleado.apellido_nombre;

                const clave = `${id}-${nombre}`;

                // Se crea una lista con los nombres no repetidos.
                if (!listaEmpleados[clave]) {
                    listaEmpleados[clave] = nombre;

                    const empleado = document.createElement("p");
                    empleado.innerHTML = nombre;
                    empleado.classList.add("link-gestion-visto");

                    contenedorEmpleados.appendChild(empleado);
                }
            });

            return;
        }
    }
    evtMouseOver() {

        // Se recuperan todos los tildes de la tabla.
        const tildes = document.querySelectorAll('[data-element="visto"]');

        // A cada tilde se le asignan los eventos para mostrar y ocultar el contenedor de empleados cuando el curso pasa sobre el icono.
        tildes.forEach(elem => {
            elem.addEventListener('mouseover', mostrarEmpleados);
            elem.addEventListener('mouseout', ocultarEmpleados);
        });

        // La funcion muestra el contenedor de los empleados que vieron la gestion.
        function mostrarEmpleados(event) {
            const icono = event.currentTarget.parentElement;

            icono.children[0].children[0].style.display = "block";

            return;
        }

        // La funcion oculta el contenedor de los empleados que vieron la gestion.
        function ocultarEmpleados(event) {
            const icono = event.currentTarget.parentElement;

            icono.children[0].children[0].style.display = "none";

            return;
        }
    }
}