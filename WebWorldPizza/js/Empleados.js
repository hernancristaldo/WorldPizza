import AsyncFetch from '/js/Utilidades/Asyncfetch.js';
import InstanciaCry from '/js/Utilidades/cry.js';
import Modal from '/js/Utilidades/Modal.js';
import Principal from '/js/Utilidades/Principal.js';
import Tabla from '/js/Utilidades/Tabla.js';
import Alert from '/js/Utilidades/Alert.js';
import Spinner from '/js/Utilidades/Spinner.js';
import Toast from '/js/Utilidades/Toast.js';

document.addEventListener('DOMContentLoaded', () => {
    new EmpleadosIndex();
});

class EmpleadosIndex {
    constructor(filtroUsado, empleados) {
        this.asyncFetch = new AsyncFetch();
        this.empleados = [];
        this.filtroUsado = false;
        this.user = null;
        this.editar = false;

        if (EmpleadosIndex.instance) {

            this.empleados = empleados;
            EmpleadosIndex.instance.empleados = empleados;

            this.spinnerTabla = new Spinner({
                id_elemento: "tabla"
            });

            if (filtroUsado) {
                this.spinnerTabla.mostrarSpinner();
                this.busqueda();
            }            

            return EmpleadosIndex.instance;
        }

        EmpleadosIndex.instance = this;

        this.main();
    }
    async main() {
        this.token = await InstanciaCry.decSer(sessionStorage.getItem('tkn'));
        this.iniciarPrincipal();
    }
    async iniciarPrincipal() {

        //Clonamos el body y lo insertamos en 'principal'.
        document.querySelector("#principal").innerHTML = "";
        const template = document.querySelector("#bodyPrincipal");
        const clone = template.content.cloneNode(true);

        // Se instancia la clase 'Principal'.
        this.principal = new Principal({
            id_elemento: 'principal',
            tituloContent: "Busqueda de Empleados",
            htmlInsertar: clone
        });

        // Se recuperan los empleados.
        this.empleados = await this.getEmpleados();

        // Se instancia el spinner para la tabla.
        this.spinnerTabla = new Spinner({
            id_elemento: "tabla"
        });

        this.eventos();
        this.permisos();
        this.usuarioABM();

        this.principal.ocultarSpinner();
    }
    async usuarioABM() {

        // Se recupera el usuario al iniciar sesion.
        const usuario = await InstanciaCry.decSer(sessionStorage.getItem('sessionUsr'));
        const sessionUser = JSON.parse(usuario);

        if (sessionUser.usuario.resultado === "Ok") this.user = sessionUser.usuario.empleado;
    }
    async permisos() {

        const pantalla = "Empleados";

        // Verificamos los permisos del usuario.
        const decryptedData = await InstanciaCry.decSer(sessionStorage.getItem('pantallasRol'));

        if (decryptedData.includes(pantalla)) {

            // Si el usuario tiene permiso se inserta la opcion de 'Nuevo Empleado'.
            this.editar = true;

            const contenedorLinkAlta = document.querySelector("#contenedorLinkAlta");
            const linkAlta = `<a href="#" data-element="nuevoEmpleado">Nuevo Empleado</a>`;
            contenedorLinkAlta.insertAdjacentHTML('beforeend', linkAlta);
        }
    }
    async getEmpleados() {

        // Se obtienen los empleados.
        const response = await this.asyncFetch.fetch({
            url: '/Controller.ashx',
            body: {
                accion: "CEmpleados",
                filtroBusqueda: ""
            },
            headers: {
                'X-CSRF-Token': this.token
            }
        });

        if (response[0].resultado === "Ok") {

            // Solo se mantienen los que estan activos.
            let empleadosActivos = response.filter(e => e.fecha_baja === null);            
            return empleadosActivos;
        }

        return [];
    }
    eventos() {
        this.evtClick();
        this.evtClickTabla();
    }
    evtClick() {
        document.querySelector("#principal").addEventListener('click', e => {

            let elem = e.target.dataset.element;

            if (elem === "nuevoEmpleado") {

                // Se instancia la clase para dar de alta un empleado.
                new AltaEmpleado(this.filtroUsado, this.user, this.empleados);
            }

            // Se realiza la busqueda de empleados de acuerdo al filtro de busqueda.
            if (elem === "btnBuscar") {

                this.spinnerTabla.mostrarSpinner();
                this.busqueda();
            }
        });
    }
    evtClickTabla() {
        // Se crea el evento click en la tabla de empleados.
        document.querySelector("#tablaEmpleados").addEventListener('click', e => {

            let elem = "";

            if (e.target.classList.contains("item") && e.target.parentElement.parentElement.dataset.action === "verEmpleado") {
                elem = e.target.parentElement.parentElement.dataset.id;
            }
            else if (e.target.classList.contains("colum") && e.target.parentElement.dataset.action === "verEmpleado") {
                elem = e.target.parentElement.dataset.id;
            }
            else {
                return;
            }

            // Se recupera el empleado seleccionado.
            let [empleado] = this.empleados.filter(p => p.id.toString() === elem);

            // Se instancia la clase para editar el empleado.
            new EdicionEmpleado(this.filtroUsado, this.editar, this.user, empleado, this.empleados);
        });
    }
    busqueda() {
        this.filtroUsado = true;
        
        let array = this.empleados;
        const text = document.querySelector("#txtBusqueda").value;

        if (text !== "") {

            // Se filtra el array por nombre
            array = array.filter(({ apellido_nombre }) => {
                return apellido_nombre.toUpperCase().includes(text.toUpperCase());
            });
        }

        // Se llama al metodo encargado de llenar la tabla.
        this.llenarTablaEmpleados(array);
    }
    llenarTablaEmpleados(array) {

        // Completamos el número de columnas a utilizar, su tipo de valor y si esta columna es ordenable.
        let columnas = [
            { nombre: "Id", tipo: "int", ordenable: true, dataset: { id: "Id", action: "verEmpleado" } },
            { nombre: "Nombre", tipo: "string", ordenable: true },
            { nombre: "DNI", tipo: "string", ordenable: true },
            { nombre: "Fecha_alta", tipo: "string", ordenable: true }
        ];

        // Si no hubo coincidencias en la busqueda.
        if (array.length === 0) {

            const tabla = new Tabla();
            tabla.llenarDatos({
                arrayDatos: [{ "Busqueda": "No hay resultados para su busqueda." }],
                objColumnas: [{ nombre: "Busqueda", tipo: "string", ordenable: true }],
                id_tabla: "tablaEmpleados"
            });

            this.spinnerTabla.ocultarSpinner();

            return;
        }
        else {

            // Se guardan en un array los datos para completar la tabla.
            const arrayReducido = array.map(({ id, apellido_nombre, dni, fecha_alta }) => ({
                Id: id,
                Nombre: apellido_nombre,
                DNI: dni,
                Fecha_alta: moment(fecha_alta).format('DD/MM/YYYY')
            }));

            // Se llena la tabla.
            const tabla = new Tabla();
            tabla.llenarDatos({
                arrayDatos: arrayReducido,
                objColumnas: columnas,
                id_tabla: "tablaEmpleados"
            });
        }

        this.spinnerTabla.ocultarSpinner();
    }
}


