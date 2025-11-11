import Principal from '/js/Utilidades/Principal.js';
import InstanciaCry from '/js/Utilidades/Cry.js';
import AsyncFetch from '/js/Utilidades/Asyncfetch.js';
import Alert from '/js/Utilidades/Alert.js';
import Toast from '/js/Utilidades/Toast.js';

document.addEventListener('DOMContentLoaded', () => {
    new ListadosIndex();
});

class ListadosIndex {
    constructor() {
        this.asyncFetch = new AsyncFetch();
        this.estados = [];
        this.tiposPagos = [];
        this.pedidos = [];
        this.roles = [];
        this.productos = [];
        this.pedidosFiltrados = [];

        this.main();
    }
    async main() {
        this.token = await InstanciaCry.decSer(sessionStorage.getItem('tkn'));

        this.permisos();
    }
    async iniciarPrincipal() {

        document.querySelector("#principal").innerHTML = "";
        const template = document.querySelector('#bodyPrincipal');
        const clone = template.content.cloneNode(true);

        // Insertamos el html en el body.
        this.principal = new Principal({
            id_elemento: 'principal',
            tituloContent: "Listado de Pedidos",
            htmlInsertar: clone
        });

        this.eventos();       

        // Se recupera el usuario de sesion.
        await this.usuarioABM();

        
        this.pedidos = await this.getPedidos("", 0, 1, "");   // Pedidos
        this.estados = await this.getEstados(); // Estados
        this.tiposPagos = await this.getTiposPagos();   // Tipos de pago
        this.roles = await this.getRoles(); // Roles
        this.productos = await this.getProductos(); // Productos

        
        this.seteoFiltro("0");
        this.principal.ocultarSpinner();
    }
    eventos() {
        this.evtClick();
        this.evtChange();
    }
    async usuarioABM() {

        // Se recupera el usuario al iniciar sesion.
        const usuario = await InstanciaCry.decSer(sessionStorage.getItem('sessionUsr'));
        this.sessionUser = JSON.parse(usuario);
    }
    async permisos() {

        // Recuperamos las pantallas del usuario.
        const arrayPantallas = await InstanciaCry.decSer(sessionStorage.getItem('pantallasRol'));
        const pantallaPedidos = "Listados";

        if (arrayPantallas.includes(pantallaPedidos)) {

            this.iniciarPrincipal();
        }        

        return;
    }
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
    async getProductos() {

        // Se obtienen los roles
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

        if (response[0].resultado === "Ok") {

            return response;
        }

        return [];
    }
    evtClick() {

        document.querySelector('#principal').addEventListener('click', e => {

            const elem = e.target.dataset.element;

            if (elem === "btnBuscar") {
                this.principal.mostrarSpinner();
                this.busqueda();
            }

            if (elem === "btnExcel") {
                this.generarExcel();
            }

            if (elem === "btnPDF") {
                this.generarPDF();
            }

            return;
        });
    }
    evtChange() {
        document.querySelector("#tipoFiltro").addEventListener('change', e => {

            const filtro = document.querySelector("#tipoFiltro").value;

            this.seteoFiltro(filtro);

        });
    }
    llenarEstados() {

        let select = document.querySelector("#selectEstado");

        this.estados.forEach(elem => {
            const option = document.createElement('option');
            option.innerHTML = elem.nombre;
            option.value = elem.id;
            select.appendChild(option);
        });

        return;
    }
    llenarProductos() {

        let select = document.querySelector("#selectProducto");

        this.productos.forEach(elem => {
            const option = document.createElement('option');
            option.innerHTML = elem.nombre;
            option.value = elem.id;
            select.appendChild(option);
        });

        return;
    }
    llenarTiposPagos() {

        let select = document.querySelector("#selectTipoPago");

        this.tiposPagos.forEach(elem => {
            const option = document.createElement('option');
            option.innerHTML = elem.nombre;
            option.value = elem.id;
            select.appendChild(option);
        });

        return;
    }
    llenarRoles() {

        let select = document.querySelector("#selectRoles");

        this.roles.forEach(elem => {
            const option = document.createElement('option');
            option.innerHTML = elem.nombre;
            option.value = elem.id;
            select.appendChild(option);
        });

        return;
    }
    seteoFiltro(filtro) {

        if (filtro === "0") {

            const html1 = `
                <label class="formbold-form-label">Estado</label>
                <select id="selectEstado" class="form-control">
                    <option value="0">Todos</option>
                </select>
            `;

            let contenedor = document.querySelector("#grupo1");
            contenedor.innerHTML = "";
            contenedor.innerHTML = html1;
            contenedor.style.display = 'block';

            document.querySelector("#grupo2").style.display = 'none';

            this.llenarEstados();
        }
        else if (filtro === "1") {

            const html1 = `
                <label class="formbold-form-label">Producto</label>
                <select id="selectProducto" class="form-control">
                    <option value="0">Todos</option>
                </select>
            `;

            let contenedor = document.querySelector("#grupo1");
            contenedor.innerHTML = "";
            contenedor.innerHTML = html1;
            contenedor.style.display = 'block';

            document.querySelector("#grupo2").style.display = 'none';

            this.llenarProductos();
        }
        else if (filtro === "2") {

            const html1 = `
                <label class="formbold-form-label">Direccion</label>
                <input id="direccion" class="form-control" type="text" placeholder="direccion, barrio" />
            `;

            let contenedor = document.querySelector("#grupo1");
            contenedor.innerHTML = "";
            contenedor.innerHTML = html1;
            contenedor.style.display = 'block';

            document.querySelector("#grupo2").style.display = 'none';
        }
        else if (filtro === "3") {

            const html1 = `
                <label class="formbold-form-label">Tipo Pago</label>
                <select id="selectTipoPago" class="form-control">
                    <option value="0">Todos</option>
                </select>
            `;

            let contenedor = document.querySelector("#grupo1");
            contenedor.innerHTML = "";
            contenedor.innerHTML = html1;
            contenedor.style.display = 'block';

            document.querySelector("#grupo2").style.display = 'none';

            this.llenarTiposPagos();
        }
        else if (filtro === "4") {

            const html1 = `
                <label class="formbold-form-label">Desde fecha</label>
                <input id="desdeFecha" class="form-control" type="date" />
            `;

            const html2 = `
                <label class="formbold-form-label">Hasta fecha</label>
                <input id="hastaFecha" class="form-control" type="date" />
            `;

            let contenedor1 = document.querySelector("#grupo1");
            contenedor1.innerHTML = "";
            contenedor1.innerHTML = html1;
            contenedor1.style.display = 'block';

            let contenedor2 = document.querySelector("#grupo2");
            contenedor2.innerHTML = "";
            contenedor2.innerHTML = html2;
            contenedor2.style.display = 'block';

        }
        else if (filtro === "5") {

            const html1 = `
                <label class="formbold-form-label">Importe</label>
                <input id="importe" class="form-control" type="text" />
            `;

            let contenedor = document.querySelector("#grupo1");
            contenedor.innerHTML = "";
            contenedor.innerHTML = html1;
            contenedor.style.display = 'block';

            document.querySelector("#grupo2").style.display = 'none';
        }
        else if (filtro === "6") {

            const html1 = `
                <label class="formbold-form-label">Cliente</label>
                <input id="cliente" class="form-control" type="text" />
            `;

            let contenedor = document.querySelector("#grupo1");
            contenedor.innerHTML = "";
            contenedor.innerHTML = html1;
            contenedor.style.display = 'block';

            document.querySelector("#grupo2").style.display = 'none';
        }
        else if (filtro === "7") {

            const html1 = `
                <label class="formbold-form-label">Rol</label>
                <select id="selectRoles" class="form-control">
                    <option value="0">Todos</option>
                </select>
            `;

            let contenedor = document.querySelector("#grupo1");
            contenedor.innerHTML = "";
            contenedor.innerHTML = html1;
            contenedor.style.display = 'block';

            document.querySelector("#grupo2").style.display = 'none';

            this.llenarRoles();
        }
    }
    busqueda() {

        let array = JSON.parse(JSON.stringify(this.pedidos));

        const tipoFiltro = document.querySelector("#tipoFiltro").value;

        if (tipoFiltro === "0") {

            const id_estado = parseInt(document.querySelector("#selectEstado").value);

            if (id_estado !== 0) {
                array = array.filter(p => p.pedido.estado.id === id_estado);
            }
        }
        else if (tipoFiltro === "1") {

            const id_producto = parseInt(document.querySelector("#selectProducto").value);

            if (id_producto !== 0) {
                array = array.filter(p =>
                    p.detalles.some(d => d.producto.id === id_producto)
                );
            }
        }
        else if (tipoFiltro === "2") {

            const direccion = (document.querySelector("#direccion").value).toUpperCase();

            if (direccion !== "") {
                array = array.filter(p => {

                    const direccionPedido = p.pedido.direccion.toUpperCase();
                    const barrioPedido = p.pedido.barrio.toUpperCase();

                    return direccionPedido.includes(direccion) || barrioPedido.includes(direccion);
                });
            }
        }
        else if (tipoFiltro === "3") {

            const id_tipoPago = parseInt(document.querySelector("#selectTipoPago").value);

            if (id_tipoPago !== 0) {
                array = array.filter(p => p.pedido.tipoPago.id === id_tipoPago);
            }
        }
        else if (tipoFiltro === "4") {

            const desdeFecha = document.querySelector("#desdeFecha").value;
            const hastaFecha = document.querySelector("#hastaFecha").value;

            if (desdeFecha === "" && hastaFecha === "") {

            }
            else if (desdeFecha !== "" && hastaFecha !== "") {

                    if (hastaFecha < desdeFecha) {
                        new Toast({ mensaje: "La segunda fecha es anterior a la primer fecha.", type: "error" });
                        this.principal.ocultarSpinner();
                        return;
                    }

                    array = array.filter(p => {

                        let fecha = p.pedido.fecha_alta;

                        // Convierte las fechas a objetos Date para poder compararlas
                        const fechaPedido = new Date(fecha);
                        const desde = new Date(desdeFecha);
                        const hasta = new Date(hastaFecha);                        

                        // Compara si la fecha del objeto está dentro del rango seleccionado
                        return fechaPedido >= desde && fechaPedido <= hasta;
                    });
            }
            else {
                new Toast({ mensaje: "Debe seleccionar una fecha.", type: "error" });
                this.principal.ocultarSpinner();
                return;
            }
        }
        else if (tipoFiltro === "5") {

            const importe = document.querySelector("#importe").value;

            if (importe !== "") {
                array = array.filter(p => p.pedido.importe === parseFloat(importe));
            }
        }
        else if (tipoFiltro === "6") {

            const cliente = (document.querySelector("#cliente").value).toUpperCase();

            if (cliente !== "") {
                array = array.filter(p => p.pedido.nombre_cliente.toUpperCase().includes(cliente));
            }
        }
        else {

            const id_rol = parseInt(document.querySelector("#selectRoles").value);

            if (id_rol !== 0) {
                array = array.filter(p => p.pedido.rol.id === id_rol);
            }
        }

        

        if (array.length === 0) {
            document.querySelector('[data-element="btnExcel"]').style.display = 'none';
            document.querySelector('[data-element="btnPDF"]').style.display = 'none';
            new Toast({ mensaje: "No hay resultados para su busqueda.", type: "error" });
        }
        else {
            document.querySelector('[data-element="btnExcel"]').style.display = 'block';
            document.querySelector('[data-element="btnPDF"]').style.display = 'block';
            this.pedidosFiltrados = JSON.parse(JSON.stringify(array));
        }

        this.principal.ocultarSpinner();
    }
    generarExcel() {
        
        try {

            const fechaActual = new Date();
            let ws_data;

            const tipoFiltro = document.querySelector("#tipoFiltro option:checked").text;
            const id_tipoFiltro = parseInt(document.querySelector("#tipoFiltro").value);
            let cantProductos = 0;

            if (id_tipoFiltro === 1) {

                const id_producto = parseInt(document.querySelector("#selectProducto").value);
                const producto = document.querySelector("#selectProducto option:checked").text;

                this.pedidosFiltrados.forEach(elem => {
                    elem.detalles.forEach(det => {
                        if (det.producto.id === id_producto) cantProductos += det.cantidad;
                    });
                });

                ws_data = [
                    ['Listado de Pedidos'],
                    [`Fecha emision: ${moment(fechaActual).format('DD/MM/YYYY')}`],
                    [`Filtrado por: ${tipoFiltro} - ${producto}`],
                    [`Cantidad de pedidos: ${this.pedidosFiltrados.length}`],
                    [`Cantidad de productos: ${cantProductos}`],
                    [], // Línea vacía para separación
                    ['Cod', 'Cliente', 'Direccion', 'Barrio', 'Pagado', 'Tipo Pago', 'Estado', 'Fecha Alta', 'Fecha Entrega', 'Asignado a', 'Importe', 'Repartidor'],
                    ...this.pedidosFiltrados.map(item => [item.pedido.id, item.pedido.nombre_cliente, item.pedido.direccion, item.pedido.barrio, item.pedido.pagado === true ? 'Si' : 'No',
                    item.pedido.tipoPago.nombre, item.pedido.estado.nombre,
                    moment(item.pedido.fecha_alta).format('DD/MM/YYYY'),
                    item.pedido.fecha_entrega !== null ? moment(item.pedido.fecha_entrega).format('DD/MM/YYYY') : ' - ',
                    item.pedido.rol.nombre, item.pedido.importe, item.pedido.repartidor !== null ? item.pedido.repartidor.usuario : " - "])];
            }
            else {

                ws_data = [
                    ['Listado de Pedidos'],
                    [`Fecha emision: ${moment(fechaActual).format('DD/MM/YYYY')}`],
                    [`Filtrado por: ${tipoFiltro}`],                    
                    [`Cantidad de pedidos: ${this.pedidosFiltrados.length}`],
                    [], // Línea vacía para separación
                    ['Cod', 'Cliente', 'Direccion', 'Barrio', 'Pagado', 'Tipo Pago', 'Estado', 'Fecha Alta', 'Fecha Entrega', 'Asignado a', 'Importe', 'Repartidor'],
                    ...this.pedidosFiltrados.map(item => [item.pedido.id, item.pedido.nombre_cliente, item.pedido.direccion, item.pedido.barrio, item.pedido.pagado === true ? 'Si' : 'No',
                    item.pedido.tipoPago.nombre, item.pedido.estado.nombre,
                    moment(item.pedido.fecha_alta).format('DD/MM/YYYY'),
                    item.pedido.fecha_entrega !== null ? moment(item.pedido.fecha_entrega).format('DD/MM/YYYY') : ' - ',
                    item.pedido.rol.nombre, item.pedido.importe, item.pedido.repartidor !== null ? item.pedido.repartidor.usuario : " - "])];
            }
            

            // Se crea un nuevo libro de trabajo (workbook) y una hoja de trabajo (worksheet)
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(ws_data);

            // Se agrega la hoja de trabajo al libro de trabajo
            XLSX.utils.book_append_sheet(wb, ws, 'Hoja1');

            // Generar el archivo Excel
            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

            // Se convierte el resultado a un Blob
            const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

            // Se crea un enlace de descarga
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "ListadoPedidos.xlsx";
            document.body.appendChild(a);
            a.click();
            a.remove();


            // Función para convertir una cadena a un array buffer
            function s2ab(s) {
                const buf = new ArrayBuffer(s.length);
                const view = new Uint8Array(buf);
                for (let i = 0; i < s.length; i++) {
                    view[i] = s.charCodeAt(i) & 0xFF;
                }
                return buf;
            }
        }
        catch (error) {
            console.log(error);
            new Alert({ mensaje: "Error al generar el archivo.", title: "Error", type: "error" });
        }
    }
    generarPDF() {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('l', 'pt', 'a4'); // orientación landscape (horizontal)
            const fechaActual = new Date();

            const tipoFiltro = document.querySelector("#tipoFiltro option:checked").text;
            const id_tipoFiltro = parseInt(document.querySelector("#tipoFiltro").value);
            let cantProductos = 0;

            let titulo = "Listado de Pedidos";
            let subtitulos = [];
            let columnas = ['Cod', 'Cliente', 'Direccion', 'Barrio', 'Pagado', 'Tipo Pago', 'Estado', 'Fecha Alta', 'Fecha Entrega', 'Asignado a', 'Importe', 'Repartidor'];
            let filas = [];

            if (id_tipoFiltro === 1) {
                const id_producto = parseInt(document.querySelector("#selectProducto").value);
                const producto = document.querySelector("#selectProducto option:checked").text;

                this.pedidosFiltrados.forEach(elem => {
                    elem.detalles.forEach(det => {
                        if (det.producto.id === id_producto) cantProductos += det.cantidad;
                    });
                });

                subtitulos = [
                    `Fecha emisión: ${moment(fechaActual).format('DD/MM/YYYY')}`,
                    `Filtrado por: ${tipoFiltro} - ${producto}`,
                    `Cantidad de pedidos: ${this.pedidosFiltrados.length}`,
                    `Cantidad de productos: ${cantProductos}`
                ];
            } else {
                subtitulos = [
                    `Fecha emisión: ${moment(fechaActual).format('DD/MM/YYYY')}`,
                    `Filtrado por: ${tipoFiltro}`,
                    `Cantidad de pedidos: ${this.pedidosFiltrados.length}`
                ];
            }

            // Construcción de filas
            filas = this.pedidosFiltrados.map(item => [
                item.pedido.id,
                item.pedido.nombre_cliente,
                item.pedido.direccion,
                item.pedido.barrio,
                item.pedido.pagado === true ? 'Sí' : 'No',
                item.pedido.tipoPago.nombre,
                item.pedido.estado.nombre,
                moment(item.pedido.fecha_alta).format('DD/MM/YYYY'),
                item.pedido.fecha_entrega !== null ? moment(item.pedido.fecha_entrega).format('DD/MM/YYYY') : ' - ',
                item.pedido.rol.nombre,
                item.pedido.importe,
                item.pedido.repartidor !== null ? item.pedido.repartidor.usuario : " - "
            ]);

            // ====== ENCABEZADO ======
            doc.setFontSize(16);
            doc.text(titulo, 40, 40);
            doc.setFontSize(11);

            let y = 60;
            subtitulos.forEach(linea => {
                doc.text(linea, 40, y);
                y += 15;
            });

            // ====== TABLA ======
            doc.autoTable({
                startY: y + 10,
                head: [columnas],
                body: filas,
                theme: 'grid',
                headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: 255,
                    fontStyle: 'bold'
                },
                styles: {
                    fontSize: 9,
                    cellPadding: 4,
                    halign: 'center',
                    valign: 'middle'
                },
                columnStyles: {
                    1: { halign: 'left' },
                    2: { halign: 'left' },
                    3: { halign: 'left' }
                }
            });

            // ====== DESCARGA ======
            doc.save('ListadoPedidos.pdf');
        } catch (error) {
            console.error(error);
            new Alert({ mensaje: "Error al generar el PDF.", title: "Error", type: "error" });
        }
    }

}