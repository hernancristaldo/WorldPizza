export default class Multiselect {
    constructor({ elementosActivos = [], elementosTotal = [], editable = true, nombreContenedorActivos }) {
        // Variables instancia
        this.elementosActivos = elementosActivos
        this.elementosTotal = elementosTotal
        this.editable = editable
        this.nombreContenedorActivos = nombreContenedorActivos
        // Variables globales
        this.contenedor = document.createElement("div")
        this.ModalSmall = null
        this.eventoActivo = false
        this.eventos = {}

        this.main();

    }
    async main() {

        this.contenedor.innerHTML = "";
        this.contenedor.appendChild(await this.getHtml());
        await this.llenarDatos();
        this.pub('getHtml', this.contenedor);
    }
    async llenarDatos() {

        // Importamos dinamicamente el modulo ModalSmall.
        if (!this.ModalSmall) {
            const { default: ModalSmall } = await import('/js/Utilidades/ModalSmall.js');
            this.ModalSmall = ModalSmall;
        }

        // Activamos eventos.
        if (!this.eventoActivo) {
            this.evtClick();
            this.eventoActivo = true;
        }

        // Seteamos lo activos actuales.
        this.setearElementosActivos(this.elementosActivos);

    }
    setearElementosActivos(elementosActivos) {

        const contenedor = this.contenedor.querySelector(`#${this.nombreContenedorActivos}`);

        contenedor.innerHTML = "";

        elementosActivos.forEach((elem) => {

            let tag = document.createElement("div");
            tag.className = "tag actived";
            tag.dataset.value = elem.value;
            tag.dataset.data = elem.data = ! null ? elem.data : null;

            let colorWhite = '';

            if (elem?.color) {
                tag.style.backgroundColor = elem?.color;
                colorWhite = 'style="color:white"';
            }

            if (this.editable && !elem?.obligatorio) {

                tag.innerHTML = `
                    <span class="tag__value" ${colorWhite}>${elem.nombre}</span>
                    <div class="tag__remove" data-element="quitarActivo" title="Quitar elemento" ${colorWhite}>x</div>
                `;
            }
            else {

                tag.innerHTML = `
                    <span class="tag__value" style="margin-right: 0px;">${elem.nombre}</span>
                `;
            }

            contenedor.appendChild(tag);
        })
    }
    async getHtml() {

        const div = document.createElement("div");
        div.id = `contenedor-multiselect-${this.nombreContenedorActivos}`;
        let html = "";
        if (this.editable) {
            html =
                `
                <div class="formulario-elements-container">
	                <div class="formulario-button" data-element="abrirModal">
                        <span data-element="abrirModal">Seleccionar</span>
	                </div>
                    <div id="${this.nombreContenedorActivos}"></div>
                </div>
                <div id="modal-mini-${this.nombreContenedorActivos}"></div>
            `
        }
        else {
            html = ` <div id="${this.nombreContenedorActivos}"></div> `;
        }

        div.innerHTML = html;

        return div;
    }
    actualizarElementosActivos({ elementosActivos }) {

        this.elementosActivos = elementosActivos;
    }
    actualizarElementosTotal({ elementosTotal }) {

        this.elementosTotal = elementosTotal;
    }
    evtClick() {

        this.contenedor.querySelector(`#contenedor-multiselect-${this.nombreContenedorActivos}`).addEventListener('click', e => {
            const element = e.target.dataset.element;

            if (element === "abrirModal") {

                new this.ModalSmall({
                    id_contenedor: `modal-mini-${this.nombreContenedorActivos}`,
                    htmlInsertar: this.getBodyModal()
                });
            }
            else if (element === "quitarActivo") {
                const elemAEliminar = e.target.parentElement.dataset.value;
                this.elementosActivos = this.elementosActivos.filter(elem => elem.value !== parseInt(elemAEliminar));
                e.target.parentElement.remove();

                this.pub('getActivos', this.elementosActivos);
            }
            else if (element === "agregarActivo") {

                if (e.target.classList.contains("activ")) {
                    e.target.classList.remove("activ");
                }
                else {
                    e.target.classList.add("activ");
                }

            }
            else if (element === this.nombreContenedorActivos) {

                // Recuperamos todos los activos.
                const activos = document.querySelectorAll(`#modal-mini-${this.nombreContenedorActivos} .activ`);
                const activosAdd = Array.from(activos).map(elem =>
                ({
                    value: parseInt(elem.dataset.value),
                    nombre: elem.innerHTML,
                    data: elem.dataset.data
                }));

                activosAdd.forEach(item => {
                    const existe = this.elementosActivos.some(elem => elem.value === item.value);
                    if (!existe) {
                        this.elementosActivos.push(item);
                    }
                });
                
                // Enviamos el nuevo array de agregados.
                this.pub('getActivos', this.elementosActivos);

                this.setearElementosActivos(this.elementosActivos);

                document.querySelector(`#modal-mini-${this.nombreContenedorActivos} .custom-modal-close-small`).click();
            }

            e.stopPropagation();
        });
    }
    getBodyModal() {

        const activos = this.elementosActivos.map(elem => elem.value);


        const contenedor = document.createElement("div");

        if (this.elementosTotal.length > 0) {

            this.elementosTotal.forEach(({ value, nombre, data }) => {
                let div = document.createElement("div");
                div.dataset.value = value;
                div.dataset.data = data;
                div.dataset.element = "agregarActivo";
                div.innerHTML = nombre;
                div.className = activos.includes(value) ? "pills activ" : "pills";

                contenedor.appendChild(div);
            });

            const btnGuardar = document.createElement("button");
            btnGuardar.className = "formulario-button";
            btnGuardar.dataset.element = this.nombreContenedorActivos;
            btnGuardar.type = "button";
            btnGuardar.innerHTML = "Aplicar";
            btnGuardar.style = `max-height: 50px; min-height: 30px;`;
            contenedor.appendChild(btnGuardar);
        }
        else {
            let div = document.createElement("div");
            div.className = "error";
            div.innerHTML = "No ítem";

            contenedor.appendChild(div);
        }

        return contenedor;
    }
    sub(evento, callback) {
        if (!this.eventos[evento]) {
            this.eventos[evento] = [];
        }
        this.eventos[evento].push(callback);
    }
    pub(evento, datos) {
        if (this.eventos[evento]) {
            this.eventos[evento].forEach(callback => {
                callback(datos);
            });
        }
    }

}