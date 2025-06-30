export default class Tabla {
    constructor() {
        this.tabla = "";
        this.objColumnas = "";
        this.idTabla = ""
        this.arrayDatos = null
        this.campoFiltrado = null
        this.paginacionTable = null
        this.paginasTable = null
    }
    /**
     * Este es un método de ejemplo.
     * @param {string} [nameSessionStorage] - [DEPRECATED] Este parámetro ya no es necesario.
     * @param {number} [filas] - [OPTIONAL] Este parámetro es opcional.
     */
    llenarDatos({ nameSessionStorage = null, arrayDatos, objColumnas, id_tabla, filas = 5, colorEstado = false, ordenPorDefecto = null }) {

        if (nameSessionStorage) {
            console.warn('El parámetro "nameSessionStorage" está marcado como deprecado y puede eliminarse en futuras versiones.');
        }

        this.idTabla = id_tabla;
        this.tabla = document.querySelector(`#${id_tabla}`);
        this.objColumnas = objColumnas;
        this.colorEstado = colorEstado;

        this.arrayDatos = arrayDatos;
        this.setearPaginacion(filas);

        // Si está seteado un orden por defecto.
        this.ordenPorDefecto = ordenPorDefecto;
        if (this.ordenPorDefecto) {

            if (this.ordenPorDefecto.tipo === "int") {

                if (this.ordenPorDefecto.ascendente) {
                    this.arrayDatos = this.arrayDatos.sort((u1, u2) => {
                        return u1[this.ordenPorDefecto.columna] - u2[this.ordenPorDefecto.columna];
                    });
                }
                else {
                    this.arrayDatos = this.arrayDatos.sort((u1, u2) => {
                        return u2[this.ordenPorDefecto.columna] - u1[this.ordenPorDefecto.columna];
                    });
                }

            }
            else if (this.ordenPorDefecto.tipo === "string") {

                if (this.ordenPorDefecto.ascendente) {

                    this.arrayDatos = this.arrayDatos.sort((u1, u2) => {
                        if (u1[this.ordenPorDefecto.columna] < u2[this.ordenPorDefecto.columna]) { return -1; }
                        if (u1[this.ordenPorDefecto.columna] > u2[this.ordenPorDefecto.columna]) { return 1; }
                        return 0;
                    });

                }
                else {

                    this.arrayDatos = this.arrayDatos.sort((u1, u2) => {
                        if (u1[this.ordenPorDefecto.columna] > u2[this.ordenPorDefecto.columna]) { return -1; }
                        if (u1[this.ordenPorDefecto.columna] < u2[this.ordenPorDefecto.columna]) { return 1; }
                        return 0;
                    });

                }

            }
            else if (this.ordenPorDefecto.tipo === "datetime") {

                this.arrayDatos = this.arrayDatos.sort((u1, u2) => {
                    const fecha1 = this.parseDate(u1[this.ordenPorDefecto.columna]);
                    const fecha2 = this.parseDate(u2[this.ordenPorDefecto.columna]);

                    if (this.ordenPorDefecto.ascendente) {
                        return fecha1 - fecha2;
                    } else {
                        return fecha2 - fecha1;
                    }
                });

            }

        }

        this.llenarTabla();

        this.evtChangeTable();
        this.evtClickTable();

        if (this.ordenPorDefecto) {

            // Colocamos el icono en el campo filtrado
            let tableSpan = document.querySelector(`#${this.idTabla} [data-nombre='${this.ordenPorDefecto.columna}']`);
            if (this.ordenPorDefecto.ascendente) {
                tableSpan.children[0].innerHTML = "↓";
            }
            else {
                tableSpan.children[0].innerHTML = "&#8593;";
            }

        }

    }
    llenarTabla() {

        let columnas = this.getColumns();

        // Recuperamos la paginacion.
        const paginacionActual = this.paginacionTable;

        // Recortamos el array según corresponda.
        let arrayRecortado = this.arrayDatos.slice(paginacionActual.start, paginacionActual.end);

        this.tabla.innerHTML = "";

        // Creamos las columnas titulo.
        columnas.forEach(title => {

            let column = document.createElement("div");
            column.className = "table-title-general";
            if (title.ordenable) column.style.cursor = "pointer";
            column.dataset.element = "orderBy";
            column.dataset.nombre = title.nombre;
            column.innerHTML = title.nombre;
            column.dataset.tipo = title.tipo;
            column.dataset.ordenable = title.ordenable;
            this.tabla.appendChild(column);

            let span = document.createElement("span");
            span.className = "table-span";
            span.dataset.element = "orderBy";
            span.dataset.nombre = title.nombre;
            span.dataset.tipo = title.tipo;
            span.dataset.ordenable = title.ordenable;
            column.appendChild(span);

        })

        // Llenamos el contenido de la tabla.
        arrayRecortado.forEach((user, index) => {

            let row = document.createElement("div");
            row.className = "table-row";
            this.tabla.appendChild(row);

            columnas.forEach(col => {

                let value = "";

                for (const [key, val] of Object.entries(user)) {
                    if (key === col.nombre) value = val;
                }

                // Agregamos dataElement a la fila.
                if (col.dataset != null) {

                    for (var i = 0; i < Object.keys(col.dataset).length; i++) {

                        if (col.nombre === Object.values(col.dataset)[i]) {
                            row.dataset[Object.keys(col.dataset)[i]] = value;
                        }
                        else {
                            row.dataset[Object.keys(col.dataset)[i]] = Object.values(col.dataset)[i];
                        }

                    }

                }

                let column = document.createElement("div");
                column.className = "colum";
                row.appendChild(column);

                let title = document.createElement("div");
                title.className = "title";
                title.innerHTML = col.nombre;
                column.appendChild(title);

                let item = document.createElement("div");
                item.className = "item";

                //item.title = value;
                item.innerHTML = value;
                column.appendChild(item);

                if ((index % 2) === 0) {
                    column.classList.add("par");
                }

            })

            let rowSeparator = document.createElement("div");
            rowSeparator.className = "table-separator";
            this.tabla.appendChild(rowSeparator);

        })

        if (this.colorEstado) {

            // Coloreamos las filas.
            const estadoColores = {
                'Realizado': '#CDFBD4',
                'Pendiente': '#F4FBCD',
                'No Realizado': '#F3A9A4',
                'Pen. Pago': '#F59558'
            };

            const items = document.querySelectorAll(`#${this.idTabla} .item`);

            items.forEach(item => {
                const estado = item.innerHTML.trim();
                const rows = item.closest('.table-row').querySelectorAll(".table-row > div");

                if (estadoColores[estado]) {
                    rows.forEach(elem => {
                        elem.style.backgroundColor = estadoColores[estado];
                    });
                }
            });

        }

        // Seteamos footer.
        let footer = document.createElement("div");
        footer.className = "table-footer";
        this.tabla.appendChild(footer);

        let aTotalFilas = document.createElement("a");
        aTotalFilas.innerHTML = `Total: ${this.arrayDatos.length} `;
        footer.appendChild(aTotalFilas);

        let btnEditar = document.createElement("a");
        btnEditar.innerHTML = "Filas";
        btnEditar.style.cursor = "pointer";
        footer.appendChild(btnEditar);

        let selectFilas = document.createElement("select");
        selectFilas.className = "table-select";
        selectFilas.dataset.element = "editShowRows";
        footer.appendChild(selectFilas);

        let option5 = document.createElement("option");
        option5.value = 5;
        option5.innerHTML = "5";
        selectFilas.appendChild(option5);

        let option10 = document.createElement("option");
        option10.value = 10;
        option10.innerHTML = "10";
        selectFilas.appendChild(option10);

        let option20 = document.createElement("option");
        option20.value = 20;
        option20.innerHTML = "20";
        selectFilas.appendChild(option20);

        // Seteamos el option en el nro actual seleccionado.
        selectFilas.value = parseInt(paginacionActual.end - paginacionActual.start);

        // Seteamos las paginas en paginacion.
        let paginas = this.setearPaginas({ filas: selectFilas.value, length: this.arrayDatos.length });

        for (var i = 1; i <= paginas; i++) {

            let spanPaginas = document.createElement("span");
            if ((parseInt(paginacionActual.end) / parseInt(selectFilas.value)) == i) {
                spanPaginas.className = "span-paginas active";
            }
            else {
                spanPaginas.className = "span-paginas";
            }
            spanPaginas.innerHTML = i;
            spanPaginas.style.cursor = "pointer";
            spanPaginas.dataset.element = "paginaSelect";
            footer.appendChild(spanPaginas);
        }

        let indexActive = "";

        // Mostramos sólo 2 a la izquierda y dos a la derecha del activo.
        let spans = document.querySelectorAll(".span-paginas");

        spans.forEach((elem, index) => {

            if (elem.classList.contains('active')) {
                indexActive = index;
            }

        })

        spans.forEach((elem, index) => {

            if (elem.classList.contains('active')) {
                indexActive = index;
                elem.style.display = "block";
            }

            if (index === (parseInt(indexActive) + 1)
                || index === (parseInt(indexActive) + 2)
                || index === (parseInt(indexActive))
                || index === (parseInt(indexActive) - 1)
                || index === (parseInt(indexActive) - 2)) {
                elem.style.display = "block";
            }
            else {
                elem.style.display = "none";
            }

            if (index === spans.length - 1) {
                elem.style.display = "block";
            }

        })

        let btnPosterior = document.createElement("a");
        btnPosterior.innerHTML = "&#8677;";
        btnPosterior.title = "Siguiente";
        btnPosterior.dataset.element = "Siguiente";
        btnPosterior.style.cursor = "pointer";
        footer.appendChild(btnPosterior);

        // Modificamos las clases según el numero de tablas.
        let cssTablaContainer = this.tabla;
        cssTablaContainer.style.gridTemplateColumns = `repeat(${columnas.length}, auto)`;
        cssTablaContainer.style.boxShadow = "0 0 2px #ccc";

        let cssTablaFooter = document.querySelector(`#${this.idTabla} .table-footer`);
        cssTablaFooter.style.gridColumnStart = "1";
        cssTablaFooter.style.gridColumnEnd = `${columnas.length + 1}`;

        // Definimos el tamaño mínimo y modificamos la estructura de las columnas según corresponda.
        let myMediaQuery = window.matchMedia('(min-width: 900px)');

        // Ejecutamos la funcion para que ordene la tabla según resolución actual.
        widthChangeCallback(myMediaQuery, this.tabla);

        function widthChangeCallback(myMediaQuery, tabla) {

            if (myMediaQuery.matches) {
                let cssTablaContainer = tabla;
                cssTablaContainer.style.gridTemplateColumns = `repeat(${columnas.length}, auto)`;
                cssTablaContainer.style.display = "grid";
            }
            else {
                let cssTablaContainer = tabla;
                cssTablaContainer.style.gridTemplateColumns = `repeat(2, 1fr)`;
                cssTablaContainer.style.display = "grid";
            }
        }

        myMediaQuery.addEventListener('change', e => {
            widthChangeCallback(myMediaQuery, this.tabla);
        });

        this.getOrderBy();

    }
    getColumns() {
        return this.objColumnas;
    }
    getOrderBy() {

        // Seteamos flechas de orden.
        const campoFiltrado = this.campoFiltrado;

        if (campoFiltrado != null) {

            let tableSpan = document.querySelector(`#${this.idTabla} [data-nombre='${campoFiltrado.campo}']`);

            if (campoFiltrado.order === "asc") {
                tableSpan.children[0].innerHTML = "↓";
            }
            else if (campoFiltrado.order === "desc") {
                tableSpan.children[0].innerHTML = "&#8593;";
            }

        }

    }
    setOrderBy(elem) {

        // Seteamos flechas de orden.
        let campoFiltrado = this.campoFiltrado != null ? this.campoFiltrado : { campo: elem, order: "asc" };

        if (campoFiltrado != null) {

            if (campoFiltrado.campo === elem) {

                if (campoFiltrado.order === "asc") campoFiltrado.order = "desc";
                else if (campoFiltrado.order === "desc") campoFiltrado.order = "asc";

                // Guardamos los elementos.
                this.campoFiltrado = campoFiltrado;

            }
            else {

                campoFiltrado.campo = elem;
                campoFiltrado.order = "asc";

                // Guardamos los elementos.
                this.campoFiltrado = campoFiltrado;

            }

        }
        else {

            campoFiltrado.campo = elem;
            campoFiltrado.order = "asc";

            // Guardamos los elementos.
            this.campoFiltrado = campoFiltrado;

        }

        return campoFiltrado.order;

    }
    setearPaginas({ filas, length }) {

        let obj = {
            filas: parseInt(filas),
            length,
            paginas: Math.ceil(length / filas),
        }

        this.paginasTable = obj;

        return obj.paginas;

    }
    setearPaginacion(end = 5) {

        // Verificamos la paginación actual.
        const paginacionActual = this.paginacionTable;
        let paginacionNew = {};

        // Recuperamos el valor del select paginas.
        let selectFilas = document.querySelector(".table-select");

        if (paginacionActual != null) {

            // Seteamos la nueva paginacion.
            paginacionNew.start = paginacionActual.end;
            paginacionNew.end = parseInt(paginacionActual.end) + parseInt(selectFilas.value)

            this.paginacionTable = paginacionNew;

        }
        else {
            paginacionNew.start = 0;
            paginacionNew.end = end;

            this.paginacionTable = paginacionNew;
        }

    }
    siguientePagina() {

        // Verificamos la paginación actual.
        const paginacionActual = this.paginacionTable;
        let paginacionNew = {};

        let paginasTable = this.paginasTable;

        // Recuperamos el valor del select paginas.
        let selectFilas = document.querySelector(".table-select");

        // Si es la última pagina.
        if (parseInt(paginasTable.paginas) === (parseInt(paginacionActual.end) / parseInt(selectFilas.value))) {
            // Seteamos la nueva paginacion.
            paginacionNew.start = 0;
            paginacionNew.end = selectFilas.value;
        }
        else {
            // Seteamos la nueva paginacion.
            paginacionNew.start = paginacionActual.end;
            paginacionNew.end = parseInt(paginacionActual.end) + parseInt(selectFilas.value)
        }

        this.paginacionTable = paginacionNew;

    }
    parseDate(dateString) {
        const parts = dateString.split('/');
        return new Date(parts[2], parts[1] - 1, parts[0]);
    }
    // Eventos.
    evtChangeTable() {

        this.tabla.addEventListener('change', e => {

            let elem = e.target.dataset.element;

            if (elem === "editShowRows") {

                let paginacionNew = {};

                // Seteamos la nueva paginacion.
                paginacionNew.start = 0;
                paginacionNew.end = e.target.querySelector('option:checked').value

                this.paginacionTable = paginacionNew;

                this.llenarTabla();

            }

        })

    }
    evtClickTable() {

        this.tabla.addEventListener('click', e => {

            let elem = e.target.dataset.element;

            if (elem === "orderBy") {

                if (e.target.dataset.ordenable != "true") return;

                let newOrder = this.setOrderBy(e.target.dataset.nombre);

                // Recuperar array.
                const gest = this.arrayDatos;

                let sortedProducts = [];

                // Si el tipo de dato a ordenar es entero.
                if (e.target.dataset.tipo === "int") {

                    if (newOrder === "asc") {

                        sortedProducts = gest.sort((u1, u2) => {
                            return u1[e.target.dataset.nombre] - u2[e.target.dataset.nombre];
                        });

                    }
                    else {

                        sortedProducts = gest.sort((u1, u2) => {
                            return u2[e.target.dataset.nombre] - u1[e.target.dataset.nombre];
                        });

                    }

                }
                else if (e.target.dataset.tipo === "string") {

                    if (newOrder === "asc") {

                        sortedProducts = gest.sort((u1, u2) => {
                            if (u1[e.target.dataset.nombre] < u2[e.target.dataset.nombre]) { return -1; }
                            if (u1[e.target.dataset.nombre] > u2[e.target.dataset.nombre]) { return 1; }
                            return 0;
                        });

                    }
                    else {

                        sortedProducts = gest.sort((u1, u2) => {
                            if (u1[e.target.dataset.nombre] > u2[e.target.dataset.nombre]) { return -1; }
                            if (u1[e.target.dataset.nombre] < u2[e.target.dataset.nombre]) { return 1; }
                            return 0;
                        });

                    }

                }
                else if (e.target.dataset.tipo === "datetime") {

                    sortedProducts = this.arrayDatos.sort((u1, u2) => {

                        const fecha1 = this.parseDate(u1[this.ordenPorDefecto.columna]);
                        const fecha2 = this.parseDate(u2[this.ordenPorDefecto.columna]);

                        if (newOrder === "asc") {
                            return fecha1 - fecha2;
                        }
                        else {
                            return fecha2 - fecha1;
                        }

                    });

                }

                this.arrayDatos = sortedProducts;
                this.llenarTabla();

            }
            else if (elem === "Siguiente") {
                this.siguientePagina();
                this.llenarTabla();
            }
            else if (elem === "Anterior") {
                this.anteriorPagina();
                this.llenarTabla();
            }
            else if (elem === "paginaSelect") {

                let paginacionNew = {};

                // Recuperamos el valor del select paginas.
                let selectFilas = document.querySelector(`#${this.idTabla} .table-select`);

                // Seteamos la nueva paginacion.
                paginacionNew.start = (parseInt(e.target.innerHTML) * parseInt(selectFilas.value)) - parseInt(selectFilas.value);
                paginacionNew.end = (parseInt(e.target.innerHTML) * parseInt(selectFilas.value))

                this.paginacionTable = paginacionNew;

                this.llenarTabla();

            }

        })

    }
}