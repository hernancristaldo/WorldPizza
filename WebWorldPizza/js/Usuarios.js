import AsyncFetch from '/js/Utilidades/Asyncfetch.js';
import InstanciaCry from '/js/Utilidades/cry.js';
import Modal from '/js/Utilidades/Modal.js';
import Principal from '/js/Utilidades/Principal.js';
import Tabla from '/js/Utilidades/Tabla.js';
import Alert from '/js/Utilidades/Alert.js';
import Spinner from '/js/Utilidades/Spinner.js';
import Toast from '/js/Utilidades/Toast.js';
import Multiselect from '/js/Utilidades/Multiselect.js';
import ModalSmall from '/js/Utilidades/ModalSmall.js';

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

        if (response[0].resultado === "Ok") { return response; }
        
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

        if (response[0].resultado === "Ok") { return response; }

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
            new EdicionUsuario(this.user, this.editar, usuario, this.usuarios, this.roles);
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
    constructor(user, editar, usuario, usuarios, roles) {
        this.asyncFetch = new AsyncFetch();
        this.user = user;
        this.editar = editar;
        this.usuario = usuario;
        this.usuarios = usuarios;
        this.roles = roles;
        this.usuarioRoles = [];
        this.rolesSeleccionados = [];        

        this.main();
    }
    async main() {
        this.token = await InstanciaCry.decSer(sessionStorage.getItem('tkn'));
        this.llenarModal();
    }
    async getUsuarioRoles() {

        // Se obtienen los roles del usuario.
        const response = await this.asyncFetch.fetch({
            url: '/Controller.ashx',
            body: {
                accion: "CUsuarioRoles",
                filtroBusqueda: this.usuario.usuario
            },
            headers: {
                'X-CSRF-Token': this.token
            }
        });        

        if (response[0].resultado === "Ok") { return response; }

        return [];
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

            // Btn para agregar rol.
            const contenedorLinkAlta = document.querySelector("#contenedorLinkRoles");
            const linkAlta = `<a href="#" data-element="nuevoRol">Nuevo Rol</a>`;
            contenedorLinkAlta.insertAdjacentHTML('beforeend', linkAlta);
        }
    }
    async llenarModal() {

        // Clonar el contenido del template
        const clone = document.querySelector("#bodyEdicion").content.cloneNode(true);
        document.querySelector("#modal").innerHTML = "";

        // Instanciamos un modal e insertamos contenido.
        this.modal = new Modal({
            id_contenedor: 'modal',
            htmlInsertar: clone,
            titulo: "Edicion"
        });

        this.usuarioRoles = await this.getUsuarioRoles();
        this.llenarTablaRoles(this.usuarioRoles);

        this.evtClick();
        this.evtChangeTablaRoles();
        this.permisos();
        this.llenarDatos();
    }
    llenarDatos() {

        // Se setean los campos con los datos del usuario.
        document.querySelector("#editEmpleado").value = this.usuario.empleado.apellido_nombre;
        document.querySelector("#editUsuario").value = this.usuario.usuario;
        document.querySelector("#editPass").value = this.usuario.pass;        

        this.modal.ocultarSpinner();
    }
    llenarTablaRoles(usuarioRoles) {

        // Completamos el número de columnas a utilizar, su tipo de valor y si esta columna es ordenable.
        let columnas = [
            { nombre: "Sel", tipo: "string", ordenable: true },
            { nombre: "Nombre", tipo: "string", ordenable: true },
            { nombre: "Descripcion", tipo: "string", ordenable: true }
        ];

        // Si no hubo coincidencias en la busqueda.
        if (usuarioRoles.length === 0) {

            const tabla = new Tabla();
            tabla.llenarDatos({
                arrayDatos: [{ "Busqueda": "No hay resultados para su busqueda." }],
                objColumnas: [{ nombre: "Busqueda", tipo: "string", ordenable: true }],
                id_tabla: "tablaRoles"
            });            

            return;
        }
        else {

            // Se guardan en un array los datos para completar la tabla.
            const arrayReducido = usuarioRoles.map(({ id, rol }) => ({
                Sel: `<input type="checkbox" data-element="checkRol" data-id="${id}">`,
                Nombre: rol.nombre,
                Descripcion: rol.descripcion
            }));

            // Se llena la tabla.
            const tabla = new Tabla();
            tabla.llenarDatos({
                arrayDatos: arrayReducido,
                objColumnas: columnas,
                id_tabla: "tablaRoles"
            });
        }

        return;
    }
    evtChangeTablaRoles() {
        document.querySelector("#tablaRoles").addEventListener('change', e => {

            const elem = e.target;

            // Se actualiza el array de ids seleccionados.
            if (elem.checked) {
                this.rolesSeleccionados.push(e.target.dataset.id);
            }
            else {
                this.rolesSeleccionados = this.rolesSeleccionados.filter(r => r !== e.target.dataset.id);
            }

            // Se muestra u oculta el boton segun seleccionados.
            if (this.rolesSeleccionados.length === 0) {
                document.querySelector(`[data-element="btnQuitar"]`).style.display = 'none';
            }
            else {
                document.querySelector(`[data-element="btnQuitar"]`).style.display = 'block';
            }
        });
    }
    setearRolesSeleccionados() {

        // Se setean los elementos que han sido seleccionados en la tabla.
        setTimeout(() => {
            const tabla = document.querySelector("#tablaRoles");
            let checks = tabla.querySelectorAll('[data-element="checkRol"]');

            checks.forEach(check => {
                const id = check.getAttribute("data-id");
                let index = this.rolesSeleccionados.indexOf(id);
                if (index !== -1) check.checked = true;
            });
        }, 30);

        return;
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

                    if (this.usuarioRoles.length === 0) {
                        document.querySelector('[data-element="btnEliminar"]').style.display = "block";
                    }
                    
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

            if (elem === "nuevoRol") {
                new NuevoRol(this.user, this.editar, this.usuario, this.usuarios, this.usuarioRoles, this.roles);
            }

            if (elem === "btnGuardar") {
                this.modal.mostrarSpinner();
                this.editarUsuario();                
            }

            if (elem === "btnEliminar") {
                this.modal.mostrarSpinner();
                this.eliminarUsuario();                
            }

            if (elem === "btnQuitar") {
                this.modal.mostrarSpinner();
                this.quitarRol();                
            }

            if (elem === "recargarModal") {
                this.modal.mostrarSpinner();
                this.llenarDatos();
            }

            if (elem === "paginaSelect" || elem === "Siguiente") {

                this.setearRolesSeleccionados();
            }

            if (elem === "cerrarModal") {

                // Se vuelve a la pantalla principal.
                new UsuariosIndex(this.usuarios);
            }
        });
    }
    async recuperarRolesSeleccionados() {

        const uRoles = [];

        // Se recupera cada rol seleccionado.
        this.rolesSeleccionados.forEach(elem => {
            const [uRol] = this.usuarioRoles.filter(ur => ur.id.toString() === elem);
            if (uRol !== undefined) uRoles.push(uRol);
        });

        return uRoles;
    }
    async quitarRol() {

        // Recuperamos los campos.        
        const uRoles = await this.recuperarRolesSeleccionados();        

        // Se hace la request por cada rol seleccionado.
        for (const uRol of uRoles) {

            const response = await this.asyncFetch.fetch({
                url: "/Controller.ashx",
                body: {
                    accion: "BUsuarioRol",
                    usuarioRol: uRol
                },
                headers: {
                    'X-CSRF-Token': this.token
                }
            });

            const { resultado, errores } = Array.isArray(response) ? response[0] : response;

            // Si hay error se muestra en pantalla.
            if (resultado !== "Ok") {
                new Toast({ mensaje: `Error al quitar el rol "${uRol.rol.nombre}".`, type: "error" });
            }
            else {
                new Toast({ mensaje: `Rol "${uRol.rol.nombre}" quitado correctamente.`, type: "success" });
                
                // Se filtran los roles del usuario.
                this.usuarioRoles = this.usuarioRoles.filter(t => t.id !== uRol.id);
            }
        }

        this.modal.ocultarSpinner();

        // Se limpia el array de seleccionados
        this.rolesSeleccionados = [];

        document.querySelector(`[data-element="btnQuitar"]`).style.display = 'none';

        // Se actualiza la tabla de roles.
        this.llenarTablaRoles(this.usuarioRoles);

        return;
    }
    recuperarDatos() {

        // Se recupera el valor de los campos completados.    
        const obj = {           
            
            empleado: this.usuario.empleado,
            usuario: document.querySelector("#editUsuario").value,
            pass: document.querySelector("#editPass").value
        };

        const data = {
            accion: "MUsuario",
            usuario: obj
        };

        return data;
    }
    async editarUsuario() {

        const data = await this.recuperarDatos();

        // Se realiza la edicion del usuario.
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
            new Alert({ mensaje: 'Usuario editado correctamente.', title: "Exito", type: "success" });

            // Se actualizan los datos del usuario en el array.
            const indiceUsuario = this.usuarios.findIndex(obj => obj.usuario === this.usuario.usuario);

            if (indiceUsuario !== -1) {

                this.usuarios[indiceUsuario] = {
                    ...this.usuarios[indiceUsuario],
                    ...{
                        usuario: data.usuario.usuario,
                        pass: data.usuario.pass
                    }
                };
            }

            // Se actualiza el usuario seleccionado.
            const [us] = this.usuarios.filter(e => e.usuario === this.usuario.usuario);
            this.usuario = us;
        }

        return;
    }
    async eliminarUsuario() {

        // Se elimina el usuario de la base de datos.
        const response = await this.asyncFetch.fetch({
            url: "/Controller.ashx",
            body: {
                accion: "BUsuario",
                usuario: this.usuario
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

            // Se quita el usuario del array.
            this.usuarios = this.usuarios.filter(e => e.usuario !== this.usuario.usuario);

            // Si la baja se realizó de manera correcta.
            new Alert({ mensaje: 'Usuario eliminado correctamente.', title: "Exito", type: "success" });

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


class NuevoRol {
    constructor(user, editar, usuario, usuarios, usuarioRoles, roles) {
        this.asyncFetch = new AsyncFetch();
        this.user = user;
        this.editar = editar;
        this.usuario = usuario;
        this.usuarios = usuarios;
        this.usuarioRoles = usuarioRoles;
        this.roles = roles;
        this.editado = false;

        this.main();
    }
    async main() {
        this.token = await InstanciaCry.decSer(sessionStorage.getItem('tkn'));
        this.iniciarModal();
    }
    iniciarModal() {

        const clone = document.querySelector("#bodyMultiselect").content.cloneNode(true);
        document.querySelector("#modalMini").innerHTML = "";

        // Se instancia ModalSmall
        this.modalMini = new ModalSmall({
            id_contenedor: 'modalMini',
            htmlInsertar: clone
        });

        this.spinner = new Spinner({
            id_elemento: "spinnerMultiselect"
        });

        this.insertarMultiselect();
        this.evtClick();
    }
    evtClick() {
        document.querySelector("#modalMini .custom-modal").addEventListener('click', e => {
            const elem = e.target.dataset.element;

            if (elem === "btnGuardarRol") {
                this.spinner.mostrarSpinner();
                this.guardarRoles();
            }

            if (elem === "cerrarModalSmall") {

                // Si hubo asignacion de productos se instancia nuevamente la clase CableSuscriptor para actualizar el modal.
                if (this.editado) new EdicionUsuario(this.user, this.editar, this.usuario, this.usuarios, this.roles);
            }
        });
    }
    insertarMultiselect() {

        // Se filtran los roles para quitar los que ya tiene asignados el usuario.
        let rolesUsuario = new Set(this.usuarioRoles.map(obj => obj.rol.id));
        let rolesMultiselect = this.roles.filter(obj => !rolesUsuario.has(obj.id));

        // Se agrega un atributo 'value' para poder usar el multiselect.
        if (rolesMultiselect.length > 0) {
            rolesMultiselect.forEach(elem => {
                elem.value = elem.id;
                elem.nombre = elem.nombre;
            });
        }

        // Se limpia el contenedor.
        document.querySelector("#contenedorNuevoRol").innerHTML = "";

        // Se instancia el multiselect y se pasa el listado de roles.
        this.multiselect = new Multiselect({
            elementosActivos: [],
            elementosTotal: rolesMultiselect,
            nombreContenedorActivos: "contenedorNuevoRol"
        });

        // Se inserta el multiselect.
        this.multiselect.sub('getHtml', data => {
            document.querySelector("#contenedorNuevoRol").appendChild(data);
        });

        // Se actualizan los roles disponibles.
        this.multiselect.sub('getActivos', data => {
            this.actualizarArrayActivosMultiselect(data);
        });

        return;
    }
    actualizarArrayActivosMultiselect(seleccionados) {

        // Se filtran los roles sacando los que el usuario ya tiene activos y se vuelve a cargar el multiselect.
        let rolesUsuario = new Set(this.usuarioRoles.map(obj => obj.rol.id));
        let rolesMultiselect = this.roles.filter(obj => !rolesUsuario.has(obj.id));


        if (seleccionados.length > 0) {
            seleccionados.forEach(elem => {
                const id = elem.value;
                rolesMultiselect = rolesMultiselect.filter(e => e.id.toString() !== id);
            });
        }

        if (rolesMultiselect.length > 0) {
            rolesMultiselect.forEach(elem => {
                elem.value = elem.id;
                elem.nombre = elem.nombre;
            });
        }

        // Se actualizan los elementos que se cargan en la lista de seleccionables.
        this.multiselect.actualizarElementosTotal({ elementosTotal: rolesMultiselect });
    }
    recuperarDatos() {

        let rolesAgregados = [];

        // Se recuperan todas las etiquetas nuevas.
        const contenedor = document.querySelector("#contenedorNuevoRol");
        let etiquetas = contenedor.querySelectorAll('.tag.actived');

        // Por cada etiqueta se recupera el rol correspondiente.
        etiquetas.forEach((elem) => {
            const id = elem.getAttribute('data-value');

            let [rol] = this.roles.filter(b => b.id.toString() === id);

            rolesAgregados.push(rol);
        });

        if (rolesAgregados.length === 0) {
            new Alert({ mensaje: 'Debe seleccionar al menos un rol.', title: "Error", type: "error" });
            this.spinner.ocultarSpinner();
            return null;
        }

        const data = {
            accion: "AUsuarioRoles",
            usuario: this.usuario,
            roles: rolesAgregados
        };

        return data;
    }
    async guardarRoles() {

        // Recuperamos los campos.        
        const data = await this.recuperarDatos();
        if (data === null) return;

        const response = await this.asyncFetch.fetch({
            url: "/Controller.ashx",
            body: data,
            headers: {
                'X-CSRF-Token': this.token
            }
        });

        this.spinner.ocultarSpinner();

        this.editado = true;

        const { resultado, errores } = Array.isArray(response) ? response[0] : response;

        if (errores.length !== 0) {

            this.limpiarErrores();
            this.mostrarErrores(errores);
            return;
        }
        else {

            this.limpiarErrores();

            // Si no hubo errores en el alta.
            new Toast({ mensaje: "Roles asignados correctamente.", type: "success" });
        }

        document.querySelector('[data-element="cerrarModalSmall"]').click();

        return;
    }
    // Errores
    mostrarErrores(errores) {

        if (errores.length > 1) {

            if (errores[0]?.propiedad != undefined) {

                errores.forEach(({ descripcion, propiedad }) => {

                    const elementoError = document.querySelector(`#modalMini [data-validate="${propiedad}"]`);

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
        const elementoError = document.querySelectorAll(`#modalMini [required]`);

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
        
        this.modal.ocultarSpinner();
    }
    evtClick() {

        document.querySelector("#modal .custom-modal").addEventListener('click', e => {

            const elem = e.target.dataset.element;

            if (elem === "btnGuardar") {

                this.modal.mostrarSpinner();
                this.guardarUsuario();
            }

            if (elem === "cerrarModal") {

                // Se vuelve a la pantalla principal.
                new UsuariosIndex(this.usuarios);
            }
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

        // Se actualiza el array de roles seleccionables quitando los seleccionados anteriormente.
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

        // Por cada etiqueta se recupera el rol correspondiente.
        etiquetas.forEach((elem) => {
            const id_rol = parseInt(elem.getAttribute('data-value'));
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
            this.modal.ocultarSpinner();
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
    async guardarUsuario() {

        // Recuperamos los campos.        
        const data = await this.recuperarDatos();
        if (data === null) return;


        // Se realiza el alta del usuario.
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

            this.insertarMultiselect(this.roles);

            // Si se asignaron roles se dan de alta.
            if (data.roles.length !== 0) {
                this.guardarUsuarioRoles(data.roles, response);
            }
        }

        return;
    }
    async guardarUsuarioRoles(roles, usuario) {

        // Se realiza el alta de los roles.
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