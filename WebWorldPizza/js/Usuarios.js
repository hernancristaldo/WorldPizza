import AsyncFetch from '/js/Utilidades/Asyncfetch.js';
import InstanciaCry from '/js/Utilidades/cry.js';
import Modal from '/js/Utilidades/Modal.js';
import Principal from '/js/Utilidades/Principal.js';
import Tabla from '/js/Utilidades/Tabla.js';
import Alert from '/js/Utilidades/Alert.js';
import Spinner from '/js/Utilidades/Spinner.js';
import Toast from '/js/Utilidades/Toast.js';
import Multiselect from '/js/Utilidades/Multiselect.js';

document.addEventListener('DOMContentLoaded', () => {
    new UsuariosIndex();
});

class UsuariosIndex {
    constructor(usuarios) {
        this.asyncFetch = new AsyncFetch();
        this.usuarios = [];
        this.roles = [];
        this.filtroUsado = false;
        this.user = null;
        this.editar = false;

        if (UsuariosIndex.instance) {
            

            this.usuarios = usuarios;
            UsuariosIndex.instance.usuarios = usuarios;

            this.spinnerTabla = new Spinner({
                id_elemento: "tabla"
            });

            if (UsuariosIndex.instance.filtroUsado) {
                this.spinnerTabla.mostrarSpinner();
                this.busqueda();
            }

            return UsuariosIndex.instance;
        }

        UsuariosIndex.instance = this;

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
            tituloContent: "Busqueda de Usuarios",
            htmlInsertar: clone
        });

        // Se recuperan los usuarios.
        this.usuarios = await this.getUsuarios();
        this.roles = await this.getRoles();

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

        const pantalla = "Usuarios";

        // Verificamos los permisos del usuario.
        const decryptedData = await InstanciaCry.decSer(sessionStorage.getItem('pantallasRol'));

        if (decryptedData.includes(pantalla)) {

            // Si el usuario tiene permiso se inserta la opcion de 'Nuevo Usuario'.
            this.editar = true;

            const contenedorLinkAlta = document.querySelector("#contenedorLinkAlta");
            const linkAlta = `<a href="#" data-element="nuevoUsuario">Nuevo Usuario</a>`;
            contenedorLinkAlta.insertAdjacentHTML('beforeend', linkAlta);
        }
    }
    async getUsuarios() {

        // Se obtienen los usuarios.
        const response = await this.asyncFetch.fetch({
            url: '/Controller.ashx',
            body: {
                accion: "CUsuarios",
                filtroBusqueda: ""               
            },
            headers: {
                'X-CSRF-Token': this.token
            }
        });

        

        if (response[0].resultado === "Ok") {

            
            return response;
        }

        return [];
    }
    async getRoles() {

        // Se obtienen los roles.
        const response = await this.asyncFetch.fetch({
            url: '/Controller.ashx',
            body: {
                accion: "CRoles"
            },
            headers: {
                'X-CSRF-Token': this.token
            }
        });

        if (response[0].resultado === "Ok") {

            return response;
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

            if (elem === "nuevoUsuario") {

                // Se instancia la clase para dar de alta un usuario.
                new AltaUsuario(this.usuarios, this.roles);
            }

            // Se realiza la busqueda de empleados de acuerdo al filtro de busqueda.
            if (elem === "btnBuscar") {

                this.spinnerTabla.mostrarSpinner();
                this.busqueda();
            }
        });
    }
    evtClickTabla() {
        // Se crea el evento click en la tabla de usuarios.
        document.querySelector("#tablaUsuarios").addEventListener('click', e => {

            let elem = "";

            if (e.target.classList.contains("item") && e.target.parentElement.parentElement.dataset.action === "verUsuario") {
                elem = e.target.parentElement.parentElement.dataset.usuario;
            }
            else if (e.target.classList.contains("colum") && e.target.parentElement.dataset.action === "verUsuario") {
                elem = e.target.parentElement.dataset.usuario;
            }
            else {
                return;
            }

            // Se recupera el usuario seleccionado.
            let [usuario] = this.usuarios.filter(p => p.usuario === elem);

            // Se instancia la clase para editar el usuario.
            new EdicionUsuario(this.editar, usuario, this.usuarios, this.roles);
        });
    }
    busqueda() {
        this.filtroUsado = true;

        let array = this.usuarios;
        const text = document.querySelector("#txtBusqueda").value;

        if (text !== "") {

            // Se filtra el array por nombre
            array = array.filter(({ usuario }) => {
                return usuario.toUpperCase().includes(text.toUpperCase());
            });
        }

        // Se llama al metodo encargado de llenar la tabla.
        this.llenarTablaUsuarios(array);
    }
    llenarTablaUsuarios(array) {

        // Completamos el número de columnas a utilizar, su tipo de valor y si esta columna es ordenable.
        let columnas = [
            { nombre: "Empleado", tipo: "string", ordenable: true },
            { nombre: "Usuario", tipo: "string", ordenable: true, dataset: { usuario: "Usuario", action: "verUsuario" } },
            { nombre: "Pass", tipo: "string", ordenable: true }
        ];

        // Si no hubo coincidencias en la busqueda.
        if (array.length === 0) {

            const tabla = new Tabla();
            tabla.llenarDatos({
                arrayDatos: [{ "Busqueda": "No hay resultados para su busqueda." }],
                objColumnas: [{ nombre: "Busqueda", tipo: "string", ordenable: true }],
                id_tabla: "tablaUsuarios"
            });

            this.spinnerTabla.ocultarSpinner();

            return;
        }
        else {

            // Se guardan en un array los datos para completar la tabla.
            const arrayReducido = array.map(({ empleado, usuario, pass }) => ({
                Empleado: empleado.apellido_nombre,
                Usuario: usuario,
                Pass: pass
            }));

            // Se llena la tabla.
            const tabla = new Tabla();
            tabla.llenarDatos({
                arrayDatos: arrayReducido,
                objColumnas: columnas,
                id_tabla: "tablaUsuarios"
            });
        }

        this.spinnerTabla.ocultarSpinner();
    }
}


