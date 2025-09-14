import InstanciaCry from '/js/Utilidades/cry.js';
import AsyncFetch from '/js/Utilidades/Asyncfetch.js';
import Tabla from '/js/Utilidades/Tabla.js';
import Errores from '/js/Utilidades/Errores2.js';
import Modal2 from '/js/Utilidades/Modal2.js';
import Alert from '/js/Utilidades/Alert.js';
import Spinner from '/js/Utilidades/Spinner.js';
import Toast from '/js/Utilidades/Toast.js';
import CampanitaNotificaciones from '/js/Utilidades/CampanitaNotificaciones.js';
import Vistos from '/js/Utilidades/Vistos.js';

export default class Gestiones {
    constructor() {
        this.localidades = null
        this.erroresPrincipal = new Errores({ id_contenedor: 'principal' });
        this.asyncFetch = new AsyncFetch()
        this.ModuloGestiones = null
        this.id_gestion = null
        this.eventos = {}
        this.observacion = false
        this.filtros = {}


        this.main();
    }
    async main() {

        // Recuperamos las localidades.
        var encryptedJson = sessionStorage.getItem('localidadesSistema');
        const value = await InstanciaCry.decSer(encryptedJson);
        this.localidades = JSON.parse(value);

        // Recuperamos los estados de las gestiones.
        const estados = sessionStorage.getItem('estadosGestiones');
        const estadosResponse = await InstanciaCry.decSer(estados);
        this.estadosGestiones = JSON.parse(estadosResponse);

        this.evtClickPrincipal();
        this.evtSelectFiltros();
        this.evtContenedorFiltros();
        this.inicializarFiltrosUsuario();
        this.evtClickTableGestiones();
        this.PermisosAltaGestion();

    }
    async PermisosAltaGestion() {

        const pantalla = "home-gestiones-alta";

        // Verificamos los permisos.
        const decryptedData = await InstanciaCry.decSer(sessionStorage.getItem('pantallasRol'));
        if (decryptedData.includes(pantalla)) {
            document.querySelector("#linkAdd").innerHTML = "";
            const a = document.createElement("a");
            a.href = "#";
            a.dataset.element = "altaGestion";
            a.innerHTML = "Alta gestión";
            document.querySelector("#linkAdd").appendChild(a);
        }

    }
    // Seteamos el option por defecto, agregamos los filtros que el usuario tiene por defecto y realizamos la búsqueda.
    inicializarFiltrosUsuario() {

        // Mostamos el opcion 1 predefinido.
        this.activarOption1();

        // Seteamos los filtros predefinidos del usuario.
        this.insertarFiltro({ id: "id_estadosGestiones", filtroName: "Estado", valueFiltro: "Pendiente", valueFiltroReal: "1" });
        this.insertarFiltro({ id: "id_localidad", filtroName: "Localidad", valueFiltro: "Clucellas", valueFiltroReal: "1" });

        // Realizamos la búsqueda.
        document.querySelector("#btn-guardar").click();

    }
    evtClickPrincipal() {

        document.querySelector("#contenedorBusquedaGestiones").addEventListener('click', e => {

            const elem = e.target.dataset.element;

            if (elem === "btnsumar") {

                const typeElement = e.target.parentElement.parentElement.querySelector(".input-buscar").nodeName;

                // Recuperamos los datos del filtro a aplicar.
                const selectedOption = document.querySelector("#selectFiltros").selectedOptions[0];
                const filtroName = selectedOption.innerHTML;
                const id = selectedOption.dataset.name;
                let valueFiltro = e.target.parentElement.parentElement.querySelector(".input-buscar").value;
                let valueFiltroReal = e.target.parentElement.parentElement.querySelector(".input-buscar").value;

                if (typeElement === "SELECT") {
                    valueFiltro = e.target.parentElement.parentElement.querySelector(".input-buscar").selectedOptions[0].innerHTML;
                }

                if (valueFiltro) {
                    // Insertamos el filtro correspondiente.
                    this.insertarFiltro({ id, filtroName, valueFiltro, valueFiltroReal });
                }

                return;

            }

            if (elem === "realizarBusqueda") {

                // recuperamos todos los filtros aplicados y realizamos las consultas.
                const miDiv = document.querySelector("#contenedorFiltros");
                const child = Array.from(miDiv.querySelectorAll(".barra-busqueda"));

                let filtros = {};
                child.forEach(({ id, dataset }) => {
                    filtros[id] = dataset.value
                });

                this.filtros = filtros;


                this.consutarGestiones({ filtros });

                return;

            }

            if (elem === "altaGestion") {
                this.cargarModalAltaGestion();
                return;
            }

        })

    }
    evtSelectFiltros() {

        if (document.querySelector("#selectFiltros")) {

            document.querySelector("#selectFiltros").addEventListener('change', e => {

                const contenidoFiltro = document.querySelector("#contenidoFiltro");

                if (e.target.selectedOptions[0].dataset.filtro) {

                    const filtroInsertar = e.target.selectedOptions[0].dataset.filtro;
                    contenidoFiltro.innerHTML = ""
                    contenidoFiltro.appendChild(this[filtroInsertar]());

                }

            })

        }

    }
    evtContenedorFiltros() {

        const contenedorFiltros = document.querySelector("#contenedorFiltros");

        if (!contenedorFiltros) {
            return;
        }

        contenedorFiltros.addEventListener('click', e => {

            const elem = e.target.dataset.element;

            if (elem === "btnQuitar") {
                e.target.parentElement.parentElement.remove()
                return;
            }

        })

    }
    activarOption1() {

        try {
            const selectElement = document.querySelector("#selectFiltros");
            selectElement.value = 1;

            // disparamos el evento para que se carge el contenido correspondiente.
            const changeEvent = new Event('change', { bubbles: true });
            selectElement.dispatchEvent(changeEvent);
        }
        catch {
            console.log("Select no existe");
        }

    }
    FiltroAbonado() {

        // Crear el elemento <label>
        const label = document.createElement('label');
        label.classList.add('filtro-label');
        label.textContent = 'Abonado';

        // Crear el elemento <input>
        const input = document.createElement('input');
        input.classList.add('input-buscar', 'busqueda-redondeadoizq');
        input.placeholder = 'Ingrese el nombre, codigo, calle o DNI-CUIL del abonado';

        // Agregar los elementos al contenedor deseado (por ejemplo, un div con id "contenedor")
        const contenedor = document.createElement('div');
        contenedor.appendChild(label);
        contenedor.appendChild(input);

        return contenedor;

    }
    FiltroLocalidad() {

        const contenedor = document.createElement('div');

        // Crear el label
        const label = document.createElement('label');
        label.classList.add('filtro-label');
        label.textContent = 'Localidad';

        // Crear el select
        const select = document.createElement('select');
        select.classList.add('input-buscar', 'busqueda-redondeadoizq');

        // Recuperamos y agregamos todas las localidades.
        this.localidades.forEach(({ id, localidad }) => {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = localidad;

            // Agregar la opción al select
            select.appendChild(option);
        })

        // Agregar el label y el select al contenedor principal
        contenedor.appendChild(label);
        contenedor.appendChild(select);

        return contenedor;

    }
    FiltroEstado() {

        const contenedor = document.createElement('div');

        // Crear el label
        const label = document.createElement('label');
        label.classList.add('filtro-label');
        label.textContent = 'Estado';

        // Crear el select
        const select = document.createElement('select');
        select.classList.add('input-buscar', 'busqueda-redondeadoizq');

        // Recuperamos y agregamos todos los estados.
        this.estadosGestiones.forEach(({ id, nombre }) => {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = nombre;

            // Agregar la opción al select
            select.appendChild(option);
        })

        // Agregar el label y el select al contenedor principal
        contenedor.appendChild(label);
        contenedor.appendChild(select);

        return contenedor;

    }
    insertarFiltro({ id, filtroName, valueFiltro, valueFiltroReal }) {

        const filtroId = document.querySelector(`#contenedorFiltros #${id}`);
        if (filtroId) {
            filtroId.remove();
        }

        // Crear el contenido utilizando template string
        const contenido =
            `
            <div class="barra-busqueda-medio">
                <div class="fullcontenido">
                    <label class="filtro-label">${filtroName}</label>
                    <input class="input-buscar busqueda-redondeadoizq" placeholder="${valueFiltro}" />
                </div>
            </div>
            <div class="barra-busqueda-derecha">
                <button class="custom-btn-sumar" data-element="btnQuitar" type="button">-</button>
            </div>
        `;

        // Crear un elemento <div> para contener el contenido
        const divContenedor = document.createElement("div");
        divContenedor.className = "barra-busqueda";
        divContenedor.id = id;
        divContenedor.dataset.value = valueFiltroReal;
        divContenedor.innerHTML = contenido;

        // Agregar el contenedor al documento
        document.querySelector("#contenedorFiltros").appendChild(divContenedor);

        return divContenedor;

    }
    async consutarGestiones({ filtros }) {

        this.spinnerTabla = new Spinner({
            id_elemento: "contenedor-tabla-gestion"
        });

        this.spinnerTabla.mostrarSpinner();

        filtros.accion = "CGestiones";

        // Recuperamos token, desencriptamos y realizamos la consuta.
        const tkn = await InstanciaCry.decSer(sessionStorage.getItem('tkn'));
        const response = await this.asyncFetch.fetch({
            url: "/Controllers/ABMCGestiones.ashx",
            body: filtros,
            headers: {
                'X-CSRF-Token': tkn
            }
        });

        const { resultado, errores } = Array.isArray(response) ? response[0] : response;

        if (resultado != "Ok") {

            const tabla = new Tabla();
            tabla.llenarDatos({
                arrayDatos: [{ Resultado: errores[0].descripcion }],
                objColumnas: [{ nombre: "Resultado", tipo: "string", ordenable: true }],
                id_tabla: "contenedorTablaGestiones"
            });

            this.spinnerTabla.ocultarSpinner();

            return;
        }

        this.llenarTablaGestiones({ response });
    }
    async setearVistos() {

        // Se setea el tiempo de intervalo de actualizacion.
        const intervalMinutes = 1;
        const intervalMilliseconds = intervalMinutes * 60 * 1000;

        // Se instancia el modulo.
        this.vistos = new Vistos();

        const checkVistos = async () => {
            await this.vistos.actualizarVistos("contenedorTablaGestiones");
        };

        // Ejecutar inmediatamente la primera vez
        await checkVistos();

        // Configurar el intervalo
        setInterval(checkVistos, intervalMilliseconds);

        return;
    }
    async llenarTablaGestiones({ response }) {

        const columnas = [
            { nombre: "Id", tipo: "int", ordenable: true, dataset: { id: "Id", action: "verGestiones" } },
            { nombre: "Abonado", tipo: "string", ordenable: true },
            { nombre: "Localidad", tipo: "string", ordenable: true },
            { nombre: "Asunto", tipo: "string", ordenable: false },
            { nombre: "Servicio", tipo: "string", ordenable: true },
            { nombre: "Tipo", tipo: "string", ordenable: false },
            { nombre: "Asignado", tipo: "string", ordenable: false },
            { nombre: "Cod", tipo: "string", ordenable: true },
            { nombre: "FInicio", tipo: "datetime", ordenable: true },
            { nombre: "FFin", tipo: "datetime", ordenable: false },
            { nombre: "Estado", tipo: "string", ordenable: true },
            { nombre: "Visto", tipo: "string", ordenable: true },
        ];

        const arrayReducido = response.map(({ cliente, localidad, asunto, estadoGestion, fecha_fin, fecha_inicio, id, servicioCliente, subTipoGestion, empleadoAlta }) => ({
            Id: id,
            Abonado: cliente?.apellido_nombre ?? " - ",
            Localidad: localidad?.localidad ?? " - ",
            Asunto: asunto ?? " - ",
            Servicio: servicioCliente?.servicio?.descripcion ?? " - ",
            Tipo: subTipoGestion?.descripcion ?? " - ",
            Asignado: empleadoAlta?.apellido_nombre ?? " - ",
            Cod: cliente?.cod_cliente ?? " - ",
            FInicio: fecha_inicio != null ? moment(fecha_inicio).format('DD/MM/YYYY') : " - ",
            FFin: fecha_fin != null ? moment(fecha_fin).format('DD/MM/YYYY') : " - ",
            Estado: estadoGestion?.nombre,
            Visto: estadoGestion.nombre === "Pendiente" ? `<span data-element="visto">✔✔</span>` : `<span data-element="visto"></span>`
        }));

        const tabla = new Tabla();
        tabla.llenarDatos({
            arrayDatos: arrayReducido,
            objColumnas: columnas,
            id_tabla: "contenedorTablaGestiones",
            colorEstado: true,
            ordenPorDefecto: {
                columna: "FInicio",
                ascendente: false,
                tipo: "datetime"
            }
        });

        // Se llama al metodo que actualiza los tildes de visto.
        this.setearVistos();

        this.spinnerTabla.ocultarSpinner();

    }
    // Tabla
    evtClickTableGestiones() {

        document.querySelector("#contenedorTablaGestiones").addEventListener('click', e => {

            const target = e.target;
            const parentElement = target.parentElement;
            const grandParentElement = parentElement.parentElement;

            if (target.classList.contains("item") && grandParentElement.dataset.action === "verGestiones") {
                this.id_gestion = grandParentElement.dataset.id;
            }
            else if (target.classList.contains("colum") && parentElement.dataset.action === "verGestiones") {
                this.id_gestion = parentElement.dataset.id;
            }
            else {
                return;
            }

            this.mostrarGestion();

        })

    }
    // Modal Gestiones.
    evtClickModal() {
        document.querySelector(".custom-modal").addEventListener('click', e => {

            const elem = e.target.dataset.element;

            if (elem === "cerrarModal") {

                let filtros = {};
                filtros = this.filtros;

                this.consutarGestiones({ filtros });
            }
        })
    }
    recuperarDatosGestion() {

        const datos = {};

        // Recuperamos observaciones, fecha, estado, tipo reclamo y vehículo.
        const observacion = document.querySelector("#nuevaObservacion textarea").value;
        datos.observacionSaltoLinea = observacion.replace(/\r?\n/g, "<br/>");
        if (observacion !== "") this.observacion = true;

        datos.fecha = document.querySelector("#inputFecha").value;
        datos.tipoReclamo = document.querySelector("#selectTiposReclamos  option:checked").value;
        datos.estado = document.querySelector("#selectEstados  option:checked").value;
        datos.vehiculo = document.querySelector("#selectVehiculos  option:checked").value;

        // Recuperamos las imágenes a agregar si es que existen.
        const nodeList = document.querySelectorAll("#img-add .cont-img");
        const imagenes = Array.from(nodeList);
        datos.ArrayImagenes = imagenes.map(elem => {
            return elem.children[1].src;
        })

        // Recuperamos subdepartamentos involucrados.
        const empleados = document.querySelectorAll("#div-activos .tag.actived");
        datos.arrayInvolucrados = Array.from(empleados).map(emp => {
            return emp.dataset.value;
        })

        // Recuperamos el empleado que está realizando la edición.
        datos.id_empleado_edicion = document.querySelector("#nuevaObservacion .obsevacion-contenido .mensaje-empleado span").dataset.id;

        return datos;

    }
    async mostrarGestion() {

        const pantalla = "home-gestiones-gestion";
        let editar = false;

        // Verificamos los permisos.
        const decryptedData = await InstanciaCry.decSer(sessionStorage.getItem('pantallasRol'));
        if (decryptedData.includes(pantalla)) {
            editar = true;
        }

        // Cargamos el módulo dinámicamente e instanciamos el detalle de gestiones.
        const { default: GestionesVerEditar } = await import('/js/Utilidades/Gestiones/GestionesVerEditar.js');
        const instanciaGestiones = new GestionesVerEditar({
            id_gestion: this.id_gestion,
            editar
        });

        // Instanciamos un modal e insertamos contenido.
        const modal = new Modal2({
            id_contenedor: 'modalGestiones',
            htmlInsertar: document.createElement("div"),
            titulo: "Detalles gestión"
        });

        // Recuperamos HTML y funcionalidades
        instanciaGestiones.sub('getHtml', data => {
            modal.bodyUpdate({ htmlBody: data });
        });

        instanciaGestiones.sub('mostrarSpinner', data => {
            modal.mostrarSpinner();
        });

        instanciaGestiones.sub('ocultarSpinner', data => {
            modal.ocultarSpinner();
        });

        instanciaGestiones.sub('ocultarModal', data => {
            modal.ocultarModal();
        });

        instanciaGestiones.sub('setTitulo', data => {
            modal.setTitulo({ text: data });
        });

        instanciaGestiones.sub('guardarGestion', data => {
            this.guardarEdiciónGestion({
                datos: data,
                modal: modal,
                instanciaModuloGestiones: instanciaGestiones
            });
            return;
        });

        instanciaGestiones.sub('DerivarGestion', data => {
            this.derivarGestion({ data, modal });
            return;
        });

        this.evtClickModal();

    }
    async derivarGestion({ data, modal }) {

        const sessionUsr = await InstanciaCry.decSer(sessionStorage.getItem('sessionUsr'));
        const sessionUsrParse = JSON.parse(sessionUsr);

        // Editamos la gestion.
        const token = await InstanciaCry.decSer(sessionStorage.getItem('tkn'));
        const response = await this.asyncFetch.fetch({
            url: "/Controllers/ABMCGestiones.ashx",
            body: {
                accion: "DerivarGestion",
                id_gestion: this.id_gestion,
                arrayBytmapImagenesAlta: data.imagenes,
                arrayInvolucrados: data.empleadosInvolucrados,
                id_empleado_asignado: parseInt(data.empleadosAsignados),
                observacion: data.observacion,
                id_empleado_edicion: sessionUsrParse?.empleado?.id
            },
            headers: {
                'X-CSRF-Token': token
            }
        });

        const { resultado, errores } = Array.isArray(response) ? response[0] : response;

        if (resultado != "Ok") {

            errores.forEach(({ descripcion }) => {
                new Toast({ mensaje: descripcion, type: "error" });
            });

            modal.ocultarSpinner();
            return;
        }

        // Si aunque la ejecución general fue correcta falló algún proceso menor.
        if (errores.length > 0) {

            errores.forEach(({ descripcion }) => {
                new Toast({ mensaje: descripcion, type: "error" });
            });

        }

        new Alert({ mensaje: "Derivación realizada con éxito.", title: "Éxito", type: "success" });

        // Se llama al metodo que instancia la campanita de notificaciones.
        const obj = {
            subDptoAsignado: data.empleadosAsignados[0],
            subDptosInvolucrados: data.empleadosInvolucrados
        };

        this.emisionNotificacion(obj, "alta", this.id_gestion);


        document.querySelector("#modalGestiones .custom-modal-close").click();

    }
    async guardarEdiciónGestion({ datos, modal, instanciaModuloGestiones }) {

        const EditarGestion = async () => {

            modal.mostrarSpinner();

            // Editamos la gestion.
            const token = await InstanciaCry.decSer(sessionStorage.getItem('tkn'));
            const response = await this.asyncFetch.fetch({
                url: "/Controllers/ABMCGestiones.ashx",
                body: {
                    accion: "MGestion",
                    id: this.id_gestion,
                    arrayInvolucrados: dataGestion.arrayInvolucrados,
                    arrayImagenesBaja: datos.imagenesEliminar,
                    arrayBytmapImagenesAlta: dataGestion.ArrayImagenes,
                    observacion: dataGestion.observacionSaltoLinea,
                    fecha: dataGestion.fecha,
                    vehiculo: dataGestion.vehiculo,
                    id_estadosGestiones: parseInt(dataGestion.estado),
                    id_empleado_edicion: dataGestion.id_empleado_edicion
                },
                headers: {
                    'X-CSRF-Token': token
                }
            });

            const { resultado, errores } = Array.isArray(response) ? response[0] : response;

            if (resultado != "Ok") {
                new Alert({ mensaje: errores[0].descripcion, title: "Error", type: "error" });
                modal.ocultarSpinner();
                return;
            }

            // Si se produjo un error menor que no afectó la ejecución general del endpoint.
            if (errores.length > 0) {

                errores.forEach(({ descripcion }) => {
                    new Toast({ mensaje: descripcion, type: "error" });
                });

            }

            new Alert({ mensaje: "Edición de gestión realizada correctamente.", title: "Éxito", type: "success" });

            if (this.observacion || datos.estado !== dataGestion.estado) {

                let asunto = null;

                if (this.observacion && datos.estado !== dataGestion.estado) {
                    asunto = "cambioEstado";
                }
                else {
                    if (datos.estado !== dataGestion.estado) {
                        asunto = "cambioEstado";
                    }

                    if (this.observacion) {
                        asunto = "observacion";
                        this.observacion = false;
                    }
                }

                // Se emite la notificacion correspondiente.
                const obj = {
                    subDptoAsignado: datos.subDepartamentoAsignado,
                    subDptosInvolucrados: dataGestion.arrayInvolucrados
                };

                this.emisionNotificacion(obj, asunto, this.id_gestion);
            }


            // Si la gestión está seteada como realizada.
            if (dataGestion.estado === "2") {

                // Si tiene vehículo
                if (dataGestion.vehiculo !== "") {

                    // Descargamos el stock.
                    instanciaModuloGestiones.descargarVehiculo({ patente: dataGestion.vehiculo });
                    modal.ocultarSpinner();
                }
                else {

                    // Mostramos modulo derivar.
                    instanciaModuloGestiones.derivarGestion();
                    modal.ocultarSpinner();
                }

            }
            else {
                document.querySelector("#modalGestiones .custom-modal-close").click();

            }
        };

        const dataGestion = this.recuperarDatosGestion();

        // Si se seteó la gestión como realizado.
        if (dataGestion.estado === "2") {

            const intancia = new Alert({
                mensaje: `¿Está seguro de guardar la gestión como '${document.querySelector("#selectEstados  option:checked").innerHTML}'?`,
                title: "Confimación",
                type: "question"
            });

            intancia.sub('cancelar', data => {
                return;
            })

            intancia.sub('aceptar', data => {
                EditarGestion();
                return;
            })

        }
        else {
            EditarGestion();
        }

    }
    emisionNotificacion(data, asunto, gestion) {

        let subDptosInvolucrados = [];

        // Se recupera el id del subdepartamento asignado.
        const obj = {
            id_subdpto: data.subDptoAsignado,
            asignado: true
        };

        subDptosInvolucrados.push(obj);

        // Se recuperan los id de los subdepartamentos involucrados.
        data.subDptosInvolucrados.forEach(elem => {

            if (elem !== data.subDptoAsignado) {

                const obj = {
                    id_subdpto: elem,
                    asignado: false
                };
                subDptosInvolucrados.push(obj);
            }
        });

        // Se instancia la campanita de notificaciones y se emite la notificacion correspondiente.
        const notificaciones = new CampanitaNotificaciones();
        notificaciones.emisionNuevaNotificacion(subDptosInvolucrados, asunto, gestion);

        return;
    }
    mostrarSpinner() {
        document.querySelector("#principal .principal-body").style.display = "block";
        document.querySelector("#principal .spinner").classList.remove("show");
    }
    ocultarSpinner() {
        document.querySelector("#principal .principal-body").style.display = "block";
        document.querySelector("#principal .spinner").classList.remove("show");
    }
    // Modal alta gestion
    async cargarModalAltaGestion() {

        // Cargamos modulo dinámicamente.
        const { default: AltaGestion } = await import('/js/Home/Gestiones/AltaGestion/AltaGestion.js');
        const instanciaGestion = new AltaGestion();

        const html = await instanciaGestion.getHtml();

        // Instanciamos un modal e insertamos contenido.
        const modal = new Modal2({
            id_contenedor: 'modal-alta',
            htmlInsertar: html,
            titulo: "Alta Gestion"
        })

        const erroresModal = new Errores({
            id_contenedor: 'modal-alta',
        });

        instanciaGestion.recibirEvento((evento, datos) => {

            if (evento === "mostrarSpinner") {
                modal.mostrarSpinner();
                return;
            }

            if (evento === "ocultarSpinner") {
                modal.ocultarSpinner();
                return;
            }

            const { resultado, error } = datos;

            if (resultado != "Ok") {

                if (Array.isArray(error)) {
                    erroresModal.setearError({ listError: error, limpiar: false });
                }
                else {
                    erroresModal.setearError({ listError: [{ descripcion: datos.error }], limpiar: false });
                }

                modal.ocultarSpinner();
                return;
            }

            erroresModal.setearErrorOk({ msj: error, limpiar: true });

        });

        await instanciaGestion.llenarHtml();

        modal.ocultarSpinner();

    }

}