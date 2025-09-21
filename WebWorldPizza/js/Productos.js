import AsyncFetch from '/js/Utilidades/Asyncfetch.js';
import InstanciaCry from '/js/Utilidades/cry.js';
import Modal from '/js/Utilidades/Modal.js';
import Principal from '/js/Utilidades/Principal.js';
import Tabla from '/js/Utilidades/Tabla.js';
import Alert from '/js/Utilidades/Alert.js';
import Spinner from '/js/Utilidades/Spinner.js';
import Toast from '/js/Utilidades/Toast.js';

document.addEventListener('DOMContentLoaded', () => {
    new ProductosIndex();
});


class ProductosIndex {
    constructor(productos) {
        this.asyncFetch = new AsyncFetch();
        this.productos = [];
        this.user = null;
        this.editar = false;

        if (ProductosIndex.instance) {

            this.productos = productos;
            ProductosIndex.instance.productos = productos;

            this.spinnerTabla = new Spinner({
                id_elemento: "tabla"
            });

            this.spinnerTabla.mostrarSpinner();
            this.busqueda();

            return ProductosIndex.instance;
        }

        ProductosIndex.instance = this;

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
            tituloContent: "Busqueda de Productos",
            htmlInsertar: clone
        });

        // Se recuperan los productos.
        this.productos = await this.getProductos();        

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

        const pantalla = "Productos";

        // Verificamos los permisos del usuario.
        const decryptedData = await InstanciaCry.decSer(sessionStorage.getItem('pantallasRol'));

        if (decryptedData.includes(pantalla)) {

            // Si el usuario tiene permiso se inserta la opcion de 'Nuevo Producto'.
            this.editar = true;

            const contenedorLinkAlta = document.querySelector("#contenedorLinkAlta");
            const linkAlta = `<a href="#" data-element="nuevoProducto">Nuevo Producto</a>`;
            contenedorLinkAlta.insertAdjacentHTML('beforeend', linkAlta);
        }
    }
    async getProductos() {

        // Se obtienen los productos.
        const response = await this.asyncFetch.fetch({
            url: '/Controller.ashx',
            body: {
                accion: "CProductos",
                filtroBusqueda: ""
            },
            headers: {
                'X-CSRF-Token': this.token
            }
        });

        if (response[0].resultado === "Ok") return response;

        return [];
    }
    eventos() {
        this.evtClick();
        this.evtClickTabla();
    }
    evtClick() {
        document.querySelector("#principal").addEventListener('click', e => {

            let elem = e.target.dataset.element;
            
            if (elem === "nuevoProducto") {

                // Se instancia la clase para dar de alta un producto.
                new AltaProducto(this.user, this.productos);
            }

            // Se realiza la busqueda de Productos de acuerdo al filtro de busqueda.
            if (elem === "btnBuscar") {
                 
                this.spinnerTabla.mostrarSpinner();

                this.busqueda();
            }
        });
    }
    evtClickTabla() {
        // Se crea el evento click en la tabla de productos.
        document.querySelector("#tablaProductos").addEventListener('click', e => {

            let elem = "";

            if (e.target.classList.contains("item") && e.target.parentElement.parentElement.dataset.action === "verProducto") {
                elem = e.target.parentElement.parentElement.dataset.id;
            }
            else if (e.target.classList.contains("colum") && e.target.parentElement.dataset.action === "verProducto") {
                elem = e.target.parentElement.dataset.id;
            }
            else {
                return;
            }

            // Se recupera el producto seleccionado.
            let [producto] = this.productos.filter(p => p.id.toString() === elem);
            
            // Se instancia la clase para editar el producto.
            new EdicionProducto(this.editar, this.user, producto, this.productos);
        });
    }
    busqueda() {
        
        let array = this.productos;
        const text = document.querySelector("#txtBusqueda").value;

        if (text !== "") {

            // Se filtra el array por nombre y descripcion
            array = array.filter(({ nombre, descripcion }) => {
                return nombre.toUpperCase().includes(text.toUpperCase()) || descripcion.toUpperCase().includes(text.toUpperCase());
            });
        }      

        // Se llama al metodo encargado de llenar la tabla.
        this.llenarTablaProductos(array);
    }
    llenarTablaProductos(array) {

        // Completamos el número de columnas a utilizar, su tipo de valor y si esta columna es ordenable.
        let columnas = [
            { nombre: "Id", tipo: "int", ordenable: true, dataset: { id: "Id", action: "verProducto" } },
            { nombre: "Nombre", tipo: "string", ordenable: true },
            { nombre: "Descripcion", tipo: "string", ordenable: true },
            { nombre: "Precio", tipo: "string", ordenable: true },
        ];

        // Si no hubo coincidencias en la busqueda.
        if (array.length === 0) {

            const tabla = new Tabla();
            tabla.llenarDatos({
                arrayDatos: [{ "Busqueda": "No hay resultados para su busqueda." }],
                objColumnas: [{ nombre: "Busqueda", tipo: "string", ordenable: true }],
                id_tabla: "tablaProductos"
            });

            this.spinnerTabla.ocultarSpinner();

            return;
        }
        else {

            // Se guardan en un array los datos para completar la tabla.
            const arrayReducido = array.map(({ id, nombre, descripcion, precio }) => ({
                Id: id,
                Nombre: nombre,
                Descripcion: descripcion !== "" ? descripcion : " - ",
                Precio: precio
            }));

            // Se llena la tabla.
            const tabla = new Tabla();
            tabla.llenarDatos({
                arrayDatos: arrayReducido,
                objColumnas: columnas,
                id_tabla: "tablaProductos"
            });
        }

        this.spinnerTabla.ocultarSpinner();
    }
}