class EdicionEmpleado {
    constructor(filtroUsado, editar, user, empleado, empleados) {
        this.asyncFetch = new AsyncFetch();
        this.filtroUsado = filtroUsado;
        this.editar = editar;
        this.user = user;
        this.empleado = empleado;
        this.empleados = empleados;
        
        this.main();
    }
    async main() {
        this.token = await InstanciaCry.decSer(sessionStorage.getItem('tkn'));
        this.llenarModal();
    }
    async permisos() {

        // De acuerdo al permiso se agrega el switch de edicion.
        if (this.editar) {

            // Switch.
            const html =
                `
                <label class="switch">
                    <input class="toggle__input" type="checkbox" id="myToggle" data-element="btnSwitch">
                    <span class="slider round"></span>
                </label>
            `;

            document.querySelector("#switchEdicion").insertAdjacentHTML('afterbegin', html);

            // Se inserta el boton de recarga de modal.
            const contenedorResetModal = document.querySelector("#resetModal");
            const btnReset = `<span data-element="recargarModal" class="btn-refresh">Refresh</span>`;
            contenedorResetModal.insertAdjacentHTML('beforeend', btnReset);
        }
    }
    llenarModal() {

        // Clonar el contenido del template
        const clone = document.querySelector("#bodyEdicion").content.cloneNode(true);
        document.querySelector("#modal").innerHTML = "";

        // Instanciamos un modal e insertamos contenido.
        this.modal = new Modal({
            id_contenedor: 'modal',
            htmlInsertar: clone,
            titulo: "Detalle del Empleado"
        });

        this.evtClick();
        this.permisos();
        this.llenarDatos();
    }
    llenarDatos() {

        // Se setean los campos con los datos del empleado.
        document.querySelector("#editDni").value = this.empleado.dni;
        document.querySelector("#editNombre").value = this.empleado.apellido_nombre;
        document.querySelector("#editTelefono").value = this.empleado.nro_telefono;
        document.querySelector("#editDomicilio").value = this.empleado.domicilio;
        document.querySelector("#editMail").value = this.empleado.mail;
        //document.querySelector("#editUsuario").value = this.empleado.usuario_abm;

        this.modal.ocultarSpinner();
    }
    evtClick() {
        document.querySelector("#modal .custom-modal").addEventListener('click', e => {
            let elem = e.target.dataset.element;

            if (elem === "btnSwitch") {

                // Recuperamos los elementos editables.
                const itemsValidar = document.querySelectorAll('#modal [data-editable="true"]');

                if (e.target.checked) {

                    // Habilitamos los elementos editables.
                    itemsValidar.forEach(elem => {
                        elem.disabled = false;
                    });

                    // Mostramos los botones de editar y eliminar.
                    document.querySelector('[data-element="btnGuardar"]').style.display = "block";
                    document.querySelector('[data-element="btnEliminar"]').style.display = "block";
                }
                else {

                    // deshabilitamos los elementos editables.
                    itemsValidar.forEach(elem => {
                        elem.disabled = true;
                    });

                    // Ocultamos los botones de editar y eliminar.
                    document.querySelector('[data-element="btnGuardar"]').style.display = "none";
                    document.querySelector('[data-element="btnEliminar"]').style.display = "none";
                }
                return;
            }
            else if (elem === "btnGuardar") {
                this.modal.mostrarSpinner();
                this.editarEmpleado();
            }
            else if (elem === "btnEliminar") {
                this.modal.mostrarSpinner();
                this.eliminarEmpleado();
            }
            else if (elem === "recargarModal") {
                this.modal.mostrarSpinner();
                this.llenarDatos();
            }
            else if (elem === "cerrarModal") {

                // Se vuelve a la pantalla principal.
                new EmpleadosIndex(this.filtroUsado, this.empleados);
            }
        });
    }
    recuperarDatos() {

        // Se recupera el valor de los campos completados.    
        const obj = {
            id: this.empleado.id,
            dni: document.querySelector("#editDni").value,
            apellido_nombre: document.querySelector("#editNombre").value,            
            mail: document.querySelector("#editMail").value,
            domicilio: document.querySelector("#editDomicilio").value,
            nro_telefono: document.querySelector("#editTelefono").value,
            fecha_alta: this.empleado.fecha_alta
        };

        // Se crea un objeto para guardar los datos obtenidos.
        const data = {
            accion: "MEmpleado",
            empleado: obj
        };

        return data;
    }
    async editarEmpleado() {

        const data = await this.recuperarDatos();

        // Se realiza la edicion del empleado.
        const response = await this.asyncFetch.fetch({
            url: "/Controller.ashx",
            body: data,
            headers: {
                'X-CSRF-Token': this.token
            }
        });

        const { resultado, errores } = Array.isArray(response) ? response[0] : response;

        this.modal.ocultarSpinner();

        if (resultado !== "Ok") {

            this.limpiarErrores();
            this.mostrarErrores(errores);
            return;
        }
        else {

            this.limpiarErrores();

            // Si la edición se realizó de manera correcta.
            new Alert({ mensaje: 'Empleado editado correctamente.', title: "Exito", type: "success" });

            // Se actualizan los datos del empleado en el array.
            const indiceEmpleado = this.empleados.findIndex(obj => obj.id === this.empleado.id);

            if (indiceEmpleado !== -1) {

                this.empleados[indiceEmpleado] = {
                    ...this.empleados[indiceEmpleado],
                    ...{
                        dni: data.empleado.dni,
                        apellido_nombre: data.empleado.apellido_nombre,
                        domicilio: data.empleado.domicilio,
                        nro_telefono: data.empleado.nro_telefono,
                        mail: data.empleado.mail
                    }
                };
            }

            // Se actualiza el empleado seleccionado.
            const [emp] = this.empleados.filter(e => e.id === this.empleado.id);
            this.empleado = emp;
        }

        return;
    }
    async eliminarEmpleado() {

        // Se elimina el producto de la base de datos.
        const response = await this.asyncFetch.fetch({
            url: "/Controller.ashx",
            body: {
                accion: "BEmpleado",
                id_empleado: this.empleado.id
            },
            headers: {
                'X-CSRF-Token': this.token
            }
        });

        const { resultado, errores } = Array.isArray(response) ? response[0] : response;

        this.modal.ocultarSpinner();

        if (resultado !== "Ok") {

            this.limpiarErrores();
            this.mostrarErrores(errores);

            return;
        }
        else {

            this.limpiarErrores();

            // Se quita el empleado del array.
            this.empleados = this.empleados.filter(e => e.id !== this.empleado.id);

            // Si la baja se realizó de manera correcta.
            new Alert({ mensaje: 'Empleado eliminado correctamente.', title: "Exito", type: "success" });

            // Cerramos el modal.
            document.querySelector('[data-element="cerrarModal"]').click();
        }

        return;
    }
    // Errores
    mostrarErrores(errores) {

        if (errores.length > 1) {

            if (errores[0]?.propiedad != undefined) {

                errores.forEach(({ descripcion, propiedad }) => {

                    const elementoError = document.querySelector(`#modal [data-validate="${propiedad}"]`);

                    if (elementoError) {
                        const erroresElement = elementoError.parentElement.querySelector(".individual-errores");
                        erroresElement.innerHTML = descripcion;
                        elementoError.classList.add("inputError");
                    }
                });

                new Alert({
                    mensaje: "Revise los errores generados.",
                    title: "Error",
                    type: "error"
                });
            }
            else {

                new Alert({
                    mensaje: "Se produjeron multiples errores.",
                    title: "Error",
                    type: "error"
                });

                errores.forEach(error => {
                    new Toast({ mensaje: error.descripcion, type: "error" });
                });
            }
        }
        else if (errores.length === 1) {
            new Alert({ mensaje: errores[0].descripcion, title: "Error", type: "error" });
        }

        return;
    }
    limpiarErrores() {

        // Se limpian los errores.
        const elementoError = document.querySelectorAll(`#modal [required]`);

        if (elementoError.length !== 0) {

            elementoError.forEach(elem => {
                const erroresElement = elem.parentElement.querySelector(".individual-errores");
                erroresElement.innerHTML = "";
                elem.classList.remove("inputError");
            })
        }

        return;
    }
}


