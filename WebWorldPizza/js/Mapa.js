import Principal from '/js/Utilidades/Principal.js';
import InstanciaCry from '/js/Utilidades/Cry.js';
import AsyncFetch from '/js/Utilidades/Asyncfetch.js';
import Alert from '/js/Utilidades/Alert.js';
import Toast from '/js/Utilidades/Toast.js';
import Modal from '/js/Utilidades/Modal.js';


document.addEventListener('DOMContentLoaded', () => {
    new Mapa();
});


function loadGoogleMaps(apiKey) {
    return new Promise((resolve, reject) => {

        // Si ya está cargado
        if (window.google && window.google.maps) {
            resolve();
            return;
        }

        // Callback que Google Maps espera
        window.__initGM = () => {
            resolve();
            delete window.__initGM;
        };

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=__initGM&libraries=marker&loading=async`;
        script.async = true;
        script.defer = true;
        script.onerror = reject;

        document.head.appendChild(script);
    });
}

class Mapa {
    constructor(pedidos) {
        this.asyncFetch = new AsyncFetch();        

        if (Mapa.instance) {
            
            this.pedidos = pedidos;
            Mapa.instance.pedidos = pedidos;      
            this.estados = Mapa.instance.estados;
            this.tiposPagos = Mapa.instance.tiposPagos;
            this.roles = Mapa.instance.roles;
            this.repartidores = Mapa.instance.repartidores;
            this.editar = Mapa.instance.editar;

            this.iniciarMapa();
            
            return Mapa.instance;
        }

        Mapa.instance = this;
        

        this.main();
    }
    async main() {
        await loadGoogleMaps("AIzaSyDRZNUspAj7J1LwfcFhXCWthM7VJ1xkROQ");

        // --- 2) Decodificar token ---
        this.token = await InstanciaCry.decSer(sessionStorage.getItem('tkn'));

        // --- 3) Cargar la UI y luego el mapa ---
        await this.iniciarPrincipal();
        await this.iniciarMapa();
    }
    async iniciarPrincipal() {
        document.querySelector("#principal").innerHTML = "";
        const template = document.querySelector('#bodyPrincipal');
        const clone = template.content.cloneNode(true);

        this.principal = new Principal({
            id_elemento: 'principal',
            tituloContent: "Mapa de Pedidos",
            htmlInsertar: clone
        });


        this.pedidos = await this.getPedidos("", 0, 1, "");
        this.estados = await this.getEstados();
        this.tiposPagos = await this.getTiposPagos();
        this.roles = await this.getRoles();
        this.repartidores = await this.getRepartidores();
        this.permisos();

        this.principal.ocultarSpinner();

        return;
    }
    async permisos() {

        // Recuperamos las pantallas del usuario.
        const arrayPantallas = await InstanciaCry.decSer(sessionStorage.getItem('pantallasRol'));
        const pantallaPedidos = "Mapa";

        if (arrayPantallas.includes(pantallaPedidos)) {

            this.editar = true;
        }
        else {
            if (this.sessionUser.usuarioRoles[0].rol.id === 1) this.editar = true;
        }

        return;
    }
    // Datos
    async getPedidos(filtro, estado, rol, nombreUsuario) {

        // Se obtienen los pedidos del usuario.
        let response = await this.asyncFetch.fetch({
            url: '/Controller.ashx',
            body: {
                accion: "CPedidos",
                filtroBusqueda: filtro,
                id_estado: estado === 0 ? null : estado,
                id_rol: rol === 1 ? null : rol,
                nombreUsuario: nombreUsuario
            },
            headers: {
                'X-CSRF-Token': this.token
            }
        });

        if (response[0].resultado === "Ok") {                       

            const hoy = new Date();

            response = response.filter(p => {
                const fechaPedido = new Date(p.pedido.fecha_alta);

                return fechaPedido === hoy;
            });


            return response;
        }

        return [];
    }
    async getEstados() {

        // Se obtienen los estados
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

        // Se recuperan los tipos de pago
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

        // Se obtienen los roles
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

        if (response[0].resultado === "Ok") {

            let repartidores = response.map(obj => obj.usuario);
            return repartidores;
        }

        return [];
    }
    // Mapa
    iniciarMapa() {
        

        const div = document.querySelector('#contenedor-mapa');
        div.innerHTML = "";
        div.style.width = "100%";
        div.style.height = "500px";
        div.style.display = "block";

        // 5) ¡Ahora Google Maps funciona sin error!
        this.mapa = new google.maps.Map(div, {
            center: { lat: -31.2525979, lng: -61.4916422 },
            zoom: 14,
            mapId: "Pedidos"
        });

        for (let p of this.pedidos) {
            this.agregarMarcadorPorDireccion(p.pedido);
        }
        
    }
    async agregarMarcadorPorDireccion(pedido) {
        try {
            const location = await this.geocodificarDireccion(`${pedido.direccion}, Rafaela, Santa Fe`);

            const marker = new google.maps.marker.AdvancedMarkerElement({
                position: location,
                map: this.mapa,
                title: `Nro pedido: ${pedido.id} \nCliente: ${pedido.nombre_cliente} \nDireccion: ${pedido.direccion} \nEstado: ${pedido.estado.nombre} \nImporte: ${pedido.importe} \nRepartidor: ${pedido.repartidor === null ? ' - ' : pedido.repartidor.empleado.apellido_nombre}`,
                content: CrearMarcadorPorEstado(pedido)
            });

            if (pedido.estado.id !== 5) {

                marker.addEventListener('click', e => {
                    const id_pedido = parseInt(e.target.dataset.id);

                    const data = {

                        roles: this.roles,
                        estados: this.estados,
                        tiposPago: this.tiposPagos
                    };

                    const pedido = this.pedidos.find(p => p.pedido.id === id_pedido);

                    new EstadoPedido(this.editar, this.sessionUser, pedido, this.pedidos, data);
                });
            }            

            return marker;

        } catch (error) {
            
            new Alert({ mensaje: error, title: "Error", type: "error" });
        }


        function CrearMarcadorPorEstado(pedido) {

            let color = "";

            // Se setea el color de acuerdo al estado de señal de la ONU.
            switch (pedido.estado.nombre.toLowerCase()) {
                case 'enviado':
                    color = 'blue';
                    break;
                case 'procesando':
                    color = 'orange';
                    break;
                case 'listo':
                    color = 'green';
                    break;
                case 'pendiente':
                    color = 'red';
                    break;
                case 'enviado':
                    color = 'blue';
                    break;
                default:
                    color = 'grey';
            }

            // Se crea el icono.
            const div = document.createElement('div');
            div.innerHTML = `
                <svg width="40" height="40" cursor="pointer" data-id="${pedido.id}" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 
                                0-2.5-1.12-2.5-2.5s1.12-2.5 
                                2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" stroke="white" stroke-width="1" data-id="${pedido.id}"/>
                </svg>
            `;
            //div.dataset.element = "itemPedido";
            //div.dataset.id = pedido.id;
            
            return div;
        }
    }
    async geocodificarDireccion(direccion) {
        return new Promise((resolve, reject) => {
            const geocoder = new google.maps.Geocoder();

            geocoder.geocode({ address: direccion }, (results, status) => {
                if (status === "OK" && results.length > 0) {
                    resolve(results[0].geometry.location); // lat/lng
                } else {
                    reject("No se pudo geocodificar la dirección: " + direccion);
                }
            });
        });
    }
    
}


class EstadoPedido {
    constructor(editar, sessionUser, pedido, pedidos, data) {
        this.asyncFetch = new AsyncFetch();
        this.editar = editar;
        this.sessionUser = sessionUser;
        this.pedido = pedido;
        this.pedidos = pedidos;
        this.roles = data.roles;
        this.estados = data.estados;
        this.tiposPago = data.tiposPago;
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
            titulo: "Estado pedido"
        });

        this.repartidores = await this.getRepartidores(); // Repartidores

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

        if (response[0].resultado === "Ok") {

            let repartidores = response.map(obj => obj.usuario);
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

        // Se completan los tipos de pago.
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

        // Se completan los estados.
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

        // Se completan los roles
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

        // Si el pedido esta en estado 'Listo' se cargan los repartidores.
        if (this.pedido.pedido.estado.id >= 3) {
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
                    if (this.pedido.pedido.repartidor.usuario === usuario) {
                        option.selected = true;
                    }
                }
            });
        }

        this.modal.ocultarSpinner();
    }
    eventos() {
        this.evtClick();
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

                    // Mostramos los botones de editar.
                    document.querySelector('[data-element="btnGuardar"]').style.display = "block";
                }
                else {

                    // deshabilitamos los elementos editables.
                    itemsValidar.forEach(elem => {
                        elem.disabled = true;
                    });

                    // Ocultamos los botones de editar.
                    document.querySelector('[data-element="btnGuardar"]').style.display = "none";
                }
                return;
            }

            if (elem === "btnGuardar") {

                const intancia = new Alert({ mensaje: 'Desea guardar los cambios realizados?', title: "Confimación", type: "question" });
                intancia.sub('aceptar', data => {

                    this.modal.mostrarSpinner();

                    // Se llama al metodo para editar el pedido.
                    this.edicionPedido();
                });
            }

            if (elem === "recargarModal") {
                this.modal.mostrarSpinner();
                this.llenarDatos();
            }

            if (elem === "cerrarModal") {

                // Se vuelve a la pantalla principal.
                new Mapa(this.pedidos);
            }
        });
    }
    recuperarDatos() {

        const [tipoPago] = this.tiposPago.filter(t => t.id === parseInt(document.querySelector("#tipoPago").value));
        const [estado] = this.estados.filter(e => e.id === parseInt(document.querySelector("#estado").value));
        const [rol] = this.roles.filter(r => r.id === parseInt(document.querySelector("#rol").value));

        let repartidor = null;        

        if (this.pedido.pedido.estado.id >= 3) {
            const [rep] = this.repartidores.filter(r => r.usuario == document.querySelector("#repartidor").value);

            repartidor = rep;
        }

        // Se recupera el valor de los campos completados.    
        const pedido = {
            id: this.pedido.pedido.id,
            nombre_cliente: this.pedido.pedido.nombre_cliente,
            direccion: this.pedido.pedido.direccion,
            barrio: this.pedido.pedido.barrio,
            importe: this.pedido.pedido.importe,
            pagado: document.querySelector("#pago").value === "0" ? false : true,
            tipoPago: tipoPago,
            estado: estado,
            rol: rol,
            fecha_alta: this.pedido.pedido.fecha_alta,
            repartidor: this.pedido.pedido.estado.id >= 3 ? repartidor : this.pedido.pedido.repartidor
        };

        const data = {
            accion: "MPedido",
            pedido: pedido
        };

        return data;
    }
    async edicionPedido() {

        const data = await this.recuperarDatos();
        //console.log(data);

        // Se realiza la edicion del pedido.
        const response = await this.asyncFetch.fetch({
            url: "/Controller.ashx",
            body: data,
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

            // Si la edición se realizó de manera correcta.
            new Alert({ mensaje: 'Pedido editado correctamente.', title: "Exito", type: "success" });

            // Se actualiza el pedido seleccionado.            
            this.pedido.pedido.pagado = data.pedido.pagado;
            this.pedido.pedido.tipoPago = data.pedido.tipoPago;
            this.pedido.pedido.estado = data.pedido.estado;
            this.pedido.pedido.rol = data.pedido.rol;
            this.pedido.pedido.repartidor = data.pedido.repartidor;


            this.pedidos.forEach(elem => {
                if (elem.pedido.id === this.pedido.pedido.id) {
                    elem.pedido.pagado = data.pedido.pagado;
                    elem.pedido.tipoPago = data.pedido.tipoPago;
                    elem.pedido.estado = data.pedido.estado;
                    elem.pedido.rol = data.pedido.rol;
                    elem.pedido.repartidor = data.pedido.repartidor;
                }
            });

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
