export default class Principal {
    constructor({ id_elemento, tituloContent = "", htmlInsertar = "" }) {
        this.elemContenedor = document.querySelector(`#${id_elemento}`);
        this.elemPrincipal = null;
        this.titulo = null;
        this.spinner = null;
        this.body = null;
        this.errores = null;
        this.id_elemento = id_elemento;
        this.tituloContent = tituloContent;
        this.htmlInsertar = htmlInsertar;

        this.main();

    }
    main() {

        const html = this.getHtml();

        this.elemContenedor.innerHTML = html;

        this.inciarVariablesEventos();

        if (this.tituloContent !== "") {
            this.setTitulo({ textTitulo: this.tituloContent });
        }

        if (this.htmlInsertar !== "") {
            this.actualizarBody({ htmlInsertar: this.htmlInsertar });
        }

        this.mostrarSpinner();

    }
    getHtml() {

        const html = `
            <div class="principal">
                <div class="principal-content">
                    <header class="custom-header">
                        <span></span>
                    </header>
                    <div class="principal-spinner">
                        <div class="spinner"></div>
                    </div>
                    <div class="principal-body"></div>
                    <div class="custom-errores"></div>
                </div>
            </div>
        `;

        return html;

    }
    inciarVariablesEventos() {
        this.elemPrincipal = this.elemContenedor.querySelector(".principal");
        this.titulo = this.elemContenedor.querySelector(".custom-header span");
        this.spinner = this.elemContenedor.querySelector(".principal-spinner .spinner");
        this.body = this.elemContenedor.querySelector(".principal-body");
        this.errores = this.elemContenedor.querySelector(".custom-errores");
    }
    actualizarBody({ htmlInsertar }) {
        const fragmento = document.createDocumentFragment();
        fragmento.appendChild(htmlInsertar);
        this.body.appendChild(fragmento);
    }
    setTitulo({ textTitulo }) {
        this.titulo.textContent = textTitulo;
    }
    mostrarSpinner() {
        this.body.style.display = "none";
        this.spinner.classList.add("show");
    }
    ocultarSpinner() {
        this.body.style.display = "block";
        this.spinner.classList.remove("show");
    }
}