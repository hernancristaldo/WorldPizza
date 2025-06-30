export default class Modal {
    constructor({ id_contenedor, htmlInsertar, titulo = "" }) {
        this.divConteiner = document.querySelector(`#${id_contenedor}`);
        this.elemPrincipal = null;
        this.titulo = null;
        this.spinner = null;
        this.body = null;
        this.errores = null;
        this.htmlBody = htmlInsertar;
        this.tituloContent = titulo;
        this.modalHtml = `
          <div class="custom-modal">
            <div class="custom-modal-content">
              <span class="custom-modal-close" data-element="cerrarModal">&times;</span>
              <header class="custom-modal-header">
                <span>Título del Modal</span>
              </header>
              <div class="content-spinner">
                <div class="spinner"></div>
              </div>
              <div class="custom-modal-body"></div>
              <div class="custom-errores"></div>
            </div>
          </div>
        `;

        this.eventListenersAdded = false;
        this.initializeModal();

    }
    initializeModal() {

        if (!this.elemPrincipal) {
            this.createModal();
            this.initializeElements();
            if (!this.eventListenersAdded) {
                this.addEventListeners();
            }
        }

        this.actualizarBody();
        this.showModal();
        this.mostrarSpinner();

    }
    initializeElements() {
        this.elemPrincipal = this.divConteiner.querySelector(".custom-modal");
        this.titulo = this.elemPrincipal.querySelector(".custom-modal-header span");
        this.spinner = this.elemPrincipal.querySelector(".custom-modal .spinner");
        this.body = this.elemPrincipal.querySelector(".custom-modal-body");
        this.errores = this.elemPrincipal.querySelector(".custom-errores");
    }
    addEventListeners() {

        this.divConteiner.querySelector(".custom-modal").addEventListener("click", (e) => {

            let elem = e.target.dataset.element;

            if (elem === "cerrarModal") {

                this.body.innerHTML = "";
                this.errores.innerHTML = "";
                this.ocultarModal();
                e.stopPropagation();
                return;
            }

            // e.stopPropagation();

        });

        this.eventListenersAdded = true;

    }
    ocultarModal() {
        this.hideModal();
        this.divConteiner.innerHTML = "";
        this.elemPrincipal = null;
        this.titulo = null;
        this.spinner = null;
        this.body = null;
        this.errores = null;
        this.eventListenersAdded = false;
        this.htmlBody = null;
        this.titulo = null;
    }
    showModal() {
        this.elemPrincipal.style.display = "block";
    }
    hideModal() {
        this.elemPrincipal.style.display = "none";
    }
    mostrarSpinner() {
        this.body.style.display = "none";
        this.spinner.classList.add("show");
    }
    ocultarSpinner() {
        this.body.style.display = "block";
        this.spinner.classList.remove("show");
    }
    actualizarBody() {
        this.body.innerHTML = "";
        if (this.htmlBody) this.body.appendChild(this.htmlBody);
        this.titulo.innerHTML = this.tituloContent;
    }
    bodyUpdate({ htmlBody }) {

        this.body.innerHTML = "";
        this.body.appendChild(htmlBody);

    }
    createModal() {
        this.divConteiner.innerHTML = this.modalHtml;
    }
    setTitulo({ text }) {
        this.titulo.innerHTML = text;
    }

}