class EdicionUsuario {
    constructor(editar, usuario, usuarios, roles) {
        this.asyncFetch = new AsyncFetch();        
        this.editar = editar;
        this.usuario = usuario;
        this.usuarios = usuarios;
        this.roles = roles;
        

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
            titulo: "Detalle del Usuario"
        });

        this.evtClick();
        this.permisos();
        this.llenarDatos();
    }
    llenarDatos() {

        // Se setean los campos con los datos del empleado.
        document.querySelector("#editEmpleado").value = this.usuario.empleado.apellido_nombre;
        document.querySelector("#editUsuario").value = this.usuario.usuario;
        document.querySelector("#editPass").value = this.usuario.pass;

        let selectRoles = document.getElementById('editRoles');

        for (let i = selectRoles.options.length; i >= 0; i--) {
            selectRoles.remove(i);
        }

        // Se crean las opciones.
        let option = document.createElement("option");
        option.value = "0";
        option.innerHTML = "";
        selectRoles.appendChild(option);

        this.roles.forEach(({ nombre, id }) => {

            let option = document.createElement("option");
            option.innerHTML = nombre;
            option.value = id;
            selectRoles.appendChild(option);


            //if (this.material.seccion !== null) {
            //    if (this.material.seccion.id === id) option.selected = true;
            //}
        });

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
                //this.modal.mostrarSpinner();
                //this.editarUsuario();
                new Toast({ mensaje: "Funcion en desarrollo", type: "error" });
            }
            else if (elem === "btnEliminar") {
                //this.modal.mostrarSpinner();
                //this.eliminarUsuario();
                new Toast({ mensaje: "Funcion en desarrollo", type: "error" });
            }
            else if (elem === "recargarModal") {
                this.modal.mostrarSpinner();
                this.llenarDatos();
            }
            else if (elem === "cerrarModal") {

                // Se vuelve a la pantalla principal.
                new UsuariosIndex(this.usuarios);
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
            usuario_abm: document.querySelector("#editUsuario").value,
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
                        mail: data.empleado.mail,
                        usuario_abm: data.empleado.usuario_abm
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


class AltaUsuario {
    constructor(usuarios, roles) {
        this.asyncFetch = new AsyncFetch();
        this.usuarios = usuarios;
        this.roles = roles;
        this.empleados = [];

        this.main();
    }
    async main() {
        this.token = await InstanciaCry.decSer(sessionStorage.getItem('tkn'));
        this.llenarModal();
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
    async llenarModal() {
        // Clonar el contenido del template
        const clone = document.querySelector("#bodyAlta").content.cloneNode(true);
        document.querySelector("#modal").innerHTML = "";

        // Instanciamos un modal e insertamos contenido.
        this.modal = new Modal({
            id_contenedor: 'modal',
            htmlInsertar: clone,
            titulo: "Alta de Usuario"
        });

        this.empleados = await this.getEmpleados();
        this.llenarListaEmpleados();
        this.insertarMultiselect(this.roles);

        this.evtClick();
        this.evtChangeEmpleados();
        

        this.modal.ocultarSpinner();
    }
    evtClick() {

        document.querySelector("#modal .custom-modal").addEventListener('click', e => {

            const elem = e.target.dataset.element;

            if (elem === "btnGuardar") {

                this.modal.mostrarSpinner();
                this.guardarUsuarioRoles();
            }
            else if (elem === "cerrarModal") {

                // Se vuelve a la pantalla principal.
                new UsuariosIndex(this.usuarios);
            }
        });
    }
    evtChangeEmpleados() {
        document.querySelector("#inputList").addEventListener('change', e => {

            const value = document.querySelector("#inputList").value;

            const [empleado] = this.empleados.filter(e => e.apellido_nombre === value);

            document.querySelector("#usuario").value = empleado !== undefined ? empleado.usuario_abm : "";

        });
    }
    llenarListaEmpleados() {

        // Se completa la datalist de empleados.
        let dataList = document.getElementById('listEmpleados');
        const options = dataList.getElementsByTagName('option');

        for (let i = options.length - 1; i >= 0; i--) {
            dataList.removeChild(options[i]);
        }

        this.empleados.forEach(({ apellido_nombre, id }) => {
            let option = document.createElement("option");
            option.value = apellido_nombre;
            option.dataset.id = id;
            dataList.appendChild(option);
        });

        return;
    }
    insertarMultiselect(roles) {

        let array = [];

        let rolesMultiselect = JSON.parse(JSON.stringify(roles));

        // Se agrega un atributo 'value' para poder usar el multiselect.
        if (rolesMultiselect.length > 0) {
            rolesMultiselect.forEach(elem => {
                elem.value = elem.id;
                elem.nombre = elem.nombre;
            });
        }      

        // Se limpia el contenedor.
        document.querySelector("#contenedor").innerHTML = "";

        // Se instancia el multiselect y se pasa el listado de articulos.
        this.multiselect = new Multiselect({
            elementosActivos: array,
            elementosTotal: rolesMultiselect,
            nombreContenedorActivos: "contenedor"
        });
                

        // Se inserta el multiselect.
        this.multiselect.sub('getHtml', data => {
            document.querySelector("#contenedor").appendChild(data);
        });

        // Se actualizan los articulos disponibles.
        this.multiselect.sub('getActivos', data => {
            this.actualizarArrayActivosMultiselect(data);
        });

        return;
    }
    actualizarArrayActivosMultiselect(seleccionados) {

        
        
        let rolesMultiselect = JSON.parse(JSON.stringify(this.roles));

        if (seleccionados.length > 0) {

            seleccionados.forEach(elem => {
                const value = elem.value;
                rolesMultiselect = rolesMultiselect.filter(e => e.id !== parseInt(value));
            });
        }

        if (rolesMultiselect.length > 0) {
            rolesMultiselect.forEach(elem => {
                elem.value = elem.id;
            });
        }
        

        this.multiselect.actualizarElementosTotal({ elementosTotal: rolesMultiselect });
    }
    recuperarRoles() {

        let rolesAsignados = [];

        // Se recuperan todas las etiquetas nuevas.
        const contenedor = document.querySelector("#contenedor");
        let etiquetas = contenedor.querySelectorAll('.tag.actived');

        // Por cada etiqueta se recupera el articulo correspondiente.
        etiquetas.forEach((elem) => {
            const id_rol = parseInt(elem.getAttribute('data-value'));
            //const nombre = elem.children[0].textContent;

            let [rol] = this.roles.filter(r => r.id === id_rol);

            rolesAsignados.push(rol);
        });

        return rolesAsignados;
    }
    async recuperarDatos() {

        const roles = await this.recuperarRoles();      

        const nombre_empleado = document.querySelector("#inputList").value;
        const [empleado] = this.empleados.filter(e => e.apellido_nombre === nombre_empleado);

        if (empleado === undefined) {
            new Toast({ mensaje: "Debe seleccionar un empleado.", type: "error" });
            return null;
        }

        // Se recupera el valor de los campos completados.      
        const obj = {
            empleado: empleado,
            usuario: document.querySelector("#usuario").value,
            pass: document.querySelector("#pass").value
        };

        // Se crea un objeto para guardar los datos obtenidos.
        const data = {            
            usuario: obj,
            roles: roles
        };

        return data;
    }
    async guardarUsuarioRoles() {

        // Recuperamos los campos.        
        const data = await this.recuperarDatos();
        if (data === null) return;

        console.log(data);

        

        // Se realiza el alta del empleado.
        const response = await this.asyncFetch.fetch({
            url: "/Controller.ashx",
            body: {
                accion: "AUsuario",
                usuario: data.usuario
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

            // Se agrega el producto al array.
            this.usuarios.push(response);

            // Si no hubo errores en el alta.
            new Toast({ mensaje: "Usuario creado correctamente.", type: "success" });

            // Se limpia el formulario.
            const inputs = document.querySelectorAll('[data-editable="true"]');
            inputs.forEach(elem => {
                elem.value = "";
            });

            document.querySelector("#contenedor").innerHTML = "";

            if (data.roles.length !== 0) {
                this.guardarUsuarioRoles(data.roles, response);
            }
        }

        return;
    }
    async guardarUsuarioRoles(roles, usuario) {

        // Se realiza el alta del empleado.
        const response = await this.asyncFetch.fetch({
            url: "/Controller.ashx",
            body: {
                accion: "AUsuarioRoles",
                usuario: usuario,
                roles: roles
            },
            headers: {
                'X-CSRF-Token': this.token
            }
        });

        const { resultado, errores } = Array.isArray(response) ? response[0] : response;        

        if (resultado !== "Ok") {

            this.limpiarErrores();
            this.mostrarErrores(errores);
            return;
        }
        else {

            this.limpiarErrores();
            
            // Si no hubo errores en el alta.
            new Toast({ mensaje: "Roles asignados correctamente.", type: "success" });            
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