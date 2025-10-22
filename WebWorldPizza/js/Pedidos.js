import Principal from '/js/Utilidades/Principal.js';
import InstanciaCry from '/js/Utilidades/Cry.js';
import Spinner from '/js/Utilidades/Spinner.js';
import AsyncFetch from '/js/Utilidades/Asyncfetch.js';
import Tabla from '/js/Utilidades/Tabla.js';
import Alert from '/js/Utilidades/Alert.js';
import Toast from '/js/Utilidades/Toast.js';
import ModalSmall from '/js/Utilidades/ModalSmall.js';
import Modal from '/js/Utilidades/Modal.js';

document.addEventListener('DOMContentLoaded', () => {
    new PedidosIndex();
});

class PedidosIndex {
    constructor(pedidos) {
        this.asyncFetch = new AsyncFetch();
        this.estados = [];
        this.tiposPagos = [];
        this.pedidos = [];
        this.roles = [];
        this.editar = false;
        this.token = null;


        if (PedidosIndex.instance) {

            this.pedidos = pedidos;
            PedidosIndex.instance.pedidos = pedidos;

            this.spinnerTabla = new Spinner({
                id_elemento: "tabla"
            });

            this.spinnerTabla.mostrarSpinner();
            this.busqueda();

            return PedidosIndex.instance;
        }

        this.main();
    }
    async main() {
        this.token = await InstanciaCry.decSer(sessionStorage.getItem('tkn'));
        this.iniciarPrincipal();

    }
    async iniciarPrincipal() {

        document.querySelector("#principal").innerHTML = "";
        const template = document.querySelector('#bodyPrincipal');
        const clone = template.content.cloneNode(true);

        // Insertamos el html en el body.
        this.principal = new Principal({
            id_elemento: 'principal',
            tituloContent: "Busqueda de Pedidos",
            htmlInsertar: clone
        });


        this.eventos();

        // Se instancia el spinner para la tabla.
        this.spinnerTabla = new Spinner({
            id_elemento: "spinnerTabla"
        });

        await this.usuarioABM();

        const repartidor = this.sessionUser.usuarioRoles[0].rol.id === 4 ? this.sessionUser.usuario.usuario : "";
        this.pedidos = await this.getPedidos("", 1, this.sessionUser.usuarioRoles[0].rol.id, repartidor);

        this.estados = await this.getEstados();
        this.tiposPagos = await this.getTiposPagos();
        this.getRoles();

        this.permisos();
        
        this.llenarSelects();


        this.principal.ocultarSpinner();

        this.spinnerTabla.mostrarSpinner();

        this.llenarTablaPedidos(this.pedidos);

        

    }
    async usuarioABM() {

        // Se recupera el usuario al iniciar sesion.
        const usuario = await InstanciaCry.decSer(sessionStorage.getItem('sessionUsr'));
        this.sessionUser = JSON.parse(usuario);
        

        //if (sessionUser.usuario.resultado === "Ok") this.sessionUser = sessionUser.usuario.usuario;
    }
    eventos() {
        this.evtClickPrincipal();
        this.evtClickTabla();
    }
    async getPedidos(filtro, estado, rol, nombreUsuario) {

        // Se obtienen los pedidos del usuario.
        let response = await this.asyncFetch.fetch({
            url: '/Controller.ashx',
            body: {
                accion: "CPedidos",
                filtroBusqueda: filtro,
                id_estado: estado,
                id_rol: rol === 1 ? null : rol,
                nombreUsuario: nombreUsuario
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
    async getEstados() {

        // Se obtienen los pedidos del usuario.
        const response = await this.asyncFetch.fetch({
            url: '/Controller.ashx',
            body: {
                accion: "CEstados"
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
    async getTiposPagos() {

       
        const response = await this.asyncFetch.fetch({
            url: '/Controller.ashx',
            body: {
                accion: "CTiposPagos"
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

        // Se obtienen los pedidos del usuario.
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

            this.roles = response;
        }

        
    }
    async permisos() {

        // Recuperamos las pantallas del usuario.
        const arrayPantallas = await InstanciaCry.decSer(sessionStorage.getItem('pantallasRol'));

        const pantallaPedidos = "Pedidos";


        if (arrayPantallas.includes(pantallaPedidos)) {

            this.editar = true;
            //window.location.href = "/ViewControllers/Pedidos.aspx";
        }
        else {
            if (this.sessionUser.usuarioRoles[0].rol.id === 1) this.editar = true;
        }

    }
    llenarSelects() {

        let selectEstados = document.querySelector("#selectEstado");

        this.estados.forEach(elem => {
            const option = document.createElement('option');
            option.value = elem.id;
            option.innerHTML = elem.nombre;
            selectEstados.appendChild(option);

            if (elem.id === 1) option.selected = true;            
        });

        let selectTiposPago = document.querySelector("#selectTipoPago");

        this.tiposPagos.forEach(elem => {
            const option = document.createElement('option');
            option.value = elem.id;
            option.innerHTML = elem.nombre;
            selectTiposPago.appendChild(option);
        });

        return;
    }
    evtClickPrincipal() {

        document.querySelector('#principal').addEventListener('click', (e) => {

            const elem = e.target.dataset.element;

            if (elem === "btnBuscar") {
                this.spinnerTabla.mostrarSpinner();
                this.busqueda();
            }

            return;

        });

    }
    llenarTablaPedidos(pedidos) {
        
        // Completamos el número de columnas a utilizar, su tipo de valor y si esta columna es ordenable.
        let columnas = [
            { nombre: "Id", tipo: "string", ordenable: true, dataset: { id: "Id", action: "verPedido" } },
            { nombre: "Fecha", tipo: "datetime", ordenable: true },
            { nombre: "Cliente", tipo: "string", ordenable: true },
            { nombre: "Direccion", tipo: "string", ordenable: true },
            { nombre: "Estado", tipo: "string", ordenable: true },
            { nombre: "Pagado", tipo: "string", ordenable: true },
            { nombre: "Importe", tipo: "string", ordenable: true }
        ];

        // Si no hubo coincidencias en la busqueda.
        if (pedidos.length === 0) {

            const tabla = new Tabla();
            tabla.llenarDatos({
                arrayDatos: [{ "Pedidos": "No hay resultados para su busqueda." }],
                objColumnas: [{ nombre: "Pedidos", tipo: "string", ordenable: true }],
                id_tabla: "tablaPedidos"
            });          
        }
        else {

            // Se guardan en un array los datos para completar la tabla.
            const arrayReducido = pedidos.map(({ pedido }) => ({
                Id: pedido.id,
                Fecha: moment(pedido.fecha_alta).format('DD/MM/YYYY'),
                Cliente: pedido.nombre_cliente,
                Direccion: pedido.direccion,
                Estado: pedido.estado.nombre,
                Pagado: pedido.pagado === false ? 'No' : 'Si',
                Importe: `$ ${pedido.importe}`
            }));

            // Se llena la tabla.
            const tabla = new Tabla();
            tabla.llenarDatos({
                arrayDatos: arrayReducido,
                objColumnas: columnas,
                id_tabla: "tablaPedidos"
            });

            setearPedidosPendientes();
        }

        this.spinnerTabla.ocultarSpinner();

        function setearPedidosPendientes() {

            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);

            const tabla = document.querySelector("#tablaPedidos");
            const rows = tabla.querySelectorAll(".table-row");

            // Se compara la fecha de cada fila con la actual y se colorea de rojo si esta vencida la factura.
            rows.forEach(row => {

                const estado = row.children[4].children[1].innerHTML;                

                if (estado === "Pendiente") {
                    const items = row.querySelectorAll(".item");
                    items.forEach(item => {
                        item.style.color = 'red';
                    });
                }
                else if (estado === "Procesando") {
                    const items = row.querySelectorAll(".item");
                    items.forEach(item => {
                        item.style.color = 'orange';
                    });
                }
                else if (estado === "Listo") {
                    const items = row.querySelectorAll(".item");
                    items.forEach(item => {
                        item.style.color = 'lightgreen';
                    });
                }
                else if (estado === "Enviado") {
                    const items = row.querySelectorAll(".item");
                    items.forEach(item => {
                        item.style.color = 'green';
                    });
                }
            });

            return;
        }

        return;
    }
    async busqueda() {

        const filtro = document.querySelector("#filtro").value;
        const id_estado = document.querySelector("#selectEstado").value;
        const id_tipoPago = document.querySelector("#selectTipoPago").value;
        const pagado = document.querySelector('[data-element="pagado"]').checked;
        const repartidor = this.sessionUser.usuarioRoles[0].rol.id === 4 ? this.sessionUser.usuario.usuario : "";


        let response = await this.getPedidos(filtro, id_estado, this.sessionUser.usuarioRoles[0].rol.id, repartidor);
        

        if (id_tipoPago !== "0") {
            this.pedidos = response.filter(p => {
                return (p.pedido.tipoPago.id.toString() === id_tipoPago && p.pedido.pagado === pagado);
            });
        }
        else {
            this.pedidos = response.filter(p => p.pedido.pagado === pagado);
        }
        

        this.llenarTablaPedidos(this.pedidos);
    }
    evtClickTabla() {

        // Se crea el evento click en la tabla de promociones.
        document.querySelector("#tablaPedidos").addEventListener('click', e => {

            let elem = "";

            if (e.target.classList.contains("item") && e.target.parentElement.parentElement.dataset.action === "verPedido") {

                elem = e.target.parentElement.parentElement.dataset.id;
            }
            else if (e.target.classList.contains("colum") && e.target.parentElement.dataset.action === "verPedido") {
                elem = e.target.parentElement.dataset.id;
            }
            else {

                return;
            }

            // Se obtiene la promocion seleccionado de la tabla.            
            let [pedido] = this.pedidos.filter(e => e.pedido.id.toString() === elem);

            // Se despliega menu flotante.
            this.abrirMenuFlotante({ event: e, pedido: pedido });
        });
    }
    async abrirMenuFlotante({ event, pedido }) {

        const id_contenedor = "principal";

        // Creamos html.
        const contenedor = document.createElement("div");
        contenedor.className = "menu-flotante";
        contenedor.appendChild(await this.GetHtmlPermisosMenuFlotante());

        contenedor.style.cssText += `top: ${event.clientY + window.scrollY - 10}px; left: ${event.clientX - 10}px;`;

        document.querySelector(`#${id_contenedor}`).appendChild(contenedor);

        // Cuando el mouse salga del elemento lo quitamos.
        contenedor.addEventListener('mouseleave', e => {
            const menuExistente = document.querySelector(".menu-flotante");
            if (menuExistente) menuExistente.remove();
        });

        // Cuando se hace click sobre el menu flotante.
        contenedor.addEventListener('click', e => {

            const elem = e.target.dataset.action;

            if (elem === "verEstado") {

                new EstadoPedido(this.editar, this.sessionUser, pedido, this.roles, this.estados, this.tiposPagos, this.pedidos);
                return;
            }

            if (elem === "verDetalles") {

                new Toast({ mensaje: 'Funcion en desarrollo', type: 'error', timmer: 3000 });
                return;
            }


        });

    }
    async GetHtmlPermisosMenuFlotante() {

        const contenedor = document.createElement("div");

        const html = `
            <span data-action="verEstado" class="btn-flotante">Estado</span>
            <span data-action="verDetalles" class="btn-flotante">Detalles</span>
            
        `

        contenedor.insertAdjacentHTML('beforeend', html);

        return contenedor;
    }
}


class EstadoPedido {
    constructor(editar, sessionUser, pedido, roles, estados, tiposPago, pedidos) {
        this.asyncFetch = new AsyncFetch();
        this.editar = editar;
        this.sessionUser = sessionUser;
        this.pedido = pedido;
        this.roles = roles;
        this.estados = estados;
        this.tiposPago = tiposPago;
        this.pedidos = pedidos;
        this.repartidores = [];
        

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

        this.repartidores = await this.getRepartidores();

        this.eventos();
        this.permisos();
        this.llenarDatos();
    }
    async getRepartidores() {

        // Se obtienen los usuarios con rol 'reparto'
        const response = await this.asyncFetch.fetch({
            url: '/Controller.ashx',
            body: {
                accion: "CUsuarioRoles",
                filtroBusqueda: "",
                id_rol: 4
            },
            headers: {
                'X-CSRF-Token': this.token
            }
        });

        console.log(response);

        if (response[0].resultado === "Ok") {

            let repartidores = response.map(obj => obj.usuario);

            
            console.log(repartidores);

            return repartidores;
        }

        return [];
    }
    llenarDatos() {

        // Se setean los campos con los datos del usuario.
        document.querySelector("#codigo").value = this.pedido.pedido.id;
        document.querySelector("#cliente").value = this.pedido.pedido.nombre_cliente;
        document.querySelector("#direccion").value = this.pedido.pedido.direccion;
        document.querySelector("#importe").value = this.pedido.pedido.importe;
        document.querySelector("#pago").value = this.pedido.pedido.pagado === true ? "1" : "0";

        this.llenarSelects();       
    }
    llenarSelects() {

        let tiposPago = document.querySelector("#tipoPago");

        for (let i = tiposPago.options.length; i >= 0; i--) {
            tiposPago.remove(i);
        }

        this.tiposPago.forEach(({ id, nombre }) => {
            const option = document.createElement("option");
            option.innerHTML = nombre;
            option.value = id;
            tiposPago.appendChild(option);

            // Si es edicion se deja seleccionado el articulo correspondiente.
            if (this.pedido.pedido.tipoPago.id === id) {
                option.selected = true;
            }
        });

        let estados = document.querySelector("#estado");

        for (let i = estados.options.length; i >= 0; i--) {
            estados.remove(i);
        }
        
        this.estados.forEach(({ id, nombre }) => {
            const option = document.createElement("option");
            option.innerHTML = nombre;
            option.value = id;
            estados.appendChild(option);

            // Si es edicion se deja seleccionado el articulo correspondiente.
            if (this.pedido.pedido.estado.id === id) {
                option.selected = true;
            }
        });

        let roles = document.querySelector("#rol");

        for (let i = roles.options.length; i >= 0; i--) {
            roles.remove(i);
        }

        this.roles.forEach(({ id, nombre }) => {
            const option = document.createElement("option");
            option.innerHTML = nombre;
            option.value = id;
            roles.appendChild(option);

            // Si es edicion se deja seleccionado el articulo correspondiente.
            if (this.pedido.pedido.rol.id === id) {
                option.selected = true;
            }
        });

        if (this.pedido.pedido.rol.id === 4) {
            document.querySelector("#grupoReparto").style.display = 'block';

            let selectRepartidores = document.querySelector("#repartidor");

            for (let i = selectRepartidores.options.length; i >= 0; i--) {
                selectRepartidores.remove(i);
            }

            const optionCero = document.createElement('option');
            optionCero.value = '0';
            optionCero.innerHTML = 'Ninguno';
            selectRepartidores.appendChild(optionCero);

            this.repartidores.forEach(({ usuario, empleado }) => {  
                const option = document.createElement("option");
                option.innerHTML = `${usuario} - ${empleado.apellido_nombre}`;
                option.value = usuario;
                selectRepartidores.appendChild(option);

                if (this.pedido.pedido.repartidor !== null) {
                    if (this.pedido.pedido.repartidor === usuario) {
                        option.selected === true;
                    }
                }
            });
        }

        this.modal.ocultarSpinner();
    }
    eventos() {
        this.evtClick();
        //this.evtChangeTablaRoles();
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

                   
                }
                else {

                    // deshabilitamos los elementos editables.
                    itemsValidar.forEach(elem => {
                        elem.disabled = true;
                    });

                    // Ocultamos los botones de editar y eliminar.
                    document.querySelector('[data-element="btnGuardar"]').style.display = "none";
                    
                }
                return;
            }

            if (elem === "btnGuardar") {
                
                const intancia = new Alert({ mensaje: 'Desea guardar los cambios realizados?', title: "Confimación", type: "question" });
                intancia.sub('aceptar', data => {

                    this.modal.mostrarSpinner();

                    // Se llama al metodo para editar el envio si el envio no es nulo.
                    this.edicionPedido();

                    new Toast({ mensaje: 'funcion en desarrollo', type: 'error', timmer: 3000 });
                });                
            }

            if (elem === "recargarModal") {
                this.modal.mostrarSpinner();
                this.llenarDatos();
            }            

            if (elem === "cerrarModal") {

                // Se vuelve a la pantalla principal.
                new PedidosIndex(this.pedidos);
            }
        });
    }
    recuperarDatos() {

        const [tipoPago] = this.tiposPago.filter(t => t.id === parseInt(document.querySelector("#tipoPago").value));
        const [estado] = this.estados.filter(e => e.id === parseInt(document.querySelector("#estado").value));
        const [rol] = this.roles.filter(r => r.id === parseInt(document.querySelector("#rol").value));

        // Se recupera el valor de los campos completados.    
        const pedido = {
            id: this.pedido.pedido.id,
            nombre_cliente: this.pedido.pedido.nombre_cliente,
            direccion: this.pedido.pedido.direccion,
            importe: this.pedido.pedido.importe,
            pagado: document.querySelector("#pago").value === "0" ? false : true,
            tipoPago: tipoPago,
            estado: estado,
            rol: rol
        };

        const data = {
            accion: "MPedido",
            pedido: pedido
        };

        return data;
    }
    async edicionPedido() {

        const data = await this.recuperarDatos();

        console.log(data);

        //// Se realiza la edicion del usuario.
        //const response = await this.asyncFetch.fetch({
        //    url: "/Controller.ashx",
        //    body: data,
        //    headers: {
        //        'X-CSRF-Token': this.token
        //    }
        //});

        //const { resultado, errores } = Array.isArray(response) ? response[0] : response;

        const resultado = "Ok";

        //this.modal.ocultarSpinner();

        if (resultado !== "Ok") {

            this.limpiarErrores();
            this.mostrarErrores(errores);
            return;
        }
        else {

            this.limpiarErrores();

            if (this.pedido.pedido.rol.id !== data.pedido.rol.id) {
                document.querySelector('[data-element="btnSwitch"]').click();
                document.querySelector('.switch').remove();
            }


            // Si la edición se realizó de manera correcta.
            new Alert({ mensaje: 'Pedido editado correctamente.', title: "Exito", type: "success" });

            // Se actualizan los datos del pedido en el array.
            this.pedidos.forEach(item => {
                if (item.pedido.id === this.pedido.pedido.id) {
                    item.pedido.pagado = data.pedido.pagado;
                    item.pedido.tipoPago = data.pedido.tipoPago;
                    item.pedido.estado = data.pedido.estado;
                    item.pedido.rol = data.pedido.rol;
                }
            });


            //para detallePedido
            //lista.forEach(item => {
            //    if (item.pedido.id === idPedido) {
            //        item.detallesPedido.forEach(detalle => {
            //            if (detalle.id === idDetalle) {
            //                detalle.cantidad = 5; // nuevo valor
            //            }
            //        });
            //    }
            //});


            // Se actualiza el usuario seleccionado.
            const [p] = this.pedidos.filter(e => e.pedido.id === this.pedido.pedido.id);
            this.pedido = p;


            console.log(p);

           
        }

        this.llenarDatos();

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