class AltaEmpleado {
    constructor(filtroUsado, user, empleados) {
        this.asyncFetch = new AsyncFetch();
        this.filtroUsado = filtroUsado;
        this.user = user;
        this.empleados = empleados;

        this.main();
    }
    async main() {
        this.token = await InstanciaCry.decSer(sessionStorage.getItem('tkn'));
        this.llenarModal();
    }
    llenarModal() {
        // Clonar el contenido del template
        const clone = document.querySelector("#bodyAlta").content.cloneNode(true);
        document.querySelector("#modal").innerHTML = "";

        // Instanciamos un modal e insertamos contenido.
        this.modal = new Modal({
            id_contenedor: 'modal',
            htmlInsertar: clone,
            titulo: "Alta de Empleado"
        });

        this.evtClick();

        this.modal.ocultarSpinner();
    }
    evtClick() {

        document.querySelector("#modal .custom-modal").addEventListener('click', e => {

            const elem = e.target.dataset.element;

            if (elem === "btnGuardar") {

                this.modal.mostrarSpinner();
                this.guardarEmpleado();
            }
            else if (elem === "cerrarModal") {

                // Se vuelve a la pantalla principal.
                new EmpleadosIndex(this.filtroUsado, this.empleados);
            }
        });
    }
    recuperarDatos() {

        // Se recupera el valor de los campos completados.      
        const obj = {
            dni: document.querySelector("#dni").value,
            apellido_nombre: document.querySelector("#nombre").value,            
            mail: document.querySelector("#mail").value,
            domicilio: document.querySelector("#domicilio").value,
            nro_telefono: document.querySelector("#telefono").value
        };

        // Se crea un objeto para guardar los datos obtenidos.
        const data = {
            accion: "AEmpleado",
            empleado: obj
        };

        return data;
    }
    async guardarEmpleado() {

        // Recuperamos los campos.        
        const data = await this.recuperarDatos();        

        // Se realiza el alta del empleado.
        const response = await this.asyncFetch.fetch({
            url: "/Controller.ashx",
            body: data,
            headers: {
                'X-CSRF-Token': this.token
            }
        });

        const { resultado, errores } = Array.isArray(response) ? response[0] : response;

        this.modal.ocultarSpinner();

        if (resultado !== "Ok") {

            this.limpiarErrores();
            this.mostrarErrores(errores);
            return;
        }
        else {

            this.limpiarErrores();

            // Se agrega el producto al array.
            this.empleados.push(response);

            // Si no hubo errores en el alta.
            new Alert({ mensaje: 'Empleado guardado correctamente.', title: "Exito", type: "success" });

            // Se limpia el formulario.
            const inputs = document.querySelectorAll('[data-editable="true"]');
            inputs.forEach(elem => {
                elem.value = "";
            });
        }

        return;
    }
    // Errores
    mostrarErrores(errores) {

        if (errores.length > 1) {

            if (errores[0]?.propiedad != undefined) {

                errores.forEach(({ descripcion, propiedad }) => {

                    const elementoError = document.querySelector(`#modal [data-validate="${propiedad}"]`);

                    if (elementoError) {
                        const erroresElement = elementoError.parentElement.querySelector(".individual-errores");
                        erroresElement.innerHTML = descripcion;
                        elementoError.classList.add("inputError");
                    }
                });

                new Alert({
                    mensaje: "Revise los errores generados.",
                    title: "Error",
                    type: "error"
                });
            }
            else {

                new Alert({
                    mensaje: "Se produjeron multiples errores.",
                    title: "Error",
                    type: "error"
                });

                errores.forEach(error => {
                    new Toast({ mensaje: error.descripcion, type: "error" });
                });
            }
        }
        else if (errores.length === 1) {
            new Alert({ mensaje: errores[0].descripcion, title: "Error", type: "error" });
        }

        return;
    }
    limpiarErrores() {

        // Se limpian los errores.
        const elementoError = document.querySelectorAll(`#modal [required]`);

        if (elementoError.length !== 0) {

            elementoError.forEach(elem => {
                const erroresElement = elem.parentElement.querySelector(".individual-errores");
                erroresElement.innerHTML = "";
                elem.classList.remove("inputError");
            })
        }

        return;
    }
}