class EdicionProducto {
    constructor(editar, user, producto, productos) {
        this.asyncFetch = new AsyncFetch();
        this.editar = editar;
        this.user = user;
        this.producto = producto;
        this.productos = productos;

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
            titulo: "Detalle del Producto"
        });

        this.evtClick();
        this.permisos();
        this.llenarDatos();
    }
    llenarDatos() {

        // Se setean los campos con los datos del producto.
        document.querySelector("#editNombre").value = this.producto.nombre;        
        document.querySelector("#editDescripcion").value = this.producto.descripcion;
        document.querySelector("#editPrecio").value = this.producto.precio.toString();
        
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
                this.editarProducto();
            }
            else if (elem === "btnEliminar") {
                this.modal.mostrarSpinner();
                this.eliminarProducto();
            }
            else if (elem === "recargarModal") {
                this.modal.mostrarSpinner();
                this.llenarDatos();
            }
            else if (elem === "cerrarModal") {

                // Se vuelve a la pantalla principal.
                new ProductosIndex(this.productos);
            }
        });
    }
    recuperarDatos() {

        // Se recupera el valor de los campos completados.    
        const obj = {
            id: this.producto.id,
            nombre: document.querySelector("#editNombre").value,
            descripcion: document.querySelector("#editDescripcion").value,
            precio: document.querySelector("#editPrecio").value
        };

        // Se crea un objeto para guardar los datos obtenidos.
        const data = {
            accion: "MProducto",
            producto: obj
        };

        return data;
    }
    async editarProducto() {

        const data = await this.recuperarDatos();        

        // Se realiza la edicion del producto.
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
            new Alert({ mensaje: 'Producto editado correctamente.', title: "Exito", type: "success" });

            // Se actualizan los datos del producto en el array.
            const indiceProducto = this.productos.findIndex(obj => obj.id === this.producto.id);

            if (indiceProducto !== -1) {

                this.productos[indiceProducto] = {
                    ...this.productos[indiceProducto],
                    ...{
                        nombre: data.producto.nombre,
                        descripcion: data.producto.descripcion,
                        precio: data.producto.precio
                    }
                };
            }

            // Se actualiza el producto seleccionado.
            const [prod] = this.productos.filter(p => p.id === this.producto.id);
            this.producto = prod;
        }

        return;
    }
    async eliminarProducto() {

        // Se elimina el producto de la base de datos.
        const response = await this.asyncFetch.fetch({
            url: "/Controller.ashx",
            body: {
                accion: "BProducto",
                id_producto: this.producto.id
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

            // Se quita el producto del array.
            this.productos = this.productos.filter(p => p.id !== this.producto.id);

            // Si la baja se realizó de manera correcta.
            new Alert({ mensaje: 'Producto eliminado correctamente.', title: "Exito", type: "success" });

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


class AltaProducto {
    constructor(user, productos) {
        this.asyncFetch = new AsyncFetch();        
        this.user = user;        
        this.productos = productos;

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
            titulo: "Alta de Producto"
        });

        this.evtClick();

        this.modal.ocultarSpinner();
    }
    evtClick() {

        document.querySelector("#modal .custom-modal").addEventListener('click', e => {

            const elem = e.target.dataset.element;
            
            if (elem === "btnGuardar") {

                this.modal.mostrarSpinner();
                this.guardarProducto();
            }
            else if (elem === "cerrarModal") {

                // Se vuelve a la pantalla principal.
                new ProductosIndex(this.productos);
            }
        });
    }
    recuperarDatos() {

        // Se recupera el valor de los campos completados.      
        const obj = {
            nombre: document.querySelector("#nombre").value,
            descripcion: document.querySelector("#descripcion").value,
            precio: document.querySelector("#precio").value
        };
        
        // Se crea un objeto para guardar los datos obtenidos.
        const data = {
            accion: "AProducto",
            producto: obj
        };

        return data;
    }
    async guardarProducto() {

        // Recuperamos los campos.        
        const data = await this.recuperarDatos();
        
        // Se realiza el alta del producto.
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
            this.productos.push(response);

            // Si no hubo errores en el alta.
            new Alert({ mensaje: 'Producto guardado correctamente.', title: "Exito", type: "success" });

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